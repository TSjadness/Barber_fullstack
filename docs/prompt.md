# PROMPT MESTRE — REFATORAÇÃO COMPLETA DA ARQUITETURA REACT + TYPESCRIPT

## 1. CONTEXTO E OBJETIVO DO PROJETO

Você atuará como um Engenheiro de Software Sênior, especialista em React, TypeScript, arquitetura frontend, componentização, Styled Components, organização de código e boas práticas de desenvolvimento.

Sua missão é analisar profundamente a estrutura atual do projeto e executar uma refatoração arquitetural completa, tornando o código mais profissional, modular, organizado, reutilizável, escalável e de fácil manutenção.

O projeto já possui funcionalidades, interfaces, regras de negócio e comportamentos implementados que deverão ser preservados.

**ATENÇÃO: Esta tarefa é uma refatoração arquitetural, não um redesenvolvimento, redesign ou reconstrução do sistema do zero.**

O resultado final deverá manter a aplicação visualmente idêntica à versão original, preservando todos os fluxos, integrações, funcionalidades, validações, animações e comportamentos existentes.

A estrutura de referência é um projeto React organizado com as pastas `public` e `src`, conforme a imagem fornecida pelo usuário. Entretanto, essa estrutura deverá ser adaptada corretamente ao framework, às dependências e à ferramenta de build realmente utilizados no projeto.

---

## 2. ANÁLISE OBRIGATÓRIA ANTES DA REFATORAÇÃO

Antes de modificar qualquer arquivo, realize uma análise completa do projeto atual.

Identifique:

1. A estrutura completa de diretórios e arquivos.
2. A versão do React utilizada.
3. A ferramenta de build existente, como Vite, Create React App ou outra.
4. A configuração atual do TypeScript.
5. As bibliotecas de estilização utilizadas.
6. Todos os componentes existentes, incluindo componentes implementados diretamente dentro de arquivos grandes.
7. As páginas, layouts e rotas.
8. Os hooks e estados da aplicação.
9. Os serviços e integrações com APIs.
10. Os scripts e funções JavaScript existentes.
11. Os estilos globais e específicos de componentes.
12. Os arquivos estáticos e suas referências.
13. As dependências entre os arquivos.
14. As regras de negócio e validações implementadas.
15. Os mecanismos de autenticação, autorização e persistência de dados.
16. As configurações de desenvolvimento, compilação e produção.

Dê atenção especial aos seguintes arquivos:

- `public/barber/app.js`
- `public/barber/app.css`

Esses arquivos representam pontos importantes da refatoração, pois atualmente concentram diversas responsabilidades.

Também investigue a existência de arquivos como `App.js`, `App.jsx`, `index.js`, `main.js`, `App.tsx`, `main.tsx` e demais arquivos de inicialização.

Não presuma que todos esses arquivos existem. Identifique os arquivos reais e adapte a refatoração de acordo com a estrutura encontrada.

**Não inicie alterações sem compreender como a aplicação funciona atualmente.**

---

## 3. ESTRUTURA PADRÃO DE DIRETÓRIOS

A nova organização deverá seguir uma arquitetura modular, baseada em React + TypeScript.

Utilize a seguinte estrutura como referência:

```text
projeto/
│
├── public/
│   ├── favicon.ico
│   └── assets/
│       ├── images/
│       ├── icons/
│       └── fonts/
│
├── src/
│   │
│   ├── components/
│   │   ├── Button/
│   │   │   ├── index.tsx
│   │   │   ├── styles.tsx
│   │   │   └── types.ts
│   │   │
│   │   ├── Input/
│   │   │   ├── index.tsx
│   │   │   ├── styles.tsx
│   │   │   └── types.ts
│   │   │
│   │   ├── Modal/
│   │   │   ├── index.tsx
│   │   │   ├── styles.tsx
│   │   │   └── types.ts
│   │   │
│   │   ├── Header/
│   │   │   ├── index.tsx
│   │   │   └── styles.tsx
│   │   │
│   │   └── Sidebar/
│   │       ├── index.tsx
│   │       └── styles.tsx
│   │
│   ├── pages/
│   │   └── NomePagina/
│   │       ├── index.tsx
│   │       ├── styles.tsx
│   │       └── types.ts
│   │
│   ├── hooks/
│   ├── services/
│   ├── contexts/
│   ├── routes/
│   ├── scripts/
│   ├── utils/
│   ├── types/
│   ├── constants/
│   │
│   ├── styles/
│   │   ├── global.ts
│   │   └── theme.ts
│   │
│   ├── App.tsx
│   └── main.tsx
│
├── package.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
└── README.md
```

