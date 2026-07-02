-- RF-04: Rastreabilidade de edições em doações
create table if not exists public.doacoes_historico (
  id uuid primary key default gen_random_uuid(),
  doacao_id uuid not null,
  alterado_por uuid null,
  dados_anteriores jsonb not null,
  dados_novos jsonb not null,
  campos_alterados text[] not null default '{}',
  criado_em timestamptz not null default now()
);

alter table public.doacoes_historico
  drop constraint if exists doacoes_historico_doacao_id_fkey;

alter table public.doacoes_historico
  add constraint doacoes_historico_doacao_id_fkey
  foreign key (doacao_id) references public.doacoes(id)
  on delete cascade;
