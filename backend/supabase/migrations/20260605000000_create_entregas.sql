-- RF-07 e RF-08: Registrar e Listar Entregas
create table if not exists public.entregas (
  id uuid primary key default gen_random_uuid(),
  item text not null,
  quantidade integer not null check (quantidade > 0),
  data_entrega date not null,
  destinatario text null,
  observacoes text null,
  created_at timestamptz not null default now()
);
