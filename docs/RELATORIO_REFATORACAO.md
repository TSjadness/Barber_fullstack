# Relatório técnico — Refatoração do frontend para React + TypeScript

Executa as instruções de `docs/prompt.md`. Escopo: `frontend/`. O backend (`backend/`) não foi alterado.
Nada foi commitado.

## Resumo

| Item | Antes | Depois |
| --- | --- | --- |
| Interface | `public/barber/app.js` (1.937 linhas, JS imperativo com template strings, ~30 funções no `window`) + shell `BarberApp` | React + TypeScript: 11 páginas/seções, 25 componentes, 5 contextos, 10 hooks |
| Estilos | `public/barber/app.css` (6.838 linhas, 1.187 regras) | 42 arquivos `styles.ts` (styled-components) + base em `src/styles/` |
| Ícones | `public/barber/icons.js` (SVG em strings no `window`) | `<Icon>` sobre `lucide-react` (já instalado), SVG idêntico byte a byte |
| JS legado | `app.js`, `api.js`, `config.js`, `icons.js`, `index.legacy.html` | removidos |
| Validação visual | — | 157 cenários comparados elemento a elemento: estilos computados e caixas idênticos |
| Testes | 9 | 32 (+23) |

## A. Estrutura final

```text
frontend/
├── public/
│   ├── assets/images/logo_rafael_uzeda.png
│   ├── barber/assets/            # fotos dos barbeiros (caminho gravado nos dados)
│   ├── favicon.png
│   └── robots.txt
└── src/
    ├── App.tsx                   # providers + troca de tela
    ├── routes/                   # TanStack Start (ponto de entrada)
    │   ├── __root.tsx
    │   ├── _barber.tsx           # layout que monta o App uma única vez
    │   ├── _barber/index.tsx     # /
    │   ├── _barber/login.tsx     # /login
    │   └── -shared/head.ts       # fontes + CSS-base no <head>
    ├── pages/                    # Public, Booking, Login, Admin/{Overview, Agenda, Calendar,
    │                             #   Bookings, Clients, Finance, Services, Staff, Hours,
    │                             #   Notices, Settings}
    ├── components/               # Avatar, Button, Card, Chip, DataTable, EmptyState, FilterBar,
    │                             #   Footer, Form, Header, Icon, LoadingOverlay, ManageRow, Modal,
    │                             #   MonthCalendar, NoticeBox, PageHead, Pagination, PhotoZoom,
    │                             #   ServiceCard, Sidebar, StatusBadge, SummaryBox, Switch,
    │                             #   TeamCard, TimeSlots (+ ui/ do shadcn, inalterado)
    ├── contexts/                 # admin, data, navigation, overlay, preferences
    ├── hooks/                    # useBarberData, useNavigation, useOverlay, usePreferences,
    │                             #   useAdminState, useMobileMenu, useFullscreenCalendar,
    │                             #   useDebouncedCallback, useDocumentSync
    ├── services/                 # api/{errors, retry, mockClient, supabaseClient, types, index},
    │                             #   stateService, authService, bookingService
    ├── scripts/                  # scheduling, notifications, financeSpreadsheet, staffPhoto
    ├── utils/                    # date, format, pagination, social, serviceIcon, bookingTone,
    │                             #   classNames, storage
    ├── constants/barber.ts
    ├── types/                    # barber.ts (contratos de dados), app.ts, css.d.ts
    ├── styles/                   # theme, animations, global, lightTheme, index (composição)
    ├── lib/, integrations/       # server functions e Supabase (inalterados)
    └── test/
```

A árvore completa (261 entradas) pode ser vista com `find src -type f`.

**Sobre `App.tsx` e `main.tsx`.** O projeto usa TanStack Start, cujo ponto de entrada é do próprio
framework (`router.tsx`, `start.ts`, `server.ts` e as rotas). Criar um `main.tsx` faria dois
pontos de entrada concorrentes, o que o `prompt.md` proíbe. Por isso não existe `main.tsx`: o
papel dele fica com a rota de layout `_barber.tsx`, e `App.tsx` faz a composição
(providers, `GlobalStyle`, cabeçalho, troca de tela, overlay e toasts). O `index.html` é gerado
pelo framework (SSR); nenhum foi criado.

## B. Componentes

- **Extraídos dos templates do `app.js`:** Header, Footer, Sidebar, PageHead, Modal,
  LoadingOverlay (+ ConfirmLayer), PhotoZoom, Pagination, MonthCalendar, TimeSlots, ServiceCard,
  TeamCard, Avatar, StatusBadge, NoticeBox, SummaryBox, Switch, DataTable, FilterBar, ManageRow,
  Card, Chip, EmptyState, Form (Form, FormStack, FormRow, ToggleField), Button e Icon.
- **Específicos de página (junto à página):**
  - Booking: os quatro passos + BookingConfirmed.
  - Login: LoginForm, ForgotForm, ResetForm.
  - Admin: BookingDetails, EditBookingForm, ManualBookingForm, DayCell, DayPanel, DayRow,
    ServiceForm, NoticeForm, ImportFinance, StaffEditor, ConfirmRemoveStaff, BookingsTable.
- **Marcação preservada:** cada componente gera exatamente as mesmas tags, classes e atributos
  do template original. A captura confirmou o mesmo DOM (caminhos, tags e classes) nos 157
  cenários.

## C. Migração do CSS (`public/barber/app.css`)

O arquivo tinha camadas de sobrescrita acumuladas: o mesmo seletor era redefinido em vários
pontos e a ordem decidia o resultado. A migração foi feita assim:

1. **Separação por dono.** Cada uma das 1.187 regras foi dividida por seletor e atribuída ao
   componente ou página dono da classe mais específica (por exemplo `.premium-agenda .btn` vai
   para a Agenda, e `body.theme-light .card` vai para Card). As regras de cada módulo mantêm a
   ordem original, com as `@media` agrupadas.
2. **Nomes de classe mantidos.** O JSX usa as mesmas classes, o que preserva a especificidade.
   Escopar com classes geradas pelo styled-components mudaria a especificidade e quebraria as
   sobrescritas do tema claro e das media queries.
3. **Ordem da cascata validada.** `src/styles/index.ts` compõe os módulos num único
   `createGlobalStyle`, em ordem fixa. Uma análise automática procurou todo par de regras que
   (a) mudou de ordem, (b) tem a mesma especificidade, (c) define a mesma propriedade,
   (d) pode valer na mesma media query e (e) casa com o mesmo elemento real nos DOMs
   capturados. Na ordem final não sobrou nenhum par desses (o único sinalizado é um falso
   positivo, porque o próprio módulo redefine o mesmo valor depois).
4. **Global somente o necessário:**
   - `styles/theme.ts`: tokens (`:root` e `body.theme-light`).
   - `styles/animations.ts`: keyframes.
   - `styles/global.ts`: reset, `body`, `html`, títulos, campos, utilitários de texto
     (`.muted`, `.eyebrow`, `.price`, `.wrap`), `#app` e o indicador de carregamento.

   Esses três vão para o `<head>` já no HTML do servidor, para valer antes da hidratação (fundo
   escuro e indicador de carregamento sem "piscar"). `styles/lightTheme.ts` reúne as regras do
   tema claro que se aplicam a elementos genéricos (`h1`, `strong`, `small`, campos) e precisam
   vir por último.
5. **`@import` da fonte Manrope** saiu do CSS e virou `<link>` no `<head>` (`routes/-shared/head.ts`).

