import {migrate,seed,db,state} from './db.mjs';
const action=process.argv[2];
if(action==='migrate'){migrate(); console.log('Migrations aplicadas.');}
else if(action==='seed'){seed();console.log('Seed aplicado (sem apagar dados existentes).');}
else if(action==='status'){migrate();console.log(db.prepare('SELECT name,applied_at FROM schema_migrations').all());console.log('Agendamentos:',db.prepare('SELECT count(*) AS count FROM bookings').get().count);}
else {console.error('Use migrate, seed ou status');process.exitCode=1;}
db.close();
