---
sidebar_label: "Solução proposta"
sidebar_position: 2
---
# Solução Proposta

## 2.1 Objetivo Geral do Produto
Desenvolver um sistema web que centralize a gestão da Creche da Tia Tata e atue como uma plataforma de conexão entre o projeto e a comunidade, com o objetivo de ampliar a captação de doações e voluntários, facilitar a comunicação e a participação, e melhorar a organização interna das atividades.

## 2.2 Objetivos Específicos (OE) do Produto
* **OE1:** Melhorar o controle e a rastreabilidade das doações realizadas no projeto.
* **OE2:** Apoiar a organização e o planejamento das atividades e ações sociais (foco nos voluntários).
* **OE3:** Centralizar as informações do projeto em um único ambiente acessível.
* **OE4:** Ampliar a captação de doações e voluntários por meio de presença digital estruturada, aumentando a transparência.

### 2.3 Características de Produto
A solução proposta deverá contemplar um conjunto reduzido de características de produto, descritas em nível mais alto. A partir delas, poderão ser derivados poucos requisitos funcionais e não funcionais, evitando que esta seção se torne uma lista detalhada de funcionalidades.

| OE Principal | ID | Característica | Descrição Resumida | Possíveis RFs derivados | Possíveis RNFs derivados | Valor de Negócio Principal |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| OE1 | C1 | Gestão de doações | Apoia o registro, acompanhamento e consulta das doações recebidas pela creche. | Registrar doação; consultar histórico de doações. | Rastreabilidade das informações; integridade dos registros. | Melhor controle e transparência das doações. |
| OE2 | C2 | Gestão de voluntariado | Apoia o cadastro de pessoas voluntárias e a organização de sua participação nas ações sociais. | Registrar voluntário; consultar disponibilidade; vincular voluntário a uma ação. | Usabilidade no cadastro; disponibilidade das informações para organização interna. | Melhor planejamento das atividades e redução de conflitos de agenda. |
| OE3 | C3 | Centralização de informações institucionais | Reúne informações essenciais sobre a creche, sua atuação, contato, localização e necessidades atuais. | Visualizar informações da creche; visualizar necessidades prioritárias. | Acessibilidade; responsividade; clareza das informações. | Facilita o acesso da comunidade às informações do projeto. |
| OE4 | C4 | Canal de engajamento da comunidade | Facilita que doadores e voluntários manifestem interesse em contribuir com a creche. | Solicitar contato para doação; solicitar participação como voluntário. | Segurança no acesso; facilidade de uso em dispositivos móveis. | Amplia a captação de doações e voluntários. |
| OE4 | C5 | Transparência e divulgação de impacto | Apresenta ações realizadas, resultados alcançados e informações que aumentem a confiança da comunidade no projeto. | Visualizar ações e impactos divulgados pela creche. | Credibilidade das informações; atualização periódica do conteúdo. | Aumenta a confiança de doadores, voluntários e parceiros. |

### 2.4 Tecnologias a Serem Utilizadas

* **Frontend:** React + PWA
* **Backend:** Supabase (Auth + Database + API + Storage)
* **Banco de dados:** PostgreSQL (via Supabase)
* **Deploy:** Vercel (frontend) + Supabase (backend)



## 2.5 Pesquisa de Mercado e Análise Competitiva
Instituto do Carinho [https://institutodocarinho.org.br/]

Embora o Instituto do Carinho disponibilize informações sobre como contribuir, o processo ainda depende de iniciativa e interação manual por parte do usuário.

O diferencial da solução proposta não está apenas na disponibilização dessas informações, mas na redução do atrito no processo de contribuição. O sistema permite que usuários identifiquem rapidamente as necessidades atuais da creche e ajam de forma imediata, sem etapas intermediárias complexas.

Além disso, a proposta incorpora mecanismos de organização e gestão, como o planejamento de voluntários e a centralização das informações, promovendo uma experiência mais eficiente tanto para os colaboradores quanto para a coordenação do projeto.

Dessa forma, a solução vai além do modelo informativo, oferecendo uma plataforma que integra divulgação, engajamento e operação em um único ambiente.

## 2.6 Viabilidade da Proposta
A proposta apresentada é considerada viável dentro do contexto da disciplina, levando em conta os aspectos de equipe, prazo, acesso ao cliente, conhecimento técnico e possibilidade de entrega de um MVP funcional.

Em relação à equipe, o desenvolvimento será realizado de forma individual, o que reduz a complexidade de comunicação e tomada de decisão, permitindo maior agilidade na implementação das funcionalidades.

Quanto ao prazo, o escopo foi definido de forma adequada para o período do semestre, priorizando funcionalidades essenciais como gestão de doações, cadastro de voluntários e divulgação das necessidades da creche, possibilitando a entrega de um MVP funcional.

O acesso ao cliente é direto, com a coordenadora da creche atuando como principal fonte de informações, validação e feedback. Isso favorece um levantamento de requisitos mais fiel e permite ajustes contínuos ao longo do desenvolvimento.

No que se refere ao conhecimento técnico, a equipe possui familiaridade com tecnologias como desenvolvimento web, o que reduz riscos técnicos e contribui para a viabilidade da implementação. Além disso, a escolha de ferramentas modernas e de fácil integração, como React e serviços de backend simplificados, contribui para acelerar o desenvolvimento.

Por fim, a proposta permite a construção de um MVP funcional, contemplando as principais necessidades identificadas, como centralização das informações, facilitação da comunicação e apoio à captação de doações e voluntários.

Dessa forma, conclui-se que o projeto é viável, com baixo risco de execução, desde que seja mantido o foco nas funcionalidades essenciais e adotada uma abordagem incremental ao longo do desenvolvimento.

## 2.7 Impactos Esperados

### Para o Cliente:
* Reduz a dependência do "boca a boca" ao criar uma presença digital permanente e pesquisável no Google
* Resolve o problema do acúmulo de itens desnecessários e o desperdício de espaço, direcionando a comunidade para o que realmente falta no inventário atual da instituição.
* Garante que o histórico de famílias e doadores seja preservado digitalmente, impedindo que informações vitais se percam com a rotatividade de voluntários ou falhas em registros físicos.
* Filtra e automatiza o fluxo de dúvidas repetitivas sobre logística e funcionamento, devolvendo à coordenação o tempo necessário para focar exclusivamente no desenvolvimento das crianças.
* Aumenta a credibilidade perante novos doadores e parceiros institucionais que buscam transparência antes de contribuir.

### Para os voluntários/doadores:
* Remove a barreira da indecisão ao fornecer uma lista em tempo real do que é prioridade, garantindo que o doador sinta que seu investimento financeiro ou material terá utilidade imediata.
* Cria um ciclo de transparência onde o colaborador percebe a organização profissional do projeto, o que aumenta a confiança para transformar uma doação única em um apoio recorrente.
* Facilita a alocação de talentos específicos em vez de apenas esforço braçal, permitindo que o voluntário encontre tarefas que se alinhem com suas habilidades e disponibilidade real.
* Integra a causa social ao cotidiano do usuário através do acesso rápido via dispositivo móvel, possibilitando que a intenção de ajudar se transforme em ação prática de forma rápida e intuitiva.