| Módulo | Regras |
| --- | --- |
| src/styles/theme | 7 |
| src/styles/animations | 7 |
| src/styles/global | 35 |
| components/Header | 38 |
| components/Button | 45 |
| pages/Public | 50 |
| components/ServiceCard | 45 |
| components/Card / Chip / EmptyState | 8 / 7 / 1 |
| components/TeamCard | 18 |
| components/Avatar / Footer | 3 / 19 |
| pages/Admin (layout) | 18 |
| components/Sidebar | 86 |
| components/PageHead | 16 |
| pages/Admin/Finance | 24 |
| components/DataTable / StatusBadge | 9 / 10 |
| pages/Admin/Agenda | 95 |
| components/MonthCalendar | 51 |
| pages/Booking | 50 |
| components/NoticeBox / Form / ManageRow | 4 / 8 / 5 |
| pages/Admin/Notices | 7 |
| components/TimeSlots / SummaryBox / Modal | 25 / 4 / 10 |
| pages/Admin/Hours | 131 |
| components/LoadingOverlay / Switch | 8 / 9 |
| pages/Admin/Overview | 75 |
| components/Icon / PhotoZoom | 11 / 6 |
| pages/Admin/Staff/StaffEditor | 90 |
| components/FilterBar | 12 |
| pages/Login | 7 |
| pages/Admin/Calendar | 96 |
| pages/Admin/Settings | 12 |
| pages/Admin/Staff / ConfirmRemoveStaff | 71 / 25 |
| pages/Admin/Services / Clients | 11 / 2 |
| components/Pagination | 23 |
| src/styles/lightTheme | 4 |

Regras removidas por não terem efeito (verificado):

- `.team-card { background }` (linha 1000): todo `.team-card` também tem `.card`, e o fundo de
  `.card` (linha 1759, mesma especificidade, posterior) sempre vencia.
- `.toast` (linha 750): pertencia ao aviso de fallback `#toastbox`, que nunca era usado porque o
  shell React sempre ativava o react-toastify.
- Regras vazias, como `.public-hero .eyebrow {}`.

## D. Migração do JavaScript (`public/barber/app.js`)

| Responsabilidade no `app.js` | Destino |
| --- | --- |
| `render()` + morph de DOM + `bf-enter`/`bf-page-enter` | React (reconciliação). As animações de entrada se repetem com `key` por tela, por passo do agendamento e por seção da gestão |
| Variáveis globais (`db`, `token`, `view`, `section`, `flow`, `step`, filtros, páginas...) | `contexts/` (data, navigation, admin, preferences, overlay) |
| `request`, `save` (fila de gravação), `refreshState`, sessão expirada, login/logout | `contexts/data/Provider.tsx` + `services/` |
| Ponte `window.__barberApi` (mock/Supabase, retry, timeout, mensagens) | `services/api/*` |
| Regras de horário (`openSlots`, `dayAvailability`, `possibleTimes`, `staffHours`, `updateWeek`, `applyBaseWeek`, validação da edição) | `scripts/scheduling.ts` |
| `toast` | `scripts/notifications.ts` |
| CSV (`exportFinance`, `previewFinanceImport`) | `scripts/financeSpreadsheet.ts` |
| `pickStaffPhoto` (redimensionamento) | `scripts/staffPhoto.ts` |
| Máscaras, telefones, datas, paginação, redes sociais | `utils/` |
| Menu mobile (trava de rolagem), tela cheia do calendário, debounce, título/URL/tema do documento | `hooks/` |
| `modal()`, `busy()`, `closeModal()`, foto ampliada | `useOverlay()` + Modal/LoadingOverlay/PhotoZoom |
| `$("#campo").value` lido no envio | estado controlado em cada formulário |
| `onclick="..."` + funções expostas com `eval` no `window` | handlers React tipados (nada mais é exposto no `window`) |

## E. Scripts (`src/scripts/`)

Todos têm o cabeçalho "Funcionalidade / Responsabilidade / Origem".

- `scheduling.ts`: expediente, bloqueios, horários livres a cada 10 min, disponibilidade do
  dia, horários por período, validação da edição, capacidade da agenda, ajustes semanais.
- `notifications.ts`: texto amigável para erros técnicos, classificação erro/informação e
  supressão de avisos informativos no mobile.
- `financeSpreadsheet.ts`: geração e download do CSV (BOM UTF-8, `;`, vírgula decimal) e
  análise do arquivo importado.
- `staffPhoto.ts`: leitura da imagem, redução para 480px e conversão para JPEG em data URL.

## F. TypeScript

- Contratos de dados em `types/barber.ts` (`AppState`, `Shop`, `Service`, `Staff`,
  `DaySchedule`, `Booking`, `Notice`, `BookingFlow`...), com os mesmos nomes de propriedades
  gravados no banco.
- A resposta da API chega como `unknown` e é validada (`parseAppState`, `login`,
  `createPublicBooking`).
- O `tsconfig` estrito existente foi mantido (`strict`, `exactOptionalPropertyTypes`,
  `noUncheckedIndexedAccess`, `noPropertyAccessFromIndexSignature`). O código novo não usa
  `any`, `@ts-ignore` nem `@ts-nocheck`.
- Variáveis CSS no `style` são tipadas por ampliação de módulo (`types/css.d.ts`), sem
  conversões forçadas.
- `tsc --noEmit`: sem erros.

## G. Arquivos removidos

| Arquivo | Motivo |
| --- | --- |
| `public/barber/app.js`, `app.css`, `icons.js` | substituídos por `src/` (validados) |
| `src/components/BarberApp/` | shell que injetava o `app.js`; substituído por `App.tsx` + `services/api` |
| `src/routes/index.tsx`, `login.tsx` | substituídos por `_barber.tsx` + `_barber/index.tsx` + `_barber/login.tsx` |
| `frontend/app.js`, `app.css`, `api.js`, `config.js`, `icons.js`, `index.legacy.html`, `assets/` | cópia antiga (versão sem React) que nada referenciava |
| `public/barber/assets/logo_rafael_uzeda.png` | movido para `public/assets/images/` |

## H. Compatibilidade

- **Contratos e rotas lógicas da API** (`/public`, `/admin/state`, `/bookings`, `/login`,
  `/logout`, `/forgot`, `/reset`) e o formato JSON dos dados: inalterados. O backend não foi
  tocado.
- **Variáveis de ambiente** (`VITE_API_MODE`, `VITE_API_URL`, `VITE_SUPABASE_*`) e
  **chaves do localStorage** (`barberTheme`, `barberSide`, `barberflow_mock_token`): as mesmas.
- **URLs:** `/` e `/login`, inclusive o link de recuperação do Supabase (`#type=recovery`) e a
  troca de endereço sem recarregar a página.
- **Fotos dos barbeiros** seguem em `/barber/assets/...`, porque os dados salvos guardam esse
  caminho.
- **Regras de negócio** transcritas sem alteração. Isso inclui um comportamento original
  preservado de propósito: em três pontos (disponibilidade do dia, ocupação da agenda e
  validação da edição) o sistema considerava apenas bloqueios da barbearia inteira, e não os de
  um profissional específico. Ver pendências.
- **Rota de layout:** trocar entre site e gestão altera o endereço com `history.replaceState`,
  e o TanStack Router reage a isso. Com um `App` por rota, a aplicação seria desmontada (o
  código antigo contornava isso com `window.__barberRemount`). A rota de layout `_barber`
  mantém um único `App` montado.

