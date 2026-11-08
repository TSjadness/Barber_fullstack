// Persistência mock em arquivo JSON (data/database.json).
// Para trocar por um banco real, basta reimplementar load() e save() mantendo o mesmo formato.
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const FILE = process.env.DB_FILE || path.join(__dirname, '..', 'data', 'database.json');
const SEED = path.join(__dirname, '..', 'data', 'seed.json');

function hashPassword(password, salt = crypto.randomBytes(16).toString('hex')) {
  return `${salt}:${crypto.scryptSync(password, salt, 64).toString('hex')}`;
}
function verifyPassword(password, stored) {
  const [salt, hash] = String(stored || '').split(':');
  if (!salt || !hash) return false;
  const a = Buffer.from(hash, 'hex');
  const b = crypto.scryptSync(password, salt, 64);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

function load() {
  if (!fs.existsSync(FILE)) {
    const seed = JSON.parse(fs.readFileSync(SEED, 'utf8'));
    seed.users = [{ email: seed.admin.email, role: 'owner', password: hashPassword(seed.admin.password) }];
    delete seed.admin;
    save(seed);
    console.log(`[db] database.json criado a partir de seed.json`);
  }
  return JSON.parse(fs.readFileSync(FILE, 'utf8'));
}

let queue = Promise.resolve();
function save(db) {
  fs.mkdirSync(path.dirname(FILE), { recursive: true });
  const tmp = FILE + '.tmp';
  fs.writeFileSync(tmp, JSON.stringify(db, null, 2));
  fs.renameSync(tmp, FILE);
}
/** Executa leitura+escrita em fila, evitando duas gravações ao mesmo tempo. */
function transaction(fn) {
  const run = queue.then(() => { const db = load(); const out = fn(db); if (out && out.__save !== false) save(db); return out; });
  queue = run.catch(() => {});
  return run;
}

module.exports = { load, save, transaction, hashPassword, verifyPassword, FILE };