### Regras importantes

- Esta é uma estrutura de referência, não uma lista de arquivos obrigatórios.
- Crie apenas os diretórios e arquivos necessários às funcionalidades reais.
- Não crie componentes fictícios apenas para preencher a estrutura.
- Não introduza bibliotecas sem necessidade técnica.
- Preserve convenções e configurações válidas já existentes.
- Se o projeto utilizar Vite, mantenha normalmente `index.html` na raiz do projeto.
- Se utilizar Create React App, respeite sua estrutura compatível com `public/index.html`.
- Não altere a ferramenta de build apenas por preferência de organização.
- Não introduza dois pontos de entrada concorrentes.

---

## 4. COMPONENTIZAÇÃO OBRIGATÓRIA

Todos os componentes reutilizáveis deverão estar localizados em:

`src/components/`

Cada componente deverá possuir sua própria pasta.

### Exemplo: Button

```text
src/
└── components/
    └── Button/
        ├── index.tsx
        ├── styles.tsx
        └── types.ts
```

### Responsabilidade de cada arquivo

**index.tsx**

Responsável pela implementação do componente React, renderização JSX, propriedades, eventos e integração com hooks.

**styles.tsx**

Responsável exclusivamente pelas declarações de estilo daquele componente.

Utilize Styled Components caso essa seja a biblioteca de estilização adotada ou aprovada para o projeto.

Se o arquivo de estilos não contiver JSX, `styles.ts` é tecnicamente suficiente. Entretanto, respeite a convenção de `styles.tsx` quando ela for definida como padrão do projeto.

**types.ts**

Responsável pelas interfaces, tipos, contratos e propriedades específicas do componente.

Esse arquivo deverá ser criado quando houver necessidade real de separar tipagens.

### Regras de componentização

1. Identifique componentes reutilizáveis existentes.
2. Extraia componentes que estejam implementados diretamente dentro de páginas ou arquivos extensos, quando essa separação melhorar a organização.
3. Evite duplicação de componentes.
4. Mantenha cada componente responsável por uma funcionalidade claramente definida.
5. Utilize propriedades tipadas.
6. Evite componentes excessivamente grandes.
7. Preserve nomes de propriedades e contratos externos quando necessário para evitar incompatibilidades.
8. Utilize PascalCase para nomes de componentes.
9. Evite lógica de negócio complexa diretamente na renderização.
10. Preserve acessibilidade, eventos, estados, animações e comportamento original.

Componentes específicos de uma única página poderão permanecer organizados junto à página quando isso fizer mais sentido arquiteturalmente.

---

## 5. REFATORAÇÃO COMPLETA DO APP.CSS

### Arquivo prioritário

`public/barber/app.css`

Atualmente, esse arquivo concentra estilos de diferentes partes da aplicação.

Essa centralização deverá ser eliminada.

### Objetivo

Analisar integralmente o conteúdo do `app.css`, identificar cada conjunto de estilos e distribuí-lo para o componente ou página correspondente.

### Exemplo de transformação

**Antes:**

```text
public/
└── barber/
    ├── app.js
    └── app.css
```

**Depois:**

