-- RF-02: Registrar Doação
-- Tabela de doações recebidas pela creche.
create table if not exists public.doacoes (
  id uuid primary key default gen_random_uuid(),
  doador_nome text,
  tipo text not null,
  descricao text not null,
  quantidade integer not null default 1 check (quantidade > 0),
  data_doacao date not null default current_date,
  created_at timestamptz not null default now()
);

alter table public.doacoes
  drop constraint if exists doacoes_tipo_check;

alter table public.doacoes
  add constraint doacoes_tipo_check
  check (tipo in ('dinheiro', 'alimento', 'roupa', 'brinquedo', 'material', 'outro'));
