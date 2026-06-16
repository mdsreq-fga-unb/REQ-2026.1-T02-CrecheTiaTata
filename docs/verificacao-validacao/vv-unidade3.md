---
sidebar_label: "V&V – Unidade 3"
sidebar_position: 1
description: Verificação e Validação do projeto Creche da Tia Tata, realizada pelo grupo Desfalcados (Unidade 3).
---

# Verificação e Validação – Unidade 3

**Revisão realizada por:** Grupo Desfalcados – Rivotril (UnB App)  
**Versão do Documento:** 1.2  
**Data:** 08/06/2026  
**Integrantes revisores:** Davi Severiano, Isaac Lucas, Luís Felipe, Mateus Rodrigues, Pedro, Rivadalvio

---

## 1. Explicação Detalhada por Inspeção

### 1.1 Introdução e Objetivo

Este documento define a estratégia de **Verificação** (*estamos construindo o produto corretamente?*) e **Validação** (*estamos construindo o produto certo?*) para o projeto Creche Tia Tata. Ele detalha como os artefatos de documentação e o código-fonte serão avaliados utilizando a técnica de **Inspeção de Software apoiada por Checklists**.

### 1.2 Avaliação da Documentação (`docs/`)

#### 1.2.1 Visão do Produto e Projeto

**Conteúdo:** Cenário atual (a), Solução proposta (b), Estratégias de engenharia (c), Cronogramas (e), Interação com cliente (f) e Intervenções sociais (g).

**Estratégia:**
- **Validação:** A Solução Proposta, Cenário Atual e Intervenções Sociais devem ser validadas diretamente com a diretoria/stakeholders da Creche Tia Tata para garantir que resolvem os problemas reais.
- **Verificação:** Os Cronogramas e Estratégias de Engenharia passam por verificação interna da equipe para checar viabilidade e coesão técnica.

#### 1.2.2 Engenharia de Requisitos

**Conteúdo:** Levantamento de requisitos funcionais, não funcionais e construção da Lista de Itens de Trabalho.

**Estratégia:**
- **Verificação:** Inspeção técnica para garantir que os requisitos não são ambíguos, são testáveis e rastreáveis.
- **Validação:** Reuniões de aprovação da Lista de Itens com o Product Owner / Cliente.

#### 1.2.3 Acordos de Trabalho (`i-DoR-DoD.md`)

**Conteúdo:** Definition of Ready (DoR) e Definition of Done (DoD).

**Estratégia:**
- **Verificação:** Avaliar se as métricas de qualidade (cobertura de testes, revisão de código e CI/CD) estão contempladas no DoD para que uma task seja considerada pronta.

#### 1.2.4 Evidências, Lições Aprendidas e Entregas

**Conteúdo:** Atas de reunião, documentação de entregas e retrospectivas.

**Estratégia:**
- **Verificação:** Auditoria e revisão por pares para garantir que todas as entregas e decisões estão devidamente registradas e formatadas conforme o padrão exigido.

### 1.3 Estado e Estratégia de V&V do Aplicativo

O sistema é composto por um **Frontend em React/Vite** (`frontend/src/`) e um **Backend Serverless com Deno/Supabase** (`backend/`).

#### 1.3.1 Estado Atual do Aplicativo

**Frontend (`frontend/src/`):**
- Arquitetura estruturada com separação clara entre `pages`, `components`, `services` e `utils`.
- Testes já iniciados: `App.test.jsx`, `LoginPage.test.jsx`, `authStorage.test.js`.
- Estilização com TailwindCSS configurado.

**Backend (`backend/supabase/functions/`):**
- Edge Functions implementadas (ex: rota de `voluntarios`) com tratamento de CORS e testes isolados (`handler.test.ts`).

#### 1.3.2 Estratégia de V&V para o Código

**Verificação (Técnica):**
- **Inspeção de Código / Code Review:** Via inspeção manual do código-fonte.
- **Testes Automatizados:** Execução dos testes unitários no frontend (Jest/React Testing Library) e no backend (Deno test).
- **Análise Estática:** Uso do `eslint.config.js` para barrar antipadrões.

**Validação (Negócio):**
- **Testes de Aceitação do Usuário (UAT):** Realização do fluxo real da aplicação com a cliente (Tia Tata ou representantes) em ambiente de homologação.

---

## 2. Verificação e Validação

### 2.1 Metodologia de V&V

A V&V fundamenta-se no método de **Inspeção de Software (Revisão por Pares)**. Os checklists servem como instrumento de apoio para validar os critérios pré-definidos para cada artefato — o checklist não é o método em si.

