---
sidebar_label: "Estratégias de Engenharia de Software"
sidebar_position: 3
---
# ESTRATÉGIAS DE ENGENHARIA DE SOFTWARE

## 3.1 Estratégia Priorizada
* **Abordagem**: Ágil
* **Ciclo de vida**: Iterativo e Incremental
* **Processo**: OpenUP

## 3.2 Quadro Comparativo
O Quadro a seguir compara as características dois possíveis processos, o OpenUP e o eXtreme Programming(XP), com o intuito de esclarecer a escolha do processo para o nosso projeto.

| Características | OpenUP | eXtreme Programming(XP) |
| :--- | :--- | :--- |
| Filosofia Central | Equilíbrio entre agilidade e formalidade mínima. | Foco total em eficiência técnica e código. |
| Papéis (Roles) | Claramente definidos (Analista, Desenvolvedor, Arquiteto, Stakeholder). | Papéis mais fluidos, focados no par de desenvolvedores e no cliente presente. |
| Documentação | Formalidade mínima, mas estruturada (Casos de Uso, Arquitetura). | Documentação mínima, focada em histórias de usuário e no próprio código. |
| Gerenciamento de Risco | **Arquitetura em primeiro lugar.** Mitigação de riscos técnicos cedo. | Riscos são tratados conforme surgem nas iterações. |
| Persistência do Conhecimento | Independente. O conhecimento do projeto é mantido nos artefatos estruturados. | Interpessoal. O conhecimento reside na memória da equipe e na comunicação oral. |
| Práticas Técnicas | Flexível; aceita várias práticas. | Rígido com práticas como TDD, Pair Programming e Refatoração constante. |

## 3.3 Justificativa
Com base nas características do projeto e dos processos comparados a cima, o **OpenUP** é o processo mais adequado pelos seguintes motivos:
1. **Visão Arquitetural**: O OpenUP enfatiza a criação de uma base arquitetural mais sólida na fase de elaboração, com a utilização de **Casos de Uso**, isso reduz a chance do projeto ser reestruturado no futuro, pois com ele delimitamos exatamente o que o usuário conseguirá fazer em cada tela;
2. **Transparência para Stakeholders**: O OpenUP fornece artefatos (como o Documento de Arquitetura, Casos de Uso) que facilitam na hora de apresentação do projeto para o cliente, diferente do XP que a documentação é mínima;
3. **Papéis Definidos**: Para um trabalho em grupo, ter papéis definidos ajuda na organização e na atribuição de responsabilidades, evitando que todos tentem fazer tudo ao mesmo tempo, o que pode acontecer no XP.
4. **Fase de Elaboração**: Por causa da validação mais cedo da arquitetura, é possível fazer a prototipação de forma mais rápida, pois garantimos que o servidor se comunique com o cliente e com o banco de dados logo nas primeiras semanas.