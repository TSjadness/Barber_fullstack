import { DatabaseSync } from 'node:sqlite';
import { mkdirSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { randomUUID, scryptSync, randomBytes, createHash, timingSafeEqual } from 'node:crypto';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const file = process.env.BARBER_DB_PATH || resolve(root, 'data/barberflow.sqlite');
mkdirSync(dirname(file), {recursive:true});
export const db = new DatabaseSync(file);
db.exec('PRAGMA journal_mode=WAL; PRAGMA busy_timeout=5000; PRAGMA foreign_keys=ON;');
export const json = x=>JSON.stringify(x);
export const parse = x=>JSON.parse(x);
export function migrate(){
 db.exec('CREATE TABLE IF NOT EXISTS schema_migrations (name TEXT PRIMARY KEY, applied_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)');
 const path=resolve(root, 'src/database/migrations');
 for(const name of readdirSync(path).filter(x=>x.endsWith('.sql')).sort()){
  if(db.prepare('SELECT 1 FROM schema_migrations WHERE name=?').get(name))continue;
  db.exec('BEGIN IMMEDIATE');
  try {db.exec(readFileSync(resolve(path,name),'utf8'));db.prepare('INSERT INTO schema_migrations(name) VALUES(?)').run(name);db.exec('COMMIT');}
  catch(e){db.exec('ROLLBACK');throw e;}
 }
}
export function state(){
 const r=db.prepare('SELECT * FROM app_state WHERE id=1').get();
 if(!r)throw Error('Banco sem dados iniciais. Execute npm run db:seed');
 return {shop:parse(r.shop),services:parse(r.services),staff:parse(r.staff),notices:parse(r.notices),payments:parse(r.payments),bookings:db.prepare('SELECT data FROM bookings ORDER BY date,time').all().map(x=>parse(x.data))};
}
export function saveState(s){
 db.exec('BEGIN IMMEDIATE');
 try{
  db.prepare('UPDATE app_state SET shop=?,services=?,staff=?,notices=?,payments=?,updated_at=CURRENT_TIMESTAMP WHERE id=1').run(json(s.shop),json(s.services),json(s.staff),json(s.notices),json(s.payments||[]));
  const old=new Set(db.prepare('SELECT id FROM bookings').all().map(x=>x.id));
  const insert=db.prepare('INSERT INTO bookings(id,date,time,staff_id,service_id,status,data) VALUES(?,?,?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET date=excluded.date,time=excluded.time,staff_id=excluded.staff_id,service_id=excluded.service_id,status=excluded.status,data=excluded.data');
  for(const b of s.bookings){insert.run(b.id,b.date,b.time,b.staffId,b.serviceId,b.status,json(b));old.delete(b.id);}
  const del=db.prepare('DELETE FROM bookings WHERE id=?');for(const id of old)del.run(id);
  db.exec('COMMIT');
 }catch(e){db.exec('ROLLBACK');throw e;}
}
export function addBooking(b){db.prepare('INSERT INTO bookings(id,date,time,staff_id,service_id,status,data) VALUES(?,?,?,?,?,?,?)').run(b.id,b.date,b.time,b.staffId,b.serviceId,b.status,json(b));}
export function hashPassword(p,salt=randomBytes(16).toString('hex')){return `${salt}:${scryptSync(p,salt,64).toString('hex')}`;}
export function checkPassword(p,stored){const [salt,hashed]=stored.split(':');if(!salt||!hashed)return false;const a=scryptSync(p,salt,64),b=Buffer.from(hashed,'hex');return a.length===b.length&&timingSafeEqual(a,b);}
export const digest=v=>createHash('sha256').update(v).digest('hex');
export function seed(){
 migrate();
 const seedData=parse(readFileSync(resolve(root,'../frontend/src/mock/db.json'),'utf8'));
 if(!db.prepare('SELECT 1 FROM app_state WHERE id=1').get()) db.prepare('INSERT INTO app_state(id,shop,services,staff,notices,payments) VALUES(1,?,?,?,?,?)').run(json(seedData.shop),json(seedData.services),json(seedData.staff),json(seedData.notices||[]),json(seedData.payments||[]));
 if(!db.prepare('SELECT 1 FROM local_users LIMIT 1').get()){
  const email=process.env.MOCK_USER||'admin@rafaeluzeda.com';
  const pw=process.env.MOCK_PASSWORD||'Barbearia@2026';
  db.prepare('INSERT INTO local_users(id,email,password_hash,role) VALUES(?,?,?,?)').run(randomUUID(),email.toLowerCase(),hashPassword(pw),'owner');
 }
}
