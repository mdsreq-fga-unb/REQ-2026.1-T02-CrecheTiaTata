---
sidebar_label: "Unidade 3"
sidebar_position: 3
---

# 11 Lições aprendidas

### Lições aprendidas - Unidade 3

#### Lições aprendidas e melhorias

*Desafio:*  
A implementação das funcionalidades exigiu maior cuidado para manter o sistema alinhado ao escopo do MVP, evitando que novas ideias aumentassem a complexidade além do necessário para a entrega da disciplina.

*Ação de melhoria:*  
A equipe passou a priorizar as funcionalidades diretamente relacionadas ao valor principal do produto, como divulgação da creche, cadastro de voluntários, registro de informações e canais de contato. Isso ajudou a manter o desenvolvimento mais objetivo e coerente com os requisitos já documentados.

---

*Desafio:*  
Durante o desenvolvimento, foi necessário conectar melhor a documentação de requisitos com as funcionalidades realmente implementadas no frontend e no backend.

*Ação de melhoria:*  
Os requisitos funcionais e não funcionais foram usados como referência para orientar as decisões de implementação e validação. Essa prática facilitou a rastreabilidade entre o que foi planejado, o que foi desenvolvido e o que precisava ser demonstrado ao cliente.

---

*Desafio:*  
A integração entre frontend, backend e serviços externos trouxe dúvidas sobre responsabilidades de cada parte do sistema, principalmente em fluxos como cadastro, autenticação e envio de informações.

*Ação de melhoria:*  
A equipe passou a separar melhor as responsabilidades entre interface, serviços, armazenamento e regras de validação. Com isso, o código ficou mais organizado e os testes puderam ser planejados de forma mais clara para cada camada do projeto.

---

#### Dificuldades, ações e priorização

*Desafio:*  
A criação dos testes automatizados do backend exigiu simular o comportamento do banco de dados sem depender diretamente do ambiente real do Supabase.

*Como foi superado:*  
Foram utilizados mocks para representar as respostas esperadas do banco de dados nos testes da função de voluntários. Isso permitiu validar os fluxos de sucesso e erro das operações de listagem, criação, atualização e exclusão com mais controle e sem depender de dados reais.

---

*Desafio:*  
A equipe precisou garantir que os testes do backend fossem executados de forma padronizada no fluxo de integração contínua.

*Como foi superado:*  
Foi configurado um workflow específico para o backend, com verificação de formatação, lint e execução dos testes com Deno. Essa automação ajudou a identificar problemas mais cedo e aumentou a confiança nas alterações feitas nas funções do Supabase.

---

*Desafio:*  
Algumas funcionalidades precisaram ser priorizadas porque o prazo da Unidade 3 exigia foco no que era mais importante para validar o MVP.

*Como foi superado:*  
A equipe concentrou esforços nas funcionalidades com maior impacto para a creche e para a demonstração do produto, deixando melhorias complementares para etapas futuras. Essa priorização ajudou a reduzir retrabalho e a manter a entrega mais estável.

---

*Desafio:*  
Houve necessidade de manter a comunicação da equipe mais alinhada durante a correção de problemas, ajustes de testes e integração das alterações.

*Como foi superado:*  
Foram reforçadas as práticas de alinhamento entre os membros, revisão das tarefas em andamento e validação das alterações antes da integração. Isso contribuiu para diminuir conflitos e melhorar a organização do trabalho coletivo.

