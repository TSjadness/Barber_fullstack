// Regras de agendamento (mesmas validações usadas na versão em produção).
class RuleError extends Error {}
const fail = (m) => { throw new RuleError(m); };
const mins = (t) => Number(t.slice(0, 2)) * 60 + Number(t.slice(3));
const dayOf = (d) => new Date(d + 'T12:00:00').getDay();

/** Data/minuto atual no fuso da barbearia (São Paulo). */
function shopNow(now = new Date()) {
  const p = Object.fromEntries(
    new Intl.DateTimeFormat('en-CA', {
      timeZone: 'America/Sao_Paulo', year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
    }).formatToParts(now).map((x) => [x.type, x.value]),
  );
  return { date: `${p.year}-${p.month}-${p.day}`, minutes: Number(p.hour) * 60 + Number(p.minute) };
}

const idsOf = (b) => (Array.isArray(b.serviceIds) && b.serviceIds.length ? b.serviceIds : [b.serviceId]);

function durationOf(b, services) {
  const total = idsOf(b).reduce((a, id) => a + (Number(services.find((s) => s.id === id)?.duration) || 0), 0);
  return total || 30;
}

function checkSlot(b, db, now = shopNow()) {
  const ids = idsOf(b);
  const p = db.staff.find((x) => x.id === b.staffId && x.active);
  if (!ids.length || ids.length > 6 || new Set(ids).size !== ids.length ||
      !ids.every((id) => db.services.some((x) => x.id === id && x.active)) || !p)
    fail('Serviço ou profissional indisponível.');
  const dur = durationOf(b, db.services);
  if (!/^\d{4}-\d\d-\d\d$/.test(b.date) || !/^([01]\d|2[0-3]):[0-5]\d$/.test(b.time) ||
      Number.isNaN(new Date(b.date + 'T12:00:00').getTime()))
    fail('Data ou horário inválido.');
  if (b.date < now.date) fail('A data já passou.');
  if (b.date === now.date && mins(b.time) <= now.minutes) fail('Esse horário já passou.');
  const wd = dayOf(b.date);
  const sched = p.weekly?.[wd] || { mode: p.days.includes(wd) ? 'default' : 'closed', start: p.start, end: p.end };
  if (sched.mode === 'closed' ||
      db.notices.some((n) => n.type === 'block' && n.date === b.date && (n.staffId === 'all' || n.staffId === p.id)))
    fail('Profissional indisponível nessa data.');
  const a = mins(sched.mode === 'custom' ? sched.start : p.start);
  const z = mins(sched.mode === 'custom' ? sched.end : p.end);
  const t = mins(b.time);
  if (t < a || t + dur > z || (t - a) % 10) fail('Horário fora do expediente.');
  if (db.bookings.some((x) => x.status !== 'cancelado' && x.id !== b.id && x.staffId === p.id && x.date === b.date &&
      t < mins(x.time) + durationOf(x, db.services) && t + dur > mins(x.time)))
    fail('Este horário acabou de ser reservado.');
}

function validateState(next) {
  if (!next || typeof next !== 'object') fail('Dados inválidos.');
  for (const k of ['shop', 'services', 'staff', 'bookings', 'notices'])
    if (!next[k] || !(k === 'shop' ? typeof next[k] === 'object' : Array.isArray(next[k]))) fail('Estrutura inválida: ' + k);
  if (next.services.length > 200 || next.staff.length > 100 || next.bookings.length > 20000 || next.notices.length > 2000)
    fail('Limite de registros excedido.');
  for (const s of next.services)
    if (!s.id || typeof s.name !== 'string' || s.name.length > 100 || !Number.isFinite(+s.price) || +s.price < 0 ||
        !Number.isFinite(+s.duration) || +s.duration < 10)
      fail('Serviço inválido.');
  for (const p of next.staff)
    if (!p.id || typeof p.name !== 'string' || !Array.isArray(p.days) || !/^\d\d:\d\d$/.test(p.start) ||
        !/^\d\d:\d\d$/.test(p.end) || mins(p.start) >= mins(p.end))
      fail('Profissional inválido.');
  for (const b of next.bookings) if (!b.id || !b.serviceId || !b.staffId || !b.date || !b.time) fail('Agendamento inválido.');
}

module.exports = { RuleError, checkSlot, validateState, shopNow, durationOf, idsOf };
