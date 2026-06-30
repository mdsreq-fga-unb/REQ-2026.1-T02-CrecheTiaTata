---
sidebar_label: "8.3 Critérios de Aceitação"
sidebar_position: 3
description: Critérios de aceitação, regras de negócio e cenários de teste dos RFs do MVP da Creche da Tia Tata.
---

# 8.3 Critérios de Aceitação dos RFs do MVP

Esta página documenta os critérios de aceitação, regras de negócio e cenários negativos para cada Requisito Funcional do MVP, alinhados ao **DoR** (critérios redigidos no formato Dado/Quando/Então) e ao **DoD** (critérios validados em homologação antes da entrega).

> **Formato adotado (DoR):** Dado \[contexto\] / Quando \[ação\] / Então \[resultado esperado\]

---

## RF-01 — Autenticar Administrador

### Regras de Negócio

- Apenas usuários com `papel = "admin"` na tabela `usuarios` podem acessar as rotas de gestão.
- Credenciais inválidas não revelam se o e-mail existe (resposta genérica `"credenciais inválidas"`).
- Após autenticação bem-sucedida, o sistema emite um token JWT com expiração de 24 horas.
- Cadastro público sempre cria `papel = "usuario"` — não é possível auto-promover para `admin` via API.

### Critérios de Aceitação

| # | Cenário | Dado | Quando | Então |
|---|---|---|---|---|
| CA-01.1 | Login admin com sucesso | administrador com credenciais válidas e `papel = "admin"` | realiza `POST /usuarios?action=login` com e-mail e senha corretos | sistema retorna `HTTP 200` com `token JWT` e `papel: "admin"` |
| CA-01.2 | Credenciais inválidas | usuário envia senha incorreta | realiza `POST /usuarios?action=login` | sistema retorna `HTTP 401` com mensagem genérica; nenhum token é emitido |
| CA-01.3 | Campos obrigatórios ausentes | requisição sem campo `senha` | realiza `POST /usuarios?action=login` | sistema retorna `HTTP 400` indicando campos faltantes |
| CA-01.4 | Acesso a rota protegida sem token | requisição sem header `Authorization` | acessa qualquer rota administrativa (`/doacoes`, `/doadores`, `/voluntarios`) | sistema retorna `HTTP 401 {"error":"Não autorizado"}` |
| CA-01.5 | Token expirado | token JWT emitido há mais de 24h | acessa rota protegida com token vencido | sistema retorna `HTTP 401`; usuário deve realizar novo login |

---

## RF-02 — Registrar Doação

### Regras de Negócio

- Campos obrigatórios: `tipo` e `descricao`.
- Campo `tipo` aceita apenas: `"dinheiro"`, `"alimento"`, `"roupa"`, `"brinquedo"`, `"material"`, `"outro"`.
- Campo `quantidade` deve ser inteiro positivo (> 0); padrão `1` quando não informado.
- Campo `data_doacao` é opcional; quando ausente, usa data do registro.
- Somente usuários autenticados podem registrar doações.
- Toda doação registrada deve receber `id` único gerado pelo banco.

### Critérios de Aceitação

| # | Cenário | Dado | Quando | Então |
|---|---|---|---|---|
| CA-02.1 | Registro com dados válidos | administrador autenticado, dados completos com tipo válido | realiza `POST /doacoes` com `tipo`, `descricao`, `quantidade` e `doador_nome` | sistema retorna `HTTP 201` com `{"registrada": true, "doacao": {...}}` incluindo `id` gerado |
| CA-02.2 | Registro com quantidade padrão | administrador autenticado, `quantidade` não informada | realiza `POST /doacoes` com `tipo` e `descricao` | sistema registra doação com `quantidade = 1` e retorna `HTTP 201` |
| CA-02.3 | Tipo inválido | administrador autenticado, `tipo = "carro"` | realiza `POST /doacoes` | sistema retorna `HTTP 422` com mensagem `"Tipo de doação inválido"` |
| CA-02.4 | Campos obrigatórios ausentes | administrador autenticado, corpo sem `tipo` | realiza `POST /doacoes` | sistema retorna `HTTP 422` com `"Campos obrigatórios: tipo, descricao"` |
| CA-02.5 | Quantidade inválida | administrador autenticado, `quantidade = 0` | realiza `POST /doacoes` | sistema retorna `HTTP 422` com `"Quantidade deve ser um inteiro maior que zero"` |
| CA-02.6 | Usuário sem autenticação | requisição sem token JWT | realiza `POST /doacoes` | sistema retorna `HTTP 401 {"error":"Não autorizado"}` |