### Correções de comportamento (necessidade técnica comprovada)

1. **Salvar serviço no desktop quebrava.** `saveService` lia `#fStatus`, campo que não existe
   no formulário de serviço (TypeError ao salvar em telas ≥ 761px). Agora o serviço usa a caixa
   "Serviço ativo", único controle do formulário.
2. **Status do profissional no desktop era ignorado.** O select "Status do profissional"
   aparecia no desktop, mas `saveStaff` lia apenas a caixa escondida. Agora os dois controles
   refletem o mesmo valor.
3. **`aria-expanded` do botão do menu mobile.** Voltava a "false" a cada redesenho; agora
   acompanha o estado real. Mudança só de acessibilidade, sem efeito visual.

## I. Testes e validações executados

| Verificação | Resultado |
| --- | --- |
| `tsc --noEmit` | sem erros |
| `npm run test` (vitest) | 4 arquivos, 32 testes, todos passando (9 existentes + 23 novos em `src/test/scheduling.test.ts` e `src/test/utils.test.ts`) |
| `npm run lint` | 18 problemas, todos em arquivos que já existiam: 12 `any` em `src/lib/` e 6 avisos em `src/components/ui/`. Antes eram 20 (13 erros e 7 avisos) |
| `prettier --check src` | ok |
| `npm run build` | concluído (cliente, SSR e Nitro); `.output/public` sem arquivos legados |
| Backend `npm test` | não executado de novo (backend não alterado; passava no início) |
| Validação visual | 157 cenários (desktop 1366, tablet 900, mobile 390; temas escuro e claro; site, 4 passos do agendamento, login, as 11 seções, 9 modais, filtros, paginação, calendário maximizado, menu recolhido e mobile). Para cada elemento foram comparados todos os estilos computados, os pseudo-elementos `::before`/`::after` e a caixa (x, y, largura, altura), contra a captura do app original com data e hora fixadas |
| Resultado visual | ver `RESULTADO_VISUAL` abaixo |
| Testes funcionais no navegador | 18 de 18 (ver lista abaixo); nenhum erro de console |

**Resultado visual (estado final, depois da limpeza):**

| Tamanho | Cenários | Idênticos | Diferenças restantes |
| --- | --- | --- | --- |
| Desktop 1366px | 56 | 54 | 2 só no atributo `value=""` de campos controlados |
| Tablet 900px | 45 | 43 | idem |
| Mobile 390px | 56 | 54 | idem |
| **Total** | **157** | **151** | estilos computados, pseudo-elementos e caixas: **0 diferenças** |

Os 6 cenários restantes (passo 4 do agendamento e agendamento manual) diferem apenas porque o
React escreve `value=""` nos `<input>` controlados. Não há mudança visual. Durante a validação
foram corrigidas diferenças subpixel (≤ 0,06px) em textos que o JSX dividia em vários nós
(ex.: "09:00–18:00"); hoje esses textos são strings únicas, como no template original.

Testes funcionais (Chrome headless contra o backend local com cópia do banco):

1. Agendamento público completo, com gravação confirmada no banco.
2. Validação de nome e sobrenome.
3. Login pelo formulário e logout.
4. Senha errada.
5. Editar serviço no desktop.
6. Desativar profissional pelo select.
7. Remover profissional com confirmação.
8. Criar e excluir aviso.
9. Concluir atendimento marca o pagamento.
10. Agendamento manual pela agenda e recusa de horário fora do expediente.
11. Fechar um dia e recusar horário personalizado inválido.
12. Configurações refletidas no site.
13. Tema claro e menu recolhido persistidos (e o tema não vaza para o site).
14. Menu mobile trava a rolagem e fecha com Esc e ao trocar de seção.
15. Calendário maximizado libera a trava ao sair da seção.
16. Filtros e paginação.
17. "Esqueci a senha" no modo local.
18. Sessão expirada volta ao site com aviso.

**Não validado:** o modo Supabase (exigiria credenciais do projeto real; o código é o mesmo
da ponte antiga, só reorganizado em módulos), estados `:hover`/`:focus` em captura (cobertos
apenas pela análise estática da cascata) e navegadores além do Chrome.

## J. Pendências e observações

1. **[Resolvido nos ajustes complementares, ver seção K]** **Bloqueio por profissional ignorado em três pontos** (comportamento original preservado):
   disponibilidade do dia no calendário do cliente, ocupação estimada da agenda e validação da
   edição de agendamento. O cálculo de horários livres respeita o bloqueio, então o cliente não
   consegue reservar. Já a edição pela gestão pode mover um agendamento para um dia bloqueado
   daquele profissional. No código está explícito como `isShopBlocked` em
   `scripts/scheduling.ts`. Corrigir muda uma regra de negócio, então fica para sua decisão.
2. **Credenciais de demonstração preenchidas no login** (`admin@rafaeluzeda.com` /
   `Barbearia@2026`), como no original. Em produção vale removê-las.
3. **Aviso de hidratação no tema claro:** o script `THEME_BOOT` de `__root.tsx` adiciona
   `theme-light` ao `<body>` antes da hidratação, de propósito, para evitar o "piscar". O React
   avisa no console. Já acontecia antes.
4. **Lint:** os `any` de `src/lib/barber.functions.ts` e `barber-rules.ts` são código de
   servidor (tipos do Supabase e serialização das server functions). Não foram alterados para
   não mexer no contrato do backend.
5. **Regras duplicadas** em `src/lib/barber-rules.ts` (servidor), `backend/src/rules.mjs` e
   `src/scripts/scheduling.ts` (interface). Precisam continuar em sincronia.
6. **Atributo `value` nos campos:** o React grava `value=""` nos campos controlados. É a única
   diferença de DOM encontrada e não tem efeito visual.
7. **Backend legado não usado** (`backend/server.js`, `src/store.js`, `src/rules.js`) não foi
   removido, por estar fora do escopo do frontend.
8. **Ao adicionar estilos:** inclua o módulo novo em `src/styles/index.ts` respeitando a ordem
   da cascata (descrito no próprio arquivo, no `CLAUDE.md` e no `frontend/README.md`).

---

## K. Ajustes complementares — Bloqueios, ícones e responsividade

Etapa posterior à aprovação da refatoração. A arquitetura, os estilos, o Supabase e as
credenciais de demonstração não foram reestruturados. Nada foi commitado nem enviado.

### K.1 Arquivos modificados

| Arquivo | Alteração |
| --- | --- |
| `frontend/src/scripts/scheduling.ts` | Bloqueio individual na disponibilidade do dia, na ocupação e na edição; duração real na edição; nova `validateManualBooking`; `isShopBlocked` removido |
| `frontend/src/lib/barber-rules.ts` | `checkSlot` passou a usar a função interna `checkWorkingSlot`; nova `validateBookingChanges` |
| `frontend/src/lib/barber.functions.ts` | `saveAdminState` (Supabase) chama `validateBookingChanges` antes de gravar |
| `backend/src/rules.mjs`, `backend/src/server.mjs` | Mesma validação no `PUT /admin/state` do backend local |
| `frontend/src/pages/Admin/useBookingModals.tsx` | Agendamento manual usa `validateManualBooking`; erros com `notifyError` |
| `frontend/src/pages/Admin/components/EditBookingForm.tsx` | Trocar o serviço atualiza `serviceIds` |
| `frontend/src/scripts/notifications.ts` | Nova `notifyError` |
| Formulários que exibem erros de validação: `contexts/data/Provider.tsx`, `pages/Booking/useConfirmBooking.tsx`, `pages/Login/components/{ForgotForm,ResetForm}.tsx`, `pages/Admin/{Hours,Notices,Services,Staff}/index.tsx`, `Staff/StaffEditor`, `Staff/useStaffEditor.tsx`, `Finance/components/ImportFinance.tsx` | Erros de validação passam a usar `notifyError` |
| `frontend/src/pages/Admin/{Bookings,Notices,Services,Staff}/index.tsx` | "+" de texto trocado pelo ícone `plus` |
| `frontend/src/pages/Admin/Agenda/index.tsx` | `aria-label` nos botões de dia anterior/próximo |
| Testes: `frontend/src/test/scheduling.test.ts`, `frontend/src/test/barber-rules.test.ts`, `backend/tests/blocks.test.mjs` (novo) | Cobertura de bloqueios |