```text
src/
├── components/
│   ├── Button/
│   │   ├── index.tsx
│   │   └── styles.tsx
│   │
│   ├── Modal/
│   │   ├── index.tsx
│   │   └── styles.tsx
│   │
│   └── Sidebar/
│       ├── index.tsx
│       └── styles.tsx
│
└── styles/
    ├── global.ts
    └── theme.ts
```

### Processo obrigatório

1. Leia todo o `app.css`.
2. Identifique todos os seletores e suas respectivas responsabilidades.
3. Relacione cada seletor aos elementos ou componentes reais da aplicação.
4. Identifique estilos de botões, modais, menus, formulários, cards, tabelas, layouts, calendários e quaisquer outros componentes existentes.
5. Transfira os estilos específicos para os respectivos arquivos `styles.tsx`.
6. Identifique estilos compartilhados que possam ser reutilizados sem duplicação.
7. Organize temas, tokens visuais e variáveis de design quando apropriado.
8. Mantenha globalmente somente os estilos que realmente precisam ser globais.
9. Atualize as referências de estilos nos componentes.
10. Elimine o carregamento do CSS legado somente depois de confirmar que todos os estilos foram corretamente migrados.

### Estilos permitidos globalmente

A camada global poderá conter:

- Reset CSS.
- Normalização de elementos HTML.
- Fontes globais.
- Variáveis de cores.
- Tokens de espaçamento.
- Configurações gerais do tema.
- Estilos de `html`, `body` e do elemento raiz.
- Outras definições verdadeiramente globais e justificadas.

Não utilize o arquivo global para concentrar estilos de componentes individuais.

### Preservação visual obrigatória

Durante a migração, preserve:

- Cores e gradientes.
- Bordas e arredondamentos.
- Sombras.
- Espaçamentos.
- Tipografia.
- Dimensões.
- Alinhamentos.
- Responsividade.
- Breakpoints.
- Transições.
- Animações.
- Estados hover, focus, active e disabled.
- Camadas, posicionamento e `z-index`.
- Comportamento visual de modais e menus.
- Elementos condicionais.
- Aparência de formulários, calendários e tabelas.

**Não altere o design original.**

A migração dos estilos deverá ser visualmente equivalente ao CSS anterior.

Atenção especial a seletores combinados, pseudo-elementos, herança CSS, especificidade, media queries e estilos dependentes da estrutura do DOM.

Não remova estilos simplesmente porque aparentam não estar sendo utilizados. Verifique primeiro se são aplicados dinamicamente.

---

## 6. REFATORAÇÃO COMPLETA DO APP.JS

### Arquivo prioritário

`public/barber/app.js`

Esse arquivo atualmente concentra diferentes scripts, funcionalidades e responsabilidades.

Ele deverá ser analisado integralmente e refatorado para uma arquitetura TypeScript organizada.

### Objetivo

Eliminar a centralização de funcionalidades em um único arquivo JavaScript e distribuir cada responsabilidade para o módulo arquitetural correto.

### Estrutura de referência

```text
src/
├── components/
├── pages/
├── hooks/
├── services/
├── scripts/
├── utils/
├── contexts/
├── routes/
├── App.tsx
└── main.tsx
```

### Regras obrigatórias

1. Leia integralmente o `app.js`.
2. Identifique todas as funções existentes.
3. Identifique os eventos e listeners.
4. Identifique os scripts responsáveis pela interface.
5. Identifique funcionalidades de autenticação.
6. Identifique chamadas para APIs.
7. Identifique manipulações de dados.
8. Identifique validações.
9. Identifique estados, filtros e operações de interface.
10. Identifique funções auxiliares.
11. Identifique dependências entre as funcionalidades.
12. Preserve a ordem necessária de inicialização.
13. Migre a lógica para TypeScript.
14. Distribua o código entre componentes, hooks, services, scripts e utils conforme a responsabilidade.
15. Atualize os imports e exports.
16. Remova o carregamento do JavaScript legado após validar sua substituição completa.

### Atenção

Apenas mover funções para arquivos diferentes não caracteriza uma refatoração completa.

