import test from 'node:test';
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {mkdtempSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join,resolve} from 'node:path';
import {checkPhoneLimit,phoneKey,LimitError} from '../src/rules.mjs';

// Limites do site público: 2 reservas ativas por WhatsApp e 5 reservas por IP a cada hora.
const directory=mkdtempSync(join(tmpdir(),'barberflow-limits-'));
const port=23000+Math.floor(Math.random()*9000);
const base=`http://127.0.0.1:${port}`;
let child;
async function raw(path,init={}){const r=await fetch(base+path,init);let data={};try{data=await r.json();}catch{}return {status:r.status,data};}
async function ready(){for(let i=0;i<70;i++){try{if((await raw('/health')).status===200)return;}catch{}await new Promise(r=>setTimeout(r,100));}throw Error('API did not start');}
const DAY='2031-03-04'; // terça futura: p1 e p2 atendem
const reserve=(time,phone,staffId='p2')=>raw('/bookings',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({date:DAY,time,customer:'Maria Lima',phone,serviceId:'s1',staffId})});

test('regra de limite por telefone',()=>{
 const now={date:'2031-03-04',minutes:600};
 const b=(time,phone,status='confirmado',date=DAY)=>({date,time,phone,status});
 assert.equal(phoneKey('+55 (79) 99999-0001'),'79999990001');
 assert.doesNotThrow(()=>checkPhoneLimit('79999990001',[b('11:00','79999990001')],now));
 assert.throws(()=>checkPhoneLimit('5579999990001',[b('11:00','79999990001'),b('12:00','79999990001')],now),LimitError);
 // Canceladas, concluídas e passadas não contam.
 assert.doesNotThrow(()=>checkPhoneLimit('79999990001',[b('11:00','79999990001','cancelado'),b('12:00','79999990001','concluido'),b('09:00','79999990001'),b('11:00','79999990001','confirmado','2031-03-01')],now));
});

test('limites da API local',async(t)=>{
 child=spawn(process.execPath,[resolve('src/server.mjs')],{cwd:process.cwd(),env:{...process.env,BARBER_DB_PATH:join(directory,'db.sqlite'),MOCK_PORT:String(port)},stdio:'ignore'});
 await ready();
 try{
  await t.test('terceira reserva ativa do mesmo WhatsApp é recusada (403)',async()=>{
   assert.equal((await reserve('10:00','79999990001')).status,201);
   assert.equal((await reserve('11:00','79999990001')).status,201);
   const third=await reserve('12:00','5579999990001');
   assert.equal(third.status,403);
   assert.match(third.data.error,/2 agendamentos ativos/);
  });
  await t.test('sexta reserva da mesma conexão na hora é recusada (403)',async()=>{
   assert.equal((await reserve('13:00','79999990002')).status,201);
   assert.equal((await reserve('14:00','79999990002')).status,201);
   assert.equal((await reserve('15:00','79999990003')).status,201); // 5ª da conexão
   const sixth=await reserve('16:00','79999990004');
   assert.equal(sixth.status,403);
   assert.match(sixth.data.error,/Muitas reservas/);
  });
 }finally{child.kill();await new Promise(r=>{child.once('exit',r);setTimeout(r,2000);});rmSync(directory,{recursive:true,force:true});}
});
