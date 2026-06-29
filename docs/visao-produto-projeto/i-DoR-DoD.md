---
sidebar_label: "DoR e DoD"
sidebar_position: 9
---

# 9 DoR e DoD

## 9.1 Definition of Ready (DoR)

Antes do início do desenvolvimento em uma iteração será utilizado o **Definition of Ready (DoR)** durante a **Reunião de Planejamento**, garantindo que todos os integrantes da equipe saibam o que deve ser feito e como deve ser realizado, verificando os requisitos e seus critérios de aceitação.

Uma *issue* está **pronta para desenvolvimento** quando todos os critérios abaixo forem atendidos:

| # | Critério | Métrica de Verificação |
|---|---|---|
| 1 | A *issue* possui descrição clara do que deve ser feito | Descrição com mínimo 50 palavras, contexto de negócio e comportamento esperado |
| 2 | A *issue* possui critérios de aceitação | Mínimo de 2 critérios de aceitação redigidos no formato "Dado/Quando/Então" |
| 3 | A *issue* não possui dependência bloqueante | Todas as dependências estão com status *Done* ou a *issue* pode ser desenvolvida em paralelo |
| 4 | A *issue* está vinculada ao requisito funcional correspondente | Campo "Requisito" preenchido com o ID (ex: RF-02) |

## 9.2 Definition of Done (DoD)

No desenvolvimento das tarefas será utilizado o **Definition of Done (DoD)**, assegurando que as atividades apenas sejam consideradas concluídas quando atenderem a todos os critérios abaixo. Caso algum critério não seja cumprido, o requisito não deverá ser apresentado na reunião de validação com o cliente.

| # | Critério | Métrica de Verificação |
|---|---|---|
| 1 | Testes unitários implementados e passando | Cobertura mínima de **60%** para o código novo adicionado (verificado pelo relatório de coverage do Jest/Deno) |
| 2 | Pipeline de CI passa sem erros | GitHub Actions com status ✅ (build + testes + lint) |
| 3 | Análise estática sem erros | `eslint` retorna **0 erros** (warnings permitidos) |
| 4 | Code review aprovado | Mínimo de **1 aprovação** de outro membro da equipe via Pull Request |
| 5 | Todos os critérios de aceitação do DoR validados | Checklist da *issue* 100% marcado |
| 6 | Funcionalidade testada em ambiente de homologação | Testada manualmente no ambiente de staging pelo desenvolvedor responsável |

### Tipos de Testes Utilizados

Os testes definidos para o projeto incluem:

- **Testes unitários**: executados automaticamente na pipeline de CI (Jest para frontend, Deno test para backend)
- **Testes de caixa preta**: executados manualmente cobrindo os fluxos principais de cada funcionalidade
- **Testes de aceitação**: realizados com o cliente nas reuniões de validação, seguindo os critérios definidos no DoR
- **Testes de usabilidade**: avaliados com a cliente (Tia Tata ou representantes) em ambiente de homologação

---

|Data|Versão|Descrição|Autor(es)|Revisor(es)|
| :--- | :--- | :--- | :--- | :--- |
| 18/05/2026 | 1.0 | Criação da página | Matheus Pinheiro | |
| 15/06/2026 | 1.1 | Adição de métricas mensuráveis e objetivas no DoR e DoD | Matheus Pinheiro | |
