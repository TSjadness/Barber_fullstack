# Dados de desenvolvimento

`db.json` é o seed inicial derivado do `INSERT` presente na migration original do Supabase. É usado pelo backend em `npm run db:seed` para popular o SQLite local **somente quando ainda não existir estado**.

O banco persistente não fica aqui: está em `backend/data/barberflow.sqlite` (ignorado pelo Git). Alterar `db.json` não altera o banco já existente. Para recriar os dados a partir do seed, faça o reset explícito descrito no README da raiz.

Este seed não contém os dados reais de produção ou de teste salvos na Lovable.
