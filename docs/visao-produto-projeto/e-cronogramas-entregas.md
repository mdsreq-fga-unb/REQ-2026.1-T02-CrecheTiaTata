---
sidebar_label: "Cronograma e Entregas"
sidebar_position: 5
---

# 5 CRONOGRAMA E ENTREGAS

## Status Real do Projeto e Justificativa de Atrasos

O sistema possui **27 Requisitos Funcionais** mapeados, sendo que o **MVP contempla 18 RFs** priorizados para as iterações da fase de Construção. Atualmente, o status dos 18 RFs do MVP é: **2 concluídos, 10 incompletos e 6 não feitos**.

**Motivo dos Desvios (Integração Frontend/Backend):**
A principal causa dos atrasos nas iterações de construção foi a falta de alinhamento e gargalos na integração entre o Frontend e o Backend. O desenvolvimento das duas frentes ocorreu de maneira isolada em algumas tarefas, e, no momento de realizar as requisições à API, surgiram impedimentos técnicos que bloquearam a finalização dos requisitos. Isso gerou um efeito cascata de atrasos a partir da Iteração 4, impactando as entregas subsequentes e deixando o MVP com um alto número de pendências na Fase de Transição, que agora foca em resolver a comunicação entre os sistemas (Front e Back) nas duas semanas restantes.

---

## Fase de Concepção
Objetivo: Definir Escopo e Viabilidade do projeto

### Iteração 1
- **Data:** 31/03/2026 - 09/04/2026
- **Objetivo:** Definição do escopo do projeto, identificação do cliente/problema e viabilidade.
- **Planejado:** Definição de escopo, documentação inicial.
- **Realizado:** Escopo e viabilidade definidos.
- **Pendente:** Nenhum.
- **Desvio:** Nenhum.

---

## Fase de Elaboração
Objetivo: Detalhamento dos requisitos e arquitetura

### Iteração 2
- **Data:** 10/04/2026 - 27/04/2026
- **Objetivo:** Criação do protótipo de alta fidelidade e definição da arquitetura.
- **Planejado:** Protótipo de alta fidelidade e documento de arquitetura.
- **Realizado:** Protótipo validado pelo cliente, com foco no design; arquitetura definida.
- **Pendente:** Nenhum.
- **Desvio:** Nenhum.
- **Evidências:** [Reunião de Validação do protótipo](/docs/evidencias/Entregas-cliente).

---

## Fase de Construção
Objetivo: Desenvolvimento das funcionalidades do Sistema

