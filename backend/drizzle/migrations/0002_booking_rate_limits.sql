-- Limite de reservas do site público por conexão: 5 por hora por IP (regra em
-- frontend/src/lib/barber-rules.ts). Guarda só um HMAC do IP, nunca o IP em texto.
-- Acesso exclusivo do servidor (service_role): RLS ligada e sem políticas.
create table if not exists public.booking_rate_limits (
  id bigint generated always as identity primary key,
  ip_hash text not null,
  created_at timestamptz not null default now()
);
--> statement-breakpoint
create index if not exists booking_rate_limits_ip_time on public.booking_rate_limits (ip_hash, created_at);
--> statement-breakpoint
alter table public.booking_rate_limits enable row level security;
--> statement-breakpoint
revoke all on public.booking_rate_limits from anon, authenticated;
--> statement-breakpoint
grant all on public.booking_rate_limits to service_role;
