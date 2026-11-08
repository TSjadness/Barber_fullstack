# BarberFlow — ambiente local SQLite + Supabase original

Projeto organizado em **frontend/** (React, TypeScript, Styled Components, `src/mock/db.json`) e **backend/** (servidor REST local, SQLite, migrations, seeds, testes). No modo mock, o frontend **não depende de uma service role key do Supabase**.

## Pré-requisito

**Node.js 22.16.0 ou superior da linha 22** (ou uma versão posterior que suporte `node:sqlite`). Verifique com `node -v`. O módulo SQLite nativo ainda pode exibir um aviso experimental; isso não significa erro.

## Executar no Windows / VS Code

Terminal 1 — a partir da pasta principal:

```cmd
cd backend
npm run db:migrate
npm run db:seed
npm run dev
```

Terminal 2 — abra outro terminal **na pasta principal**:

```cmd
cd frontend
npm install
npm run dev
```

- Frontend: **http://localhost:8080** (confirme a URL indicada pelo Vite).
- Backend: **http://127.0.0.1:3333/health**.
- Painel: **http://localhost:8080/login**.
- Credenciais de demonstração (somente local): **admin@rafaeluzeda.com** / **Barbearia@2026**. Troque `MOCK_USER` e `MOCK_PASSWORD` antes do primeiro `db:seed` para personalizar; não use essas credenciais publicamente.

O backend cria o banco automaticamente caso esteja vazio e não sobrescreve registros durante novos seeds. Os agendamentos e mudanças do painel persistem em `backend/data/barberflow.sqlite` mesmo após reiniciar os servidores.

## Escolher a fonte de dados

Em `frontend/.env` (reinicie o Vite após modificar):

```env
VITE_API_MODE=mock
VITE_API_URL=http://localhost:3333
```

`mock`: chamadas feitas pelo `BarberApp` usam o servidor SQLite local (recomendado para testar). `supabase`: mantém o caminho original com funções TanStack Start e Supabase; as operações com `supabaseAdmin` precisam de uma chave de servidor válida no ambiente do servidor. **Não insira `SUPABASE_SERVICE_ROLE_KEY` com prefixo `VITE_`.**

## Banco e migrations

- `backend/src/database/migrations/0001_initial.sql`: tabelas SQLite `app_state`, `bookings`, `local_users`, `local_sessions`, `local_password_resets`; `schema_migrations` controla versões.
- `frontend/src/mock/db.json`: seed **derivado da migration original**, não um backup dos registros reais do Supabase.
- `npm run db:migrate`: aplica migrations ainda não executadas.
- `npm run db:seed`: cria dados iniciais e proprietário local se estiverem ausentes, **sem apagar alterações existentes**.
- `npm run db:status`: lista as migrations e quantos agendamentos estão armazenados.
- `npm run db:reset -- --confirm`: **APAGA o banco SQLite local**. Depois execute `npm run db:seed` para recriá-lo.
- `npm test`: testa formato do seed, autenticação, privacidade dos dados públicos e persistência após reinicialização.

## Endpoints do servidor local

`GET /health`, `GET /public`, `GET /owner-exists`, `POST /bookings`, `POST /login`, `POST /logout`, `GET /admin/state` (login), `PUT /admin/state` (login), `POST /forgot`, `POST /reset`.

A senha de acesso local é protegida por `scrypt`; sessões usam tokens gerados aleatoriamente e armazenados no SQLite por hash. Rotas de gestão exigem token. O endpoint público remove informações privadas de clientes dos agendamentos e lista de pagamentos.

**Recuperação de senha:** não há disparo real de e-mail em modo local. Opcionalmente, iniciar o servidor com `MOCK_ALLOW_PASSWORD_RESET=1` habilita um fluxo de código de teste mostrado **apenas no terminal backend**. Esse recurso é estritamente de desenvolvimento.

## Escopo e limitações

- Preservados os arquivos de integração Supabase, layout e lógica das telas atuais.
- `frontend/public/barber/app.js` **ainda usa JavaScript imperativo** para renderizar telas: a conversão completa para componentes React não fazia parte desta implementação de banco local.
- `app_state` mantém arrays `services`, `staff`, `notices`, `payments` em colunas JSON, **conforme o schema original do Supabase**; `bookings` é uma tabela independente.
- Sem sincronização automática entre Supabase e banco local. Sem cópia dos usuários e registros reais da Lovable; apenas a estrutura e o seed disponível no repositório.
- Servidor local vinculado a `127.0.0.1`, não destinado à produção ou rede pública. Autenticação local não substitui Supabase Auth em produção.