---

## RF-03 — Listar Doações

### Regras de Negócio

- Listagem disponível apenas para usuários autenticados.
- Resultados ordenados por `data_doacao` decrescente (mais recentes primeiro).
- Filtros opcionais: `tipo`, `doador_nome`, intervalo de datas.
- Lista vazia retorna `HTTP 200` com array vazio `[]`, não `HTTP 404`.

### Critérios de Aceitação

| # | Cenário | Dado | Quando | Então |
|---|---|---|---|---|
| CA-03.1 | Listagem completa | administrador autenticado, doações cadastradas no banco | realiza `GET /doacoes` sem filtros | sistema retorna `HTTP 200` com array de doações ordenado por data decrescente |
| CA-03.2 | Filtro por tipo | administrador autenticado | realiza `GET /doacoes?tipo=alimento` | sistema retorna apenas doações com `tipo = "alimento"` |
| CA-03.3 | Banco sem registros | administrador autenticado, banco vazio | realiza `GET /doacoes` | sistema retorna `HTTP 200` com `[]` |
| CA-03.4 | Usuário sem autenticação | requisição sem token JWT | realiza `GET /doacoes` | sistema retorna `HTTP 401` |

---

## RF-04 — Editar Doação

### Regras de Negócio

- Apenas usuários autenticados podem editar doações.
- O `id` da doação deve existir no banco; caso contrário, retornar `HTTP 404`.
- Campos editáveis: `tipo`, `descricao`, `quantidade`, `doador_nome`, `data_doacao`.
- Não é permitido alterar o `id` da doação.
- Toda edição deve ser registrada em log (timestamp + usuário responsável) — vinculado ao RNF-10.

### Critérios de Aceitação

| # | Cenário | Dado | Quando | Então |
|---|---|---|---|---|
| CA-04.1 | Edição com dados válidos | administrador autenticado, doação com `id` existente | realiza `PUT /doacoes/:id` com campos a alterar | sistema retorna `HTTP 200` com dados atualizados |
| CA-04.2 | Tipo alterado para valor inválido | administrador autenticado | realiza `PUT /doacoes/:id` com `tipo = "outro2"` | sistema retorna `HTTP 422` com `"Tipo de doação inválido"` |
| CA-04.3 | ID inexistente | administrador autenticado, `id` não existe no banco | realiza `PUT /doacoes/:id` | sistema retorna `HTTP 404` |
| CA-04.4 | Usuário sem autenticação | requisição sem token | realiza `PUT /doacoes/:id` | sistema retorna `HTTP 401` |

---

## RF-05 — Registrar Doador

### Regras de Negócio

- Campo obrigatório: `nome`.
- Campo `email` é opcional mas, quando informado, deve conter `@` e domínio reconhecido.
- Campo `tipo` aceita: `"pessoa_fisica"`, `"pessoa_juridica"`, `"anonimo"`; padrão `"pessoa_fisica"`.
- Não é permitido cadastrar dois doadores com o mesmo e-mail.
- Somente administradores autenticados podem cadastrar doadores.

### Critérios de Aceitação

| # | Cenário | Dado | Quando | Então |
|---|---|---|---|---|
| CA-05.1 | Cadastro com dados válidos | administrador autenticado, `nome` informado | realiza `POST /doadores` com `nome` e demais campos válidos | sistema retorna `HTTP 201` com dados do doador e `id` gerado |
| CA-05.2 | Cadastro apenas com nome | administrador autenticado | realiza `POST /doadores` somente com `nome` | sistema registra doador com campos opcionais nulos e retorna `HTTP 201` |
| CA-05.3 | Nome ausente | administrador autenticado, corpo sem `nome` | realiza `POST /doadores` | sistema retorna `HTTP 422` indicando campo obrigatório ausente |
| CA-05.4 | E-mail inválido | administrador autenticado, `email = "semdominio@"` | realiza `POST /doadores` | sistema retorna `HTTP 422` com mensagem de e-mail inválido |
| CA-05.5 | E-mail duplicado | doador com mesmo e-mail já existe | realiza `POST /doadores` com e-mail repetido | sistema retorna `HTTP 400` indicando duplicidade |
| CA-05.6 | Usuário sem autenticação | requisição sem token | realiza `POST /doadores` | sistema retorna `HTTP 401` |

---

## RF-06 — Listar Doadores

### Regras de Negócio

