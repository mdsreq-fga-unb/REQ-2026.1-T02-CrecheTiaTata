---
sidebar_label: "Unidade 2"
sidebar_position: 2
---

# 11 Lições aprendidas

### Lições aprendidas - Unidade 2

#### Lições aprendidas e melhorias

*Desafio:*  
O objetivo geral do produto estava sendo descrito como o desenvolvimento de um sistema web, e não como o valor que o produto entregaria para a Creche da Tia Tata.

*Ação de melhoria:*  
Revisão do objetivo geral para destacar o impacto esperado do produto: fortalecer a capacidade operacional da creche, ampliar a base de doadores e voluntários, melhorar a comunicação com a comunidade e organizar as contribuições recebidas.

---

*Desafio:*  
O escopo da solução estava amplo, com características e objetivos que poderiam tornar o projeto maior do que o necessário para o MVP da disciplina.

*Ação de melhoria:*  
Simplificação dos objetivos específicos e das características do produto, priorizando divulgação de necessidades, canal de contribuição e organização básica das contribuições. Essa mudança ajudou a manter o projeto mais viável e alinhado aos requisitos principais.

---

*Desafio:*  
Havia necessidade de manter coerência entre as características do produto e os requisitos funcionais e não funcionais documentados no GitHub Pages.

*Ação de melhoria:*  
As características do produto foram tratadas em nível mais alto, mas mantendo relação com os RFs e RNFs existentes. A divulgação de necessidades, o canal de contribuição e a organização básica das contribuições passaram a servir como agrupamentos para requisitos como página institucional, solicitações de apoio, registro de doações, registro de voluntários, segurança, responsividade e integridade das informações.

---

#### Dificuldades, ações e priorização

*Desafio:*  
Os testes do frontend estavam falhando no fluxo de CI porque o workflow executava os testes na raiz do projeto, utilizando Jest, enquanto os testes do frontend foram escritos para Vitest.

*Como foi superado:*  
O workflow foi ajustado para instalar as dependências e executar os testes dentro da pasta `frontend`, utilizando o comando correto do projeto React. Com isso, os testes passaram a rodar com Vitest e o resultado esperado foi validado localmente.

---

*Desafio:*  
O Pull Request apresentou conflitos entre a branch `develop` e a `main`, dificultando a integração das mudanças no repositório.

*Como foi superado:*  
Foi feito o merge da `main` na `develop`, com resolução manual dos conflitos em arquivos de configuração e documentação. Após a correção, o build do GitHub Pages e os testes do frontend foram executados para validar que a integração estava funcionando.

---

*Desafio:*  
A equipe teve dificuldade em manter o trabalho organizado devido ao uso simultâneo de várias branches diferentes, o que aumentou a chance de conflitos, divergências entre versões e retrabalho durante a integração.

*Como foi superado:*  
Foi realizada uma reunião de alinhamento para definir uma forma mais organizada de trabalho, priorizando o uso de uma branch principal de desenvolvimento para concentrar as alterações da equipe. Com isso, a integração das mudanças passou a ser mais controlada e os conflitos puderam ser identificados e resolvidos com mais facilidade.

---

*Desafio:*  
Alguns conteúdos novos do GitHub Pages precisavam ser posicionados de forma coerente dentro da estrutura já existente da documentação.

*Como foi superado:*  
A página de intervenções sociais foi criada dentro da seção "Visão do Produto e Projeto", pois esse conteúdo complementa o cenário atual, a solução proposta e os impactos esperados. A estrutura da página seguiu o padrão dos demais documentos, com título numerado, subtópicos e tabela de versões.

|Data|Versão|Descrição|Autor(es)|Revisor(es)|
| :--- | :--- | :--- | :--- | :--- |
| 19/05/2026 | 1.0 | Criação da página de lições aprendidas da Unidade 2 | Bruno Henryque |  |
