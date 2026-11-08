# BarberFlow backend SQLite

Node.js >=22.16, sem bibliotecas adicionais obrigatórias. A API usa `node:sqlite` nativo e migrations SQL no diretório `src/database/migrations/`.

```cmd
npm run db:migrate
npm run db:seed
npm run dev
```

Acesse http://127.0.0.1:3333/health e http://127.0.0.1:3333/public.

Credenciais locais padrão: admin@rafaeluzeda.com / Barbearia@2026 (configuráveis antes do seed com `MOCK_USER` e `MOCK_PASSWORD`).

Consulte o README da raiz para as rotas, teste, reset e avisos de segurança.
