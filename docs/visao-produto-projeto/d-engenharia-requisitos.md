---
sidebar_label: "Engenharia de Requisitos"
sidebar_position: 4
---

# 4. Engenharia de Requisitos

Nesta seção, estabelecemos as atividades fundamentais da Engenharia de Requisitos (ER), suas práticas e técnicas, em total alinhamento com o framework de processo escolhido para o projeto da Creche Tia Tata: o **OpenUP**. 

O objetivo é garantir que o levantamento, especificação e validação das necessidades da organização e de seus voluntários ocorram de forma iterativa e incremental, mitigando riscos desde as fases iniciais. O histórico e as evidências de execução de cada atividade estão registrados nas atas de reunião da equipe.

## 4.1 Atividades e Técnicas de ER

### 4.1.1 Elicitação e Descoberta
Fase voltada à exploração do domínio do problema e ao levantamento das necessidades reais dos stakeholders.
* **Entrevistas com Stakeholders:** Reuniões direcionadas com a administração da Creche Tia Tata para entender o fluxo atual de doações e a gestão manual de voluntários, identificando as principais dores do processo.

### 4.1.2 Análise e Consenso
Atividade focada em refinar, classificar e priorizar os requisitos brutos levantados na elicitação, resolvendo conflitos de escopo.
* **Matriz de Priorização (Impacto x Dificuldade):** Técnica utilizada para classificar as funcionalidades de acordo com o valor gerado para a creche versus o esforço técnico de implementação, facilitando a visualização dos "Quick Wins" (ex: CRUD de Doadores).
* **Análise MoSCoW:** Classificação dos requisitos em *Must Have, Should Have, Could Have* e *Won't Have*, fundamental para fechar o escopo exato do Produto Mínimo Viável (MVP).

### 4.1.3 Declaração de Requisitos
Tradução das necessidades analisadas para um formato documentado, padronizado e compreensível para a equipe de desenvolvimento.
* **Casos de Uso:** Mapeamento descritivo e formal das interações entre os Atores (Administrador, Doador, Voluntário) e as funcionalidades do sistema.
* **Histórias de Usuário (User Stories):** Descrição das funcionalidades sob a perspectiva de valor para o usuário, utilizadas para popular o backlog e guiar o desenvolvimento ágil.

### 4.1.4 Representação de Requisitos
Atividade focada em ilustrar visualmente a estrutura, o comportamento e a interface do sistema, facilitando a comunicação técnica e a validação.
* **Diagrama de Casos de Uso:** Modelagem em UML utilizada para ilustrar graficamente as fronteiras do sistema e como os diferentes atores interagem com as principais funcionalidades (ex: Fluxo de Autenticação, Registro de Evento).
* **Prototipação de Alta Fidelidade:** Criação de telas interativas no Figma (ex: Página Sobre com Missão, Visão e Valores) para representar a interface final do usuário e a jornada de uso antes da codificação.

### 4.1.5 Verificação e Validação de Requisitos
Garantia de que os requisitos e representações criadas realmente atendem às expectativas do cliente antes e durante a construção.
* **Feedback do Cliente / Walkthrough:** Apresentação dos diagramas e protótipos de software gerados em cada iteração para colher aprovação e ajustes diretamente com a gestão da creche.
* **Definition of Done (DoD) e Definition of Ready (DoR):** Critérios de aceitação estabelecidos para garantir que um requisito só comece a ser feito quando estiver claro (DoR) e só seja entregue quando estiver testado e validado (DoD).

### 4.1.6 Organização e Atualização
Controle contínuo das mudanças de escopo e garantia do alinhamento entre o código e a documentação.
* **Matriz de Rastreabilidade:** Técnica utilizada para vincular os Requisitos Funcionais aos Objetivos de Negócio (e às Histórias de Usuário correspondentes), garantindo que nada seja desenvolvido sem um propósito justificado.
* **Controle de Versão do Backlog:** Atualização contínua das prioridades e refinamento das *User Stories* ao longo das iterações do OpenUP, refletindo as mudanças de rota e as decisões arquiteturais.

---

## 4.2 Engenharia de Requisitos e o Processo OpenUP

A tabela abaixo mapeia as atividades da Engenharia de Requisitos dentro das quatro fases do ciclo de vida do OpenUP (Concepção, Elaboração, Construção e Transição).

| Fase do OpenUP | Atividades ER | Prática | Técnica | Resultado Esperado |
| :--- | :--- | :--- | :--- | :--- |
| **Concepção (Inception)** | Elicitação e Descoberta | Entendimento do negócio e da dor do cliente (Creche). | Entrevistas com Stakeholders e Brainstorming. | Declaração do Problema, Visão do Produto e levantamento inicial de necessidades. |
| **Concepção (Inception)** | Análise e Consenso | Definição do que é viável para a primeira entrega. | Matriz de Priorização (Impacto x Dificuldade) e MoSCoW. | Escopo inicial do MVP definido e priorizado. |
| **Elaboração (Elaboration)** | Declaração de Requisitos | Documentação estruturada das necessidades do sistema. | Especificação de Casos de Uso e Histórias de Usuário. | Backlog inicial populado e Casos de Uso arquiteturalmente significantes detalhados. |
| **Elaboração (Elaboration)** | Representação de Requisitos | Tangibilização visual das ideias e do escopo. | Diagrama de Casos de Uso e Prototipação de Alta Fidelidade (Figma). | Modelos visuais e protótipos elaborados para reduzir riscos técnicos e de usabilidade. |
| **Construção (Construction)** | Verificação e Validação | Garantia de qualidade das implementações durante as iterações. | Definition of Ready (DoR), Definition of Done (DoD) e Walkthroughs. | Funcionalidades desenvolvidas alinhadas aos critérios de aceitação e aprovadas. |
| **Construção (Construction)** | Organização e Atualização | Adaptação às mudanças e detalhamento contínuo do backlog. | Refinamento de Backlog e Matriz de Rastreabilidade. | Backlog atualizado, garantindo que o software construído reflete os requisitos atuais. |
| **Transição (Transition)** | Verificação e Validação | Homologação final do sistema com o usuário real. | Feedback final do cliente e Testes de Aceitação. | Sistema executável validado, documentado e entregue à Creche Tia Tata. |

---

## Histórico de Versão

| Data | Versão | Descrição | Autor(es) | Revisor(es) |
| :--- | :--- | :--- | :--- | :--- |
| 18/05/2026 | 1.0 | Criação inicial do documento de atividades e técnicas da ER. | Lorena Ribeiro | Equipe |
| 18/05/2026 | 2.0 | Atualização estrutural: remoção de terminologia de artefatos OpenUP e inclusão das teorias clássicas de ER e Tabela de Fases. | Lorena Ribeiro | Monitor |
| 18/05/2026 | 2.1 | Inclusão da etapa de Representação de Requisitos e detalhamento do Diagrama de Casos de Uso. | Lorena Ribeiro | Monitor |