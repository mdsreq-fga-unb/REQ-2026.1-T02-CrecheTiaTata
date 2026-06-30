---
sidebar_label: "Solução proposta"
sidebar_position: 2
---
# Solução Proposta

## 2.1 Objetivo Geral do Produto
Fortalecer a capacidade operacional da Creche da Tia Tata por meio da ampliação da base de doadores e voluntários, da melhoria na comunicação com a comunidade e da organização básica das contribuições recebidas.

## 2.2 Objetivos Específicos (OE) do Produto
* **OE1:** Divulgar informações essenciais da creche e suas necessidades atuais.
* **OE2:** Facilitar o contato de pessoas interessadas em doar ou atuar como voluntárias.
* **OE3:** Apoiar o registro e a consulta básica de doações e voluntários.

### 2.3 Características de Produto
A solução proposta deverá contemplar um conjunto de características de produto, descritas em nível mais alto. Uma característica pode atender a múltiplos objetivos específicos, e um objetivo específico pode ser atendido por múltiplas características, refletindo a complexidade real do sistema.

| OEs Atendidos | ID | Característica | Descrição Resumida | Possíveis RFs derivados | Possíveis RNFs derivados | Valor de Negócio Principal |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| OE1, OE2 | C1 | Vitrine Pública Digital | Página institucional acessível ao público com informações da creche, necessidades prioritárias em tempo real e formas de contato visíveis, sem necessidade de login. | RF-19 (Página Institucional), RF-20 (Publicar Solicitação), RF-21 (Listar Solicitações) | RNF-02 (Carregamento 5s), RNF-04 (Disponibilidade), RNF-11 (Padrões web), RNF-14 (Contato visível) | Ampliar alcance da creche na comunidade e reduzir a dependência do boca a boca |
| OE1, OE2 | C2 | Canal de Engajamento da Comunidade | Mecanismos que permitem a doadores e voluntários manifestar interesse, realizar contato e iniciar o processo de contribuição de forma rápida e intuitiva. | RF-05 (Registrar Doador), RF-09 (Registrar Voluntário) | RNF-03 (50 usuários), RNF-07 (Interface intuitiva), RNF-13 (Feedback) | Reduzir o atrito no processo de captação e aumentar a conversão de interesse em contribuição |
| OE2, OE3 | C3 | Gestão de Voluntários | Módulo administrativo para cadastro, edição, controle de disponibilidade, geração de escalas e histórico de participação de voluntários. | RF-09 a RF-13, RF-22 a RF-25 | RNF-01 (Resposta 3s), RNF-05 (Confirmação), RNF-10 (Logs) | Organizar e aproveitar o capital humano disponível, reduzindo perdas por falta de controle |
| OE3 | C4 | Gestão de Doações e Entregas | Módulo administrativo para registro, listagem e rastreamento de doações recebidas e itens entregues às famílias. | RF-02 a RF-08 | RNF-01 (Resposta 3s), RNF-05 (Confirmação), RNF-10 (Logs), RNF-13 (Feedback) | Eliminar perda de informações e garantir distribuição justa e rastreável dos recursos |
| OE2, OE3 | C5 | Painel Administrativo Seguro | Área restrita com autenticação para a coordenação gerenciar todas as operações do sistema, incluindo eventos, recursos e relatórios de participação. | RF-01 (Autenticação), RF-14 a RF-18, RF-26 | RNF-08 (Bloqueio sem login), RNF-09 (bcrypt+AES), RNF-12 (Expiração de sessão) | Garantir segurança e controle centralizado sobre os dados da instituição |

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

Quanto ao prazo, o escopo foi reduzido para o período do semestre, priorizando a divulgação das necessidades da creche, o contato de doadores e voluntários e o registro básico dessas contribuições.

O acesso ao cliente é direto, com a coordenadora da creche atuando como principal fonte de informações, validação e feedback. Isso favorece um levantamento de requisitos mais fiel e permite ajustes contínuos ao longo do desenvolvimento.

No que se refere ao conhecimento técnico, a equipe possui familiaridade com tecnologias como desenvolvimento web, o que reduz riscos técnicos e contribui para a viabilidade da implementação. Além disso, a escolha de ferramentas modernas e de fácil integração, como React e serviços de backend simplificados, contribui para acelerar o desenvolvimento.

Por fim, a proposta permite a construção de um MVP funcional, contemplando as principais necessidades identificadas: divulgação das necessidades, facilitação do contato e apoio à captação de doações e voluntários.

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
