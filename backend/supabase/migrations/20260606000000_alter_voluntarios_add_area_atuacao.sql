-- RF-11: Listar Voluntários com filtro por área de atuação
alter table public.voluntarios
  add column if not exists area_atuacao text null;