### K.2 Regras de bloqueio: antes e depois

As três implementações de regras têm papéis diferentes:

- `scripts/scheduling.ts` (interface): mostra datas e horários e valida antes de enviar.
- `lib/barber-rules.ts` (server functions do Supabase) e `backend/src/rules.mjs` (backend
  local): **são as que efetivamente gravam**.

A correção foi aplicada nas três camadas, respeitando o papel de cada uma.

| Situação | Antes | Depois |
| --- | --- | --- |
| Calendário do cliente, profissional com bloqueio individual | Dia aparecia "Lotado" (os horários já eram filtrados) | Dia aparece "Fechado"; com "sem preferência", os outros profissionais continuam disponíveis |
| Ocupação estimada da Agenda | Contava o profissional bloqueado como capacidade | Profissional bloqueado (bloqueio geral ou individual) não entra na capacidade |
| Edição/reagendamento pela gestão | Permitia mover para um dia bloqueado do profissional | Recusado com "O profissional está bloqueado nesta data."; o formulário continua aberto com os dados digitados |
| Duração validada na edição | Só a do serviço principal | Soma de todos os serviços do agendamento (a mesma regra do servidor) |
| Trocar o serviço de um agendamento com vários serviços | A troca não tinha efeito (`serviceIds` antigo prevalecia) | O serviço escolhido substitui a lista |
| Agendamento manual em dia bloqueado | Recusado com mensagem genérica de horário | Recusado com a mensagem específica de bloqueio |
| `PUT /admin/state` (gravação da gestão) por chamada direta à API | Só validava a estrutura: aceitava agendamento em dia bloqueado, fora do expediente ou em conflito | `validateBookingChanges` confere expediente, bloqueios gerais e individuais, limites do horário e conflitos (ignorando o próprio agendamento) |
| Reserva pública (`POST /bookings` / `createBooking`) | Já respeitava os bloqueios individuais | Sem mudança de comportamento (refatorada para compartilhar a mesma verificação) |

**Regras mantidas de propósito:**