A lógica deverá ser reorganizada respeitando as práticas recomendadas do React.

Evite manipulação direta do DOM quando ela puder ser substituída por estado, propriedades, eventos e referências do React.

Não mantenha duas implementações concorrentes da mesma funcionalidade.

---

## 7. CRIAÇÃO DA PASTA SCRIPTS

Crie o diretório:

`src/scripts/`

Esse diretório deverá armazenar scripts e rotinas independentes que realmente necessitem dessa classificação.

Exemplo ilustrativo:

```text
src/
└── scripts/
    ├── authentication.ts
    ├── scheduling.ts
    ├── professionals.ts
    └── notifications.ts
```

Os nomes acima são exemplos e deverão ser adaptados às funcionalidades reais encontradas.

### Documentação obrigatória

Cada arquivo da pasta `scripts` deverá conter um comentário de identificação.

Exemplo:

```ts
/**
 * Funcionalidade: Gerenciamento de agendamentos
 *
 * Responsabilidade:
 * Executar rotinas relacionadas ao processamento
 * e à validação de agendamentos.
 *
 * Origem:
 * Funcionalidade anteriormente implementada
 * no arquivo public/barber/app.js.
 */
```

Comentários deverão esclarecer a responsabilidade das rotinas, especialmente em trechos de maior complexidade.

Evite comentários redundantes que apenas descrevam literalmente o nome de uma função.

### Separação correta de responsabilidades

Não direcione automaticamente toda lógica para `scripts`.

Siga os seguintes critérios:

