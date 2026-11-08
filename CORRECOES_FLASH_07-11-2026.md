# BarberFlow — correção do "flash" e ajustes (07/11/2026)

## Causa do flash
1. Cada clique chamava `render()`, que trocava o `innerHTML` de **toda** a tela. Todos os elementos eram recriados e a animação de entrada (`bfFadeUp`, que começava em `opacity: 0`) recomeçava a cada clique: a tela escurecia e voltava (medido no vídeo: queda de brilho a cada clique).
2. Ao abrir `/login` já logado com o tema claro, a página aparecia escura e só virava clara depois de carregar os dados (e o `body` ainda fazia uma transição lenta de escuro para claro).
3. Ao ir do site (escuro) para a Gestão (clara), o fundo do `body` mudava devagar enquanto o conteúdo trocava na hora.

## O que foi feito (sem mudar o fluxo)
- `public/barber/app.js`: o `render()` agora **compara** o novo HTML com o DOM atual e altera só o que mudou (`morphHTML`). Elementos iguais permanecem: sem recriar, sem reiniciar animação, sem perder foco, rolagem ou imagens. Só uma troca real de tela (site/agendamento/login/painel) recria o DOM, com entrada suave (opacidade de 0,8 a 1 em 0,26 s). A troca de seção do painel e de etapa do agendamento tem fade curto.
- `public/barber/app.css`: a animação de entrada deixou de ser aplicada a toda renderização (agora é a classe `.bf-enter`, aplicada pelo JS); `body` saiu da lista de transições de cor; indicador de carregamento enquanto o app inicia (antes era tela vazia).
- `src/routes/__root.tsx`: script mínimo que aplica o tema claro **antes da primeira pintura** em `/login` quando há sessão.
- `src/components/BarberApp/index.tsx`:
  - **Bug:** o "Sair da gestão" enviava `POST /logout` sem `Content-Type` e o servidor respondia 415; a sessão nunca era encerrada no servidor. Corrigido; o token local é apagado mesmo se o servidor estiver fora.
  - Falha de rede agora mostra mensagem em português ("Não foi possível conectar ao servidor...") em vez de "Failed to fetch".
  - `#app`, `#overlay` e `#toastbox` viraram `div` simples: some o aviso de hidratação do React no console.
  - Corrigidos 3 erros de TypeScript que já existiam (`tsc --noEmit` agora passa).
- `src/barber/components/Button/index.tsx`: erro de tipo (`$block`).
- Acessibilidade: os cards de serviço (`role="checkbox"`) agora respondem a Enter/Espaço; item ativo do menu recebe `aria-current`.

## Verificação
Fluxo completo testado em navegador real (Chromium) em 360, 390, 768 e 1440 px: agendamento até a confirmação, login, as 10 seções do painel, filtros, tema, menu mobile e logout. Sem erro de JS, sem rolagem horizontal, sem resposta 4xx. `npm test` (frontend e backend), `tsc --noEmit` e `vite build` passam.

---

# Rodada 2 — melhorias aprovadas e aba Calendário

## Requisições e erros (melhoria 1 e 2)
- Leituras (`GET`) e a gravação do estado do painel (`PUT`, idempotente) são repetidas até 2 vezes com espera crescente em falha de rede, timeout ou 5xx. Criar agendamento (`POST`) **nunca** é repetido, para não duplicar reserva.
- Cada requisição tem tempo limite; a abertura do painel faz uma única leitura de `/admin/state` (antes eram duas).
- Conflito de horário (409): o aviso mostra o motivo real do servidor, volta para a escolha de data/horário e atualiza a disponibilidade. Em falha de rede os dados digitados são mantidos.
- Sessão recusada pelo servidor (401): volta ao site público com o aviso "Sua sessão expirou". Falha de rede na abertura não apaga a sessão.

## Ícones dos serviços (melhoria 3)
O ícone escolhido no cadastro do serviço agora aparece no site do cliente.

## Aba Calendário (nova)
- Menu lateral → **Calendário**: calendário mensal com todos os agendamentos, sem separar por funcionário. Cada item mostra horário, cliente, telefone, serviço e profissional; as cores indicam confirmado, pendente e concluído.
- Clicar num dia/item abre os detalhes no modal padrão. Navegação por mês/ano e botão "Hoje".
- Botão **Maximizar**: tela cheia (esc ou "Minimizar" para sair). Responsivo (360 px a desktop).

## Limpeza (melhoria 6)
Código formatado (Prettier) e código morto removido. Mantidos de propósito: credenciais de teste pré-preenchidas no login (projeto em desenvolvimento) e agenda clara no tema escuro.

## Verificação
Testes de fluxo, mobile, calendário, tema e das melhorias 1–3 em Chromium; `tsc`, vitest (9/9) e testes do backend passam.
