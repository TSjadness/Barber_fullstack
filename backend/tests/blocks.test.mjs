import test from 'node:test';
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {mkdtempSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join,resolve} from 'node:path';

// Bloqueios por profissional na camada de persistência (servidor local + SQLite).
const directory=mkdtempSync(join(tmpdir(),'barberflow-blocks-'));
const port=43000+Math.floor(Math.random()*10000);
const base=`http://127.0.0.1:${port}`;
let child;
function start(){child=spawn(process.execPath,[resolve('src/server.mjs')],{cwd:process.cwd(),env:{...process.env,BARBER_DB_PATH:join(directory,'db.sqlite'),MOCK_PORT:String(port)},stdio:'ignore'});}
async function request(path,method='GET',body,token){
 const r=await fetch(base+path,{method,headers:{...(body?{'content-type':'application/json'}:{}),...(token?{authorization:`Bearer ${token}`}:{})},body:body?JSON.stringify(body):undefined});
 return {status:r.status,data:await r.json()};
}
async function ready(){for(let i=0;i<70;i++){try{if((await request('/health')).status===200)return;}catch{}await new Promise(r=>setTimeout(r,100));}throw Error('API did not start');}
async function stop(){if(child&&!child.killed){const p=child;child=null;p.kill();await new Promise(r=>{p.once('exit',r);setTimeout(r,2000);});}}

// Terça-feira futura: os dois profissionais do seed atendem (p1 09-18, p2 10-19).
const DAY='2031-03-04';
const booking=(id,patch={})=>({id,date:DAY,time:'11:00',customer:'Cliente Teste',phone:'79999990000',serviceId:'s1',staffId:'p1',status:'confirmado',paid:false,paymentMethod:null,...patch});

test('bloqueios por profissional são aplicados na gravação',async()=>{
 try{
  start();await ready();
  const token=(await request('/login','POST',{email:'admin@rafaeluzeda.com',password:'Barbearia@2026'})).data.token;
  const get=async()=>(await request('/admin/state','GET',undefined,token)).data;
  const put=next=>request('/admin/state','PUT',next,token);

  // Agendamento existente antes do bloqueio.
  let s=await get();
  assert.equal((await put({...s,bookings:[...s.bookings,booking('antes')]})).status,200);

  // Bloqueio individual de p1 criado depois: o agendamento existente continua válido.
  s=await get();
  const blocked={...s,notices:[...s.notices,{id:'blk',date:DAY,staffId:'p1',type:'block',title:'Folga',detail:''}]};
  assert.equal((await put(blocked)).status,200,'criar bloqueio não invalida agendamentos existentes');

  s=await get();
  // Agendamento manual em dia bloqueado do profissional: recusado.
  const manual=await put({...s,bookings:[...s.bookings,booking('manual',{time:'14:00'})]});
  assert.equal(manual.status,400);assert.match(manual.data.error,/indisponível/);
  // Outro profissional na mesma data: permitido.
  assert.equal((await put({...s,bookings:[...s.bookings,booking('outro',{time:'14:00',staffId:'p2'})]})).status,200);

  s=await get();
  // Reagendar um agendamento de p2 para p1 na data bloqueada: recusado e nada muda no banco.
  const moved=s.bookings.map(b=>b.id==='outro'?{...b,staffId:'p1'}:b);
  assert.equal((await put({...s,bookings:moved})).status,400);
  assert.equal((await get()).bookings.find(b=>b.id==='outro').staffId,'p2','dados anteriores preservados');

  // Atualizar só o status de um agendamento existente no dia bloqueado: permitido.
  s=await get();
  assert.equal((await put({...s,bookings:s.bookings.map(b=>b.id==='antes'?{...b,status:'concluido',paid:true}:b)})).status,200);

  // Conflito com outro atendimento ao remarcar: recusado.
  s=await get();
  const clash=await put({...s,bookings:[...s.bookings,booking('clash',{staffId:'p2',time:'14:10'})]});
  assert.equal(clash.status,400);assert.match(clash.data.error,/reservado/);

  // Reserva pública: p1 bloqueado (409) e p2 disponível (201).
  const pub=(staffId,time)=>request('/bookings','POST',{date:DAY,time,customer:'Maria Lima',phone:'79999990001',serviceId:'s1',serviceIds:['s1'],staffId});
  assert.equal((await pub('p1','16:00')).status,409);
  assert.equal((await pub('p2','16:00')).status,201);

  // Bloqueio geral: ninguém recebe reserva pública nem agendamento manual.
  s=await get();
  const shop={...s,notices:[...s.notices,{id:'geral',date:'2031-03-05',staffId:'all',type:'block',title:'Fechado',detail:''}]};
  assert.equal((await put(shop)).status,200);
  assert.equal((await request('/bookings','POST',{date:'2031-03-05',time:'11:00',customer:'Maria Lima',phone:'79999990001',serviceId:'s1',staffId:'p2'})).status,409);
  s=await get();
  assert.equal((await put({...s,bookings:[...s.bookings,booking('geral',{date:'2031-03-05',staffId:'p2'})]})).status,400);
 } finally {await stop();rmSync(directory,{recursive:true,force:true});}
});
