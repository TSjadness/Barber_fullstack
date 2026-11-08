// Backend mock da Barbearia Rafael Úzeda — Node.js puro, sem dependências externas.
// Inicie com: npm start   (ou: node server.js)
const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { RuleError, checkSlot, validateState } = require('./src/rules');
const store = require('./src/store');

const PORT = Number(process.env.PORT) || 3000;
const FRONTEND = path.resolve(process.env.FRONTEND_DIR || path.join(__dirname, '..', 'frontend'));
const SESSION_HOURS = 12;
const sessions = new Map(); // token -> { email, expires }
const resetCodes = new Map(); // email -> { code, expires }

const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.png': 'image/png', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.json': 'application/json' };

function send(res, status, data) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization', 'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS' });
  res.end(JSON.stringify(data));
}
function readBody(req) {
  return new Promise((resolve, reject) => {
    let size = 0; const chunks = [];
    req.on('data', (c) => { size += c.length; if (size > 15e6) { reject(new Error('Requisição muito grande.')); req.destroy(); } else chunks.push(c); });
    req.on('end', () => { try { resolve(chunks.length ? JSON.parse(Buffer.concat(chunks).toString()) : {}); } catch { reject(new Error('JSON inválido.')); } });
  });
}
function auth(req) {
  const token = String(req.headers.authorization || '').replace(/^Bearer /, '');
  const s = sessions.get(token);
  if (!s || s.expires < Date.now()) { sessions.delete(token); return null; }
  return s;
}
const publicView = ({ users, ...db }) => ({
  ...db, payments: [],
  bookings: db.bookings.map((b) => ({ id: b.id, date: b.date, time: b.time, serviceId: b.serviceId, serviceIds: b.serviceIds, staffId: b.staffId, status: b.status })),
});
const adminView = ({ users, ...db }) => db;

const routes = {
  'GET /api/public': () => publicView(store.load()),

  'POST /api/bookings': async (req) => {
    const body = await readBody(req);
    const b = {
      id: crypto.randomUUID(), date: String(body.date || ''), time: String(body.time || ''),
      customer: String(body.customer || '').trim(), phone: String(body.phone || '').replace(/\D/g, ''),
      serviceId: String(body.serviceId || ''), staffId: String(body.staffId || ''),
      status: 'confirmado', paid: false, paymentMethod: null, createdAt: new Date().toISOString(),
    };
    if (Array.isArray(body.serviceIds) && body.serviceIds.length) { b.serviceIds = body.serviceIds.slice(0, 6).map(String); b.serviceId = b.serviceIds[0]; }
    if (b.customer.length < 3 || b.customer.length > 100 || b.phone.length < 10 || b.phone.length > 15) return [400, { error: 'Nome ou telefone inválido.' }];
    return store.transaction((db) => { checkSlot(b, db); db.bookings.push(b); return { booking: b }; });
  },

  'POST /api/login': async (req) => {
    const { email = '', password = '' } = await readBody(req);
    const user = store.load().users.find((u) => u.email === String(email).trim().toLowerCase());
    if (!user || !store.verifyPassword(String(password), user.password)) return [401, { error: 'Credenciais inválidas.' }];
    const token = crypto.randomBytes(32).toString('hex');
    sessions.set(token, { email: user.email, expires: Date.now() + SESSION_HOURS * 3600e3 });
    return { token, user: { email: user.email, role: user.role } };
  },

  'POST /api/logout': (req) => { sessions.delete(String(req.headers.authorization || '').replace(/^Bearer /, '')); return { ok: true }; },

  'POST /api/forgot': async (req) => {
    const email = String((await readBody(req)).email || '').trim().toLowerCase();
    if (store.load().users.some((u) => u.email === email)) {
      const code = String(crypto.randomInt(100000, 1000000));
      resetCodes.set(email, { code, expires: Date.now() + 15 * 60e3 });
      // Mock: em produção este código seria enviado por e-mail.
      console.log(`\n[recuperação de senha] código para ${email}: ${code} (válido por 15 min)\n`);
    }
    return { ok: true };
  },

  'POST /api/reset': async (req) => {
    const { email = '', code = '', password = '' } = await readBody(req);
    const e = String(email).trim().toLowerCase();
    if (String(password).length < 6) return [400, { error: 'A nova senha precisa ter pelo menos 6 caracteres.' }];
    const r = resetCodes.get(e);
    if (!r || r.expires < Date.now() || r.code !== String(code).trim()) return [400, { error: 'Código inválido ou expirado. Solicite um novo código.' }];
    resetCodes.delete(e);
    return store.transaction((db) => { db.users.find((u) => u.email === e).password = store.hashPassword(String(password)); return { ok: true }; });
  },

  'GET /api/admin/state': (req) => (auth(req) ? adminView(store.load()) : [401, { error: 'Sessão expirada. Entre novamente.' }]),

  'PUT /api/admin/state': async (req) => {
    if (!auth(req)) return [401, { error: 'Sessão expirada. Entre novamente.' }];
    const next = await readBody(req);
    validateState(next);
    return store.transaction((db) => {
      Object.assign(db, { shop: next.shop, services: next.services, staff: next.staff, notices: next.notices, payments: next.payments || [], bookings: next.bookings });
      return { ok: true };
    });
  },
};

function serveStatic(req, res) {
  const url = decodeURIComponent(req.url.split('?')[0]);
  let file = path.join(FRONTEND, path.normalize(url).replace(/^(\.\.[/\\])+/, ''));
  if (!file.startsWith(FRONTEND) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) file = path.join(FRONTEND, 'index.html'); // /login e outras rotas
  res.writeHead(200, { 'Content-Type': MIME[path.extname(file)] || 'application/octet-stream' });
  fs.createReadStream(file).pipe(res);
}

http.createServer(async (req, res) => {
  if (req.method === 'OPTIONS') return send(res, 204, {});
  const pathname = req.url.split('?')[0].replace(/\/$/, '');
  if (!pathname.startsWith('/api/')) return serveStatic(req, res);
  const handler = routes[`${req.method} ${pathname}`];
  if (!handler) return send(res, 404, { error: 'Rota não encontrada.' });
  try {
    const out = await handler(req);
    Array.isArray(out) ? send(res, out[0], out[1]) : send(res, 200, out);
  } catch (e) {
    if (e instanceof RuleError) return send(res, 400, { error: e.message });
    console.error(e);
    send(res, 500, { error: e.message || 'Erro interno.' });
  }
}).listen(PORT, () => {
  store.load();
  console.log(`\nBarbearia Rafael Úzeda rodando em http://localhost:${PORT}`);
  console.log(`Gestão: http://localhost:${PORT}/login`);
  console.log(`Dados:  ${store.FILE}\n`);
});
