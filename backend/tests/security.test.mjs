import test from 'node:test';
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {mkdtempSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join,resolve} from 'node:path';

// Segurança e integridade da API local (autenticação, autorização, entradas e exclusões).
const directory=mkdtempSync(join(tmpdir(),'barberflow-sec-'));
const port=23000+Math.floor(Math.random()*9000);
const base=`http://127.0.0.1:${port}`;
let child;
function start(){child=spawn(process.execPath,[resolve('src/server.mjs')],{cwd:process.cwd(),env:{...process.env,BARBER_DB_PATH:join(directory,'db.sqlite'),MOCK_PORT:String(port)},stdio:'ignore'});}
async function raw(path,init={}){const r=await fetch(base+path,init);let data={};try{data=await r.json();}catch{}return {status:r.status,data};}
const json=(path,method,body,token,extra={})=>raw(path,{method,headers:{'content-type':'application/json',...(token?{authorization:`Bearer ${token}`}:{}),...extra},body:body===undefined?undefined:JSON.stringify(body)});
async function ready(){for(let i=0;i<70;i++){try{if((await raw('/health')).status===200)return;}catch{}await new Promise(r=>setTimeout(r,100));}throw Error('API did not start');}
async function stop(){if(child&&!child.killed){const p=child;child=null;p.kill();await new Promise(r=>{p.once('exit',r);setTimeout(r,2000);});}}

const DAY='2031-03-04'; // terça futura: p1 e p2 atendem
const booking=(id,patch={})=>({id,date:DAY,time:'11:00',customer:'Cliente Teste',phone:'79999990000',serviceId:'s1',staffId:'p2',status:'confirmado',paid:false,paymentMethod:null,...patch});

