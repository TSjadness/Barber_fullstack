export class RuleError extends Error{}
const fail=m=>{throw new RuleError(m)};
const mins=t=>Number(t.slice(0,2))*60+Number(t.slice(3,5));
const idsOf=b=>Array.isArray(b.serviceIds)&&b.serviceIds.length?b.serviceIds:[b.serviceId];
const duration=(b,services)=>idsOf(b).reduce((sum,id)=>sum+(Number(services.find(s=>s.id===id)?.duration)||0),0)||30;
export function shopNow(now=new Date()){
 const p=Object.fromEntries(new Intl.DateTimeFormat('en-CA',{timeZone:'America/Sao_Paulo',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).formatToParts(now).map(x=>[x.type,x.value]));
 return {date:`${p.year}-${p.month}-${p.day}`, minutes:Number(p.hour)*60+Number(p.minute)};
}
export function checkSlot(b,s,now=shopNow()){
 const ids=idsOf(b), staff=s.staff.find(p=>p.id===b.staffId&&p.active);
 if(!staff||!ids.length||ids.length>6||new Set(ids).size!==ids.length||!ids.every(id=>s.services.some(x=>x.id===id&&x.active)))fail('Serviço ou profissional indisponível.');
 if(!/^\d{4}-\d{2}-\d{2}$/.test(b.date)||!/^([01]\d|2[0-3]):[0-5]\d$/.test(b.time)||Number.isNaN(Date.parse(b.date+'T12:00:00')))fail('Data ou horário inválido.');
 if(b.date<now.date)fail('A data já passou.');if(b.date===now.date&&mins(b.time)<=now.minutes)fail('Esse horário já passou.');
 const wd=new Date(b.date+'T12:00:00').getDay();
 const wk=staff.weekly?.[wd]||{mode:staff.days.includes(wd)?'default':'closed',start:staff.start,end:staff.end};
 if(wk.mode==='closed'||s.notices.some(n=>n.type==='block'&&n.date===b.date&&(n.staffId==='all'||n.staffId===staff.id)))fail('Profissional indisponível nessa data.');
 const a=mins(wk.mode==='custom'?wk.start:staff.start),z=mins(wk.mode==='custom'?wk.end:staff.end),t=mins(b.time),dur=duration(b,s.services);
 if(t<a||t+dur>z||(t-a)%10)fail('Horário fora do expediente.');
 if(s.bookings.some(x=>x.id!==b.id&&x.status!=='cancelado'&&x.staffId===staff.id&&x.date===b.date&&t<mins(x.time)+duration(x,s.services)&&t+dur>mins(x.time)))fail('Este horário acabou de ser reservado.');
}
export function validateState(next){
 if(!next||typeof next!=='object')fail('Dados inválidos.');
 for(const k of ['shop','services','staff','bookings','notices'])if(!next[k]||(k==='shop'?typeof next[k]!=='object':!Array.isArray(next[k])))fail('Estrutura inválida: '+k);
 if(next.services.length>200||next.staff.length>100||next.bookings.length>20000||next.notices.length>2000)fail('Limite de registros excedido.');
 for(const x of next.services)if(!x.id||typeof x.name!=='string'||x.name.length>100||!Number.isFinite(+x.price)||+x.price<0||!Number.isFinite(+x.duration)||+x.duration<10)fail('Serviço inválido.');
 for(const p of next.staff)if(!p.id||typeof p.name!=='string'||!Array.isArray(p.days)||!/^\d\d:\d\d$/.test(p.start)||!/^\d\d:\d\d$/.test(p.end)||mins(p.start)>=mins(p.end))fail('Profissional inválido.');
 for(const b of next.bookings)if(!b.id||!b.serviceId||!b.staffId||!b.date||!b.time)fail('Agendamento inválido.');
}
