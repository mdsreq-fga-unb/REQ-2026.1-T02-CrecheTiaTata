---
sidebar_label: "8.1 Funcionais"
sidebar_position: 1
description: Lista de requisitos funcionais do sistema da Creche da Tia Tata.
---

# 8.1 Requisitos Funcionais

> **Total:** 27 Requisitos Funcionais (RF-01 a RF-27). O **MVP** contempla 18 RFs priorizados — ver [Andamento do Projeto](../../evidencias/Andamento-do-projeto.md) e [Lista de Itens de Trabalho](../j-backlog.md).
>
> **RF-01 vs RF-27:** RF-01 autentica especificamente o administrador para acesso à área de gestão. RF-27 é o login geral para qualquer usuário cadastrado (doadores, voluntários, administradores) e está fora do MVP atual.

## Autenticação

| ID | Descrição |
|---|---|
| **RF-01** | **Autenticar Administrador** — O sistema deve permitir que o administrador acesse as funcionalidades de gestão mediante a confirmação de suas credenciais, garantindo que apenas usuários autorizados consigam prosseguir para as áreas restritas do sistema. |
| **RF-27** | **Login de Usuário** — O sistema deve permitir que usuários previamente cadastrados (doadores, voluntários e administradores) realizem autenticação por meio de e-mail e senha para acessar as funcionalidades correspondentes ao seu perfil. |

## Gestão de Doações

| ID | Descrição |
|---|---|
| **RF-02** | **Registrar Doação** — O sistema deve permitir o registro de doações por meio do preenchimento das informações necessárias relacionadas ao doador e à doação, garantindo que os dados sejam armazenados e possam ser consultados posteriormente no sistema. |
| **RF-03** | **Listar Doações** — O sistema deve apresentar ao usuário a relação de doações registradas, permitindo a aplicação de filtros para refinar os resultados exibidos, de forma que a consulta seja ágil e os dados estejam organizados de maneira compreensível. |
| **RF-04** | **Editar Doação** — O sistema deve permitir que o usuário altere as informações de uma doação já registrada, mantendo um registro das modificações realizadas para fins de rastreabilidade. |

## Gestão de Doadores

| ID | Descrição |
|---|---|
| **RF-05** | **Registrar Doador** — O sistema deve permitir o cadastro de novos doadores mediante o preenchimento das informações de identificação e contato necessárias, garantindo que os dados fiquem disponíveis para consultas e associações futuras. |
| **RF-06** | **Listar Doadores** — O sistema deve apresentar a relação de doadores cadastrados, permitindo a aplicação de filtros e o acesso ao histórico de contribuições de cada um, de modo a facilitar o acompanhamento e a gestão dos doadores pela organização. |

## Gestão de Entregas

| ID | Descrição |
|---|---|
| **RF-07** | **Registrar Entrega** — O sistema deve permitir o registro de entregas realizadas pela organização, armazenando as informações relativas ao item, à quantidade e à data correspondente, de forma que os dados fiquem disponíveis para consulta posterior. |
| **RF-08** | **Listar Entregas** — O sistema deve apresentar a relação de entregas registradas, permitindo a aplicação de filtros para facilitar a localização de registros específicos conforme a necessidade do usuário. |

## Gestão de Voluntários

