---
sidebar_label: "8.1 Funcionais"
sidebar_position: 1
description: Catálogo de requisitos funcionais do sistema da Creche da Tia Tata.
---

# 8.1 Requisitos Funcionais

Catálogo de requisitos funcionais do sistema da Creche da Tia Tata.

| RF | Nome | Descrição |
|---|---|---|
| RF-01 | Autenticar Administrador | Autenticar o administrador mediante e-mail e senha, gerando token JWT para acesso à área restrita. |
| RF-27 | Autenticar Usuário | Autenticar usuários cadastrados por e-mail e senha, retornando token JWT e perfil de acesso. |
| RF-02 | Registrar Doação | Registrar doações recebidas, armazenando tipo, quantidade e data para controle de contribuições. |
| RF-03 | Listar Doações | Listar as doações registradas, possibilitando consulta do histórico com suporte a filtros. |
| RF-04 | Editar Doação | Editar registros de doação para correção de informações incorretas. |
| RF-05 | Registrar Doador | Registrar doadores com informações de identificação e contato para manutenção da base de apoiadores. |
| RF-06 | Listar Doadores | Listar doadores cadastrados para consulta e gerenciamento dos apoiadores da creche. |
| RF-07 | Registrar Entrega | Registrar entregas realizadas, armazenando destinatário, itens e data para rastreamento da distribuição. |
| RF-08 | Listar Entregas | Listar entregas registradas para acompanhamento da distribuição de doações. |
| RF-09 | Registrar Voluntário | Registrar voluntários com dados de identificação, contato e área de atuação. |
| RF-10 | Listar Voluntários | Listar voluntários cadastrados para visualização e gerenciamento da equipe de apoio. |
| RF-22 | Excluir Voluntário | Excluir o cadastro de voluntário, verificando vínculos ativos antes de concluir a operação. |
| RF-23 | Desalocar Voluntário de Evento | Desfazer a alocação de voluntário em evento específico para ajuste de escala. |
| RF-24 | Editar Dados do Voluntário | Editar informações cadastrais de voluntários para manter os dados atualizados. |
| RF-25 | Visualizar Histórico do Voluntário | Visualizar o histórico de participações de um voluntário em eventos e atividades da creche. |
| RF-26 | Gerar Relatório de Participação | Gerar relatório consolidado de participação de voluntários em período determinado. |
| RF-11 | Registrar Disponibilidade | Registrar os períodos de disponibilidade de voluntários, informando dias e horários para planejamento de escalas. |
| RF-12 | Editar Disponibilidade | Editar informações de disponibilidade de voluntários para manter dados atualizados para alocação. |
| RF-13 | Gerar Escala | Gerar escalas automáticas de voluntários para eventos, considerando disponibilidades e impedindo conflitos de horário. |
| RF-14 | Registrar Evento | Registrar eventos com informações de identificação, data e localização para planejamento das atividades. |
| RF-15 | Listar Eventos | Listar eventos cadastrados com filtros por período e situação para acompanhamento da agenda. |
| RF-16 | Associar Voluntário a Evento | Associar voluntários a eventos para garantir cobertura das atividades planejadas. |
| RF-17 | Registrar Recursos por Evento | Registrar os recursos necessários por evento, informando tipo e quantidade para controle. |
| RF-18 | Exibir Resumo de Recursos por Evento | Exibir visão consolidada dos recursos de um evento com totais por tipo para apoiar o planejamento. |
| RF-19 | Exibir Página Institucional Pública | Disponibilizar página pública com missão, formas de contato e localização, sem exigir autenticação. |
| RF-20 | Publicar Solicitação de Apoio | Publicar solicitações de apoio na página pública com título, descrição e categoria para captação de apoiadores. |
| RF-21 | Listar Solicitações de Apoio | Listar solicitações de apoio ativas na página pública com filtros por status e categoria, sem autenticação. |