- Listagem disponível apenas para usuários autenticados.
- Filtros opcionais: `nome` (busca parcial), `tipo`.
- Resultado inclui contagem de doações associadas a cada doador.
- Lista vazia retorna `HTTP 200` com array `[]`.

### Critérios de Aceitação

| # | Cenário | Dado | Quando | Então |
|---|---|---|---|---|
| CA-06.1 | Listagem completa | administrador autenticado, doadores cadastrados | realiza `GET /doadores` | sistema retorna `HTTP 200` com array de doadores |
| CA-06.2 | Filtro por nome parcial | administrador autenticado | realiza `GET /doadores?nome=Maria` | sistema retorna apenas doadores cujo nome contém "Maria" (case-insensitive) |
| CA-06.3 | Banco sem registros | administrador autenticado, banco vazio | realiza `GET /doadores` | sistema retorna `HTTP 200` com `[]` |
| CA-06.4 | Usuário sem autenticação | requisição sem token | realiza `GET /doadores` | sistema retorna `HTTP 401` |

---

## RF-07 — Registrar Entrega

### Regras de Negócio

- Campos obrigatórios: `item`, `quantidade` e `data_entrega`.
- Campo `quantidade` deve ser inteiro positivo (> 0).
- Campo `beneficiario` é opcional.
- Somente administradores autenticados podem registrar entregas.
- Toda entrega registrada recebe `id` único gerado pelo banco.

### Critérios de Aceitação

| # | Cenário | Dado | Quando | Então |
|---|---|---|---|---|
| CA-07.1 | Registro com dados completos | administrador autenticado, todos os campos válidos | realiza `POST /entregas` com `item`, `quantidade` e `data_entrega` | sistema retorna `HTTP 201` com dados da entrega e `id` gerado |
| CA-07.2 | Campos obrigatórios ausentes | administrador autenticado, corpo sem `item` | realiza `POST /entregas` | sistema retorna `HTTP 422` indicando campos obrigatórios ausentes |
| CA-07.3 | Quantidade inválida | administrador autenticado, `quantidade = -1` | realiza `POST /entregas` | sistema retorna `HTTP 422` com mensagem de quantidade inválida |
| CA-07.4 | Falha de persistência | banco de dados indisponível | realiza `POST /entregas` com dados válidos | sistema retorna `HTTP 400` com mensagem de erro; nenhum registro parcial é criado |
| CA-07.5 | Usuário sem autenticação | requisição sem token | realiza `POST /entregas` | sistema retorna `HTTP 401` |

---

## RF-08 — Listar Entregas

### Regras de Negócio

- Listagem disponível apenas para usuários autenticados.
- Ordenação padrão: `data_entrega` decrescente.
- Filtros opcionais: intervalo de datas, `beneficiario`.
- Lista vazia retorna `HTTP 200` com `[]`.

### Critérios de Aceitação

| # | Cenário | Dado | Quando | Então |
|---|---|---|---|---|
| CA-08.1 | Listagem completa | administrador autenticado, entregas cadastradas | realiza `GET /entregas` | sistema retorna `HTTP 200` com array de entregas ordenado por data decrescente |
| CA-08.2 | Filtro por período | administrador autenticado | realiza `GET /entregas?de=2026-01-01&ate=2026-06-30` | sistema retorna apenas entregas no intervalo informado |
| CA-08.3 | Banco sem registros | administrador autenticado | realiza `GET /entregas` | sistema retorna `HTTP 200` com `[]` |
| CA-08.4 | Usuário sem autenticação | requisição sem token | realiza `GET /entregas` | sistema retorna `HTTP 401` |

---

## RF-09 — Registrar Voluntário

### Regras de Negócio

- Campos obrigatórios: `nome` e `email`.
- E-mail deve ser único no sistema — não é permitido duplicidade.
- Campo `area_atuacao` é opcional.
- Somente administradores autenticados podem cadastrar voluntários.

### Critérios de Aceitação

| # | Cenário | Dado | Quando | Então |
|---|---|---|---|---|
| CA-09.1 | Cadastro com dados válidos | administrador autenticado, `nome` e `email` informados | realiza `POST /voluntarios` com dados válidos | sistema retorna `HTTP 201` com dados do voluntário e `id` gerado |
| CA-09.2 | E-mail duplicado | voluntário com mesmo e-mail já existe | realiza `POST /voluntarios` com e-mail repetido | sistema retorna `HTTP 400` indicando que o e-mail já está em uso |
| CA-09.3 | Campos obrigatórios ausentes | administrador autenticado, corpo sem `email` | realiza `POST /voluntarios` | sistema retorna `HTTP 422` indicando campos obrigatórios ausentes |
| CA-09.4 | Usuário sem autenticação | requisição sem token | realiza `POST /voluntarios` | sistema retorna `HTTP 401` |