### Iteração 3
- **Data:** 28/04/2026 - 11/05/2026
- **Objetivo:** Criação da *Landing Page* e Página Sobre, apresentando o trabalho da Creche, localização e contatos (UC-08).
- **Planejado:** [RF-19](/docs/visao-produto-projeto/h-requisitos/funcionais.md#RF-19) (Exibir Informações Institucionais).
- **Realizado:** RF-19. Demonstração das páginas para o cliente.
- **Pendente:** Nenhum.
- **Desvio:** Nenhum.
- **Evidências:** [Página de Início](/docs/evidencias/Andamento-do-projeto#rf-19), [Sobre](/docs/evidencias/Andamento-do-projeto#sobre) e [Contato](/docs/evidencias/Andamento-do-projeto#contato).

### Iteração 4
- **Data:** 12/05/2026 - 25/05/2026
- **Objetivo:** Cadastro de voluntários, controle de disponibilidade e escala (UC-05, UC-06).
- **Planejado:** [RF-09](/docs/visao-produto-projeto/h-requisitos/funcionais.md#RF-09), [RF-10](/docs/visao-produto-projeto/h-requisitos/funcionais.md#RF-10), [RF-11](/docs/visao-produto-projeto/h-requisitos/funcionais.md#RF-11), [RF-12](/docs/visao-produto-projeto/h-requisitos/funcionais.md#RF-12), [RF-22](/docs/visao-produto-projeto/h-requisitos/funcionais.md#RF-22), [RF-23](/docs/visao-produto-projeto/h-requisitos/funcionais.md#RF-23), [RF-24](/docs/visao-produto-projeto/h-requisitos/funcionais.md#RF-24).
- **Realizado:** Apenas RF-09 (Registrar Voluntário) concluído.
- **Pendente:** RF-10, RF-11, RF-12, RF-22, RF-23, RF-24 (Constam como incompletos).
- **Desvio:** Atraso grave gerado pela falta de integração entre Frontend e Backend, impedindo a validação do armazenamento correto e listagem dos dados de voluntários.
- **Evidências:** [ICadastro e Login](/docs/evidencias/Andamento-do-projeto#RF-9).

### Iteração 5
- **Data:** 26/05/2026 - 08/06/2026
- **Objetivo:** Cadastro de doações, registro de doadores e autenticação no sistema (UC-01, UC-02, UC-03).
- **Planejado:** [RF-01](/docs/visao-produto-projeto/h-requisitos/funcionais.md#RF-01), [RF-02](/docs/visao-produto-projeto/h-requisitos/funcionais.md#RF-02), [RF-03](/docs/visao-produto-projeto/h-requisitos/funcionais.md#RF-03), [RF-04](/docs/visao-produto-projeto/h-requisitos/funcionais.md#RF-04), [RF-05](/docs/visao-produto-projeto/h-requisitos/funcionais.md#RF-05), [RF-06](/docs/visao-produto-projeto/h-requisitos/funcionais.md#RF-06).
- **Realizado:** Nenhum requisito foi 100% finalizado.
- **Pendente:** RF-01, RF-03, RF-04, RF-06 (Incompletos); RF-02, RF-05 (Não iniciados).
- **Desvio:** Efeito cascata da Iteração 4. A equipe precisou dividir os esforços para tentar corrigir a integração, inviabilizando a entrega das funcionalidades de doação no prazo.
- **Evidências:** Nenhuma evidência de funcionalidade completa

### Iteração 6
- **Data:** 09/06/2026 - 15/06/2026
- **Objetivo:** Canal de solicitações de apoio e acompanhamento de entregas (UC-04, UC-09, UC-10).
- **Planejado:** [RF-07](/docs/visao-produto-projeto/h-requisitos/funcionais.md#RF-07), [RF-08](/docs/visao-produto-projeto/h-requisitos/funcionais.md#RF-08), [RF-20](/docs/visao-produto-projeto/h-requisitos/funcionais.md#RF-20), [RF-21](/docs/visao-produto-projeto/h-requisitos/funcionais.md#RF-21).
- **Realizado:** Nenhum.
- **Pendente:** RF-07, RF-08, RF-20, RF-21.
- **Desvio:** Desenvolvimento das *features* paralisado. O acúmulo de dívida técnica e ausência de conexão Front/Back impediu o início destas funcionalidades dentro do cronograma original.
- **Evidências:** Nenhuma.

---

## Fase de Transição
Objetivo: Entrega do sistema ao cliente

### Iteração 7
- **Data:** 16/06/2026 - 03/07/2026
- **Objetivo Real:** Tentativa de estabilização do MVP, resolução dos conflitos de integração Front/Back e deploy.
- **Planejado Inicialmente:** Deploy completo do MVP e validação de aprovação com o cliente.
- **Realizado até o momento:** Deploy inicial do sistema web realizado na Vercel.
- **Pendente:** Validação final com a cliente e finalização do código dos 16 RFs incompletos/não feitos.
- **Desvio:** A fase de transição precisou ser adaptada. Em vez de apenas validar e treinar o uso, o tempo útil está sendo consumido para finalizar o desenvolvimento técnico e "ligar" as partes do sistema antes de apresentar o produto viável à cliente.

---

## Versões
|Data|Versão|Descrição|Autor(es)|Revisor(es)|
| :--- | :--- | :--- | :--- | :--- |
| 13/04/2026 | 1.0 | Criação da página | Matheus Pinheiro |  |
| 23/04/2026 | 1.1 | Alinhamento do cronograma com o processo escolhido | Matheus Pinheiro |  |
| 01/05/2026 | 1.2 | Alteração na data final das iterações da fase de contrução | Matheus Pinheiro |  |
| 17/05/2026 | 2.0 | Ajustes na ordem das iterações e remoção de funcionalidades fora do MVP | Matheus Pinheiro |  |
| 15/06/2026 | 2.1 | Atualização de status e Casos de Uso | Matheus Pinheiro | Equipe |
| 01/07/2026 | 3.0 | Reestruturação do cronograma aplicando critérios de aceite, desvios e pendências do MVP atualizado | Lorena RIbeiro | |