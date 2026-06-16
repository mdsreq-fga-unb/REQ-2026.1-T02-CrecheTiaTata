---
sidebar_label: "8.2 Não Funcionais"
sidebar_position: 2
description: Lista de requisitos não funcionais do sistema da Creche da Tia Tata.
---

# 8.2 Requisitos Não Funcionais

Os requisitos não funcionais foram classificados segundo o modelo **URPS+** (Usabilidade, Confiabilidade, Desempenho, Suportabilidade e Segurança), permitindo rastreabilidade e avaliação objetiva de qualidade.

## Usabilidade (U)

| ID | Descrição | Critério de Aceitação |
|---|---|---|
| **RNF-07** | Interface intuitiva | Usuário completa tarefa principal sem ajuda em até 3 tentativas |
| **RNF-13** | Feedback ao usuário em ações críticas | Mensagem de sucesso/erro exibida em até 2s após ação |
| **RNF-14** | Informações de contato e doações visíveis | Visíveis sem scroll na tela inicial em resoluções ≥ 360px |

## Confiabilidade (R — Reliability)

| ID | Descrição | Critério de Aceitação |
|---|---|---|
| **RNF-04** | Alta disponibilidade | Uptime ≥ 99% medido mensalmente |
| **RNF-05** | Confirmação em ações críticas | Caixa de confirmação exibida antes de exclusões e alterações irreversíveis |
| **RNF-06** | Recuperação de falhas em 30 min | Serviço restaurado em até 30 minutos após falha identificada |

## Desempenho (P — Performance)

| ID | Descrição | Critério de Aceitação |
|---|---|---|
| **RNF-01** | Resposta de operações internas em até 3s | P95 das requisições autenticadas ≤ 3s sob carga normal |
| **RNF-02** | Carregamento da página pública em até 5s | LCP ≤ 5s em conexão 3G medido pelo Lighthouse |
| **RNF-03** | Suportar 50 usuários simultâneos | Sistema operacional sem degradação com 50 sessões ativas |

## Suportabilidade (S)

| ID | Descrição | Critério de Aceitação |
|---|---|---|
| **RNF-10** | Logs de operações críticas | Toda criação, edição e exclusão registrada com timestamp e usuário |
| **RNF-11** | Padrões web modernos | Compatível com Chrome, Firefox e Safari nas últimas 2 versões |

## + Segurança

| ID | Descrição | Critério de Aceitação |
|---|---|---|
| **RNF-08** | Bloqueio de acesso sem autenticação | Rotas administrativas retornam 401 para requisições sem token válido |
| **RNF-09** | Senhas com hash bcrypt e dados sensíveis criptografados (AES) | Nenhuma senha armazenada em texto claro; auditoria por inspeção de banco |
| **RNF-12** | Expiração automática de sessão | Token JWT expira em 24h; refresh token em 7 dias |

---

|Data|Versão|Descrição|Autor(es)|Revisor(es)|
| :--- | :--- | :--- | :--- | :--- |
| 18/05/2026 | 1.0 | Criação da página | Matheus Pinheiro | |
| 15/06/2026 | 1.1 | Categorização URPS+ com critérios de aceitação mensuráveis | Matheus Pinheiro | |