---

## RF-10 — Listar Voluntários

### Regras de Negócio

- Listagem disponível apenas para usuários autenticados.
- Filtros opcionais: `nome` (busca parcial), `area_atuacao`.
- Lista vazia retorna `HTTP 200` com `[]`.

### Critérios de Aceitação

| # | Cenário | Dado | Quando | Então |
|---|---|---|---|---|
| CA-10.1 | Listagem completa | administrador autenticado, voluntários cadastrados | realiza `GET /voluntarios` | sistema retorna `HTTP 200` com array de voluntários |
| CA-10.2 | Filtro por área de atuação | administrador autenticado | realiza `GET /voluntarios?area=educacao` | sistema retorna apenas voluntários com `area_atuacao = "educacao"` |
| CA-10.3 | Banco sem registros | administrador autenticado | realiza `GET /voluntarios` | sistema retorna `HTTP 200` com `[]` |
| CA-10.4 | Usuário sem autenticação | requisição sem token | realiza `GET /voluntarios` | sistema retorna `HTTP 401` |

---

## RF-11 — Registrar Disponibilidade

### Regras de Negócio

- Campos obrigatórios: `voluntario_id`, `dia_semana` e `horario_inicio` e `horario_fim`.
- `dia_semana` aceita: `"segunda"`, `"terca"`, `"quarta"`, `"quinta"`, `"sexta"`, `"sabado"`, `"domingo"`.
- `horario_inicio` deve ser anterior a `horario_fim`.
- Não é permitido registrar disponibilidade com sobreposição de horário para o mesmo voluntário no mesmo dia.
- O `voluntario_id` deve existir no banco.

### Critérios de Aceitação

| # | Cenário | Dado | Quando | Então |
|---|---|---|---|---|
| CA-11.1 | Registro com dados válidos | administrador autenticado, voluntário existente | realiza `POST /disponibilidades` com dados válidos | sistema retorna `HTTP 201` com dados da disponibilidade registrada |
| CA-11.2 | Conflito de horário | voluntário já tem disponibilidade das 08h às 12h na segunda | registra disponibilidade das 10h às 14h no mesmo dia | sistema retorna `HTTP 422` com `"Conflito de horário para este voluntário"` |
| CA-11.3 | Horário início >= fim | `horario_inicio = "14:00"` e `horario_fim = "08:00"` | realiza `POST /disponibilidades` | sistema retorna `HTTP 422` com mensagem de horário inválido |
| CA-11.4 | Voluntário inexistente | `voluntario_id` não existe no banco | realiza `POST /disponibilidades` | sistema retorna `HTTP 404` indicando voluntário não encontrado |
| CA-11.5 | Dia da semana inválido | `dia_semana = "feriado"` | realiza `POST /disponibilidades` | sistema retorna `HTTP 422` com mensagem de dia inválido |

---

## RF-13 — Gerar Escala

### Regras de Negócio

- Escala gerada com base nas disponibilidades registradas dos voluntários.
- Um voluntário não pode ser alocado em dois eventos com conflito de horário.
- Evento sem disponibilidade compatível retorna escala vazia para aquele slot.
- Somente administradores autenticados podem gerar escalas.

### Critérios de Aceitação

| # | Cenário | Dado | Quando | Então |
|---|---|---|---|---|
| CA-13.1 | Geração com voluntários disponíveis | administrador autenticado, evento cadastrado, voluntários com disponibilidade compatível | solicita geração de escala para o evento | sistema retorna `HTTP 200` com lista de voluntários alocados por horário |
| CA-13.2 | Conflito de horário bloqueado | voluntário já alocado em outro evento no mesmo horário | solicita alocação do mesmo voluntário | sistema exclui o voluntário da escala gerada e retorna os disponíveis sem conflito |
| CA-13.3 | Nenhum voluntário disponível | nenhum voluntário com disponibilidade compatível com o evento | solicita geração de escala | sistema retorna `HTTP 200` com `{"escala": []}` e mensagem indicando ausência de disponíveis |
| CA-13.4 | Evento inexistente | `evento_id` não existe no banco | solicita geração de escala | sistema retorna `HTTP 404` |

---

## RF-20 — Publicar Solicitação de Apoio

