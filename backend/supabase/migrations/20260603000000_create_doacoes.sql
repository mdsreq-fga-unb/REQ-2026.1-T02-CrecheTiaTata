-- RF-03 e RF-04: Listar e Editar Doações
create table if not exists public.doacoes (
  id uuid primary key default gen_random_uuid(),
  doador_id uuid null,
  tipo text null,
  item text not null,
  descricao text null,
  quantidade integer not null check (quantidade > 0),
  data_doacao date not null,
  observacoes text null,
  created_at timestamptz not null default now(),
  updated_at timestamptz null
);
