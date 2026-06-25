-- RF-20: Publicar Solicitação de Apoio
-- Tabela de solicitações de apoio publicadas pela creche.
create table if not exists public.solicitacoes_apoio (
  id uuid primary key default gen_random_uuid(),
  titulo text not null,
  descricao text not null,
  categoria text not null,
  status text not null default 'pendente',
  created_at timestamptz not null default now()
);

alter table public.solicitacoes_apoio
  drop constraint if exists solicitacoes_apoio_categoria_check;

alter table public.solicitacoes_apoio
  add constraint solicitacoes_apoio_categoria_check
  check (categoria in ('alimentacao', 'material', 'voluntario', 'financeiro', 'outro'));

alter table public.solicitacoes_apoio
  drop constraint if exists solicitacoes_apoio_status_check;

alter table public.solicitacoes_apoio
  add constraint solicitacoes_apoio_status_check
  check (status in ('pendente', 'em_andamento', 'concluida'));
