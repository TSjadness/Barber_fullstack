# BarberFlow / Áureo Barber — projeto full stack local

Protótipo funcional de agendamentos de barbearia com site público, gestão administrativa e API Node.js. Interface preto/dourado, calendário com cores e horários semanais individuais. A interface reutiliza o preview aprovado, com integração real via HTTP.

## Requisitos

- Node.js 20 ou superior
- Nenhuma dependência externa e nenhum `npm install` necessário

## Iniciar no Windows, Mac ou Linux

Abra **dois terminais** na pasta do projeto.

**Terminal 1 — API**
```bash
cd backend
npm start
```

**Terminal 2 — site**
```bash
cd frontend
npm start
```

Visite **http://localhost:5173**. O backend usa **http://localhost:3333**.

Conta inicial **somente para desenvolvimento**:
- Email: `admin@aureobarber.local`
- Senha: `Admin@12345`

Altere o email e senha em `backend/.env` **antes da primeira inicialização**. O usuário é criado no primeiro boot e salvo em `backend/data/database.json`; mudanças posteriores no `.env` não alteram uma conta existente.

## Organização

```text
barberflow-fullstack/
  frontend/
    index.html       # site do cliente + painel da gestão
    server.js        # servidor web estático local
    .env             # VITE_API_URL=http://localhost:3333/api
    .env.example
    package.json
  backend/
    src/server.js    # API, autenticação, regras de agenda e persistência
    data/            # JSON persistente criado automaticamente
    .env             # PORT, FRONTEND_ORIGIN, ADMIN_EMAIL, ADMIN_PASSWORD
    .env.example
    package.json
```

## Rotas

- `GET /api/health` verifica conectividade
- `GET /api/public` retorna catálogo, agenda ocupada (sem telefones) e avisos
- `POST /api/bookings` cria um agendamento com checagem de conflitos no servidor
- `POST /api/login` autentica o proprietário
- `POST /api/logout` encerra a sessão
- `GET /api/admin/state` lê dados completos (token requerido)
- `PUT /api/admin/state` persiste a administração (token requerido)

## Como testar

1. Inicie ambos os servidores e abra o site.
2. Clique em **Gestão** e entre com a conta de teste.
3. Edite **Horários da semana**, serviços ou aviso de fechamento.
4. Clique em **Site do cliente** e agende um horário livre.
5. Volte a **Gestão → Agendamentos** para visualizar e marcar como pago.
6. Recarregue a página para verificar a persistência no backend.
7. Abra uma aba anônima para testar o site público sem autenticação.

## Limites desta versão

Este é um projeto full stack local de validação, não uma implantação pronta para produção. O JSON é persistente, mas não oferece transações multi-processo, versionamento de alterações nem proteção contra gravações concorrentes entre dois administradores. A administração usa atualização do estado completo, adequada apenas a uma demonstração local com um gestor de cada vez. A checagem de conflitos é feita no backend de processo único. Não há recuperação de senha, auditoria, rate limiting distribuído, integração WhatsApp, pagamentos online nem banco SQL. A sessão fica em `sessionStorage`, expira em 8 horas e o login é limitado ao proprietário cadastrado. Não publique a API na internet sem evoluir autenticação, controle de acesso, banco de dados, logs e proteção contra abuso.

O frontend atual é HTML/CSS/JS sem framework para manter o preview visual e permitir rodar imediatamente. Uma futura migração para React + TypeScript e módulos separados está indicada no prompt do preview, mas **não foi implementada nesta entrega**.

## Atualização visual — versão premium aprovada

- **Visão Geral:** quatro KPIs essenciais, cinco próximos atendimentos clicáveis, faturamento semanal e ações rápidas. Sem calendário duplicado.
- **Agenda:** quadro claro com profissionais em colunas dentro do painel escuro, navegação de datas, cartões por status e rolagem horizontal com coluna de horário fixa.
- **Detalhes:** clique em um atendimento para alterar o status/pagamento, editar dados ou cancelar logicamente (preserva histórico). A edição local confere o expediente e possíveis colisões antes de enviar uma atualização ao backend.
- **Financeiro:** exporta CSV UTF-8 com BOM e separador `;` que pode ser aberto no Microsoft Excel. A importação permite selecionar e inspecionar CSV exportado, mas **não grava** automaticamente: ainda requer módulo de conciliação e validação de registros. Não é exportação `.xlsx` nativa.
- **Site do cliente:** mantém serviço → profissional ou sem preferência → calendário por disponibilidade → confirmação com sobreposição.

### Limites da versão

Projeto local para demonstração e desenvolvimento. O backend persiste em JSON e o painel usa uma atualização administrativa do estado completo. **Não é indicado para hospedagem pública, múltiplos administradores simultâneos ou uso comercial sem revisão de segurança, validação transacional de atualizações, permissões, testes de navegador e banco de dados.** Também não há disparo real pelo WhatsApp, integração financeira nem cobrança. As fontes externas e a fotografia do hero necessitam de acesso à internet; caso contrário, permanece um fundo escuro legível.

### Validação efetuada

- Sintaxe JavaScript e inicialização de frontend/backend.
- GET `/api/health` e autenticação com as credenciais locais.
- Carregamento HTTP do arquivo frontend.

Não foram realizados testes E2E em navegador nesta entrega. A aparência segue o estilo dos previews aprovados, mas não representa uma reprodução pixel a pixel da imagem gerada.
"# Petshop_fullstack" 
