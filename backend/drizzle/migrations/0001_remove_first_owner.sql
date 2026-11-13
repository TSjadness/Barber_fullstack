-- Remove o "primeiro dono automático": antes, a primeira conta criada no Auth virava
-- proprietária enquanto não existisse dono (risco de tomada de controle se a tabela
-- user_roles ficasse vazia). O dono atual em user_roles NÃO é alterado.
-- Um novo dono, se um dia for necessário, é criado manualmente:
--   insert into public.user_roles(user_id, role)
--   select id, 'owner' from auth.users where email = '<e-mail do dono>';
drop trigger if exists on_auth_user_created_owner on auth.users;
--> statement-breakpoint
drop function if exists public.assign_first_owner();
