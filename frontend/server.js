'use strict';
const http=require('node:http');const fs=require('node:fs');const path=require('node:path');const base=__dirname;
const env=Object.fromEntries((fs.existsSync(path.join(base,'.env'))?fs.readFileSync(path.join(base,'.env'),'utf8'):'').split(/\r?\n/).map(x=>x.match(/^(VITE_[A-Z_]+)=(.*)$/)).filter(Boolean).map(m=>[m[1],m[2]]));
const port=Number(process.env.PORT||5173);
http.createServer((req,res)=>{let uri=new URL(req.url,'http://localhost').pathname;if(uri==='/config.js'){res.writeHead(200,{'content-type':'application/javascript; charset=utf-8'});return res.end('window.__ENV__='+JSON.stringify(env)+';')}if(uri!=='/'&&uri!=='/index.html'){res.writeHead(404);return res.end('Não encontrado')}res.writeHead(200,{'content-type':'text/html; charset=utf-8','cache-control':'no-store'});fs.createReadStream(path.join(base,'index.html')).pipe(res)}).listen(port,()=>console.log(`Site em http://localhost:${port}`));
