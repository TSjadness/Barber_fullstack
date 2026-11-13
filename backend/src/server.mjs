/** Local-only persistent BarberFlow API; never expose this development server to the internet. */
import http from 'node:http';
import {randomUUID,randomInt} from 'node:crypto';
import {db,seed,state,saveState,addBooking,checkPassword,hashPassword,digest,ConflictError} from './database/db.mjs';
const CONFLICT='Os dados foram alterados em outra aba ou aparelho. A tela foi atualizada: confira e refaça a alteração.';
import {checkSlot,checkPhoneLimit,validateState,prepareAdminSave,RuleError,LimitError,IP_BOOKING_LIMIT,IP_LIMIT_WINDOW_MS,IP_LIMIT_MESSAGE} from './rules.mjs';
/** Limite por IP do servidor local: reservas criadas por conexão na última hora (em memória). */
const bookingsByIp=new Map();
export const resetBookingLimits=()=>bookingsByIp.clear();
const recentByIp=ip=>{const since=Date.now()-IP_LIMIT_WINDOW_MS,list=(bookingsByIp.get(ip)||[]).filter(t=>t>since);bookingsByIp.set(ip,list);return list;};
if(process.env.NODE_ENV==='production')throw Error('Backend mock não deve ser utilizado em produção.');
seed();
const HOST='127.0.0.1', PORT=Number(process.env.MOCK_PORT||3333);
const respond=(res,status,data)=>{res.writeHead(status,{'content-type':'application/json; charset=utf-8','cache-control':'no-store','x-content-type-options':'nosniff'});res.end(JSON.stringify(data));};
const fail=(res,status,msg)=>respond(res,status,{error:msg});
const allowed=new Set(['http://localhost:8080','http://127.0.0.1:8080','http://localhost:5173','http://127.0.0.1:5173']);
function loggedUser(req){
 const token=/^Bearer ([a-zA-Z0-9-]+)$/.exec(req.headers.authorization||'')?.[1];if(!token)return null;
 const u=db.prepare('SELECT u.id,u.email,u.role FROM local_sessions s JOIN local_users u ON s.user_id=u.id WHERE s.token_hash=? AND s.expires_at>?').get(digest(token),Date.now());return u||null;
}
function publicState(){const {version,...s}=state();return {...s,payments:[],bookings:s.bookings.map(({id,date,time,staffId,serviceId,serviceIds,status})=>({id,date,time,staffId,serviceId,serviceIds,status}))};}
export const server=http.createServer(async(req,res)=>{
 const origin=req.headers.origin;
 if(origin){if(!allowed.has(origin))return fail(res,403,'Origem não autorizada.');res.setHeader('Access-Control-Allow-Origin',origin);res.setHeader('Vary','Origin');res.setHeader('Access-Control-Allow-Headers','content-type,authorization');res.setHeader('Access-Control-Allow-Methods','GET,POST,PUT,OPTIONS');}
 if(req.method==='OPTIONS'){res.writeHead(204);return res.end();}
 const path=new URL(req.url,'http://localhost').pathname;
 try{
  let body={};
  if(['POST','PUT','PATCH'].includes(req.method)){
   if(req.headers['content-type']?.split(';')[0]!=='application/json')return fail(res,415,'Envie application/json.');
   // Corpo grande demais: responde 413 e continua lendo (descartando) até o fim. Sair do
   // for-await destruiria o socket e o cliente receberia ECONNRESET em vez do 413.
   let raw='',tooBig=false;for await(const chunk of req){if(tooBig)continue;raw+=chunk;if(raw.length>2_000_000){tooBig=true;raw='';res.setHeader('connection','close');fail(res,413,'Requisição muito grande.');}}
   if(tooBig)return;
   try{body=raw?JSON.parse(raw):{};}catch{return fail(res,400,'JSON inválido.');}
  }
  if(req.method==='GET'&&path==='/health')return respond(res,200,{ok:true,mode:'mock',database:'sqlite'});
  if(req.method==='GET'&&path==='/public')return respond(res,200,publicState());
  if(req.method==='GET'&&path==='/owner-exists')return respond(res,200,{exists:!!db.prepare('SELECT 1 FROM local_users WHERE role=?').get('owner')});
  if(req.method==='POST'&&path==='/login'){
   const email=String(body.email||'').trim().toLowerCase(),pw=String(body.password||'');
   const user=db.prepare('SELECT * FROM local_users WHERE email=?').get(email);
   if(!user||!checkPassword(pw,user.password_hash))return fail(res,401,'Credenciais inválidas.');
   const token=randomUUID();db.prepare('INSERT INTO local_sessions(token_hash,user_id,expires_at) VALUES(?,?,?)').run(digest(token),user.id,Date.now()+12*3600_000);
   return respond(res,200,{token,user:{email:user.email,role:user.role}});
  }
  if(req.method==='POST'&&path==='/logout'){
   const token=/^Bearer ([a-zA-Z0-9-]+)$/.exec(req.headers.authorization||'')?.[1];if(token)db.prepare('DELETE FROM local_sessions WHERE token_hash=?').run(digest(token));
   return respond(res,200,{ok:true});
  }
  if(req.method==='POST'&&path==='/forgot'){
   const user=db.prepare('SELECT id FROM local_users WHERE email=?').get(String(body.email||'').trim().toLowerCase());
   // No real email transport in local mock. Return code only when explicitly enabled in local environment.
   if(!process.env.MOCK_ALLOW_PASSWORD_RESET)return fail(res,501,'Recuperação por e-mail indisponível no modo local. Configure MOCK_ALLOW_PASSWORD_RESET=1 para obter um código de teste.');
   if(!user)return respond(res,200,{ok:true});
   const code=String(randomInt(100000,999999));db.prepare('DELETE FROM local_password_resets WHERE user_id=?').run(user.id);
   db.prepare('INSERT INTO local_password_resets(code_hash,user_id,expires_at) VALUES(?,?,?)').run(digest(code),user.id,Date.now()+15*60000);
   console.log(`[DEV ONLY] Código local de recuperação para ${body.email}: ${code}`);
   return respond(res,200,{ok:true,message:'Código gerado no terminal do backend. Não foi enviado e-mail.'});
  }
  if(req.method==='POST'&&path==='/reset'){
   if(!process.env.MOCK_ALLOW_PASSWORD_RESET)return fail(res,501,'Recuperação indisponível no modo local.');
   const email=String(body.email||'').trim().toLowerCase(),code=String(body.code||'');
   const user=db.prepare('SELECT id FROM local_users WHERE email=?').get(email);
   const reset=user&&db.prepare('SELECT code_hash FROM local_password_resets WHERE user_id=? AND code_hash=? AND expires_at>?').get(user.id,digest(code),Date.now());
   if(!reset)return fail(res,400,'Código inválido ou expirado.');
   if(String(body.password||'').length<6)return fail(res,400,'A senha deve ter pelo menos 6 caracteres.');
   db.prepare('UPDATE local_users SET password_hash=? WHERE id=?').run(hashPassword(body.password),user.id);
   db.prepare('DELETE FROM local_password_resets WHERE user_id=?').run(user.id);
   db.prepare('DELETE FROM local_sessions WHERE user_id=?').run(user.id);
   return respond(res,200,{ok:true});
  }
  if(req.method==='POST'&&path==='/bookings'){
   const ids=Array.isArray(body.serviceIds)?body.serviceIds.slice(0,6).map(String):undefined;
   const b={id:randomUUID(),date:String(body.date||''),time:String(body.time||''),customer:String(body.customer||'').trim(),phone:String(body.phone||'').replace(/\D/g,''),serviceId:String(ids?.[0]||body.serviceId||''),staffId:String(body.staffId||''),status:'confirmado',paid:false,paymentMethod:null};
   if(ids?.length)b.serviceIds=ids;
   if(b.customer.length<3||b.customer.length>100||b.phone.length<10||b.phone.length>15)return fail(res,400,'Nome ou telefone inválido.');
   const ip=req.socket.remoteAddress||'local';
   if(recentByIp(ip).length>=IP_BOOKING_LIMIT)return respond(res,403,{error:IP_LIMIT_MESSAGE,reason:'ip'});
   try{db.exec('BEGIN IMMEDIATE');const s=state();checkPhoneLimit(b.phone,s.bookings);checkSlot(b,s);addBooking(b);db.exec('COMMIT');recentByIp(ip).push(Date.now());return respond(res,201,{booking:b});}
   catch(e){db.exec('ROLLBACK');if(e instanceof LimitError)return respond(res,403,{error:e.message,reason:e.reason});if(e instanceof RuleError)return fail(res,409,e.message);throw e;}
  }
  if(path.startsWith('/admin/')){
   const user=loggedUser(req);if(!user||user.role!=='owner')return fail(res,401,'Acesso restrito ao proprietário.');
   if(req.method==='GET'&&path==='/admin/state')return respond(res,200,state());
   if(req.method==='PUT'&&path==='/admin/state'){
    if(body.version!==undefined&&typeof body.version!=='string')return fail(res,400,'Versão inválida.');
    let plan;try{validateState(body);plan=prepareAdminSave(state(),body);}catch(e){if(e instanceof RuleError)return fail(res,400,e.message);throw e;}
    // Sem `version` (cliente antigo) grava como antes; com ela, recusa estado desatualizado (409).
    try{return respond(res,200,{ok:true,version:saveState(body,plan.deletions,body.version)});}
    catch(e){if(e instanceof ConflictError)return fail(res,409,CONFLICT);throw e;}
   }
  }
  return fail(res,404,'Rota não encontrada.');
 }catch(e){console.error(e);return fail(res,500,'Erro interno do servidor local.');}
});
if(import.meta.url===`file://${process.argv[1]?.replaceAll('\\','/')}`||process.argv[1]?.endsWith('/src/server.mjs')||process.argv[1]?.endsWith('\\src\\server.mjs'))server.listen(PORT,HOST,()=>console.log(`BarberFlow SQLite API: http://${HOST}:${PORT}`));
