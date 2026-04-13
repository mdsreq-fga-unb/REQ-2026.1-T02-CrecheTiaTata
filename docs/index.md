## 3 ESTRATÉGIAS DE ENGENHARIA DE SOFTWARE

### 3.1 Estratégia Priorizada
**Abordagem**: Ágil
**Ciclo de vida**: Iterativo e Incremental
**Processo**: OpenUP

### 3.2 Quadro Comparativo
O Quadro a seguir compara as características dois possíveis processos, o OpenUP e o eXtreme Programming(XP), com o intuito de esclarecer a escolha do processo para o nosso projeto.

| Características | OpenUP | eXtreme Programming(XP) |
| :--- | :--- | :--- |
| Filosofia Central | Equilíbrio entre agilidade e formalidade mínima. | Foco total em eficiência técnica e código. |
| Papéis (Roles) | Claramente definidos (Analista, Desenvolvedor, Arquiteto, Stakeholder). | Papéis mais fluidos, focados no par de desenvolvedores e no cliente presente. |
| Documentação | Formalidade mínima, mas estruturada (Casos de Uso, Arquitetura). | Documentação mínima, focada em histórias de usuário e no próprio código. |
| Gerenciamento de Risco | **Arquitetura em primeiro lugar.** Mitigação de riscos técnicos cedo. | Riscos são tratados conforme surgem nas iterações. |
| Escalabilidade | Mais fácil de adaptar para equipes ligeiramente maiores ou distribuídas. | Funciona melhor em equipes pequenas e altamente integradas. |
| Práticas Técnicas | Flexível; aceita várias práticas. | Rígido com práticas como TDD, Pair Programming e Refatoração constante. |

### 3.3 Justificativa
Com base nas características do projeto e dos processos comparados a cima, o **OpenUP** é o processo mais adequado pelos seguintes motivos:
1. **Visão Arquitetural**: O OpenUP enfatixa a criação de uma base arquitetural mais sólida na fase de elaboração, isso reduz a chance do projeto ser reestruturado no futuro;
2. **Transparência para Stakeholders**: Enquanto o XP é muito "dentro da sala de desenvolvimento", o OpenUP fornece artefatos (como a Lista de Itens de Trabalho e o Documento de Arquitetura) que são mais fáceis de apresentar para clientes ou professores que precisam acompanhar o progresso formal do trabalho;
3. **Papéis Definidos**: Para um trabalho em grupo, ter papéis definidos (quem faz o quê) ajuda na organização e na atribuição de responsabilidades, evitando que todos tentem fazer tudo ao mesmo tempo, o que pode acontecer no XP se a equipe não for muito madura.