### 2.2 Checklist de Inspeção

| Seção | Critério de Inspeção | Categoria | Técnica | Cumpre? | Justificativa |
|---|---|---|---|:---:|---|
| **1. Padrões Gerais** | O documento possui Histórico de Revisão (Data, Versão, Descrição, Autor)? | Verificação | Inspeção por Checklist e Revisão por Pares | ❌ | Histórico fragmentado: ausência de seção exclusiva e divergências de versão entre tópicos. |
| | O GitPages contém todas as seções exigidas para a Visão do Produto? | Verificação | Inspeção por Checklist | ✅ | Todos os tópicos exigidos foram constatados no GitPages. |
| | A formatação visual comunica efetivamente os requisitos e está alinhada ao modelo exigido? | Verificação | Inspeção por Checklist e Revisão por Pares | ❌ | Não há associação orgânica entre requisitos e objetivos específicos/características de produto. Apenas uma tabela visual isolada. |
| **2. Cenário Atual** | A Identificação do Cliente apresenta Nome, Tipo, Representante, Forma de contato e Vínculo? | Validação | Inspeção por Checklist e Feedback do Cliente | ✅ | Presente na seção 1.1 do GitPages. |
| | Há um Rich Picture com breve explicação (atores, processos, sistemas e problemas)? | Validação e Verificação | Inspeção por Checklist e Feedback do Cliente | ✅ | Presente na seção 1.3. |
| | O diagrama de Ishikawa está presente e estruturado? | Validação e Verificação | Inspeção por Checklist | ✅ | Ishikawa baseado no modelo 4 M's. |
| | O Mapa de Stakeholders informa relação com a solução, interesse principal e nível de influência? | Validação | Inspeção por Checklist e Feedback do Cliente | ✅ | Seção 1.6: matriz Interesse X Poder com texto descritivo de cada stakeholder. |
| | A Segmentação de Clientes descreve os diferentes perfis do público-alvo? | Validação | Inspeção por Checklist e Feedback do Cliente | ✅ | Seção 1.7: perfis, necessidades, interesses e expectativas descritos por tipo de usuário. |
| **3. Solução Proposta** | Os Objetivos Específicos (OE) estão mapeados com suas respectivas Características de Produto (CP)? | Verificação | Inspeção por Checklist | ❌ | Tabela estruturada, porém relação 1:1 em todos os OE↔CP, o que indica escopo subdimensionado. |
| | A viabilidade da proposta foi avaliada objetivamente (equipe, prazo, cliente, tecnologia e MVP)? | Verificação | Inspeção por Checklist e Revisão interna | ✅ | Cada dimensão de viabilidade abordada objetivamente, incluindo afirmação de entrega de MVP funcional. |
| | A Intervenção Social descreve impactos esperados **e** efeitos não previstos? | Validação | Inspeção por Checklist e Validação com cliente | ❌ | Documentação descreve apenas impactos positivos esperados; sem menção a efeitos colaterais ou não previstos. |
| | Há Quadro Comparativo entre dois processos de desenvolvimento justificando a escolha? | Verificação | Inspeção por Checklist e Revisão interna | ✅ | Tabela comparativa entre OpenUP e XP, com 4 motivos justificando a escolha do OpenUP. |
| **4. Eng. Requisitos** | As 6 atividades de ER estão mapeadas com suas técnicas no contexto do projeto? | Verificação | Inspeção técnica por Checklist | ✅ | 6 atividades listadas com técnica específica utilizada no contexto do projeto. |
| | As atividades de ER estão associadas às fases do processo de software escolhido? | Verificação | Inspeção técnica por Checklist | ✅ | Tabela cruza Atividades ER × Técnicas × 4 fases do OpenUP. |
| | O cronograma detalha iterações com data de início/fim, objetivos, entregas e método de validação? | Verificação | Inspeção por Checklist e Revisão interna | ✅ | Datas, objetivos, entregas e método de validação especificados para cada iteração. |
| | O documento informa composição da equipe, ferramentas de comunicação e ritos/reuniões? | Verificação | Inspeção técnica por Checklist | ✅ | Tabela de integrantes com responsabilidades, ferramentas e frequência de reuniões. |
| **5. Requisitos e Backlog** | Os RNFs estão classificados por atributos de qualidade (ex: URPS+)? | Verificação | Inspeção técnica por Checklist | ❌ | Tabela simples com ID e descrição genérica. Sem categorização por Funcionalidade, Usabilidade, Confiabilidade, Desempenho ou Suportabilidade. |
| | A Matriz-síntese de rastreabilidade conecta OE, CP, VN, RFs e RNFs? | Verificação | Inspeção técnica por Checklist | ❌ | Matriz-síntese não encontrada. Backlog apresenta rastreabilidade RF↔RNF, mas sem conexão com OE, CP e Valor de Negócio. |
| | O DoR e o DoD possuem critérios claros e mensuráveis? | Verificação | Inspeção técnica por Checklist | ❌ | Termos subjetivos ("informações suficientes", "sem erros"). Faltam métricas como "cobertura de testes ≥ 60%". |
| | O Backlog lista os itens de trabalho mapeados aos seus Requisitos Funcionais? | Validação | Inspeção técnica por Checklist | ✅ | Coluna de RNFs associados a cada item de trabalho presente na tabela do Backlog. |
| | O Backlog foi priorizado matematicamente ou por modelo conhecido? | Validação | Inspeção por Checklist e Reunião de Aprovação com Cliente | ❌ | Modelo próprio (Dificuldade × Importância). No GitPages aparece apenas a priorização do MVP; os demais itens sem critério explícito no pages. |
| | O MVP foi claramente definido com técnica reconhecida (ex: MoSCoW)? | Validação | Inspeção por Checklist e Reunião de Aprovação com Cliente | ❌ | Técnica de Dificuldade × Importância utilizada, mas critério de corte para o MVP não está explicitado. |
| **6. Lições Aprendidas** | As lições aprendidas estão registradas separadamente por Unidade? | Verificação | Auditoria, Revisão por Pares e Inspeção | ✅ | GitPages organiza lições aprendidas por unidade de desenvolvimento. |
| | A equipe registrou explicitamente as dificuldades técnicas ou processuais enfrentadas? | Verificação | Auditoria, Revisão por Pares e Inspeção | ✅ | Gargalos técnicos e processuais detalhados, incluindo problemas técnicos específicos. |
| | As ações tomadas para superar os desafios estão descritas? | Verificação | Auditoria, Revisão por Pares e Inspeção | ✅ | Para cada desafio identificado, há melhoria correspondente e descrição de como foi superado. |
| **7. Código-Fonte** | Há padronização de nomenclatura de pastas e arquivos? | Verificação | Inspeção Manual do Código-Fonte | ✅ | Componentes em PascalCase (`ContactCard.jsx`), utilitários em camelCase (`authStorage.js`). |
| | Existem testes unitários críticos implementados? | Verificação | Inspeção Manual do Código-Fonte | ✅ | Arquivos `.test.jsx` e `.test.ts` identificados no frontend e backend. |
| | Há separação clara entre UI e Regras de Negócio? | Verificação | Inspeção Manual do Código-Fonte | ✅ | UI isolada em `components/pages`; lógica de API/autenticação em `services/config`. |
| | O gerenciamento de rotas e acesso protegido estão adequadamente configurados? | Verificação | Inspeção Manual do Código-Fonte | ⚠️ A Avaliar | `protectedActions.js` e `navigation.js` identificados; inspeção aprofundada necessária para atestar bloqueio efetivo. |
| | O tratamento de CORS está implementado corretamente no backend? | Verificação | Inspeção Manual do Código-Fonte | ✅ | `cors.ts` identificado em `_shared/`, prevenindo bloqueios entre Vite e Supabase. |
| | O código está livre de dados sensíveis hardcoded (senhas/tokens)? | Verificação | Inspeção Manual do Código-Fonte | ⚠️ A Avaliar | `api.js` e `auth.js` precisam ser inspecionados para confirmar uso de `import.meta.env`. |

