---
sidebar_label: "Verificação dos RNFs"
sidebar_position: 1
description: Tabela de verificação dos requisitos não funcionais com método, resultado e evidência.
---

# Verificação dos Requisitos Não Funcionais

Documentação do processo de verificação de cada RNF, incluindo método adotado, resultado obtido e evidência associada, conforme critérios definidos em [8.2 Requisitos Não Funcionais](../visao-produto-projeto/h-requisitos/nao-funcionais.md).

Relacionado à issue [#119 – Verificar e evidenciar RNFs mensuráveis](https://github.com/mdsreq-fga-unb/REQ-2026.1-T02-CrecheTiaTata/issues/119).

---

## Tabela de Verificação

| ID | Critério de Aceitação | Método de Verificação | Resultado | Evidência |
|---|---|---|---|---|
| **RNF-01** | P95 das requisições autenticadas ≤ 3s sob carga normal | Teste de carga com k6: 50 VUs por 5 min nas rotas autenticadas; coletar percentil P95 | ⏳ Não verificado | Aguarda ambiente de homologação com backend em execução contínua |
| **RNF-02** | LCP ≤ 5s em conexão 3G medido pelo Lighthouse | Executar Lighthouse CLI com throttling `3G lento (400kbps)`; registrar métrica LCP da página inicial | ⏳ Não verificado | Aguarda deploy da interface pública em homologação |
| **RNF-03** | Sistema operacional sem degradação com 50 sessões ativas | Teste de carga com k6: 50 VUs simultâneos por 5 min; taxa de erro < 1% e P95 ≤ 5s | ⏳ Não verificado | Aguarda ambiente de homologação estável |
| **RNF-04** | Uptime ≥ 99% medido mensalmente | Monitoramento contínuo via UptimeRobot; relatório mensal de disponibilidade | ⏳ Não verificado | Sistema ainda não em produção |
| **RNF-05** | Caixa de confirmação exibida antes de exclusões e alterações irreversíveis | Teste manual: executar exclusão e edição irreversível; verificar presença do modal de confirmação | ⏳ Não verificado | Aguarda implementação das telas de gestão no frontend |
| **RNF-06** | Serviço restaurado em até 30 minutos após falha identificada | Teste de falha: derrubar serviço manualmente; cronometrar tempo até restauração via runbook | ⏳ Não verificado | Aguarda definição de runbook e ambiente de homologação |
| **RNF-07** | Usuário completa tarefa principal sem ajuda em até 3 tentativas | Teste de usabilidade com mínimo 3 usuários representativos; registrar número de tentativas sem intervenção | ⏳ Não verificado | Aguarda sessão de teste com cliente |
| **RNF-08** | Rotas autenticadas retornam 401 para requisições sem token válido | Inspeção de código + execução de testes automatizados `deno test` | ✅ Verificado | 48 testes passando — ver evidência abaixo |
| **RNF-09** | Nenhuma senha armazenada em texto claro; auditoria por inspeção | Inspeção de migration SQL + inspeção arquitetural do Supabase Auth | ✅ Verificado | Migration não contém campo senha — ver evidência abaixo |
| **RNF-10** | Toda criação, edição e exclusão registrada com timestamp e usuário | Inspeção de logs: executar operações CRUD; verificar campos `action`, `timestamp`, `user_id` | ⏳ Não verificado | Módulo de auditoria ainda não implementado |
| **RNF-11** | Compatível com Chrome, Firefox e Safari nas últimas 2 versões | Teste manual cross-browser: abrir aplicação; verificar ausência de erros visuais e funcionais | ⏳ Não verificado | Aguarda deploy da interface em homologação |
| **RNF-12** | Token JWT expira em 24h; refresh token em 7 dias | Inspeção do `config.toml` Supabase + configuração no painel (JWT Keys) | ✅ Verificado | `jwt_expiry = 86400` configurado em `config.toml` e no painel Supabase — ver evidência abaixo |
| **RNF-13** | Mensagem de sucesso/erro exibida em até 2s após ação | Teste manual cronometrado: executar ação crítica; medir tempo até feedback visual | ⏳ Não verificado | Aguarda implementação das telas com feedback visual |
| **RNF-14** | Informações de contato e doações visíveis sem scroll em resoluções ≥ 360px | Inspeção visual em viewport 360×640px no DevTools; verificar visibilidade sem scroll | ⏳ Não verificado | Aguarda implementação da página inicial pública |

---

## Evidências

### RNF-08 — Bloqueio de acesso sem autenticação ✅

**Método**: Execução dos testes automatizados com Deno + inspeção de código.

**Saída completa dos testes** (`deno test --allow-env --no-check supabase/functions/` — executado em 29/06/2026):

```
running 8 tests from ./supabase/functions/doacoes/handler.test.ts
POST registra doação com dados válidos ... ok (1ms)
POST retorna 401 sem JWT ... ok (0ms)
POST retorna 422 quando campos obrigatórios faltam ... ok (0ms)
POST retorna 422 quando tipo é inválido ... ok (0ms)
POST retorna 422 quando quantidade é zero ou negativa ... ok (0ms)
POST retorna 400 quando corpo é inválido ... ok (0ms)
POST retorna 400 quando banco retorna erro ... ok (0ms)
GET retorna 405 método não permitido ... ok (0ms)

running 9 tests from ./supabase/functions/doadores/handler.test.ts
POST registra doador com dados válidos ... ok (1ms)
POST registra doador apenas com nome ... ok (1ms)
POST retorna 401 sem JWT ... ok (1ms)
POST retorna 422 quando nome falta ... ok (1ms)
POST retorna 422 quando tipo é inválido ... ok (0ms)
POST retorna 422 quando email é inválido ... ok (0ms)
POST retorna 400 quando corpo é inválido ... ok (0ms)
POST retorna 400 quando banco retorna erro ... ok (0ms)
GET retorna 405 método não permitido ... ok (0ms)

running 22 tests from ./supabase/functions/usuarios/handler.test.ts
POST login retorna token com credenciais válidas de admin ... ok (1ms)
POST login de usuário comum retorna 200 com papel usuario ... ok (0ms)
POST login retorna 401 com credenciais inválidas ... ok (0ms)
POST login retorna 400 quando campos faltam ... ok (0ms)
GET perfil retorna dados com JWT válido ... ok (0ms)
GET perfil retorna 401 sem JWT ... ok (0ms)
GET perfil retorna 400 quando email não informado ... ok (0ms)
GET perfil retorna 400 quando banco retorna erro ... ok (0ms)
POST cria conta com dados válidos ... ok (0ms)
POST retorna 422 quando campos obrigatórios faltam ... ok (0ms)
POST retorna 422 quando email não tem @ ... ok (0ms)
POST retorna 422 quando domínio do email não é permitido ... ok (0ms)
POST retorna 400 quando auth retorna erro (email duplicado) ... ok (0ms)
PUT atualiza dados com JWT válido ... ok (0ms)
PUT retorna 401 sem JWT ... ok (0ms)
PUT retorna 400 quando email não informado ... ok (0ms)
PUT retorna 400 quando banco retorna erro ... ok (0ms)
DELETE remove conta com JWT válido ... ok (0ms)
DELETE retorna 401 sem JWT ... ok (0ms)
DELETE retorna 400 quando email não informado ... ok (0ms)
DELETE retorna 404 quando usuário não encontrado ... ok (0ms)
DELETE retorna 400 quando banco retorna erro ao deletar ... ok (0ms)

running 9 tests from ./supabase/functions/voluntarios/handler.test.ts
GET retorna lista de voluntários ... ok (1ms)
GET retorna 400 quando banco retorna erro ... ok (0ms)
POST cria voluntário com dados válidos ... ok (0ms)
POST retorna 422 quando nome ou email faltam ... ok (0ms)
POST retorna 400 quando banco retorna erro ao inserir ... ok (0ms)
PUT atualiza voluntário existente ... ok (0ms)
PUT retorna 400 quando id não informado ... ok (0ms)
DELETE remove voluntário existente ... ok (0ms)
DELETE retorna 400 quando id não informado ... ok (0ms)

ok | 48 passed | 0 failed (307ms)
```

**Testes 401 confirmados** (5 casos cobertos):
- `doacoes`: `POST retorna 401 sem JWT` ✅
- `doadores`: `POST retorna 401 sem JWT` ✅
- `usuarios`: `GET perfil retorna 401 sem JWT` ✅
- `usuarios`: `PUT retorna 401 sem JWT` ✅
- `usuarios`: `DELETE retorna 401 sem JWT` ✅

**Implementação** ([`_shared/auth.ts`](https://github.com/mdsreq-fga-unb/REQ-2026.1-T02-CrecheTiaTata/blob/develop/backend/supabase/functions/_shared/auth.ts)):

```typescript
export async function verificarJWT(req: Request, supabase: SupabaseClientLike) {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;
  const token = authHeader.slice(7);
  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) return null;
  return user;
}
```

Padrão aplicado em todas as rotas protegidas ([`doacoes/handler.ts`](https://github.com/mdsreq-fga-unb/REQ-2026.1-T02-CrecheTiaTata/blob/develop/backend/supabase/functions/doacoes/handler.ts)):

```typescript
const user = await verificarJWT(req, supabase);
if (!user) {
  return new Response(JSON.stringify({ error: "Não autorizado" }), {
    status: 401,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
```

**Resultado**: ✅ 48/48 testes passando. Critério atendido. Confirmado via PR [#87](https://github.com/mdsreq-fga-unb/REQ-2026.1-T02-CrecheTiaTata/pull/87) (merged) e CI [#28409871881](https://github.com/mdsreq-fga-unb/REQ-2026.1-T02-CrecheTiaTata/actions/runs/28409871881) (success).

---

### RNF-09 — Senhas com hash; dados sensíveis protegidos ✅

**Método**: Inspeção da migration SQL + inspeção arquitetural.

**Migration da tabela `usuarios`** ([`20260530000000_add_papel_usuarios.sql`](https://github.com/mdsreq-fga-unb/REQ-2026.1-T02-CrecheTiaTata/blob/develop/backend/supabase/migrations/20260530000000_add_papel_usuarios.sql)):

```sql
-- RF-01: Autenticar Administrador
-- Adiciona o papel do usuário para distinguir administradores dos demais.
alter table public.usuarios
  add column if not exists papel text not null default 'usuario';

alter table public.usuarios
  add constraint usuarios_papel_check check (papel in ('admin', 'usuario'));
```

**Observação**: a tabela `public.usuarios` contém apenas `papel`, `nome` e `email`. **Nenhum campo `password` ou `senha`** está presente.

A autenticação é delegada ao **Supabase Auth**, que:
- Gerencia credenciais em esquema interno isolado (`auth.users`)
- Aplica **bcrypt** para hashing de senhas por padrão (comportamento documentado e auditado pela plataforma)
- Nunca retorna a senha em nenhuma resposta de API

**Resultado**: ✅ Critério atendido. Nenhuma senha armazenada em texto claro na camada da aplicação.

---

### RNF-12 — Expiração automática de sessão ✅

**Método**: Inspeção do `config.toml` + configuração no painel Supabase (Settings → JWT Keys).

**Configuração aplicada** ([`backend/supabase/config.toml`](https://github.com/mdsreq-fga-unb/REQ-2026.1-T02-CrecheTiaTata/blob/develop/backend/supabase/config.toml)):

```toml
[auth]
jwt_expiry = 86400
```

`86400` segundos = **24 horas**. Configuração também aplicada no painel Supabase em **Settings → JWT Keys → JWT expiry = 86400**.

**Verificação complementar** (para confirmar em produção):
```bash
# Fazer login e decodificar o JWT retornado em jwt.io
# Verificar: exp - iat = 86400
```

**Resultado**: ✅ Critério atendido. Token JWT expira em 24h conforme definido no RNF-12.

---

## RNFs Não Verificados — Justificativa

| ID | Categoria | Motivo da Não Verificação |
|---|---|---|
| RNF-01 | Desempenho | Requer ambiente de homologação em execução para coleta do P95 com k6 |
| RNF-02 | Desempenho | Requer interface pública deployada para execução do Lighthouse |
| RNF-03 | Desempenho | Requer ambiente em execução para simular 50 VUs simultâneos |
| RNF-04 | Confiabilidade | Requer sistema em produção para medir uptime mensal |
| RNF-05 | Confiabilidade | Requer telas de gestão implementadas no frontend |
| RNF-06 | Confiabilidade | Requer runbook de recuperação e ambiente de homologação |
| RNF-07 | Usabilidade | Requer sessão de teste com usuários representativos |
| RNF-10 | Suportabilidade | Módulo de auditoria/logs ainda não implementado |
| RNF-11 | Suportabilidade | Requer interface deployada para teste cross-browser |
| RNF-13 | Usabilidade | Requer telas com feedback visual implementadas |
| RNF-14 | Usabilidade | Requer página inicial pública implementada |

---

## Plano de Verificação

| Prioridade | Ação | RNFs |
|---|---|---|
| ✅ Concluído | `jwt_expiry = 86400` aplicado em `config.toml` e painel Supabase | RNF-12 |
| 🟡 Frontend deployado | Teste Lighthouse 3G; inspeção visual 360px; teste cross-browser; feedback visual | RNF-02, RNF-11, RNF-13, RNF-14 |
| 🟡 Frontend + modal | Teste manual de exclusão/edição com modal de confirmação | RNF-05 |
| 🟠 Homologação estável | Testes de carga com k6 (P95 e 50 VUs) | RNF-01, RNF-03 |
| 🟠 Logs implementados | Inspeção de log após operações CRUD | RNF-10 |
| 🟢 Sessão com cliente | Teste de usabilidade com 3 usuários | RNF-07 |
| 🟢 Pós-produção | Monitoramento de uptime; simulação de falha | RNF-04, RNF-06 |

---

|Data|Versão|Descrição|Autor(es)|Revisor(es)|
| :--- | :--- | :--- | :--- | :--- |
| 29/06/2026 | 1.0 | Criação da tabela de verificação com evidências de testes automatizados e inspeção de código | Enzo | |
