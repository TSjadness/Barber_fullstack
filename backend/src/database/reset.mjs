import { rmSync } from 'node:fs';
import { resolve,dirname } from 'node:path';
import {fileURLToPath} from 'node:url';
const file=process.env.BARBER_DB_PATH||resolve(dirname(fileURLToPath(import.meta.url)),'../../data/barberflow.sqlite');
if(process.argv[2]!=='--confirm'){console.error('Este comando APAGA os dados locais. Execute: npm run db:reset -- --confirm');process.exit(1);}
for(const suffix of ['','-wal','-shm'])rmSync(file+suffix,{force:true});
console.log('Banco local removido. Execute npm run db:seed.');
