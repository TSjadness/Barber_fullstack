// Compatibility entry point for previous scripts.
import {server} from './server.mjs';
const port=Number(process.env.MOCK_PORT||3333);
server.listen(port,'127.0.0.1',()=>console.log(`BarberFlow SQLite API: http://127.0.0.1:${port}`));
