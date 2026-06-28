---
sidebar_label: "Lista de Itens de Trabalho"
sidebar_position: 10
description: Lista de Itens de Trabalho com priorização e MVP do sistema da Creche da Tia Tata.
---

# Lista de Itens de Trabalho

No contexto do **OpenUP**, o artefato equivalente ao backlog de metodologias ágeis é a **Lista de Itens de Trabalho (Work Items List)**. Ela contém todos os itens de trabalho priorizados que guiam o desenvolvimento ao longo das iterações, servindo como referência para o planejamento de cada ciclo.

## 10.1 Itens de Trabalho {#itens-de-trabalho}

A Lista de Itens de Trabalho contém todos os itens planejados para o sistema, descritos no formato OpenUP com a descrição direta do comportamento esperado e os requisitos não funcionais relacionados.

| ID | Item de Trabalho | Descrição do Item de Trabalho | RNFs Relacionados |
|---|---|---|---|
| **IT-01** | Autenticar Administrador | O sistema deve permitir que o administrador acesse a área restrita mediante autenticação com credenciais (e-mail e senha). | RNF-08 (Bloqueio sem login), RNF-09 (bcrypt+AES), RNF-12 (Expiração de sessão), RNF-13 (Feedback) |
| **IT-02** | Registrar Doação | O sistema deve permitir o registro de doações recebidas, incluindo tipo, quantidade e data, para controle de contribuições. | RNF-01 (Resposta 3s), RNF-05 (Confirmação), RNF-10 (Logs), RNF-13 (Feedback) |
| **IT-03** | Listar Doações | O sistema deve exibir a lista de todas as doações registradas, permitindo consulta do histórico de contribuições. | RNF-01 (Resposta 3s), RNF-03 (50 usuários), RNF-07 (Interface intuitiva) |
| **IT-04** | Editar Doação | O sistema deve permitir a edição de registros de doação para correção de informações incorretas. | RNF-05 (Confirmação), RNF-10 (Logs), RNF-13 (Feedback) |
| **IT-05** | Registrar Doador | O sistema deve permitir o cadastro de doadores para manutenção da base de apoiadores da creche. | RNF-01 (Resposta 3s), RNF-05 (Confirmação), RNF-10 (Logs) |
| **IT-06** | Listar Doadores | O sistema deve exibir a lista de doadores cadastrados para consulta e gerenciamento dos apoiadores. | RNF-01 (Resposta 3s), RNF-07 (Interface intuitiva) |
| **IT-07** | Registrar Entrega | O sistema deve permitir o registro de entregas realizadas para rastreamento da distribuição de doações. | RNF-05 (Confirmação), RNF-10 (Logs), RNF-13 (Feedback) |
| **IT-08** | Listar Entregas | O sistema deve exibir a lista de entregas realizadas para acompanhamento da distribuição de doações. | RNF-01 (Resposta 3s), RNF-07 (Interface intuitiva) |
| **IT-09** | Registrar Voluntário | O sistema deve permitir o cadastro de voluntários para gerenciamento de quem apoia as atividades da creche. | RNF-01 (Resposta 3s), RNF-05 (Confirmação), RNF-10 (Logs), RNF-13 (Feedback) |
| **IT-10** | Listar Voluntários | O sistema deve exibir a lista de voluntários cadastrados para visualização e gerenciamento da equipe de apoio. | RNF-01 (Resposta 3s), RNF-07 (Interface intuitiva) |
| **IT-11** | Registrar Disponibilidade | O sistema deve permitir o registro da disponibilidade de horários dos voluntários para planejamento de escalas. | RNF-01 (Resposta 3s), RNF-05 (Confirmação), RNF-13 (Feedback) |
| **IT-12** | Editar Disponibilidade | O sistema deve permitir a edição da disponibilidade de voluntários para manutenção de informações atualizadas. | RNF-05 (Confirmação), RNF-13 (Feedback) |
| **IT-13** | Gerar Escala | O sistema deve gerar escalas de voluntários com base nas disponibilidades registradas para organização das atividades. | RNF-01 (Resposta 3s), RNF-07 (Interface intuitiva), RNF-13 (Feedback) |
| **IT-14** | Registrar Evento | O sistema deve permitir o registro de eventos para planejamento e organização das atividades da creche. | RNF-01 (Resposta 3s), RNF-05 (Confirmação), RNF-10 (Logs), RNF-13 (Feedback) |
| **IT-15** | Listar Eventos | O sistema deve exibir a lista de eventos cadastrados para acompanhamento da agenda da creche. | RNF-01 (Resposta 3s), RNF-07 (Interface intuitiva) |
| **IT-16** | Associar Voluntário a Evento | O sistema deve permitir a associação de voluntários a eventos para garantir cobertura das atividades planejadas. | RNF-05 (Confirmação), RNF-13 (Feedback) |
| **IT-17** | Registrar Recursos por Evento | O sistema deve permitir o registro de recursos necessários por evento para controle do que é preciso em cada atividade. | RNF-01 (Resposta 3s), RNF-05 (Confirmação), RNF-10 (Logs) |
| **IT-18** | Resumo de Recursos por Evento | O sistema deve exibir um resumo consolidado de recursos por evento para visão geral das necessidades. | RNF-01 (Resposta 3s), RNF-07 (Interface intuitiva) |
| **IT-19** | Página Institucional Pública | O sistema deve disponibilizar uma página pública com informações institucionais da creche, sua missão e formas de contato, acessível sem autenticação. | RNF-02 (Carregamento 5s), RNF-04 (Disponibilidade), RNF-11 (Padrões web), RNF-14 (Contato visível) |
| **IT-20** | Publicar Solicitação de Apoio | O sistema deve permitir que o administrador publique solicitações de apoio para divulgar necessidades da creche ao público externo. | RNF-04 (Disponibilidade), RNF-05 (Confirmação), RNF-10 (Logs), RNF-13 (Feedback) |
| **IT-21** | Listar Solicitações de Apoio | O sistema deve exibir publicamente a lista de solicitações de apoio ativas para que visitantes visualizem as necessidades atuais da creche. | RNF-02 (Carregamento 5s), RNF-04 (Disponibilidade), RNF-07 (Interface), RNF-14 (Doações visíveis) |
| **IT-22** | Excluir Voluntário | O sistema deve permitir a exclusão de voluntários que não atuam mais na creche, com confirmação obrigatória antes da remoção. | RNF-05 (Confirmação), RNF-10 (Logs), RNF-13 (Feedback) |
| **IT-23** | Desalocar Voluntário de Evento | O sistema deve permitir a desalocação de voluntários de eventos para ajuste de escala conforme necessidade operacional. | RNF-05 (Confirmação), RNF-13 (Feedback) |
| **IT-24** | Editar Voluntário | O sistema deve permitir a edição de dados de voluntários para manutenção do cadastro atualizado. | RNF-05 (Confirmação), RNF-10 (Logs), RNF-13 (Feedback) |
| **IT-25** | Histórico do Voluntário | O sistema deve exibir o histórico de participação do voluntário em atividades da creche para acompanhamento de seu engajamento. | RNF-01 (Resposta 3s), RNF-07 (Interface), RNF-10 (Logs) |
| **IT-26** | Relatório de Participação | O sistema deve gerar relatório consolidado de participação dos voluntários para avaliação do engajamento da equipe de apoio. | RNF-01 (Resposta 3s), RNF-07 (Interface), RNF-10 (Logs) |

