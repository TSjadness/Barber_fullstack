export class RuleError extends Error{}
const fail=m=>{throw new RuleError(m)};
const mins=t=>Number(t.slice(0,2))*60+Number(t.slice(3,5));
const idsOf=b=>Array.isArray(b.serviceIds)&&b.serviceIds.length?b.serviceIds:[b.serviceId];
const duration=(b,services)=>idsOf(b).reduce((sum,id)=>sum+(Number(services.find(s=>s.id===id)?.duration)||0),0)||30;
export function shopNow(now=new Date()){
 const p=Object.fromEntries(new Intl.DateTimeFormat('en-CA',{timeZone:'America/Sao_Paulo',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).formatToParts(now).map(x=>[x.type,x.value]));
 return {date:`${p.year}-${p.month}-${p.day}`, minutes:Number(p.hour)*60+Number(p.minute)};
}
// Limites do site público (mesma regra de frontend/src/lib/barber-rules.ts).
export const PHONE_BOOKING_LIMIT=2, IP_BOOKING_LIMIT=5, IP_LIMIT_WINDOW_MS=3600_000;
export const PHONE_LIMIT_MESSAGE='Você já tem 2 agendamentos ativos com este WhatsApp. Para marcar outro horário, fale com a barbearia.';
export const IP_LIMIT_MESSAGE='Muitas reservas feitas desta conexão na última hora. Tente novamente mais tarde ou fale com a barbearia.';
export class LimitError extends RuleError{constructor(message,reason){super(message);this.reason=reason;}}
export const phoneKey=v=>{const d=String(v??'').replace(/\D/g,'');return d.length>=12&&d.startsWith('55')?d.slice(2):d;};
/** Reserva pública: no máximo 2 reservas ativas (pendente/confirmado) futuras por WhatsApp. */
export function checkPhoneLimit(phone,bookings,now=shopNow()){
 const key=phoneKey(phone);if(!key)return;
 const active=bookings.filter(b=>(b.status==='pendente'||b.status==='confirmado')&&phoneKey(b.phone)===key&&(b.date>now.date||(b.date===now.date&&mins(b.time)>=now.minutes))).length;
 if(active>=PHONE_BOOKING_LIMIT)throw new LimitError(PHONE_LIMIT_MESSAGE,'phone');
}
export function checkSlot(b,s,now=shopNow()){
 const ids=idsOf(b), staff=s.staff.find(p=>p.id===b.staffId&&p.active);
 if(!staff||!ids.length||ids.length>6||new Set(ids).size!==ids.length||!ids.every(id=>s.services.some(x=>x.id===id&&x.active)))fail('Serviço ou profissional indisponível.');
 if(!/^\d{4}-\d{2}-\d{2}$/.test(b.date)||!/^([01]\d|2[0-3]):[0-5]\d$/.test(b.time)||Number.isNaN(Date.parse(b.date+'T12:00:00')))fail('Data ou horário inválido.');
 if(b.date<now.date)fail('A data já passou.');if(b.date===now.date&&mins(b.time)<=now.minutes)fail('Esse horário já passou.');
 checkWorkingSlot(b,staff,s,true);
}
// Expediente, bloqueios (da barbearia ou do profissional), limites e conflitos; grid = passos de 10 min.
function checkWorkingSlot(b,staff,s,grid){
 const wd=new Date(b.date+'T12:00:00').getDay();
 const wk=staff.weekly?.[wd]||{mode:staff.days.includes(wd)?'default':'closed',start:staff.start,end:staff.end};
 if(wk.mode==='closed'||s.notices.some(n=>n.type==='block'&&n.date===b.date&&(n.staffId==='all'||n.staffId===staff.id)))fail('Profissional indisponível nessa data.');
 const a=mins(wk.mode==='custom'?(wk.start??staff.start):staff.start),z=mins(wk.mode==='custom'?(wk.end??staff.end):staff.end),t=mins(b.time),dur=duration(b,s.services);
 if(t<a||t+dur>z||(grid&&(t-a)%10))fail('Horário fora do expediente.');
 if(s.bookings.some(x=>x.id!==b.id&&x.status!=='cancelado'&&x.staffId===staff.id&&x.date===b.date&&t<mins(x.time)+duration(x,s.services)&&t+dur>mins(x.time)))fail('Este horário acabou de ser reservado.');
}
const slotKey=b=>[b.date,b.time,b.staffId,idsOf(b).join('+')].join('|');
/** Gravação da gestão: valida só agendamentos novos ou remarcados (mesma regra de src/lib/barber-rules.ts do frontend). */
export function validateBookingChanges(previous,next){
 const before=new Map(previous.bookings.map(b=>[b.id,b]));
 for(const b of next.bookings){
  if(b.status==='cancelado')continue;
  const old=before.get(b.id);if(old&&slotKey(old)===slotKey(b))continue;
  const ids=idsOf(b),staff=next.staff.find(p=>p.id===b.staffId);
  if(!staff||!ids.length||!ids.every(id=>next.services.some(x=>x.id===id)))fail('Serviço ou profissional indisponível.');
  if(!/^\d{4}-\d{2}-\d{2}$/.test(b.date)||!/^([01]\d|2[0-3]):[0-5]\d$/.test(b.time))fail('Data ou horário inválido.');
  checkWorkingSlot(b,staff,next,false);
 }
}
// ---- Gravação da gestão: conteúdo, exclusões explícitas e integridade (igual a frontend/src/lib/barber-rules.ts).
const STATUSES=new Set(['pendente','confirmado','concluido','cancelado']);
export function isSafePhoto(v){
 if(v===undefined||v===null||v==='')return true;
 if(typeof v!=='string'||v.length>1_000_000)return false;
 return /^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/]+=*$/.test(v)||/^\/(?!\/)[\w\-./]+$/.test(v)||/^https:\/\/[\w\-.]+(:\d+)?\/[\w\-./%?=&]*$/.test(v);
}
const text=(v,max,required=false)=>(v===undefined||v===null?!required:typeof v==='string')&&String(v??'').length<=max&&(!required||String(v).trim().length>0);
function validateContent(next){
 const s=next.shop;
 if(!text(s.name,200)||!text(s.tagline,1000)||!text(s.address,2000)||!text(s.whatsapp,40)||!text(s.phone,40)||!text(s.instagram,300)||!text(s.facebook,300))fail('Configurações inválidas.');
 for(const p of next.staff)if(!text(p.name,200,true)||!text(p.role,200)||!isSafePhoto(p.photo))fail('Profissional inválido.');
 for(const b of next.bookings)if(typeof b.id!=='string'||!STATUSES.has(b.status)||!text(b.customer,200)||!text(b.phone,40)||(b.paid!==undefined&&typeof b.paid!=='boolean'))fail('Agendamento inválido.');
 for(const n of next.notices)if(!n.id||!/^\d{4}-\d\d-\d\d$/.test(n.date)||!text(n.title,200)||!text(n.detail,2000))fail('Aviso inválido.');
}
const isFinancialRecord=b=>b.paid===true||b.status==='concluido';
/** Valida a gravação e devolve {bookings: estado final, deletions: exclusões pedidas}. Ausentes do envio são preservados. */
export function prepareAdminSave(previous,next,now=shopNow()){
 validateContent(next);
 const requested=next.deletedBookingIds??[];
 if(!Array.isArray(requested)||requested.length>500||requested.some(id=>typeof id!=='string'))fail('Exclusão inválida.');
 const byId=new Map(previous.bookings.map(b=>[b.id,b])),deletions=[...new Set(requested)];
 for(const id of deletions){const b=byId.get(id);if(!b)fail('Agendamento não encontrado para exclusão.');if(isFinancialRecord(b))fail('Agendamentos pagos ou concluídos fazem parte do histórico financeiro e não podem ser excluídos.');}
 const sent=new Set(next.bookings.map(b=>b.id)),removed=new Set(deletions);
 const bookings=[...next.bookings.filter(b=>!removed.has(b.id)),...previous.bookings.filter(b=>!sent.has(b.id)&&!removed.has(b.id))];
 const used=new Set(bookings.flatMap(b=>idsOf(b)));
 for(const s of previous.services)if(!next.services.some(x=>x.id===s.id)&&used.has(s.id))fail('Este serviço possui agendamentos e não pode ser excluído. Desative-o para ocultá-lo do site.');
 for(const p of previous.staff){
  if(next.staff.some(x=>x.id===p.id))continue;
  if(p.owner===true||p.id==='p1')fail('O cadastro do dono não pode ser removido.');
  if(bookings.some(b=>b.staffId===p.id&&b.status!=='cancelado'&&b.date>=now.date))fail('Este profissional tem agendamentos futuros. Cancele ou transfira antes de remover.');
 }
 validateBookingChanges(previous,{...next,bookings});
 return {bookings,deletions};
}
export function validateState(next){
 if(!next||typeof next!=='object')fail('Dados inválidos.');
 for(const k of ['shop','services','staff','bookings','notices'])if(!next[k]||(k==='shop'?typeof next[k]!=='object':!Array.isArray(next[k])))fail('Estrutura inválida: '+k);
 if(next.services.length>200||next.staff.length>100||next.bookings.length>20000||next.notices.length>2000)fail('Limite de registros excedido.');
 for(const x of next.services)if(!x.id||typeof x.name!=='string'||x.name.length>100||!Number.isFinite(+x.price)||+x.price<0||!Number.isFinite(+x.duration)||+x.duration<10)fail('Serviço inválido.');
 for(const p of next.staff)if(!p.id||typeof p.name!=='string'||!Array.isArray(p.days)||!/^\d\d:\d\d$/.test(p.start)||!/^\d\d:\d\d$/.test(p.end)||mins(p.start)>=mins(p.end))fail('Profissional inválido.');
 for(const b of next.bookings)if(!b.id||!b.serviceId||!b.staffId||!b.date||!b.time)fail('Agendamento inválido.');
}
