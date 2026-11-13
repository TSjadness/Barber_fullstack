# Frontend

React 19 + TypeScript + TanStack Start (Vite) + styled-components.

```bash
npm install
npm run dev      # http://localhost:8080
npm run test     # vitest
npm run lint
npm run build
```

Para usar o backend local (SQLite) em vez do Supabase, defina `VITE_API_MODE=mock` e
`VITE_API_URL=http://localhost:3333` (veja `env.local.example` e `backend/README.md`).

## Estrutura

```text
src/
├── App.tsx            # providers + troca de tela (site, agendamento, gestão)
├── routes/            # rotas do TanStack Start (/ e /login) — entrada da aplicação
├── pages/             # telas: Public, Booking, Login e Admin (uma pasta por seção)
├── components/        # componentes reutilizáveis (index.tsx, styles.ts, types.ts)
├── contexts/          # estado compartilhado (dados, navegação, overlay, preferências, gestão)
├── hooks/             # hooks de acesso aos contextos e comportamentos (menu mobile, tela cheia...)
├── services/          # API: modo mock (backend local) e Supabase; serviços por domínio
├── scripts/           # rotinas independentes: agenda/disponibilidade, notificações, CSV, foto
├── utils/             # funções puras (datas, formatação, paginação, redes sociais)
├── constants/         # textos fixos, menus, chaves de armazenamento
├── types/             # contratos de dados (AppState, Booking, Staff...)
├── styles/            # tokens do tema, keyframes, base global e a composição dos estilos
└── lib/, integrations/ # server functions e cliente Supabase
```

### Estilos

Os estilos do antigo `public/barber/app.css` foram distribuídos para o `styles.ts` de cada
componente/página, mantendo os nomes de classe originais. `src/styles/index.ts` junta todos
em um `createGlobalStyle` **em ordem de cascata**: ao mover regras entre módulos, mantenha as
sobrescritas de mesma especificidade depois das regras que elas sobrescrevem. A base
(`styles/theme.ts`, `animations.ts`, `global.ts`) é inserida no `<head>` pelas rotas para valer
antes da hidratação.

### Arquivos estáticos

`public/assets/images/` guarda o logo. As fotos dos profissionais ficam em
`public/barber/assets/` porque os dados salvos (seed e Supabase) apontam para esse caminho.

O mock (`src/mock/db.json`) é uma cópia dos dados iniciais da migration, não dos dados reais do
Supabase. As migrations ficam em `../backend/drizzle`.
