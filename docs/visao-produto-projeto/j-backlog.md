---
sidebar_label: "Backlog de Produto"
sidebar_position: 10
description: Backlog de produto com priorização e MVP do sistema da Creche da Tia Tata.
---

# Backlog de Produto

Esta seção descreve o backlog de produto do sistema da Creche da Tia Tata, contendo a lista priorizada de todas as funcionalidades planejadas, bem como a definição do Produto Mínimo Viável (MVP).

## 10.1 Backlog Geral

O backlog geral contém todas as funcionalidades planejadas para o sistema, organizadas com suas respectivas user stories e requisitos não funcionais relacionados.

| Requisito Funcional | User Story Derivada | RNFs Relacionados |
|---|---|---|
| **RF-01** – Autenticar Administrador | Como administrador, quero fazer login no sistema para acessar funcionalidades de gestão. | RNF-08 (Bloqueio sem login), RNF-09 (bcrypt+AES), RNF-12 (Expiração de sessão), RNF-13 (Feedback) |
| **RF-02** – Registrar Doação | Como administrador, quero registrar doações recebidas para manter controle do que foi doado. | RNF-01 (Resposta 3s), RNF-05 (Confirmação), RNF-10 (Logs), RNF-13 (Feedback) |
| **RF-03** – Listar Doações | Como administrador, quero listar todas as doações para consultar histórico de contribuições. | RNF-01 (Resposta 3s), RNF-03 (50 usuários), RNF-07 (Interface intuitiva) |
| **RF-04** – Editar Doação | Como administrador, quero editar registros de doação para corrigir informações incorretas. | RNF-05 (Confirmação), RNF-10 (Logs), RNF-13 (Feedback) |
| **RF-05** – Registrar Doador | Como administrador, quero registrar doadores para manter base de apoiadores da creche. | RNF-01 (Resposta 3s), RNF-05 (Confirmação), RNF-10 (Logs) |
| **RF-06** – Listar Doadores | Como administrador, quero listar doadores cadastrados para consultar e gerenciar apoiadores. | RNF-01 (Resposta 3s), RNF-07 (Interface intuitiva) |
| **RF-07** – Registrar Entrega | Como administrador, quero registrar entregas de doações para rastrear o que foi distribuído. | RNF-05 (Confirmação), RNF-10 (Logs), RNF-13 (Feedback) |
| **RF-08** – Listar Entregas | Como administrador, quero listar entregas realizadas para acompanhar distribuição de doações. | RNF-01 (Resposta 3s), RNF-07 (Interface intuitiva) |
| **RF-09** – Registrar Voluntário | Como administrador, quero registrar voluntários para gerenciar quem apoia atividades da creche. | RNF-01, RNF-05 (Confirmação), RNF-10 (Logs), RNF-13 (Feedback) |
| **RF-10** – Listar Voluntários | Como administrador, quero listar voluntários cadastrados para visualizar e gerenciar equipe de apoio. | RNF-01 (Resposta 3s), RNF-07 (Interface intuitiva) |
| **RF-11** – Registrar Disponibilidade | Como administrador, quero registrar disponibilidade dos voluntários para planejar escalas. | RNF-01, RNF-05 (Confirmação), RNF-13 (Feedback) |
| **RF-12** – Editar Disponibilidade | Como administrador, quero editar disponibilidade de voluntários para manter informações atualizadas. | RNF-05 (Confirmação), RNF-13 (Feedback) |
| **RF-13** – Gerar Escala | Como administrador, quero gerar escala de voluntários para organizar atividades da creche. | RNF-01 (Resposta 3s), RNF-07 (Interface intuitiva), RNF-13 (Feedback) |
| **RF-14** – Registrar Evento | Como administrador, quero registrar eventos para organizar e planejar atividades da creche. | RNF-01, RNF-05 (Confirmação), RNF-10 (Logs), RNF-13 (Feedback) |
| **RF-15** – Listar Eventos | Como administrador, quero listar eventos cadastrados para acompanhar agenda da creche. | RNF-01 (Resposta 3s), RNF-07 (Interface intuitiva) |
| **RF-16** – Associar Voluntário a Evento | Como administrador, quero associar voluntários a eventos para garantir cobertura das atividades. | RNF-05 (Confirmação), RNF-13 (Feedback) |
| **RF-17** – Registrar Recursos por Evento | Como administrador, quero registrar recursos necessários por evento para controlar o que é preciso em cada atividade. | RNF-01, RNF-05 (Confirmação), RNF-10 (Logs) |
| **RF-18** – Resumo de Recursos por Evento | Como administrador, quero visualizar resumo de recursos por evento para ter visão consolidada das necessidades. | RNF-01 (Resposta 3s), RNF-07 (Interface intuitiva) |
| **RF-19** – Página Institucional Pública | Como visitante, quero acessar informações institucionais da creche para conhecer projeto e missão. | RNF-02 (Carregamento 5s), RNF-04 (Disponibilidade), RNF-11 (Padrões web), RNF-14 (Contato visível) |
| **RF-20** – Publicar Solicitação de Apoio | Como administrador, quero publicar solicitações de apoio para divulgar necessidades da creche ao público. | RNF-04 (Disponibilidade), RNF-05 (Confirmação), RNF-10 (Logs), RNF-13 (Feedback) |
| **RF-21** – Listar Solicitações | Como visitante, quero listar solicitações de apoio para visualizar necessidades atuais da creche. | RNF-02 (Carregamento 5s), RNF-04 (Disponibilidade), RNF-07 (Interface), RNF-14 (Doações visíveis) |
| **RF-22** – Excluir Voluntário | Como administrador, quero excluir voluntário do sistema para remover quem não atua mais na creche. | RNF-05 (Confirmação), RNF-10 (Logs), RNF-13 (Feedback) |
| **RF-23** – Desalocar Voluntário | Como administrador, quero desalocar voluntário de evento para ajustar escala conforme necessidade. | RNF-05 (Confirmação), RNF-13 (Feedback) |
| **RF-24** – Editar Voluntário | Como administrador, quero editar dados de voluntários para manter cadastro atualizado. | RNF-05 (Confirmação), RNF-10 (Logs), RNF-13 (Feedback) |
| **RF-25** – Histórico do Voluntário | Como administrador, quero visualizar histórico de atividades do voluntário para acompanhar sua participação. | RNF-01 (Resposta 3s), RNF-07 (Interface), RNF-10 (Logs) |
| **RF-26** – Relatório de Participação | Como administrador, quero gerar relatório de participação para avaliar engajamento da equipe de voluntários. | RNF-01 (Resposta 3s), RNF-07 (Interface), RNF-10 (Logs) |

## 10.2 Priorização do Backlog Geral e MVP

A priorização foi realizada com base em dois critérios: **Dificuldade (D)** e **Importância (I)**, permitindo identificar quais funcionalidades são essenciais para o lançamento do MVP e quais podem ser desenvolvidas posteriormente.

O MVP representa o conjunto mínimo de funcionalidades que permite que o sistema seja utilizado pela coordenação da creche, focando nos recursos essenciais para validar as principais hipóteses de valor do projeto.

![Board MVP do projeto](/img/mvp-board.png)

**DIFICULDADE** (dias de 3h de trabalho):
- 1 = 1 a 5 dias para conclusão com base no DoD
- 2 = 5 a 14 dias para conclusão com base no DoD
- 3 = 14+ dias para conclusão com base no DoD

**IMPORTÂNCIA:**
- 1 = Não relacionado ao problema central
- 2 = Baixo impacto no problema
- 3 = Impacta o problema
- 4 = Essencial na solução
