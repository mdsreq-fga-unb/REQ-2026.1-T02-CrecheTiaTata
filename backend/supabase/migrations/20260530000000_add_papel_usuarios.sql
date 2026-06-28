-- RF-01: Autenticar Administrador
-- Adiciona o papel do usuário para distinguir administradores dos demais.
alter table public.usuarios
  add column if not exists papel text not null default 'usuario';

alter table public.usuarios
  drop constraint if exists usuarios_papel_check;

alter table public.usuarios
  add constraint usuarios_papel_check check (papel in ('admin', 'usuario'));