## 10.2 Matriz-Síntese de Rastreabilidade {#matriz-rastreabilidade}

A matriz-síntese conecta os Objetivos Específicos (OE), as Características de Produto (CP), o Valor de Negócio (VN), os Requisitos Funcionais (RF) e os Requisitos Não Funcionais (RNF), garantindo rastreabilidade completa entre a visão estratégica e os artefatos técnicos.

| OE | CP | Valor de Negócio | RFs | RNFs |
|---|---|---|---|---|
| OE1 – Divulgar informações da creche | C1 (Vitrine Pública Digital) | Ampliar alcance e reduzir dependência do boca a boca | RF-19, RF-20, RF-21 | RNF-02, RNF-04, RNF-11, RNF-14 |
| OE2 – Facilitar contato de doadores e voluntários | C1 (Vitrine Pública Digital), C2 (Canal de Engajamento) | Reduzir atrito na captação de apoiadores | RF-05, RF-09, RF-19, RF-20, RF-21 | RNF-03, RNF-07, RNF-13 |
| OE3 – Apoiar registro e consulta de contribuições | C3 (Gestão de Voluntários), C4 (Gestão de Doações), C5 (Painel Admin) | Eliminar perda de informações e organizar operações internas | RF-01, RF-02, RF-03, RF-04, RF-05, RF-06, RF-07, RF-08, RF-09, RF-10, RF-11, RF-12, RF-13, RF-14, RF-15, RF-16, RF-17, RF-18, RF-22, RF-23, RF-24, RF-25, RF-26 | RNF-01, RNF-05, RNF-08, RNF-09, RNF-10, RNF-12 |

## 10.3 Priorização da Lista de Itens de Trabalho {#priorizacao}

A priorização foi realizada com base em dois critérios: **Importância (I)** e **Dificuldade (D)**, posicionando cada item em uma matriz de quadrantes que permite identificar visualmente a ordem de desenvolvimento.

**Escala de Dificuldade (D)** — dias de trabalho de 3h com base no DoD:
- 1 = 1 a 5 dias
- 2 = 5 a 14 dias
- 3 = 14+ dias

**Escala de Importância (I)**:
- 1 = Não relacionado ao problema central
- 2 = Baixo impacto no problema
- 3 = Impacta o problema
- 4 = Essencial na solução

O **Índice de Prioridade (IP = I / D)** determina a ordem relativa dentro de cada quadrante: quanto maior o IP, maior a prioridade.

![Priorização por quadrantes](/img/priorizacao-quadrantes.jpeg)

## 10.4 Produto Mínimo Viável (MVP)

O MVP representa o conjunto mínimo de itens de trabalho que permite que o sistema seja utilizado pela coordenação da creche, validando as hipóteses centrais do projeto com a cliente. No OpenUP, esses itens são priorizados nas primeiras iterações da fase de Construção.

![Board MVP do projeto](/img/mvp-board.png)