- A gravação valida só agendamentos **novos ou remarcados** (data, horário, profissional ou
  serviços alterados). Um bloqueio criado depois não invalida reservas existentes, como a tela
  de avisos já informava ("Bloqueios não cancelam automaticamente agendamentos já
  existentes"). Mudar só o status ou o pagamento continua permitido.
- A gestão pode lançar horários fora da grade de 10 minutos e horários já passados do dia, como
  antes; só a reserva pública exige isso.
- Nenhuma permissão de exceção foi criada.

**Bloqueios parciais (intervalo de horário):** não são suportados pelo sistema. Um aviso
`block` vale para o dia inteiro, e o modelo de dados não tem horário de início e fim. Nada
foi acrescentado, para não criar regra nova.

### K.3 Testes adicionados e resultados (executados)

**Interface** (`scheduling.test.ts`, +9 testes):
- bloqueio individual fecha só o profissional;
- "sem preferência" mantém o outro profissional;
- bloqueio geral fecha todos;
- bloqueio em outra data não afeta o dia;
- agendamento manual permitido, bloqueado e em conflito;
- reagendamento para dia bloqueado recusado, e para outro profissional aceito;
- edição sem mudar o horário não conflita consigo mesma;
- duração de vários serviços na edição;
- ocupação sem o profissional bloqueado (8, 4 e 0 blocos).

**Servidor** (`barber-rules.test.ts`, +11 testes):
- reserva pública: profissional bloqueado, outro profissional livre e bloqueio geral;
- gravação da gestão: manual livre, manual bloqueado, remarcação bloqueada, remarcação para
  outro profissional, agendamento existente intocado num dia bloqueado depois, conflito,
  cancelado ignorado e fora do expediente.

**Persistência** (`backend/tests/blocks.test.mjs`, novo): servidor real + SQLite.
- Agendamento existente sobrevive a um bloqueio criado depois.
- Manual em dia bloqueado → 400; outro profissional → 200.
- Remarcar para dia bloqueado → 400, e o banco continua com o dado anterior.
- Alterar só o status → 200.
- Conflito → 400.
- Reserva pública: bloqueado → 409; livre → 201.
- Bloqueio geral → 409 e 400.

| Execução | Resultado |
| --- | --- |
| `npm run test` (frontend) | 4 arquivos, **52 testes passando** (eram 32) |
| `npm test` (backend) | **3 de 3 passando** (eram 2) |

### K.4 Auditoria de ícones

Busca em todo `frontend/src` (exceto `components/ui`), `backend/src` e no seed por emojis e
símbolos não ASCII, mais uma busca por ícones improvisados com texto.

| Encontrado | Onde | Decisão |
| --- | --- | --- |
| ✂️ 🪒 💈 ✨ | Valor legado do campo `icon` de serviços (seed e linhas já gravadas) e o mapa `SERVICE_EMOJI_ICONS` | Mantido como **dado**: nunca é exibido cru; `serviceIconName` converte para ícones lucide (`Scissors`, `Brush`, `ScissorsLineDashed`, `SprayCan`). Os dados do banco não foram alterados |
| "+" de texto em "+ Novo agendamento", "+ Adicionar serviço", "+ Novo profissional", "+ Criar aviso" | Agendamentos, Serviços, Profissionais, Avisos | **Substituído** por `<Icon name="plus" />`, o mesmo padrão já usado em Visão geral, Agenda e Calendário |
| © – • · — … | Rodapé (direitos autorais), separadores de texto, travessão de "sem valor" e reticências da paginação | Mantidos: tipografia de texto, não ícones |

Demais verificações:
- **Toasts:** usam os ícones SVG do próprio react-toastify; nenhuma mensagem contém emoji.
- **Estados vazios:** são só texto.
- **Botões só com ícone:** todos têm nome acessível. Os dois botões de dia da Agenda não
  tinham e ganharam `aria-label` ("Dia anterior" / "Próximo dia").
- **Na tela:** a validação responsiva confirmou que todos os `svg.ic` visíveis têm tamanho
  ≥ 8px, ficam alinhados dentro do elemento pai e que não há emoji no texto exibido (seções
  Visão geral, Agenda, Agendamentos, Serviços, Profissionais e Avisos, nas três resoluções).

Efeito visual: os 4 botões com "+" ficaram cerca de 12px mais largos (ícone de 16px mais o
espaçamento padrão do botão). A comparação por elemento confirmou que nada mais mudou nessas
telas.

### K.5 Correção funcional encontrada na validação mobile

`notify` esconde no mobile as mensagens que não reconhece como erro (comportamento original).
Por isso várias mensagens de **validação nunca apareciam no celular** e o botão parecia não
fazer nada. Exemplos: "O profissional está bloqueado nesta data.", "Horário fora do expediente
ou bloqueado", "Existe outro atendimento nesse horário", "Preencha data e título.", "As senhas
não conferem.", "Informe seu e-mail.", "O horário final deve ser depois do inicial.".

A nova `notifyError` sempre exibe a mensagem, com estilo de erro, e passou a ser usada em
todas as falhas de validação. Mensagens de sucesso continuam omitidas no mobile, como antes.
As validações do agendamento público já eram exibidas e agora também usam o estilo de erro.

### K.6 Validação responsiva funcional (executada)

Chrome headless, backend local com cópia do banco de teste restaurada a cada resolução, e
data/hora fixadas em 11/11/2026 15:00. Os cliques são **reais**: o teste rola até o elemento,
confere que ele está visível e que nada o cobre (`elementFromPoint`) e dispara eventos de
ponteiro do navegador. Assim são detectados elementos cortados, cobertos ou fora da tela.

| Resolução | Fluxos | Resultado | Erros de console |
| --- | --- | --- | --- |
| Desktop 1366×900 | 22 | **22 de 22** | nenhum |
| Tablet 900×1180 | 22 | **22 de 22** | nenhum |
| Mobile 390×844 (toque emulado) | 22 | **22 de 22** | nenhum |

Fluxos testados nas três resoluções:

1. Navegação site ↔ gestão pelo cabeçalho, sem rolagem horizontal.
2. Login e logout.
3. Agendamento público completo (serviço, profissional, data, horário, contato, máscara do
   WhatsApp, confirmação, gravação no banco).
4. Validação do nome visível.
5. Bloqueio individual criado pela tela de avisos.
6. Cliente: Rafael "Fechado" na data, Alê "Livre", e "sem preferência" oferecendo só Alê.
7. Agendamento manual bloqueado (mensagem específica, nada gravado) e aceito para outro
   profissional.
8. Ocupação da Agenda calculada só com a capacidade de Alê, com as células de Rafael
   "Fechado".
9. Reagendamento para dia bloqueado recusado, banco inalterado e formulário preservado.
10. Edição sem mudar o horário salva.
11. Edição fora do expediente com mensagem.
12. Cadastro e edição de serviço.
13. Status do profissional (select no desktop/tablet, caixa no mobile) e remoção com
    confirmação.
14. Horários: fechar dia e horário personalizado inválido.
15. Calendário: dia selecionado, maximizar e minimizar.
16. Filtros e paginação (desktop: Anterior/Próxima; mobile: números de página).
17. Configurações refletidas no site.
18. Tema claro/escuro e menu recolhido (desktop/tablet).
19. Menu mobile: trava a rolagem e fecha com Esc, com o fundo e ao trocar de seção. Em
    desktop/tablet: botão oculto e sidebar visível.
20. Modais (X) e foto ampliada (Esc).
21. Ícones visíveis, alinhados e sem emoji.
22. "Esqueci a senha" e sessão expirada.

**Comparação visual das telas afetadas** (desktop e mobile; os 157 cenários anteriores não
foram repetidos):
- Agenda: idêntica, só o `aria-label` novo.
- Agendamentos, Serviços, Profissionais, Avisos e edição de agendamento: só o ícone `plus` no
  botão.
- Calendário do cliente: único dia alterado é 16/11 (Rafael bloqueado e Alê sem atendimento às
  segundas), de "Lotado" para "Fechado", o rótulo correto.
- Passo 4 e agendamento manual: idênticos, exceto o atributo `value` já conhecido.

### K.7 Verificação técnica final

| Verificação | Resultado |
| --- | --- |
| `tsc --noEmit` | sem erros |
| Testes frontend | 52 de 52 |
| Testes backend | 3 de 3 |
| `prettier --check src` | ok |
| `npm run lint` | **18 problemas, iguais aos documentados** (12 erros de `any` em `src/lib/barber.functions.ts` e `barber-rules.ts`, 6 avisos em `src/components/ui/`); **nenhum novo** |
| `npm run build` | concluído: cliente, SSR e Nitro (`.output/public` gerado) |
| Console do navegador | nenhum erro nos 66 fluxos (o aviso de hidratação do `THEME_BOOT` no tema claro é conhecido e filtrado) |

### K.8 Limitações e pendências

1. **Supabase não testado de ponta a ponta:** exigiria o projeto real. A regra nova em
   `saveAdminState` é o mesmo código coberto pelos testes de `validateBookingChanges`. Ela faz
   uma leitura extra (`loadAll`) antes de gravar, para comparar com o estado atual.
2. **Reativar um agendamento cancelado** (status de "cancelado" para outro) não revalida
   bloqueios nem conflitos, nem na interface nem no servidor. Isso já era assim; ficou fora do
   escopo para não criar regra nova.
3. **Bloqueios parciais por horário** não existem no modelo de dados (ver K.2).
4. **`backend/src/barber-rules.ts`** é uma cópia sem uso (nenhum arquivo a importa) e não foi
   atualizada; as regras ativas estão em `backend/src/rules.mjs`.
5. **Dados legados com emoji** no campo `icon` de serviços continuam no banco. Ao salvar o
   serviço pela gestão, o valor passa a ser a chave do ícone.
6. **Credenciais de demonstração** no login continuam preenchidas, como aprovado (a partir
   da seção L, só em desenvolvimento).
7. As demais pendências da seção J (lint de `lib/`, regras duplicadas, atributo `value`,
   backend legado) continuam válidas.

---

## L. Interface das exclusões e auditoria de segurança local

Continuação da etapa anterior. As proteções dos dois backends foram mantidas sem alteração
(exceção: correção do 413, item L.1). Nenhuma alteração no Supabase remoto, sem commits,
pushes ou deploys.

### L.1 Correções de segurança concluídas

| Item | Onde | Situação |
| --- | --- | --- |
| Exclusão de agendamento só por `deletedBookingIds` explícito; ausentes do envio são preservados (reserva pública feita durante a edição não some) | `backend/src/rules.mjs`, `frontend/src/lib/barber-rules.ts` | mantido; **agora usado pela interface** |
| Pagos/concluídos não podem ser excluídos | idem | mantido; interface bloqueia antes (botão desabilitado) |
| Serviço com agendamentos não pode ser excluído | idem | mantido; interface avisa antes |
| Dono e profissional com agendamentos futuros não podem ser removidos | idem | mantido |
| Validação de foto (data URL/caminho/https) e limites de texto | idem | mantido |
| Corpo > 2 MB: respondia com conexão resetada (`ECONNRESET`) em vez de 413 | `backend/src/server.mjs` | **corrigido**: responde 413 e descarta o restante do corpo sem destruir o socket |
| Cabeçalhos de segurança | `frontend/src/lib/security-headers.ts`, aplicado em `src/server.ts` | **novo** (ver abaixo) |
| Credenciais de demonstração no bundle de produção | `pages/Login/components/LoginForm.tsx` | **corrigido**: preenchidas só com `import.meta.env.DEV` |
| Teste de credenciais expostas | `src/test/secrets.test.ts`, `npm run test:secrets` | **novo** |

**Cabeçalhos** (todas as respostas do servidor, inclusive páginas de erro):
`Content-Security-Policy: frame-ancestors 'none'; base-uri 'self'; object-src 'none'`,
`X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`,
`Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` (câmera, microfone,
localização, pagamento e USB desligados), `Cross-Origin-Opener-Policy: same-origin` e
`Strict-Transport-Security` só em HTTPS. A CSP não tem `script-src`/`style-src`: o TanStack
Start injeta scripts inline de hidratação e o styled-components injeta estilos inline, então
uma CSP restritiva quebraria a página (precisaria de nonce, ver L.6). Cabeçalhos já definidos
pela resposta não são sobrescritos; respostas com cabeçalhos imutáveis são copiadas.
Validado com resposta real do servidor (`vite dev`, que usa o mesmo `src/server.ts`) e por
`src/test/security-headers.test.ts`.

**Teste de credenciais** (`src/test/secrets.test.ts`, ambiente node): o teste guarda apenas o
SHA-256 do e-mail e da senha de demonstração e compara com cada palavra dos arquivos. Regras:
no código-fonte e em `public/`, as credenciais só podem aparecer no `LoginForm` e em linhas
condicionadas a `import.meta.env.DEV`; no build (`.output/`, cliente e servidor), em lugar
nenhum. Também procura chave privada PEM, JWT com papel `service_role`, chaves `sb_secret_` e
`sk_live_`/`sk_test_`, e os **valores** das variáveis secretas do `.env` local (nomes com
`SERVICE_ROLE`, `SECRET`, `PASSWORD`, `PRIVATE`, `DATABASE_URL`, `_TOKEN`), comparados em
memória. As mensagens de falha citam só arquivo e nome da variável, nunca o valor. A parte do
bundle é pulada quando `.output/` não existe; `npm run test:secrets` faz o build e roda o
teste. Prova de detecção: rodado contra o build anterior à correção, o teste **falhou**
apontando os 2 arquivos com as credenciais; após o novo build, passou.

A autenticação não mudou: o login segue igual, só os campos vêm vazios fora de `vite dev`.

### L.2 Funcionalidades administrativas implementadas

**Modal de confirmação padrão.** O componente da Gestão de Profissionais virou
`components/ConfirmDialog` (mesmo HTML e classes `.bf-confirm-delete*`; o CSS foi movido sem
alteração para `components/ConfirmDialog/styles.ts`, na mesma posição da cascata) e o hook
`useConfirm()` abre o modal com título, mensagem, detalhe, ícone e rótulos. Ganhou
`role="alertdialog"` ligado à mensagem. **Não há mais `window.confirm()`** no código: foram
substituídos os de cancelamento de agendamento, "Aplicar à semana" (Horários) e exclusão de
aviso; a remoção de profissional passou a usar o mesmo hook.

**Ações padronizadas.** Novo `components/RowActions` (`RowActions` + `RowAction`), com as
medidas finais dos botões da Gestão de Profissionais: no desktop/tablet, botões quadrados de
44 px só com ícone (38 px dentro de tabelas); no mobile, em listas, botões na largura do item
com ícone e texto (uma coluna até 420 px). Todo botão tem `aria-label`/`title` com o nome do
item; ícones do `lucide-react` via `<Icon>`.

- **Serviços:** editar e excluir. Excluir recusa, com aviso de erro, serviço usado em qualquer
  agendamento (mesma regra do servidor; a orientação é desativar). Sem uso, abre o modal e
  remove do catálogo.
- **Clientes:** nova coluna "Ações" com excluir. A exclusão é **anonimização**: em todos os
  agendamentos do cliente, `customer` vira "Cliente removido", `phone` fica vazio e é marcado
  `anonymized: true`. Nenhum agendamento é apagado (sem cascata); valores, pagamentos, status e
  datas continuam na agenda e no financeiro. Clientes anonimizados saem da lista. Cliente com
  agendamento futuro não cancelado não pode ser excluído (é preciso cancelar antes, como nos
  profissionais).
- **Agendamentos:** coluna "Ações" com detalhes, editar, cancelar e excluir.
  - Cancelar: modal, status "cancelado", registro preservado; desabilitado se já cancelado.
  - Excluir: modal; `update(recipe, { deletedBookingIds: [id] })` envia o pedido explícito no
    `PUT /admin/state` (mesmo caminho no Supabase). Desabilitado para pagos ou concluídos.
  - Editar: o mesmo formulário de antes, com as mesmas validações de bloqueio por
    profissional, expediente e conflito.

`update` (`contexts/data`) aceita agora `options.deletedBookingIds`; sem esse campo, o envio
é idêntico ao anterior. Novos utilitários em `scripts/scheduling.ts`: `isFinancialRecord`,
`serviceIdsOf`, `clientKey` e `ANONYMIZED_CUSTOMER`, espelhando o servidor.

### L.3 Alterações responsivas

- Serviços no mobile: as ações descem para baixo do item, na largura total
  (`.bf-service-row .bf-row-actions { grid-column: 1 / -1 }`), como em Profissionais. A
  antiga regra `.bf-service-edit` saiu porque o botão foi substituído.
- Tabelas (Agendamentos, Clientes): a coluna de ações não quebra linha (`width: 1%`,
  `nowrap`). No mobile continua valendo a rolagem horizontal interna da tabela, que já existia
  (`.tablewrap`); a página em si não rola na horizontal.
- O modal de confirmação mantém o layout aprovado: dois botões lado a lado no desktop e
  empilhados no mobile.

### L.4 Validação funcional e responsiva (executada)

Chrome headless controlado pelo DevTools Protocol, frontend em `vite dev` no modo `mock`,
backend local com **banco temporário recriado a cada resolução** (o banco do usuário e o
Supabase não foram tocados). Os cliques são reais: rola até o elemento, confere visibilidade
e que nada o cobre (`elementFromPoint`) e dispara mouse (desktop/tablet) ou toque (mobile). O
login foi feito pela interface e o token lido do navegador; nenhuma credencial ou token ficou
em script ou log. Cada operação foi conferida também **no servidor** (`GET /admin/state`).

| Resolução | Fluxos | Resultado | Erros de console |
| --- | --- | --- | --- |
| Desktop 1366×900 | 16 | **16 de 16** | nenhum |
| Tablet 900×1180 | 16 | **16 de 16** | nenhum |
| Mobile 390×844 (toque) | 16 | **16 de 16** | nenhum |

Fluxos:
1. Login com campos preenchidos em desenvolvimento.
2. Serviços: 2 ações por item, `aria-label`, 44 px só ícone no desktop/tablet e texto no
   mobile, sem rolagem horizontal.
3. Serviços: excluir serviço com agendamentos é recusado com erro e sem modal.
4. Serviços: criar, abrir exclusão, **cancelar** (nada muda no servidor), excluir e confirmar
   (some no servidor). O modal cabe na tela, tem 2 botões e `role=alertdialog`.
5. Agendamentos: coluna Ações com 4 botões acessíveis.
6. Cancelar pelo modal: status "cancelado" gravado e botão desabilitado depois.
7. Pago: botão excluir desabilitado.
8. Edição: conflito de horário recusado; data com bloqueio do profissional recusada; servidor
   inalterado.
9. Excluir: o agendamento some do servidor e só ele (total − 1).
10. Clientes: coluna Ações; cliente com agendamento futuro não pode ser excluído.
11. Clientes: anonimização. Os 2 agendamentos ficam no banco, sem nome nem telefone,
    `anonymized`, o pago continua pago, o total não muda e o cliente sai da lista.
12. Profissionais: remoção pelo modal (cancelar não remove; confirmar remove).
13. Profissionais: editor com select de status (desktop/tablet) e dentro da tela.
14. Horários: "Aplicar à semana" abre o modal e cancelar não altera nada.
15. Avisos: exclusão pelo modal; o bloqueio de outro dia continua.
16. Persistência: após recarregar a página, serviço excluído, cliente anonimizado,
    agendamento excluído e agendamento cancelado continuam como ficaram.

Também foram conferidas capturas de tela das telas novas nas três resoluções.

### L.5 Testes e build

| Verificação | Resultado |
| --- | --- |
| `tsc --noEmit` | sem erros |
| Testes frontend (`vitest run`) | **66 de 66** (7 arquivos; novos: `secrets`, `security-headers`, `admin-actions`) |
| Testes backend (`npm test`) | **15 de 15** (o teste de corpo grande falhava antes da correção do 413) |
| `npm run lint` | 18 problemas, **os mesmos já documentados** (12 `any` em `src/lib/`, 6 avisos em `src/components/ui/`); nenhum novo |
| `prettier --check src` | ok |
| `npm run build` | concluído (cliente, SSR e Nitro) |
| `npm run test:secrets` (build + bundle) | 7 de 7 |
| Cabeçalhos em resposta real | presentes; HSTS ausente em http, como esperado |

Observação: sem a variável `VERCEL`, o build local usa o preset `cloudflare-module`; por isso
os cabeçalhos foram validados no `vite dev` (mesmo `src/server.ts`) e por teste unitário, e
não executando `.output/server`.

### L.6 Vulnerabilidades pendentes e recomendações para o Supabase remoto

Nada abaixo foi alterado; são recomendações para a próxima etapa.

| # | Ponto | Risco | Gravidade | Correção recomendada | Impacto no funcionamento |
| --- | --- | --- | --- | --- | --- |
| 1 | **[Resolvido, ver L.10]** **Cadastro automático do primeiro proprietário** (`assign_first_owner`, trigger em `auth.users`; e o login do frontend chama `signUp` quando ainda não há dono) | Enquanto não existir dono (projeto novo, banco recriado ou `user_roles` limpo), **qualquer pessoa** que acessar `/login` primeiro vira proprietária e passa a ler clientes/telefones e alterar tudo | **Alta** (crítica numa janela de instalação) | Criar o dono uma única vez por SQL/painel (ou função protegida por segredo de instalação), remover o trigger e o `signUp` do login; ou limitar o trigger a um e-mail definido em configuração | O "primeiro acesso cria a conta" deixa de existir; o dono passa a ser criado manualmente. Contas já criadas não mudam |
| 2 | **Cadastros públicos** (o `config.toml` não desativa `enable_signup`, padrão ativo) | Qualquer um cria contas pela API pública do Auth. Hoje elas não têm papel e as políticas negam acesso, mas: (a) combinado com o item 1 vira tomada de controle; (b) permite spam de contas e de e-mails de confirmação | Média | Desativar cadastros (`[auth] enable_signup = false` / painel), após o dono existir; ativar CAPTCHA e limites do Auth | Nenhum para o dono existente. A mensagem "cadastro desativado" já está traduzida em `errors.ts` |
| 3 | **Permissões de `has_role`** (`security definer`, sem `revoke`) | Pelo padrão do Postgres, funções novas são executáveis por `PUBLIC`: `anon` e `authenticated` podem chamar `rpc('has_role', …)` com qualquer UUID e descobrir quem é dono (vazamento de informação; não dá acesso). A política de `UPDATE` em `app_state` também não tem `WITH CHECK` | Baixa a média | `revoke execute on function public.has_role(uuid, app_role) from public, anon;` mantendo `authenticated` (as políticas RLS precisam dela); acrescentar `with check (public.has_role(auth.uid(),'owner'))` na política de update | Nenhum: as políticas continuam funcionando para usuários autenticados; os servidores usam a `service_role` |
| 4 | **Dependência vulnerável `zod`** (`zod@3.25.76` direta; GHSA-mrhx-c7xc-m3w5, alta: consumo de memória ao validar coleções grandes) | Só é explorável onde o zod valida entrada não confiável. **Nenhum arquivo de `src/` importa `zod` nem `@hookform/resolvers`**; as ferramentas do TanStack já usam `zod@4.6.7` (corrigido) | Alta no aviso, **baixa na prática** | Remover `zod` e `@hookform/resolvers` das dependências (não usados) ou atualizar para `zod@^4.6.7` | Remover: nenhum, se o build confirmar; atualizar: o zod 4 tem mudanças de API (só afetaria código que viesse a usá-lo) |
| 5 | **Sem limite de tentativas nas reservas públicas** (`createBooking` no Supabase e `POST /bookings` local) e no login local | Um robô pode preencher toda a agenda com reservas falsas (negação de serviço do negócio) ou forçar senhas no backend local. As regras de horário impedem conflito, mas não volume | Média | Limite por IP/telefone (ex.: N reservas por hora; contador em tabela/KV na server function ou rate limit da Vercel), limite de reservas futuras por telefone e CAPTCHA (Turnstile) no passo 4; no Supabase Auth, os limites e o CAPTCHA nativos | Clientes legítimos não são afetados se o limite for folgado; o CAPTCHA acrescenta um passo no agendamento |

Outras observações da auditoria:
- `/public` não expõe nomes, telefones nem pagamentos (coberto pelo teste do backend).
- A CSP poderia ser completa (`script-src` com nonce) se o TanStack Start passar a fornecer
  nonce; hoje fica restrita às diretivas que não quebram a hidratação.
- Reativar um agendamento cancelado continua sem revalidar conflitos e bloqueios (K.8).

### L.7 Limitações da auditoria

1. **Supabase testado só na gestão, com registros de teste** (ver L.8). Não foram testados
   contra o Supabase: a reserva pública, as telas de Profissionais, Horários e Avisos, e a
   recuperação de senha.
2. A análise do Supabase foi feita sobre `backend/drizzle/migrations/0000_migration.sql` e
   `backend/supabase/config.toml`. O estado real do projeto remoto (políticas aplicadas,
   configuração do Auth) **não foi consultado** e pode diferir desses arquivos.
3. `npm audit` lista só vulnerabilidades conhecidas das dependências de produção do frontend;
   o backend local não tem dependências.
4. A anonimização é aplicada pela interface e gravada pelo `PUT /admin/state`. O servidor não
   impede que o dono edite um agendamento anonimizado e coloque um nome de novo.
5. O teste de bundle depende de `.output/` atualizado e é pulado sem build; use
   `npm run test:secrets`.
6. Os testes funcionais rodaram em `vite dev`, não no build de produção (preset Cloudflare
   local).

### L.8 Verificação contra o Supabase real (registros de teste)

Feita a pedido do usuário, com `vite dev` usando o `.env` original (`VITE_API_MODE=supabase`).

**Leitura (site público, sem login):** os dados vieram da server function `getPublicState`,
com serviços e equipe do banco remoto; só requisições GET e nenhum erro de console.

**Gestão:** o proprietário entrou numa janela do Chrome. As credenciais não foram lidas nem
registradas. Antes do teste, a checagem `ownerExists`, que só lê, confirmou que já existia um
dono, então nenhum login criaria conta. Todos os registros criados tinham o nome iniciado por
"Teste Qa", com agendamentos em 2031 e um serviço oculto no site. Cada etapa foi conferida
lendo de volta do Supabase.

| Etapa | Resultado |
| --- | --- |
| Criar serviço (oculto) e excluir pelo modal | ok, gravado e removido no Supabase |
| Agendamento manual gravado | ok |
| Cancelar pelo modal | ok, `status: "cancelado"` no Supabase |
| Excluir pelo modal (`deletedBookingIds`) | ok, removido só esse registro (total − 1) |
| Excluir cliente (anonimização) | ok na 2ª tentativa: "Cliente removido", telefone vazio, `anonymized: true`, registro preservado |
| Estado final | igual ao inicial: 10 agendamentos, os mesmos serviços, profissionais e avisos, nenhum registro de teste |

Ocorrências durante o teste:
1. Na 1ª rodada, o modal de exclusão do cliente não abriu: o clique ocorreu, mas a janela
   estava em outra tela quando foi inspecionada. A causa não foi identificada. Na 2ª rodada,
   com diagnóstico, o modal abriu e a anonimização foi gravada. O mesmo cenário (cliente só com
   agendamento futuro cancelado) também foi reproduzido localmente e funcionou.
2. **Um agendamento de teste voltou ao banco.** A limpeza de segurança da 1ª rodada apagou o
   registro chamando a gravação diretamente, sem atualizar o estado da janela aberta. Na 2ª
   rodada, a primeira gravação feita pela gestão enviou o estado antigo da janela e recriou o
   registro. Ele foi identificado (data e horário de teste, cancelado, anonimizado, não pago,
   ausente no início da rodada) e removido pelo mesmo caminho, conferindo o total de 10.
   Localmente, o agendamento manual cria um único registro com uma única gravação: não há bug
   no formulário.

**Pendência revelada pelo item 2: aba desatualizada recria agendamentos excluídos.** Como cada
gravação envia o estado completo, uma segunda aba (ou dispositivo) da gestão aberta antes de
uma exclusão vai recriar o agendamento excluído na próxima alteração que fizer. Isso vale
também para serviços e avisos excluídos em outra aba. É uma limitação do modelo de "estado
único" que já existia, não das mudanças desta etapa. Correção recomendada: controle de versão
otimista (o `PUT /admin/state` envia a versão/`updated_at` lida e o servidor recusa com 409 se
o estado mudou, e a tela recarrega), ou passar a gravar só as alterações (inserções e
atualizações por id) em vez do documento inteiro. Gravidade média: pode trazer de volta dados
excluídos sem aviso. **Corrigido na seção L.9.**

### L.9 Correção: controle de versão otimista nas gravações da gestão

**Como funciona:**
- **Versão:** é a coluna `updated_at` do `app_state`, que já existe nos dois bancos.
  **Nenhuma migração** e nenhuma mudança de schema no Supabase.
- **`GET /admin/state`:** devolve `version`. O site público não recebe a versão.
- **Gravação:** cada uma envia a `version` que a tela leu. O servidor só grava se ela ainda for
  a atual e devolve a nova versão.
  - No SQLite, a comparação e a gravação acontecem na mesma transação `BEGIN IMMEDIATE`.
  - No Supabase, o `UPDATE app_state … WHERE id = 1 AND updated_at = <versão lida>` é atômico;
    nenhuma linha atualizada significa conflito. Os agendamentos só são gravados ou excluídos
    depois que esse `UPDATE` passa.
- **Conflito:** o servidor responde **409**, com a mensagem "Os dados foram alterados em outra
  aba ou aparelho…", e **não grava nada**.
- **Na tela** (`contexts/data/Provider.tsx`):
  - A versão é lida na hora do envio, então gravações seguidas da mesma aba usam a versão
    devolvida pela anterior e não geram conflito.
  - No 409, a tela descarta as gravações que ainda estavam na fila (contador de geração),
    mostra o aviso como erro (visível também no mobile) e recarrega os dados do servidor.
  - A alteração recusada precisa ser refeita, agora sobre os dados atuais.
- **Compatibilidade:** um envio **sem** `version` (aba aberta com o código antigo) é gravado
  como antes. Uma versão que não seja texto recebe 400.
- **Reservas públicas:** não mudam a versão, então não causam conflito na gestão. Elas
  continuam preservadas pela regra de "ausentes do envio são mantidos".

**Arquivos:** `backend/src/database/db.mjs`, `backend/src/server.mjs`,
`frontend/src/lib/barber.functions.ts`, `frontend/src/services/api/supabaseClient.ts`,
`frontend/src/services/stateService.ts`, `frontend/src/contexts/data/Provider.tsx`,
`frontend/src/types/barber.ts`.

**Validação:**

| Verificação | Resultado |
| --- | --- |
| Teste backend novo: duas abas, A exclui e B (desatualizada) grava | 409; agendamento não volta; alteração de B não aplicada; a versão devolvida permite gravar; envio sem versão aceito; versão inválida recusada (400); `/public` sem versão |
| Teste frontend novo (`state-version.test.ts`) | modo Supabase: envia a versão e devolve a nova; conflito vira 409; erro de regra continua 400 |
| Navegador, duas abas reais (local) | 3 gravações seguidas na mesma aba sem conflito; aba B recebe o aviso, é recusada (409), recarrega e depois grava normalmente; agendamento excluído não volta; sem erros de console (11 de 11) |
| Bateria funcional completa (L.4) repetida | 16 de 16 em 1366, 900 e 390 px, sem erros de console |
| `tsc`, lint, Prettier | sem erros; lint com os mesmos 18 problemas antigos |
| Testes | frontend 69 de 69; backend 16 de 16 |
| Build + `test:secrets` | ok, 7 de 7 |

**No Supabase real**, pela janela em que o proprietário estava logado:
- A versão vem no estado da gestão e não vem no site público.
- Gravação com versão antiga inventada: **recusada, sem nenhuma alteração**.
- Gravação com a versão correta e **sem nenhuma mudança de dados**: aceita. Os dados ficaram
  idênticos e só `updated_at` mudou. **Foi a única gravação feita no Supabase nesta
  verificação.**
- Reenvio com a versão anterior: **recusado, sem alteração**.

O status chegou ao navegador como 400, e a nova versão não foi devolvida, porque a janela
tinha sido carregada antes da mudança e usava o código antigo do navegador. O servidor já
usava o código novo e recusou corretamente. Recarregar a janela para repetir com o código
novo exigiria novas gravações em produção, e essa ação não foi autorizada. O mapeamento
409/versão do navegador está coberto pelo teste `state-version.test.ts`.
**Pendente:** repetir no Supabase com a página recarregada.

**Limites:** uma aba aberta com o código anterior a esta mudança não envia versão e, por
compatibilidade, ainda grava como antes, com o mesmo risco, até ser recarregada. Depois que
todos os clientes estiverem atualizados, dá para tornar a versão obrigatória no servidor.

### L.10 Correção: fim do "primeiro dono automático"

- **Dono mantido:** a conta atual (única no Auth, já com papel `owner`) continua sendo a proprietária, com acesso completo; e-mail e senha não mudaram.
- **Banco:** nova migração `backend/drizzle/migrations/0001_remove_first_owner.sql` remove o trigger `on_auth_user_created_owner` e a função `assign_first_owner`. Não altera `user_roles`.
- **Login:** `supabaseClient.ts` não chama mais `signUp`; credencial errada é sempre "Credenciais inválidas.". A server function pública `ownerExists` (que revelava se havia dono) foi removida.
- **Auth:** `backend/supabase/config.toml` com `enable_signup = false`.
- **Testes:** `src/test/supabase-login.test.ts` (login nunca cria conta; conta sem papel de dono é recusada; dono entra).
- **Pendente no Supabase remoto:** executar o SQL da migração e desativar cadastros no painel (Authentication → Sign In / Providers → "Allow new users to sign up").
