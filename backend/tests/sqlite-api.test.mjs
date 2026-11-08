import test from 'node:test';
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {mkdtempSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join,resolve} from 'node:path';
const directory=mkdtempSync(join(tmpdir(),'barberflow-'));
const port=33000+Math.floor(Math.random()*10000);
const base=`http://127.0.0.1:${port}`;
let child;
function start(){
 child=spawn(process.execPath,[resolve('src/server.mjs')],{cwd:process.cwd(),env:{...process.env,BARBER_DB_PATH:join(directory,'db.sqlite'),MOCK_PORT:String(port)},stdio:'ignore'});
}
async function request(path,method='GET',body,token){
 const r=await fetch(base+path,{method,headers:{...(body?{'content-type':'application/json'}:{}),...(token?{authorization:`Bearer ${token}`}:{})},body:body?JSON.stringify(body):undefined});return {status:r.status,data:await r.json()};
}
async function ready(){for(let i=0;i<70;i++){try {const r=await request('/health');if(r.status===200)return;}catch{}await new Promise(r=>setTimeout(r,100));}throw Error('API did not start');}
async function stop(){if(child&&!child.killed){const p=child;child=null;p.kill();await new Promise(r=>{p.once('exit',r);setTimeout(r,2000);});}}
test('persistent SQLite API with authentication and public privacy',async()=>{
 try{
  start();await ready();
  assert.equal((await request('/health')).data.database,'sqlite');
  const unauth=await request('/admin/state');assert.equal(unauth.status,401);
  const bad=await request('/login','POST',{email:'admin@rafaeluzeda.com',password:'wrong'});assert.equal(bad.status,401);
  const login=await request('/login','POST',{email:'admin@rafaeluzeda.com',password:'Barbearia@2026'});assert.equal(login.status,200);
  const token=login.data.token;
  const admin=await request('/admin/state','GET',undefined,token);assert.equal(admin.status,200);
  const updated={...admin.data,shop:{...admin.data.shop,name:'Teste Persistente'}};
  assert.equal((await request('/admin/state','PUT',updated,token)).status,200);
  const invalid=await request('/bookings','POST',{date:'2027-11-11',time:'10:00',customer:'A',phone:'1',serviceId:'s1',staffId:'p1'});assert.equal(invalid.status,400);
  const pub=await request('/public');assert.equal(pub.data.shop.name,'Teste Persistente');assert.deepEqual(pub.data.payments,[]);
  await stop();start();await ready();
  const persisted=await request('/public');assert.equal(persisted.data.shop.name,'Teste Persistente');
 } finally {await stop();rmSync(directory,{recursive:true,force:true});}
});