---

### 2.3 Detalhamento das Inspeções

#### 2.3.1 Padrões Gerais e Histórico de Revisão

- **Estratégia:** Verificação.
- **Como implementamos:** Inspeção e Revisão técnica em todo o repositório e GitPages, confrontando com o template exigido para a Visão do Produto e Projeto.
- **Resultado:** Fragmentação crítica no Histórico de Revisão. A ausência de uma seção exclusiva e as divergências de versão comprometem a auditabilidade. Formatação visual com limitações: sem associação orgânica entre requisitos, objetivos específicos e características de produto.

#### 2.3.2 Cenário Atual e Atores

- **Estratégia:** Validação e Verificação.
- **Como implementamos:** Revisão das Representações Sistêmicas (Ishikawa, Rich Picture e Mapa); Análise de Adequação ao Negócio para os atores.
- **Resultado:** Mapeamento em total conformidade. Rich Picture, Ishikawa (4 M's) e Mapa de Stakeholders (Interesse × Poder) assertivos e completos. Segmentação de clientes clara com perfis, necessidades e expectativas descritos.

#### 2.3.3 Solução Proposta e Intervenção Social

- **Estratégia:** Validação e Verificação.
- **Como implementamos:** Auditoria de Rastreabilidade Arquitetural; Análise Crítica de Contexto sobre a Intervenção Social.
- **Resultado:** Viabilidade detalhada em equipe, prazo, tecnologia e MVP. Porém, relação 1:1 entre todos os OE e CP indica escopo subdimensionado. Documentação limitada a impactos positivos, sem análise de efeitos colaterais. Escolha do OpenUP devidamente justificada por comparação com XP.

#### 2.3.4 Engenharia de Requisitos e Processos

- **Estratégia:** Verificação.
- **Como implementamos:** Checklist de Conformidade Metodológica, cruzando atividades e artefatos contra as diretrizes do OpenUP.
- **Resultado:** Conformidade alta. Seis atividades de ER listadas com técnicas específicas; tabela cruza ER × fases do OpenUP; cronograma detalhado; composição de equipe, ferramentas e ritos documentados.

#### 2.3.5 Requisitos e Backlog

- **Estratégia:** Verificação e Validação.
- **Como implementamos:** Inspeção Técnica de Métricas (verificação) e Inspeção de Priorização Matemática (validação).
- **Resultado:** RNFs sem categorização por atributos de qualidade (URPS+). Matriz-síntese de rastreabilidade ausente. DoR e DoD com critérios subjetivos, sem métricas testáveis. MVP definido, mas Backlog Geral sem critérios de priorização matematicamente transparentes visíveis no GitPages.

#### 2.3.6 Lições Aprendidas e Retrospectiva

- **Estratégia:** Verificação.
- **Como implementamos:** Auditoria de Retrospectiva inspecionando os registros iterativos.
- **Resultado:** Elevada maturidade. Gargalos técnicos e processuais documentados por unidade. Para cada desafio, ação de mitigação registrada, assegurando rastreabilidade das decisões.

---

### 2.4 Evidências Existentes

Durante a auditoria, identificou-se uma **falha crítica** na acessibilidade das evidências de validação: múltiplos links de vídeos (YouTube) indisponíveis ou privados, bem como imagens de fluxo de trabalho corrompidas.

- **Impacto na Validação:** Ausência de evidências funcionais impossibilita verificação independente dos resultados. Invalida o registro histórico de que o produto atendeu aos critérios de aceite nas entregas passadas.
- **Risco ao Processo:** Negligência na manutenção da documentação pós-entrega compromete rastreabilidade e transparência do histórico de evoluções do MVP.

### 2.5 DoR e DoD

A inspeção revelou falha metodológica na definição dos critérios de aceitação. Os tipos de verificação planejados são corretos (testes unitários, caixa preta), mas os critérios carecem de métricas mensuráveis:

- **Subjetividade:** Termos como "informações suficientes" (DoR) e "sem erros" (DoD) são abertos a interpretações subjetivas, inviabilizando auditoria de qualidade real.
- **Ausência de Indicadores:** Sem limites quantitativos (ex: cobertura de testes mínima, padrões de linting, aprovação de Code Review por pelo menos um par).
- **Risco ao CI:** Sem métricas objetivas, o ciclo de Continuous Integration torna-se puramente protocolar, sem garantia de que "Done" significa incremento de valor estável.

---

## 3. Conclusão

O projeto Creche da Tia Tata possui potencial social inquestionável. A solução tecnológica para otimizar o fluxo de doações e a gestão de voluntários demonstra alinhamento com as necessidades da comunidade.

Sob a ótica da Engenharia de Software, o projeto apresenta incertezas metodológicas que comprometem rastreabilidade e garantia de qualidade. Os **três gargalos críticos** identificados foram:

1. **Inacessibilidade das Evidências:** Links quebrados ou privados invalidam o registro histórico de validação junto ao cliente.
2. **Métricas Subjetivas:** Ausência de indicadores quantitativos nos acordos de trabalho (DoR e DoD) transforma o fluxo de CI em processo puramente protocolar.
3. **Mapeamento Superficial de Escopo:** Relação 1:1 entre todos os OE e CP indica subdimensionamento arquitetural.

A fundação do projeto é sólida e o domínio do problema foi bem compreendido. A adoção de métricas objetivas de qualidade e a restauração do histórico de validação são passos necessários para transformar a iniciativa em um produto de software rigoroso, confiável e auditável.