| ID | Descrição |
|---|---|
| **RF-09** | **Registrar Voluntário** — O sistema deve permitir o cadastro de novos voluntários mediante o preenchimento das informações de identificação, contato e área de atuação, garantindo que os dados fiquem disponíveis para consultas e alocações futuras. |
| **RF-10** | **Listar Voluntários** — O sistema deve apresentar a relação de voluntários cadastrados, permitindo a aplicação de filtros para localizar registros com base em critérios como nome e área de atuação. |
| **RF-22** | **Excluir Voluntário** — O sistema deve permitir que o administrador remova o cadastro de um voluntário, garantindo que a operação seja verificada em relação a vínculos existentes antes de ser concluída. |
| **RF-23** | **Desalocar Voluntário de Tarefa** — O sistema deve permitir que o administrador desfaça a alocação de um voluntário em uma tarefa ou evento específico, exigindo que o motivo da desalocação seja informado e registrando a operação para fins de rastreabilidade. |
| **RF-24** | **Editar Dados do Voluntário** — O sistema deve permitir que o administrador atualize as informações cadastrais de um voluntário, mantendo um registro das alterações realizadas para fins de rastreabilidade. |
| **RF-25** | **Visualizar Histórico do Voluntário** — O sistema deve apresentar o histórico de participações de um voluntário, reunindo as informações relativas aos eventos em que atuou e às ocorrências de desalocação, de forma que o administrador tenha uma visão completa de sua trajetória na organização. |
| **RF-26** | **Gerar Relatório de Participação** — O sistema deve permitir a geração de um relatório consolidado sobre a participação dos voluntários em um período determinado, reunindo as informações necessárias para análise e disponibilizando o resultado em formato adequado para exportação. |

## Disponibilidade e Escala

| ID | Descrição |
|---|---|
| **RF-11** | **Registrar Disponibilidade** — O sistema deve permitir o registro dos períodos em que um voluntário está disponível para atuação, informando os dias da semana e os intervalos de horário correspondentes, de modo que essas informações possam ser consideradas na alocação de tarefas e eventos. |
| **RF-12** | **Editar Disponibilidade** — O sistema deve permitir que as informações de disponibilidade de um voluntário sejam alteradas ou removidas, refletindo eventuais mudanças na agenda do voluntário e mantendo os dados atualizados para fins de alocação. |
| **RF-13** | **Gerar Escala** — O sistema deve permitir a geração de escalas de voluntários para eventos, considerando as disponibilidades previamente registradas e impedindo a alocação de voluntários em situações de conflito de horário. |

## Gestão de Eventos

| ID | Descrição |
|---|---|
| **RF-14** | **Registrar Evento** — O sistema deve permitir o cadastro de eventos promovidos pela organização, reunindo as informações necessárias para identificação, localização e controle de horários, garantindo que os dados fiquem disponíveis para consulta e gerenciamento. |
| **RF-15** | **Listar Eventos** — O sistema deve apresentar a relação de eventos cadastrados, permitindo a aplicação de filtros por período e situação atual do evento, de forma que o usuário consiga localizar e acompanhar os eventos de interesse. |
| **RF-16** | **Associar Voluntário a Evento** — O sistema deve permitir a vinculação de voluntários a eventos cadastrados, considerando as disponibilidades registradas de cada voluntário para garantir que a alocação seja compatível com sua agenda. |
| **RF-17** | **Registrar Recursos por Evento** — O sistema deve permitir o registro dos recursos utilizados em cada evento, contemplando as doações consumidas e os voluntários alocados, de modo que seja possível acompanhar o que foi empregado em cada ocasião. |
| **RF-18** | **Exibir Resumo de Recursos por Evento** — O sistema deve apresentar, para cada evento, uma visão consolidada dos recursos utilizados, permitindo que o usuário visualize de forma rápida o total de doações consumidas e o número de voluntários envolvidos. |

## Página Pública

| ID | Descrição |
|---|---|
| **RF-19** | **Página Institucional Pública** — O sistema deve disponibilizar na página pública as informações que apresentam a organização ao público, incluindo sua identidade, propósito, canais de contato, localização física com mapa, e vídeos relacionados às ações realizadas, identificados por título e data de publicação. |
| **RF-20** | **Publicar Solicitação de Apoio** — O sistema deve permitir a publicação de solicitações de apoio na página pública, informando o tipo de contribuição esperada, o prazo e o grau de urgência, de modo que interessados em colaborar possam identificar as necessidades da organização. |
| **RF-21** | **Listar Solicitações de Apoio** — O sistema deve apresentar na página pública as solicitações de apoio ativas, organizadas de forma que as mais urgentes e recentes sejam destacadas, facilitando a identificação das demandas prioritárias pelos visitantes. |
