-- RF-06: Listar Doadores
create table if not exists public.doadores (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  email text null,
  telefone text null,
  tipo text null,
  created_at timestamptz not null default now()
);
