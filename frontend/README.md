# Frontend

React 19 + TypeScript + TanStack Start + Styled Components (estrutura preservada do projeto enviado).

```bash
npm install
npm run dev
npm run test
```

Os componentes de `src/barber/components` e `src/components/ui` seguem a pasta por componente; os `styles.ts` são Styled Components, com tipagens em `types.ts` onde aplicável. `src/components/BarberApp` contém shell React com Styled Components.

**Limitação importante:** o arquivo `public/barber/app.js` permanece como renderizador imperativo da maior parte das telas, com `app.css` e `icons.js`, para não alterar o layout ou quebrar recursos; a migração integral dessas telas para JSX e Styled Components **ainda não foi realizada**. Não apague esses arquivos.

O mock é uma cópia dos dados iniciais da migration, não dos dados reais do Supabase. A integração com Supabase mantém as configurações e funções originais. As migrations foram movidas para `../backend/drizzle`.