### Regras de Negócio

- Campos obrigatórios: `tipo_contribuicao`, `prazo` e `urgencia`.
- Campo `urgencia` aceita: `"baixa"`, `"media"`, `"alta"`.
- Campo `prazo` deve ser data futura.
- Somente administradores autenticados podem publicar solicitações.
- Solicitação publicada fica imediatamente visível na página pública.

### Critérios de Aceitação

| # | Cenário | Dado | Quando | Então |
|---|---|---|---|---|
| CA-20.1 | Publicação com dados válidos | administrador autenticado, todos os campos válidos | realiza `POST /solicitacoes` com `tipo_contribuicao`, `prazo` e `urgencia` | sistema retorna `HTTP 201`; solicitação aparece em `GET /solicitacoes` sem autenticação |
| CA-20.2 | Urgência inválida | administrador autenticado, `urgencia = "critica"` | realiza `POST /solicitacoes` | sistema retorna `HTTP 422` com mensagem de urgência inválida |
| CA-20.3 | Prazo no passado | administrador autenticado, `prazo = "2020-01-01"` | realiza `POST /solicitacoes` | sistema retorna `HTTP 422` com `"Prazo deve ser uma data futura"` |
| CA-20.4 | Campos obrigatórios ausentes | administrador autenticado, corpo sem `urgencia` | realiza `POST /solicitacoes` | sistema retorna `HTTP 422` indicando campos obrigatórios ausentes |
| CA-20.5 | Usuário sem autenticação | requisição sem token | realiza `POST /solicitacoes` | sistema retorna `HTTP 401` |

---

## RF-21 — Listar Solicitações de Apoio

### Regras de Negócio

- Listagem pública — **não requer autenticação**.
- Exibe apenas solicitações ativas (prazo não expirado).
- Ordenação: `urgencia` decrescente (alta → media → baixa), depois `prazo` crescente.
- Solicitações com prazo vencido não devem aparecer na listagem pública.

### Critérios de Aceitação

| # | Cenário | Dado | Quando | Então |
|---|---|---|---|---|
| CA-21.1 | Listagem pública sem autenticação | solicitações ativas cadastradas | visitante acessa `GET /solicitacoes` sem token | sistema retorna `HTTP 200` com solicitações ordenadas por urgência decrescente |
| CA-21.2 | Filtragem automática de vencidas | solicitação com `prazo` expirado existe no banco | visitante acessa `GET /solicitacoes` | sistema retorna apenas solicitações com prazo futuro; vencidas não aparecem |
| CA-21.3 | Ordenação por urgência | solicitações com urgências mistas | acessa `GET /solicitacoes` | itens com `urgencia = "alta"` aparecem antes de `"media"` e `"baixa"` |
| CA-21.4 | Banco sem solicitações ativas | nenhuma solicitação ativa | visitante acessa `GET /solicitacoes` | sistema retorna `HTTP 200` com `[]` |

---

## Relação com DoR e DoD

### Vínculo com o DoR

Os critérios acima satisfazem os requisitos do DoR:

| Critério DoR | Como os CAs atendem |
|---|---|
| Descrição com mínimo 50 palavras e comportamento esperado | Cada RF possui descrição funcional + regras de negócio detalhadas |
| Mínimo 2 critérios de aceitação no formato Dado/Quando/Então | Todos os RFs possuem ≥ 2 CAs positivos + cenários negativos |
| Dependências identificadas | CAs de RF-13 referenciam RF-11; CAs de RF-16 referenciam RF-09 e RF-14 |
| Vinculação ao requisito funcional | Cada CA referencia seu RF (CA-XX.Y → RF-XX) |

### Vínculo com o DoD

| Critério DoD | Como validar via CAs |
|---|---|
| Testes unitários com cobertura ≥ 60% | Cenários negativos (4xx) já têm testes em `handler.test.ts` — cobrem os CAs de erro |
| Pipeline CI passando | `deno test` executa os CAs automatizados (48/48 passando atualmente) |
| Funcionalidade testada em homologação | CAs positivos (HTTP 201/200) validados manualmente em staging antes da entrega |
| Critérios de aceitação do DoR validados | Checklist da issue marcado após validação de cada CA |

---

|Data|Versão|Descrição|Autor(es)|Revisor(es)|
| :--- | :--- | :--- | :--- | :--- |
| 29/06/2026 | 1.0 | Criação dos critérios de aceitação, regras de negócio e cenários negativos dos RFs do MVP | Enzo | |
