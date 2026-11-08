create type public.app_role as enum ('owner');
create table public.user_roles (id uuid primary key default gen_random_uuid(), user_id uuid references auth.users(id) on delete cascade not null, role app_role not null, unique(user_id, role));
grant select on public.user_roles to authenticated; grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;
create policy "own roles" on public.user_roles for select to authenticated using (user_id = auth.uid());

create or replace function public.has_role(_user_id uuid, _role app_role) returns boolean language sql stable security definer set search_path=public as $$ select exists(select 1 from public.user_roles where user_id=_user_id and role=_role) $$;

-- first account created becomes the shop owner
create or replace function public.assign_first_owner() returns trigger language plpgsql security definer set search_path=public as $$
begin
  perform pg_advisory_xact_lock(424242);
  if not exists (select 1 from public.user_roles where role='owner') then
    insert into public.user_roles(user_id, role) values (new.id, 'owner');
  end if;
  return new;
end $$;
create trigger on_auth_user_created_owner after insert on auth.users for each row execute function public.assign_first_owner();

create table public.app_state (id int primary key default 1 check (id=1), shop jsonb not null, services jsonb not null, staff jsonb not null, notices jsonb not null default '[]', payments jsonb not null default '[]', updated_at timestamptz not null default now());
grant select, update on public.app_state to authenticated; grant all on public.app_state to service_role;
alter table public.app_state enable row level security;
create policy "owner reads state" on public.app_state for select to authenticated using (public.has_role(auth.uid(),'owner'));
create policy "owner updates state" on public.app_state for update to authenticated using (public.has_role(auth.uid(),'owner'));

create table public.bookings (id text primary key, date text not null, time text not null, staff_id text not null, service_id text not null, status text not null default 'confirmado', data jsonb not null, created_at timestamptz not null default now());
create index bookings_staff_date on public.bookings(staff_id, date);
grant select, insert, update, delete on public.bookings to authenticated; grant all on public.bookings to service_role;
alter table public.bookings enable row level security;
create policy "owner manages bookings" on public.bookings for all to authenticated using (public.has_role(auth.uid(),'owner')) with check (public.has_role(auth.uid(),'owner'));

insert into public.app_state(id, shop, services, staff, notices) values (1,
 '{"name":"Áureo Barber","tagline":"Tradição no corte. Excelência nos detalhes.","whatsapp":"","address":"Seu espaço, sua experiência."}',
 '[{"id":"s1","name":"Corte masculino","duration":30,"price":40,"icon":"✂️","active":true},{"id":"s2","name":"Barba","duration":30,"price":30,"icon":"🪒","active":true},{"id":"s3","name":"Cabelo + barba","duration":60,"price":65,"icon":"💈","active":true},{"id":"s4","name":"Acabamento","duration":20,"price":20,"icon":"✨","active":true}]',
 '[{"id":"p1","name":"Lucas Oliveira","role":"Proprietário • Barbeiro","start":"09:00","end":"18:00","days":[1,2,3,4,5,6],"active":true},{"id":"p2","name":"Rafael Santos","role":"Barbeiro","start":"10:00","end":"19:00","days":[2,3,4,5,6],"active":true}]',
 '[]');