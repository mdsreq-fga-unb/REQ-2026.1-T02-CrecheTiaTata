-- RF-05: Registrar Doador
-- Tabela de doadores (base de apoiadores da creche).
create extension if not exists pgcrypto;

create table if not exists public.doadores (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  tipo text not null default 'pessoa_fisica',
  email text,
  telefone text,
  created_at timestamptz not null default now()
);

alter table public.doadores
  drop constraint if exists doadores_tipo_check;

alter table public.doadores
  add constraint doadores_tipo_check
  check (tipo in ('pessoa_fisica', 'pessoa_juridica'));