**components/**

Componentes visuais reutilizáveis e seus comportamentos específicos.

**pages/**

Páginas e composição das interfaces.

**hooks/**

Lógicas reutilizáveis relacionadas a estados, efeitos e comportamentos React.

**services/**

Chamadas de APIs, integrações, clientes HTTP e comunicação com serviços.

**scripts/**

Rotinas independentes, inicializadores ou scripts específicos que não se encaixem adequadamente nas demais camadas.

**utils/**

Funções auxiliares puras e reutilizáveis.

**contexts/**

Estados e informações compartilhadas por meio de React Context.

**routes/**

Definição e organização das rotas, quando houver roteamento.

**types/**

Tipos e interfaces compartilhados por diferentes módulos.

**constants/**

Constantes e configurações estáticas reutilizáveis.

---

## 8. MIGRAÇÃO COMPLETA PARA TYPESCRIPT

O código-fonte da aplicação frontend deverá utilizar TypeScript como padrão.

Não deverão permanecer componentes ou módulos de aplicação escritos em JavaScript puro.

### Conversões esperadas

```text
App.js         → App.tsx
App.jsx        → App.tsx
index.js       → main.tsx
Component.jsx  → index.tsx
helpers.js     → helpers.ts
services.js    → services.ts
```

Essas conversões são exemplos. Preserve os nomes ou caminhos existentes quando forem necessários ao funcionamento do framework.

### Regras

1. Arquivos que contenham JSX deverão utilizar `.tsx`.
2. Arquivos sem JSX deverão utilizar `.ts`.
3. Propriedades de componentes deverão ser tipadas.
4. Eventos deverão utilizar os tipos adequados do React.
5. Estados deverão possuir inferência ou tipagem correta.
6. Respostas de APIs deverão possuir contratos tipados.
7. Tipos compartilhados deverão ser centralizados quando apropriado.
8. Evite `any`, especialmente quando houver possibilidade de definir tipos adequados.
9. Utilize `unknown` e validações quando os dados externos forem desconhecidos.
10. Revise referências, imports, exports e caminhos.
11. Revise o `tsconfig.json`.
12. Garanta compatibilidade com as bibliotecas instaladas.
13. Remova os arquivos JavaScript legados somente após a conversão ter sido validada.

### Proibição

Não considere a migração concluída apenas porque a extensão foi alterada.

O código deverá ser efetivamente tipado e compatível com TypeScript.

Evite utilizar `@ts-ignore`, `@ts-nocheck` ou conversões forçadas apenas para esconder erros.

Arquivos de configuração JavaScript que sejam exigidos por ferramentas externas poderão permanecer quando tecnicamente necessário e devidamente justificado.

---

## 9. ORGANIZAÇÃO DO APP.TSX E MAIN.TSX

Os arquivos principais deverão possuir responsabilidades claramente definidas.

### main.tsx

Responsável por:

- Inicialização do React.
- Renderização da aplicação.
- Configuração dos providers globais necessários.
- Inicialização dos estilos globais.
- Integração com as configurações do projeto.

### App.tsx

Responsável por:

- Organização principal da aplicação.
- Estruturação dos layouts.
- Integração com o roteamento.
- Composição dos componentes principais.
- Configurações gerais necessárias à árvore React.

### Regras

Não concentre funcionalidades de negócio, múltiplas páginas ou implementações extensas de componentes diretamente nesses arquivos.

Mantenha o `App.tsx` e o `main.tsx` organizados, enxutos e coerentes com a estrutura real da aplicação.

Caso a tecnologia existente utilize outro padrão de inicialização, como um entrypoint específico do framework, preserve o mecanismo correto.

---

## 10. ORGANIZAÇÃO DA PASTA PUBLIC

A pasta `public` deverá armazenar arquivos estáticos destinados ao carregamento direto pelo navegador.

Exemplos:

- `favicon.ico`
- Imagens públicas.
- Ícones.
- Fontes estáticas.
- Manifestos e outros recursos necessários à aplicação.

### Regras

1. Verifique todos os arquivos existentes em `public`.
2. Identifique arquivos necessários e arquivos obsoletos.
3. Mantenha os recursos estáticos corretamente organizados.
4. Preserve caminhos utilizados pela aplicação.
5. Atualize referências quando arquivos forem movidos.
6. Evite manter lógica de componentes React dentro de `public`.
7. Evite manter CSS específico de componentes dentro de `public`.
8. Evite manter o antigo `app.js` e `app.css` após a migração completa e validada.
9. Preserve manifestos e outras configurações que sejam efetivamente utilizadas.

### Localização do index.html

A localização do documento HTML principal deverá respeitar a ferramenta de build identificada.

**Create React App:**

```text
public/
├── favicon.ico
├── index.html
└── manifest.json
```

**Vite:**

```text
projeto/
├── index.html
├── public/
│   └── favicon.ico
└── src/
```

Não mova `index.html` para uma localização incompatível com a ferramenta de build utilizada.

---

## 11. ARQUIVOS PYTHON E BACKEND

Caso existam arquivos Python, como `app.py`, identifique suas responsabilidades antes de qualquer alteração.

O arquivo Python não deverá ser misturado à estrutura interna de componentes React.

Se ele pertencer a um backend, preserve sua organização, rotas, integrações e contratos.

Uma eventual reorganização do backend deverá respeitar sua tecnologia e arquitetura específicas.

**Não converta arquivos Python para TypeScript apenas para padronizar o frontend.**

A refatoração prioritária é do frontend. Alterações no backend somente deverão ocorrer quando forem estritamente necessárias para manter a integração funcional e deverão ser justificadas.

---

## 12. PADRONIZAÇÃO DE NOMENCLATURA

Adote convenções consistentes.

### Componentes React

Utilize PascalCase.

Exemplos:

```text
Button/
ProfessionalCard/
SchedulingModal/
```

### Hooks

Utilize nomes iniciados por `use`.

Exemplos:

```text
useAuth.ts
useScheduling.ts
useProfessionals.ts
```

### Serviços

Utilize nomes claros relacionados ao domínio.

Exemplos:

```text
authService.ts
schedulingService.ts
professionalService.ts
```

### Tipagens

Utilize nomes descritivos.

Exemplos:

```ts
interface ButtonProps {}

type ProfessionalStatus = "active" | "inactive";
```

### Importações

Utilize imports consistentes, evitando caminhos desnecessariamente complexos quando aliases já estiverem configurados.

Não altere nomes de contratos externos que possam comprometer a compatibilidade do sistema.

---

## 13. PRESERVAÇÃO DAS FUNCIONALIDADES EXISTENTES

Esta é uma das regras mais importantes.

**Nenhuma funcionalidade deverá ser removida, simplificada ou modificada sem necessidade técnica comprovada.**

Preserve integralmente:

- Autenticação e login.
- Logout.
- Controle de acesso.
- Navegação.
- Formulários.
- Validações.
- Cadastro, edição, exclusão e consulta de registros.
- Integrações com APIs.
- Estados e atualizações de interface.
- Agendamentos, calendários e horários, caso existam.
- Operações administrativas.
- Listagens, filtros e pesquisas.
- Modais e notificações.
- Persistência de dados.
- Armazenamento local utilizado pela aplicação.
- Permissões por perfil.
- Responsividade.
- Animações e interações.
- Regras de negócio e contratos existentes.

Esta lista é ilustrativa e não substitui a análise das funcionalidades reais do projeto.

Não adicione novas funcionalidades durante a refatoração, a menos que sejam estritamente necessárias para manter o comportamento original.

---

## 14. PRESERVAÇÃO DO DESIGN E DA EXPERIÊNCIA DO USUÁRIO

A interface atual está aprovada e deverá ser mantida.

A refatoração não autoriza alterações visuais.

Não modifique:

- Layouts.
- Cores.
- Fontes.
- Tamanhos.
- Espaçamentos.
- Sombras.
- Ícones.
- Componentes visuais.
- Posicionamentos.
- Transições.
- Animações.
- Experiência de navegação.
- Comportamentos responsivos.

A aplicação deverá apresentar o mesmo resultado visual antes e depois da refatoração.

Caso uma alteração visual mínima seja tecnicamente inevitável, documente a necessidade e priorize a solução que preserve o comportamento original.

---

## 15. LIMPEZA E QUALIDADE DO CÓDIGO

Durante a refatoração:

1. Identifique duplicações reais.
2. Extraia funcionalidades reutilizáveis quando apropriado.
3. Elimine imports não utilizados.
4. Elimine exports desnecessários.
5. Remova códigos mortos após confirmar que não são utilizados.
6. Evite funções excessivamente extensas.
7. Reduza acoplamentos desnecessários.
8. Separe responsabilidades.
9. Organize a tipagem.
10. Evite dependências circulares.
11. Preserve tratamentos de erros.
12. Mantenha nomenclatura coerente.
13. Preserve a semântica das operações.
14. Evite abstrações desnecessárias.
15. Evite introduzir dependências apenas para reorganização estética.

Priorize clareza, manutenção e compatibilidade.

Não faça alterações extensas fora do escopo aprovado.

---

## 16. COMPATIBILIDADE COM O PROJETO ATUAL

Antes de realizar alterações arquiteturais, verifique:

- `package.json`.
- Scripts de desenvolvimento.
- Scripts de build.
- Dependências instaladas.
- Versões do React.
- Configurações de TypeScript.
- Configurações de Vite ou da ferramenta utilizada.
- Variáveis de ambiente.
- Aliases de importação.
- Configurações de roteamento.
- Configurações de deploy.
- Integrações com backend.

Não atualize versões de bibliotecas sem necessidade.

Não substitua tecnologias estáveis apenas por preferência.

Caso Styled Components já esteja presente, utilize a biblioteca respeitando sua versão e suas APIs.

Caso outra abordagem de estilização esteja configurada, avalie a compatibilidade antes de qualquer migração.

Não altere contratos de API, nomes de variáveis de ambiente ou mecanismos de autenticação sem justificativa técnica.

---

## 17. ESTRATÉGIA DE IMPLEMENTAÇÃO

Execute a refatoração de forma controlada, por etapas.

### Etapa 1 — Diagnóstico

Mapeie os arquivos, componentes, estilos, scripts, páginas, integrações e funcionalidades existentes.

### Etapa 2 — Planejamento arquitetural

Defina a estrutura final e a responsabilidade de cada diretório.

### Etapa 3 — Preparação do TypeScript

Revise configurações, dependências e compatibilidade.

### Etapa 4 — Extração dos componentes

Identifique e organize os componentes em suas respectivas pastas.

### Etapa 5 — Migração do app.css

Distribua os estilos entre os arquivos específicos de cada componente.

### Etapa 6 — Migração do app.js

Separe e converta as funcionalidades para TypeScript, respeitando suas responsabilidades.

### Etapa 7 — Organização das páginas e rotas

Separe as páginas e preserve o fluxo de navegação.

### Etapa 8 — Organização dos arquivos principais

Revise a inicialização da aplicação e os arquivos App e main, ou equivalentes.

### Etapa 9 — Organização da pasta public

Organize os recursos estáticos e remova arquivos legados apenas quando estiverem completamente substituídos.

### Etapa 10 — Revisão das integrações

Verifique chamadas de API, autenticação, armazenamento local e comunicação com backend.

### Etapa 11 — Validação técnica

Execute as verificações e correções necessárias.

### Etapa 12 — Limpeza final

Remova duplicações, dependências e arquivos obsoletos confirmados.

Ao concluir cada etapa, mantenha o projeto em um estado consistente, evitando acumular erros de várias alterações simultâneas.

---

## 18. VALIDAÇÃO OBRIGATÓRIA

A refatoração somente será considerada concluída após as verificações aplicáveis.

### Validação de TypeScript

Verifique se o código compila sem erros de tipagem.

### Validação do build

Execute o comando de build correto do projeto e confirme sua conclusão.

### Validação de lint

Execute o lint quando estiver configurado.

### Validação das funcionalidades

Verifique todos os fluxos relevantes existentes, especialmente autenticação, navegação, formulários, APIs, calendários e operações administrativas.

### Validação visual

Compare as interfaces antes e depois da refatoração.

Verifique principalmente:

- Desktop.
- Tablet.
- Mobile.
- Modais.
- Menus.
- Formulários.
- Tabelas.
- Estados de interação.
- Responsividade.

### Validação dos arquivos migrados

Confirme que:

- Os estilos do antigo `app.css` foram migrados.
- Os scripts do antigo `app.js` foram migrados.
- Não existem funcionalidades duplicadas.
- Não existem referências quebradas.
- Não existem imports inválidos.
- Não existem componentes dependentes de arquivos removidos.
- Não existem erros de execução decorrentes da refatoração.

Não declare que testes foram aprovados se eles não foram efetivamente executados.

Caso algum teste não possa ser realizado, registre claramente a limitação.

---

## 19. CRITÉRIOS DE ACEITAÇÃO

A refatoração deverá atender aos seguintes critérios:

- [ ] Arquitetura organizada em React + TypeScript.
- [ ] Componentes reutilizáveis em `src/components`.
- [ ] Cada componente com sua pasta própria.
- [ ] Arquivos `index.tsx` devidamente estruturados.
- [ ] Arquivos `styles.tsx` ou `styles.ts` específicos por componente.
- [ ] Arquivos `types.ts` quando necessários.
- [ ] Código de aplicação migrado de JavaScript para TypeScript.
- [ ] `app.css` distribuído corretamente entre os componentes.
- [ ] `app.js` dividido entre os módulos apropriados.
- [ ] Pasta `src/scripts` criada quando necessária.
- [ ] Scripts documentados com suas responsabilidades.
- [ ] Páginas organizadas.
- [ ] Hooks organizados.
- [ ] Serviços organizados.
- [ ] Rotas preservadas.
- [ ] App e main organizados conforme o framework.
- [ ] Pasta `public` organizada corretamente.
- [ ] HTML principal na localização compatível com a ferramenta de build.
- [ ] Nenhuma funcionalidade removida.
- [ ] Nenhuma regra de negócio alterada.
- [ ] Design original preservado.
- [ ] Responsividade preservada.
- [ ] Integrações preservadas.
- [ ] Arquivos legados removidos somente após validação.
- [ ] Build e verificações técnicas executados quando disponíveis.
- [ ] Código final organizado e documentado.

---

## 20. DOCUMENTAÇÃO FINAL

Ao concluir a implementação, apresente um relatório contendo:

### A. Estrutura final

Mostre a árvore real de diretórios e arquivos após a refatoração.

### B. Componentes

Informe os componentes identificados, extraídos e reorganizados.

### C. Migração do CSS

Explique como o conteúdo de `public/barber/app.css` foi distribuído entre os componentes e quais estilos permaneceram globais.

### D. Migração do JavaScript

Explique como as responsabilidades de `public/barber/app.js` foram distribuídas.

### E. Scripts

Liste os scripts criados e suas responsabilidades.

### F. TypeScript

Descreva as principais conversões e os contratos de tipagem organizados.

### G. Arquivos removidos

Informe quais arquivos legados foram removidos e por quê.

### H. Compatibilidade

Descreva como foram preservadas as integrações, rotas, funcionalidades e regras de negócio.

### I. Testes e validações

Informe quais verificações foram realmente executadas, quais passaram e quais não puderam ser realizadas.

### J. Pendências

Registre eventuais limitações ou problemas identificados, sem ocultar falhas existentes.

---

## 21. RESTRIÇÕES ABSOLUTAS

Durante toda a execução, é proibido:

1. Recriar o sistema do zero sem necessidade.
2. Modificar o design aprovado.
3. Remover funcionalidades existentes.
4. Alterar regras de negócio.
5. Substituir o React ou trocar a ferramenta de build sem necessidade.
6. Criar componentes fictícios.
7. Introduzir novas dependências sem justificativa.
8. Concentrar novamente todo o CSS em um arquivo global.
9. Concentrar novamente toda a lógica em um único arquivo.
10. Migrar JavaScript para TypeScript apenas renomeando extensões.
11. Ignorar erros de TypeScript para concluir a migração artificialmente.
12. Remover arquivos antes de verificar suas dependências.
13. Alterar contratos de backend sem necessidade.
14. Deixar funcionalidades duplicadas entre a implementação antiga e a nova.
15. Apresentar como concluída uma etapa que não foi validada.

---

## 22. RESULTADO FINAL ESPERADO

Ao final, o projeto deverá possuir uma arquitetura frontend profissional, modular e totalmente organizada.

Cada componente deverá ser responsável por sua própria interface, comportamento e estilização.

Os estilos anteriormente concentrados em `public/barber/app.css` deverão estar distribuídos corretamente, mantendo apenas as definições realmente globais em sua camada correspondente.

As funcionalidades anteriormente concentradas em `public/barber/app.js` deverão estar organizadas entre componentes, hooks, services, scripts, utils e demais módulos adequados.

O código-fonte frontend deverá utilizar TypeScript, com interfaces e tipos coerentes.

Os arquivos principais deverão conter somente as responsabilidades necessárias à inicialização e composição da aplicação.

A pasta `public` deverá conter recursos estáticos organizados corretamente.

A aplicação deverá continuar funcionando com suas funcionalidades, regras de negócio, integrações, design e comportamento originais preservados.

**DIRETRIZ FINAL: PRIORIZE UMA REFATORAÇÃO ARQUITETURAL COMPLETA, SEGURA E PROFISSIONAL, SEM COMPROMETER A ESTABILIDADE DO SISTEMA EXISTENTE.**

Não se limite a reorganizar arquivos superficialmente. Analise a implementação real, distribua adequadamente as responsabilidades, preserve a compatibilidade e valide o resultado.

Execute a refatoração nos arquivos reais do projeto, respeitando as tecnologias e configurações existentes, e apresente ao final a estrutura implementada e os resultados das verificações.