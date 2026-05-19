---
sidebar_label: "DoR e DoD"
sidebar_position: 9
---

# 9 DoR e DoD

## 9.1 Definition of Ready (DoR)

Antes do início do desenvolvimento em uma iteração será utilizado o **Definition of Ready (DoR)** durante a **Reunião de Planejamento**, garantindo que todos os integrantes da equipe saibam o que deve ser feito e como deve ser realizado, verificando os requisitos e seus critérios de aceitação.

Entre os itens verificados, temos:
- A *issue* apresenta informações suficientes sobre o que deve ser feito;
- A *issue* possui critérios de aceitação;
- É possível implementar o requisito sem que outra *issues* impeça seu desenvolvimento;
- É possível implementar o requisito no tempo previsto.

## 9.2 Definition of Done (DoD)

No desenvolvimento das tarefas será utilizado o **Definition of Done (DoD)**, assegurando que as atividades apenas sejam consideradas concluídas quando estiverem documentadas, testadas, revisadas pela equipe e sem erros. Caso seus critérios não sejam cumpridos, o requisito não deverá ser apresentado na reunião de validação com o cliente.

Os testes definidos para o projeto incluem:
- Testes de aceitação;
- Testes de usabilidade;
- Testes unitários;
- Testes de caixa preta.

Os testes de aceitação e usabilidade serão realizados tanto pelos desenvolvedores quanto pelo cliente durante as reuniões de validação. Já os testes unitários e de caixa preta serão executados automaticamente por meio da pipeline de **Continuous Integration (CI)**.

A validação das atividades será realizada por meio de listas de verificação nas *issues* do GitHub, garantindo que todos os critérios estabelecidos no DoR e no DoD sejam atendidos antes da aprovação das entregas.

---

|Data|Versão|Descrição|Autor(es)|Revisor(es)|
| :--- | :--- | :--- | :--- | :--- |
| 18/05/2026 | 1.0 | Criação da página | Matheus Pinheiro |  |