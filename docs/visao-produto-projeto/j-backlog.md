---
sidebar_label: "Lista de Itens de Trabalho"
sidebar_position: 10
description: Lista de Itens de Trabalho com priorização e MVP do sistema da Creche da Tia Tata.
---

# Lista de Itens de Trabalho

No contexto do **OpenUP**, o artefato equivalente ao backlog de metodologias ágeis é a **Lista de Itens de Trabalho (Work Items List)**. Ela contém todos os itens de trabalho priorizados que guiam o desenvolvimento ao longo das iterações, servindo como referência para o planejamento de cada ciclo.

## 10.1 Itens de Trabalho {#itens-de-trabalho}

A Lista de Itens de Trabalho contém todos os itens planejados para o sistema, descritos no formato OpenUP com a descrição direta do comportamento esperado. Rastreabilidade com RNFs e OEs disponível no [Fluxograma de Requisitos](./g-fluxograma-requisitos) e em [Verificação dos RNFs](../evidencias/Verificacao-RNFs).

| ID | Item de Trabalho | Caso de Uso | Descrição do Item de Trabalho |
|---|---|---|---|
| **IT-01** | Autenticar Administrador | [UC-01](./k-casos-de-uso#uc-01--autenticar-no-sistema) | O sistema deve permitir que o administrador acesse a área restrita mediante autenticação com credenciais (e-mail e senha). |
| **IT-27** | Login de Usuário | [UC-01](./k-casos-de-uso#uc-01--autenticar-no-sistema) | O sistema deve permitir que usuários cadastrados (doadores, voluntários e administradores) realizem autenticação por e-mail e senha para acessar funcionalidades do seu perfil. |
| **IT-02** | Registrar Doação | [UC-02](./k-casos-de-uso#uc-02--gerenciar-doações) | O sistema deve permitir o registro de doações recebidas, incluindo tipo, quantidade e data, para controle de contribuições. |
| **IT-03** | Listar Doações | [UC-02](./k-casos-de-uso#uc-02--gerenciar-doações) | O sistema deve exibir a lista de todas as doações registradas, permitindo consulta do histórico de contribuições. |
| **IT-04** | Editar Doação | [UC-02](./k-casos-de-uso#uc-02--gerenciar-doações) | O sistema deve permitir a edição de registros de doação para correção de informações incorretas. |
| **IT-05** | Registrar Doador | [UC-03](./k-casos-de-uso#uc-03--gerenciar-doadores) | O sistema deve permitir o cadastro de doadores para manutenção da base de apoiadores da creche. |
| **IT-06** | Listar Doadores | [UC-03](./k-casos-de-uso#uc-03--gerenciar-doadores) | O sistema deve exibir a lista de doadores cadastrados para consulta e gerenciamento dos apoiadores. |
| **IT-07** | Registrar Entrega | [UC-04](./k-casos-de-uso#uc-04--gerenciar-entregas) | O sistema deve permitir o registro de entregas realizadas para rastreamento da distribuição de doações. |
| **IT-08** | Listar Entregas | [UC-04](./k-casos-de-uso#uc-04--gerenciar-entregas) | O sistema deve exibir a lista de entregas realizadas para acompanhamento da distribuição de doações. |
| **IT-09** | Registrar Voluntário | [UC-05](./k-casos-de-uso#uc-05--gerenciar-voluntários) | O sistema deve permitir o cadastro de voluntários para gerenciamento de quem apoia as atividades da creche. |
| **IT-10** | Listar Voluntários | [UC-05](./k-casos-de-uso#uc-05--gerenciar-voluntários) | O sistema deve exibir a lista de voluntários cadastrados para visualização e gerenciamento da equipe de apoio. |
| **IT-11** | Registrar Disponibilidade | [UC-06](./k-casos-de-uso#uc-06--gerenciar-disponibilidade-e-escala) | O sistema deve permitir o registro da disponibilidade de horários dos voluntários para planejamento de escalas. |
| **IT-12** | Editar Disponibilidade | [UC-06](./k-casos-de-uso#uc-06--gerenciar-disponibilidade-e-escala) | O sistema deve permitir a edição da disponibilidade de voluntários para manutenção de informações atualizadas. |
| **IT-13** | Gerar Escala | [UC-06](./k-casos-de-uso#uc-06--gerenciar-disponibilidade-e-escala) | O sistema deve gerar escalas de voluntários com base nas disponibilidades registradas para organização das atividades. |
| **IT-14** | Registrar Evento | [UC-07](./k-casos-de-uso#uc-07--gerenciar-eventos) | O sistema deve permitir o registro de eventos para planejamento e organização das atividades da creche. |
| **IT-15** | Listar Eventos | [UC-07](./k-casos-de-uso#uc-07--gerenciar-eventos) | O sistema deve exibir a lista de eventos cadastrados para acompanhamento da agenda da creche. |
| **IT-16** | Associar Voluntário a Evento | [UC-07](./k-casos-de-uso#uc-07--gerenciar-eventos) | O sistema deve permitir a associação de voluntários a eventos para garantir cobertura das atividades planejadas. |
| **IT-17** | Registrar Recursos por Evento | [UC-07](./k-casos-de-uso#uc-07--gerenciar-eventos) | O sistema deve permitir o registro de recursos necessários por evento para controle do que é preciso em cada atividade. |
| **IT-18** | Resumo de Recursos por Evento | [UC-07](./k-casos-de-uso#uc-07--gerenciar-eventos) | O sistema deve exibir um resumo consolidado de recursos por evento para visão geral das necessidades. |
| **IT-19** | Página Institucional Pública | [UC-08](./k-casos-de-uso#uc-08--acessar-página-institucional) | O sistema deve disponibilizar uma página pública com informações institucionais da creche, sua missão e formas de contato, acessível sem autenticação. |
| **IT-20** | Publicar Solicitação de Apoio | [UC-09](./k-casos-de-uso#uc-09--publicar-solicitação-de-apoio) | O sistema deve permitir que o administrador publique solicitações de apoio para divulgar necessidades da creche ao público externo. |
| **IT-21** | Listar Solicitações de Apoio | [UC-10](./k-casos-de-uso#uc-10--visualizar-solicitações-de-apoio) | O sistema deve exibir publicamente a lista de solicitações de apoio ativas para que visitantes visualizem as necessidades atuais da creche. |
| **IT-22** | Excluir Voluntário | [UC-05](./k-casos-de-uso#uc-05--gerenciar-voluntários) | O sistema deve permitir a exclusão de voluntários que não atuam mais na creche, com confirmação obrigatória antes da remoção. |
| **IT-23** | Desalocar Voluntário de Evento | [UC-06](./k-casos-de-uso#uc-06--gerenciar-disponibilidade-e-escala) | O sistema deve permitir a desalocação de voluntários de eventos para ajuste de escala conforme necessidade operacional. |
| **IT-24** | Editar Voluntário | [UC-05](./k-casos-de-uso#uc-05--gerenciar-voluntários) | O sistema deve permitir a edição de dados de voluntários para manutenção do cadastro atualizado. |
| **IT-25** | Histórico do Voluntário | [UC-05](./k-casos-de-uso#uc-05--gerenciar-voluntários) | O sistema deve exibir o histórico de participação do voluntário em atividades da creche para acompanhamento de seu engajamento. |
| **IT-26** | Relatório de Participação | [UC-05](./k-casos-de-uso#uc-05--gerenciar-voluntários) | O sistema deve gerar relatório consolidado de participação dos voluntários para avaliação do engajamento da equipe de apoio. |

## 10.2 Priorização da Lista de Itens de Trabalho {#priorizacao}

A priorização foi realizada com base em dois critérios: **Importância (I)** e **Dificuldade (D)**, posicionando cada Caso de Uso em uma matriz de quadrantes para identificar a ordem de desenvolvimento.

**Escala de Dificuldade (D)** — dias de trabalho de 3h com base no DoD:
- 1 = 1 a 5 dias · 2 = 5 a 14 dias · 3 = 14+ dias

**Escala de Importância (I):** 1 = sem relação · 2 = baixo impacto · 3 = impacta · 4 = essencial

O **Índice de Prioridade (IP = I / D)** ordena os itens dentro de cada quadrante.

<iframe src="/REQ-2026.1-T02-CrecheTiaTata/unidade3/priorizacao.html" width="100%" height="740" style={{border:'none',borderRadius:'8px',display:'block'}} title="Matriz de Priorização por Quadrantes"></iframe>

## 10.3 Produto Mínimo Viável (MVP) {#mvp}

O MVP contempla os Itens de Trabalho que permitem a operação básica da creche — autenticação, gestão de doações, doadores, entregas, voluntários e captação digital. Cada card referencia o Caso de Uso correspondente.

<iframe src="/REQ-2026.1-T02-CrecheTiaTata/unidade3/mvp.html" width="100%" height="620" style={{border:'none',borderRadius:'8px',display:'block'}} title="Board MVP"></iframe>

A expansão e definição de detalhes de implementação do MVP estão em -> [Critérios de Aceitação](./h-requisitos/criterios-aceitacao.md).