test('segurança da API local',async(t)=>{
 start();await ready();
 const token=(await json('/login','POST',{email:'admin@rafaeluzeda.com',password:'Barbearia@2026'})).data.token;
 const get=async()=>(await json('/admin/state','GET',undefined,token)).data;
 const put=(next)=>json('/admin/state','PUT',next,token);
 try{
  await t.test('acesso administrativo exige autenticação',async()=>{
   assert.equal((await raw('/admin/state')).status,401);
   assert.equal((await json('/admin/state','PUT',await get())).status,401);
   assert.equal((await json('/admin/state','GET',undefined,'token-invalido')).status,401);
   assert.equal((await raw('/admin/state',{headers:{authorization:'Basic abc'}})).status,401);
  });
  await t.test('sessão encerrada não é aceita',async()=>{
   const other=(await json('/login','POST',{email:'admin@rafaeluzeda.com',password:'Barbearia@2026'})).data.token;
   await json('/logout','POST',{},other);
   assert.equal((await json('/admin/state','GET',undefined,other)).status,401);
  });
  await t.test('entradas malformadas são recusadas sem detalhes internos',async()=>{
   const bad=await raw('/admin/state',{method:'PUT',headers:{'content-type':'application/json',authorization:`Bearer ${token}`},body:'{nao-e-json'});
   assert.equal(bad.status,400);assert.equal(bad.data.error,'JSON inválido.');
   assert.equal((await raw('/bookings',{method:'POST',headers:{'content-type':'text/plain'},body:'x'})).status,415);
   assert.equal((await put({shop:{}})).status,400);
   assert.equal((await put({...await get(),bookings:[{id:''}]})).status,400);
   const big=await raw('/bookings',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({x:'a'.repeat(2_100_000)})});
   assert.ok([413,400].includes(big.status));
  });
  await t.test('reserva pública feita durante a edição não é apagada pela gestão',async()=>{
   const stale=await get();
   const pub=await json('/bookings','POST',{date:DAY,time:'15:00',customer:'Maria Lima',phone:'79999990001',serviceId:'s1',staffId:'p2'});
   assert.equal(pub.status,201);
   // A gestão salva o estado que carregou antes da reserva (ex.: mudou o nome da barbearia).
   assert.equal((await put({...stale,shop:{...stale.shop,name:'Outro nome'}})).status,200);
   assert.ok((await get()).bookings.some(b=>b.id===pub.data.booking.id),'reserva pública foi apagada');
  });
  await t.test('aba desatualizada não recria agendamento excluído em outra aba (409)',async()=>{
   let s=await get();
   assert.equal(typeof s.version,'string');
   assert.equal((await put({...s,bookings:[...s.bookings,booking('aba',{time:'13:00'})]})).status,200);
   const tabA=await get(),tabB=await get();
   assert.equal(tabA.version,tabB.version);
   // Aba A exclui; a versão muda.
   const del=await put({...tabA,bookings:tabA.bookings.filter(b=>b.id!=='aba'),deletedBookingIds:['aba']});
   assert.equal(del.status,200);assert.equal(typeof del.data.version,'string');assert.notEqual(del.data.version,tabA.version);
   // Aba B, com o estado antigo (ainda tem o agendamento), tenta salvar outra alteração.
   const stale=await put({...tabB,shop:{...tabB.shop,name:'Nome da aba B'}});
   assert.equal(stale.status,409);assert.match(stale.data.error,/outra aba/);
   s=await get();
   assert.ok(!s.bookings.some(b=>b.id==='aba'),'agendamento excluído voltou');
   assert.notEqual(s.shop.name,'Nome da aba B','gravação desatualizada foi aplicada');
   // Versão devolvida pela gravação permite a próxima gravação da mesma aba.
   const next=await put({...s,shop:{...s.shop,name:'Barbearia'}});
   assert.equal(next.status,200);
   assert.equal((await put({...s,version:next.data.version,shop:{...s.shop,name:'Barbearia 2'}})).status,200);
   // Cliente antigo (sem versão) continua gravando; versão inválida é recusada.
   const {version,...legacy}=await get();
   assert.equal((await put({...legacy,shop:{...legacy.shop,name:'Barbearia'}})).status,200);
   assert.equal((await put({...legacy,version:42})).status,400);
   assert.equal((await raw('/public')).data.version,undefined);
  });
  await t.test('exclusão de agendamento só com pedido explícito e sem histórico financeiro',async()=>{
   let s=await get();
   assert.equal((await put({...s,bookings:[...s.bookings,booking('apagar'),booking('pago',{time:'12:00',paid:true,paymentMethod:'Pix'})]})).status,200);
   s=await get();
   const ok=await put({...s,bookings:s.bookings.filter(b=>b.id!=='apagar'),deletedBookingIds:['apagar']});
   assert.equal(ok.status,200);assert.ok(!(await get()).bookings.some(b=>b.id==='apagar'));
   s=await get();
   const paid=await put({...s,bookings:s.bookings.filter(b=>b.id!=='pago'),deletedBookingIds:['pago']});
   assert.equal(paid.status,400);assert.match(paid.data.error,/histórico financeiro/);
   assert.ok((await get()).bookings.some(b=>b.id==='pago'));
   const bogus=await put({...await get(),deletedBookingIds:['nao-existe',42]});
   assert.equal(bogus.status,400);
  });
  await t.test('serviço usado em agendamentos não pode ser excluído',async()=>{
   const s=await get();
   const r=await put({...s,services:s.services.filter(x=>x.id!=='s1')});
   assert.equal(r.status,400);assert.match(r.data.error,/agendamentos/);
   assert.ok((await get()).services.some(x=>x.id==='s1'));
  });
  await t.test('proprietário e profissional com agendamentos futuros não podem ser removidos',async()=>{
   const s=await get();
   assert.equal((await put({...s,staff:s.staff.filter(p=>p.id!=='p1')})).status,400);
   assert.equal((await put({...s,staff:s.staff.filter(p=>p.id!=='p2')})).status,400);
  });
  await t.test('foto e textos inválidos são recusados',async()=>{
   const s=await get();
   const withPhoto=(photo)=>({...s,staff:s.staff.map(p=>p.id==='p2'?{...p,photo}:p)});
   assert.equal((await put(withPhoto('javascript:alert(1)'))).status,400);
   assert.equal((await put(withPhoto('data:text/html;base64,PHNjcmlwdD4='))).status,400);
   assert.equal((await put(withPhoto('data:image/jpeg;base64,'+'A'.repeat(1_100_000)))).status,400);
   assert.equal((await put(withPhoto('data:image/jpeg;base64,AAAA'))).status,200);
   assert.equal((await put({...s,shop:{...s.shop,name:'x'.repeat(500)}})).status,400);
   assert.equal((await put({...s,bookings:s.bookings.map((b,i)=>i?b:{...b,status:'hackeado'})})).status,400);
  });
  await t.test('regras de agendamento continuam valendo na gravação',async()=>{
   const s=await get();
   const blocked={...s,notices:[...s.notices,{id:'b1',date:DAY,staffId:'p2',type:'block',title:'Folga',detail:''}]};
   assert.equal((await put(blocked)).status,200);
   const s2=await get();
   assert.equal((await put({...s2,bookings:[...s2.bookings,booking('novo',{time:'17:00'})]})).status,400);
  });
  await t.test('dados públicos não trazem clientes, telefones nem pagamentos',async()=>{
   const pub=(await raw('/public')).data;
   assert.deepEqual(pub.payments,[]);
   for(const b of pub.bookings){assert.equal(b.customer,undefined);assert.equal(b.phone,undefined);assert.equal(b.paid,undefined);}
  });
  await t.test('recuperação de senha não revela se o e-mail existe',async()=>{
   const r=await json('/forgot','POST',{email:'ninguem@exemplo.com'});
   assert.ok([200,501].includes(r.status));assert.ok(!/não encontrado|inexistente/i.test(JSON.stringify(r.data)));
  });
 } finally {await stop();rmSync(directory,{recursive:true,force:true});}
});
