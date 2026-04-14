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
A solução proposta deverá contemplar as seguintes características:

| OE Principal | ID | Contribuição Secundária | Característica | Descrição Resumida | Valor de Negócio Principal |
| :--- | :--- | :--- | :--- | :--- | :--- |
| OE1 | C1 | OE3 | Cadastro de doações | Permite registrar doações (alimentos, roupas, dinheiro) | Controle e rastreabilidade das doações |
| OE1 | C2 | - | Registro de doadores | Armazena informações dos doadores | Transparência e relacionamento com doadores |
| OE1 | C3 | OE3 | Cadastro de beneficiários | Cadastro de famílias atendidas | Organização do público atendido |
| OE1 | C4 | OE3 | Histórico de entregas | Registro de entregas realizadas | Evita duplicidade e melhora controle |
| OE2 | C5 | OE3 | Cadastro de voluntários | Registro de voluntários com dados básicos | Organização da equipe |
| OE2 | C6 | OE3 | Controle de disponibilidade | Permite informar dias e horários disponíveis | Melhor alocação de voluntários |
| OE2 | C7 | OE3 | Escala de voluntários | Organização da participação em ações | Redução de conflitos e faltas |
| OE3 | C8 | OE2 | Cadastro de eventos | Criação de ações sociais | Planejamento estruturado |
| OE3 | C9 | OE2 | Associação de voluntários a eventos | Vincula voluntários às ações | Execução eficiente das atividades |
| OE3 | C10 | OE1 | Registro de recursos utilizados | Controle de recursos por evento | Melhor gestão de recursos |
| OE4 | C11 | - | Página Sobre | Apresentação institucional do projeto | Aumento da credibilidade |
| OE4 | C12 | - | Exibição de vídeos | Divulgação de ações e impacto | Engajamento do público |
| OE4 | C13 | - | Localização | Exibição de endereço ou mapa | Facilita acesso e contato |
| OE4 | C14 | OE1 | Canal de contato/doação | Permite contato e direcionamento para doações | Captação de recursos |
| OE5 | C15 | OE2 | Canal de solicitações | Permite que a creche publique necessidades e pedidos urgentes para doações e apoio voluntário | Facilita a contribuição e aumenta o engajamento da comunidade |

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

## 2.6 Impactos Esperados
* **Para a creche:** [Descrever]
* **Para os voluntários/doadores:** [Descrever]

