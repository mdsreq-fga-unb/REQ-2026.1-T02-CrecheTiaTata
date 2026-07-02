---
sidebar_label: "Casos de Uso"
sidebar_position: 11
description: Especificação dos Casos de Uso do sistema da Creche da Tia Tata no formato OpenUP.
---

# Casos de Uso

**Atores do sistema:**
- **Administrador** – coordenação da creche; acesso autenticado à área restrita
- **Visitante** – qualquer pessoa que acessa o site público sem autenticação

---

## UC-01 – Autenticar no Sistema

**Atores:** Administrador

**Objetivo:** Permitir que o administrador acesse a área restrita do sistema mediante confirmação de credenciais.

**Pré-condições:** O ator não está autenticado.

**Fluxo Principal (Autenticar):**

1. O ator acessa a página de login do sistema.
2. O Sistema exibe o formulário de autenticação com campos de e-mail e senha.
3. O ator preenche e-mail e senha e confirma o acesso.
4. O Sistema valida as credenciais, gera um token JWT e redireciona o ator ao painel administrativo.

**Fluxos Alternativos:**

FA01 – Login de Usuário Não-Administrador:
1. No passo 3 do Fluxo Principal, o ator informa credenciais de um usuário com papel `usuario`.
2. O Sistema autentica e redireciona para a área correspondente ao perfil do usuário.

**Fluxos de Exceção:**

FE01 – Credenciais Inválidas: No passo 4 do Fluxo Principal, se o Sistema detectar e-mail ou senha incorretos, a autenticação é interrompida. O Sistema exibe mensagem de erro sem indicar qual campo está errado e permite nova tentativa.

FE02 – Sessão Expirada: Se o token JWT do ator estiver expirado, o Sistema retorna 401 e redireciona automaticamente para a tela de login.

FE03 – Campos Ausentes: No passo 3 do Fluxo Principal, se o ator não preencher e-mail ou senha, o Sistema destaca os campos obrigatórios e impede o envio do formulário.

**Regras de Negócio:**

RN01 – Mensagem de erro de autenticação não deve indicar qual campo (e-mail ou senha) está incorreto, para não facilitar ataques de enumeração.

RN02 – Token JWT expira em 24h; refresh token expira em 7 dias.

---

## UC-02 – Gerenciar Doações

**Atores:** Administrador

**Objetivo:** Permitir que o ator gerencie (registre, liste e edite) as doações recebidas pela creche.

**Pré-condições:** O ator deve estar autenticado no sistema.

**Fluxo Principal (Registrar e Listar Doação):**

1. O ator acessa a seção de Gestão de Doações.
2. O Sistema exibe a lista de todas as doações registradas.
3. O ator aciona a opção de adicionar nova doação.
4. O Sistema apresenta um formulário em branco.
5. O ator preenche tipo, quantidade e data da doação e confirma.
6. O Sistema valida as informações, registra a doação com timestamp automático e retorna o ator à lista exibindo mensagem de sucesso.

**Fluxos Alternativos:**

FA01 – Editar Doação:
1. No passo 2 do Fluxo Principal, o ator seleciona uma doação e escolhe a opção "Editar".
2. O Sistema apresenta o formulário preenchido com os dados atuais.
3. O ator modifica as informações desejadas e confirma.
4. O Sistema valida, salva as atualizações e exibe mensagem de sucesso.

**Fluxos de Exceção:**

FE01 – Tipo Inválido: No passo 6 do Fluxo Principal (ou no passo 4 do FA01), se o tipo informado não pertencer ao conjunto permitido, o Sistema retorna 422 e exibe mensagem indicando os valores aceitos.

FE02 – Quantidade Inválida: No passo 6, se a quantidade for zero ou negativa, o Sistema retorna 422 e solicita correção.

FE03 – Campos Obrigatórios Ausentes: No passo 6, se `tipo` ou `descricao` estiverem ausentes, o Sistema retorna 422 e destaca os campos com erro.

FE04 – Sem Autenticação: Em qualquer passo que exija ação autenticada, se o token for inválido ou ausente, o Sistema retorna 401 e redireciona para login.

**Regras de Negócio:**

RN01 – Tipo de doação deve ser um de: `dinheiro`, `alimento`, `roupa`, `brinquedo`, `material`, `outro`.

RN02 – Quantidade deve ser inteiro maior que zero.

RN03 – Timestamp de criação (`created_at`) é gerado automaticamente pelo sistema e não pode ser informado pelo ator.

---

## UC-03 – Gerenciar Doadores

**Atores:** Administrador

**Objetivo:** Permitir que o ator gerencie (cadastre e liste) os doadores da creche.

**Pré-condições:** O ator deve estar autenticado no sistema.

**Fluxo Principal (Registrar e Listar Doador):**

1. O ator acessa a seção de Gestão de Doadores.
2. O Sistema exibe a lista de doadores cadastrados.
3. O ator aciona a opção de adicionar novo doador.
4. O Sistema apresenta um formulário em branco.
5. O ator preenche nome, tipo e opcionalmente e-mail e telefone, e confirma.
6. O Sistema valida as informações, registra o doador e retorna o ator à lista exibindo mensagem de sucesso.

**Fluxos de Exceção:**

FE01 – Campo Nome Ausente: No passo 6, se o nome não for informado, o Sistema retorna 422 e exibe mensagem de campo obrigatório.

FE02 – Tipo Inválido: No passo 6, se o tipo não for `pessoa_fisica` ou `pessoa_juridica`, o Sistema retorna 422.

FE03 – E-mail de Domínio Não Permitido: No passo 6, se o e-mail informado não pertencer a um domínio da lista permitida, o Sistema retorna 422 e informa os domínios aceitos.

FE04 – Sem Autenticação: Token ausente ou inválido → retorna 401.

**Regras de Negócio:**

RN01 – Tipo deve ser `pessoa_fisica` ou `pessoa_juridica`.

RN02 – E-mail deve pertencer a domínio permitido: gmail, outlook, hotmail, yahoo, icloud, proton.

RN03 – Nome é campo obrigatório; e-mail e telefone são opcionais.

---

## UC-04 – Gerenciar Entregas

**Atores:** Administrador

**Objetivo:** Permitir que o ator registre e consulte as entregas de doações realizadas pela creche.

**Pré-condições:** O ator deve estar autenticado no sistema.

**Fluxo Principal (Registrar e Listar Entrega):**

1. O ator acessa a seção de Gestão de Entregas.
2. O Sistema exibe a lista de entregas registradas.
3. O ator aciona a opção de registrar nova entrega.
4. O Sistema apresenta um formulário em branco.
5. O ator preenche destinatário, itens distribuídos e data, e confirma.
6. O Sistema valida, registra a entrega e retorna o ator à lista exibindo mensagem de sucesso.

**Fluxos de Exceção:**

FE01 – Campos Obrigatórios Ausentes: No passo 6, se destinatário ou data estiverem ausentes, o Sistema retorna 422 e destaca os campos com erro.

FE02 – Sem Autenticação: Token ausente ou inválido → retorna 401.

---

## UC-05 – Gerenciar Voluntários

**Atores:** Administrador

**Objetivo:** Permitir que o ator gerencie (cadastre, liste, edite, exclua e consulte histórico e relatório) os voluntários da creche.

**Pré-condições:** O ator deve estar autenticado no sistema.

**Fluxo Principal (Registrar e Listar Voluntário):**

1. O ator acessa a seção de Gestão de Voluntários.
2. O Sistema exibe a lista de voluntários cadastrados.
3. O ator aciona a opção de adicionar novo voluntário.
4. O Sistema apresenta um formulário em branco.
5. O ator preenche nome, e-mail e demais dados, e confirma.
6. O Sistema valida, registra o voluntário e retorna o ator à lista exibindo mensagem de sucesso.

**Fluxos Alternativos:**

FA01 – Editar Voluntário:
1. No passo 2 do Fluxo Principal, o ator seleciona um voluntário e escolhe "Editar".
2. O Sistema apresenta o formulário preenchido com os dados atuais.
3. O ator modifica as informações e confirma.
4. O Sistema valida, salva as atualizações e exibe mensagem de sucesso.

FA02 – Excluir Voluntário:
1. No passo 2 do Fluxo Principal, o ator seleciona um voluntário e escolhe "Excluir".
2. O Sistema exibe um modal solicitando confirmação da exclusão.
3. O ator confirma.
4. O Sistema verifica ausência de escala ativa, remove o voluntário e atualiza a listagem.

FA03 – Visualizar Histórico:
1. No passo 2 do Fluxo Principal, o ator clica no nome de um voluntário.
2. O Sistema exibe o histórico de atividades com datas e eventos em que participou.

FA04 – Gerar Relatório de Participação:
1. O ator acessa a seção de relatórios de voluntários.
2. O Sistema gera e exibe relatório consolidado de participação por voluntário com totais de atividades.

**Fluxos de Exceção:**

FE01 – Campos Obrigatórios Ausentes: No passo 6 do Fluxo Principal (ou passo 4 do FA01), se nome ou e-mail estiverem ausentes, o Sistema retorna 422.

FE02 – E-mail Duplicado: No passo 6, se o e-mail já pertencer a outro voluntário, o Sistema retorna 400 com mensagem de conflito.

FE03 – Exclusão com Escala Ativa: No passo 4 do FA02, se o voluntário possuir escala ativa, o Sistema bloqueia a exclusão e orienta o ator a desalocá-lo antes de prosseguir.

FE04 – Cancelamento de Exclusão: No passo 3 do FA02, se o ator cancelar o modal, o registro é mantido sem alteração.

FE05 – Sem Autenticação: Token ausente ou inválido → retorna 401.

**Regras de Negócio:**

RN01 – Voluntário com escala ativa não pode ser excluído diretamente; deve ser desalocado antes.

RN02 – E-mail deve ser único no cadastro de voluntários.

RN03 – A exclusão exige confirmação explícita via modal antes de ser efetivada.

---

## UC-06 – Gerenciar Disponibilidade e Escala

**Atores:** Administrador

**Objetivo:** Permitir que o ator registre disponibilidades de voluntários, gere escalas e gerencie alocações.

**Pré-condições:** O ator deve estar autenticado no sistema e voluntários devem estar cadastrados.

**Fluxo Principal (Registrar Disponibilidade e Gerar Escala):**

1. O ator acessa o perfil de um voluntário.
2. O Sistema exibe os dados do voluntário e sua disponibilidade atual.
3. O ator aciona "Registrar Disponibilidade", seleciona dias e horários, e confirma.
4. O Sistema valida, registra a disponibilidade e exibe mensagem de sucesso.
5. O ator acessa a seção de escalas, seleciona um período e aciona "Gerar Escala".
6. O Sistema cruza as disponibilidades registradas e gera a escala automaticamente, exibindo-a para revisão.

**Fluxos Alternativos:**

FA01 – Editar Disponibilidade:
1. No passo 2 do Fluxo Principal, o ator seleciona a disponibilidade existente e escolhe "Editar".
2. O Sistema apresenta os horários atuais para edição.
3. O ator modifica os horários e confirma.
4. O Sistema valida, salva as atualizações e exibe mensagem de sucesso.

FA02 – Desalocar Voluntário de Evento:
1. O ator acessa a escala ou os detalhes do evento.
2. O ator localiza o voluntário alocado e aciona "Desalocar".
3. O Sistema exibe modal de confirmação.
4. O ator confirma.
5. O Sistema remove o vínculo e atualiza a escala exibida.

**Fluxos de Exceção:**

FE01 – Conflito de Horário: No passo 4 do Fluxo Principal (ou passo 4 do FA01), se o horário informado se sobrepuser a uma disponibilidade já registrada no mesmo dia, o Sistema retorna 422 e informa o conflito.

FE02 – Sem Voluntários Disponíveis: No passo 6, se não houver voluntários disponíveis no período selecionado, o Sistema informa a ausência sem gerar escala vazia.

FE03 – Período Inválido: No passo 5, se a data inicial for posterior à data final, o Sistema retorna 422.

FE04 – Vínculo Inexistente: No passo 5 do FA02, se o voluntário não estiver alocado ao evento, o Sistema retorna 400.

**Regras de Negócio:**

RN01 – Não é permitido registrar disponibilidade sobreposta para o mesmo voluntário no mesmo dia e horário.

RN02 – A geração de escala é automática com base nas disponibilidades; o ator pode revisar mas não altera a lógica de cruzamento.

---

## UC-07 – Gerenciar Eventos

**Atores:** Administrador

**Objetivo:** Permitir que o ator gerencie (cadastre, liste, associe voluntários e registre recursos) os eventos da creche.

**Pré-condições:** O ator deve estar autenticado no sistema.

**Fluxo Principal (Registrar e Listar Evento):**

1. O ator acessa a seção de Gestão de Eventos.
2. O Sistema exibe a lista de eventos cadastrados.
3. O ator aciona a opção de adicionar novo evento.
4. O Sistema apresenta um formulário em branco.
5. O ator preenche nome, data e local, e confirma.
6. O Sistema valida, registra o evento e retorna o ator à lista exibindo mensagem de sucesso.

**Fluxos Alternativos:**

FA01 – Associar Voluntário a Evento:
1. No passo 2 do Fluxo Principal, o ator seleciona um evento e escolhe "Associar Voluntário".
2. O Sistema exibe a lista de voluntários disponíveis.
3. O ator seleciona o voluntário e confirma.
4. O Sistema cria o vínculo e exibe mensagem de sucesso.

FA02 – Registrar Recursos por Evento:
1. No passo 2 do Fluxo Principal, o ator seleciona um evento e aciona "Registrar Recursos".
2. O Sistema apresenta o formulário de recursos.
3. O ator informa tipo e quantidade dos recursos necessários e confirma.
4. O Sistema registra e exibe mensagem de sucesso.

FA03 – Exibir Resumo de Recursos:
1. No passo 2 do Fluxo Principal, o ator seleciona um evento e aciona "Ver Resumo".
2. O Sistema exibe consolidado dos recursos por tipo com totais de quantidade.

**Fluxos de Exceção:**

FE01 – Campos Obrigatórios Ausentes: No passo 6 do Fluxo Principal, se nome, data ou local estiverem ausentes, o Sistema retorna 422 e destaca os campos.

FE02 – Voluntário Já Associado: No passo 4 do FA01, se o voluntário já estiver vinculado ao evento, o Sistema retorna 400 com mensagem de vínculo existente.

FE03 – Quantidade Inválida: No passo 4 do FA02, se a quantidade for zero ou negativa, o Sistema retorna 422.

FE04 – Evento Inexistente: Se o evento referenciado não existir, o Sistema retorna 404.

FE05 – Sem Autenticação: Token ausente ou inválido → retorna 401.

**Regras de Negócio:**

RN01 – Um voluntário não pode ser associado ao mesmo evento mais de uma vez.

RN02 – Quantidade de recursos deve ser inteiro maior que zero.

---

## UC-08 – Acessar Página Institucional

**Atores:** Visitante

**Objetivo:** Permitir que o visitante acesse informações públicas da creche sem necessidade de autenticação.

**Pré-condições:** Nenhuma — acesso público.

**Fluxo Principal (Acessar Página Pública):**

1. O ator acessa o endereço do site da creche.
2. O Sistema carrega a página institucional pública em até 5s.
3. O ator visualiza missão, história, localização com mapa e formas de contato.
4. O ator pode clicar nos canais de contato para interagir com a creche.

**Fluxos de Exceção:**

FE01 – Indisponibilidade do Serviço: No passo 2, se o serviço de hospedagem estiver indisponível, o Sistema exibe página de erro padrão sem expor dados internos.

**Regras de Negócio:**

RN01 – Nenhuma autenticação é exigida para acesso à página institucional pública.

RN02 – Informações de contato e formas de doação devem estar visíveis sem necessidade de scroll em resoluções ≥ 360px.

---

## UC-09 – Publicar Solicitação de Apoio

**Atores:** Administrador

**Objetivo:** Permitir que o administrador publique necessidades da creche na página pública para captação de apoio externo.

**Pré-condições:** O ator deve estar autenticado no sistema.

**Fluxo Principal (Publicar Solicitação):**

1. O ator acessa a seção de Solicitações de Apoio.
2. O Sistema exibe as solicitações já publicadas.
3. O ator aciona "Nova Solicitação".
4. O Sistema apresenta formulário com campos de título, descrição e categoria.
5. O ator preenche os dados e confirma a publicação.
6. O Sistema valida, registra a solicitação com status `pendente` e a torna visível na página pública, exibindo mensagem de confirmação.

**Fluxos de Exceção:**

FE01 – Campos Obrigatórios Ausentes: No passo 6, se título, descrição ou categoria estiverem ausentes, o Sistema retorna 422 e destaca os campos com erro.

FE02 – Categoria Inválida: No passo 6, se a categoria não pertencer ao conjunto permitido, o Sistema retorna 422.

FE03 – Sem Autenticação: Token ausente ou inválido → retorna 401.

**Regras de Negócio:**

RN01 – Categoria deve ser uma de: `alimentacao`, `material`, `voluntario`, `financeiro`, `outro`.

RN02 – Status padrão ao publicar é `pendente`; o ator não define o status na criação.

RN03 – Somente o administrador autenticado pode publicar solicitações.

---

## UC-10 – Visualizar Solicitações de Apoio

**Atores:** Visitante

**Objetivo:** Permitir que visitantes consultem publicamente as necessidades atuais da creche.

**Pré-condições:** Nenhuma — acesso público.

**Fluxo Principal (Listar Solicitações):**

1. O ator acessa a página pública de solicitações de apoio.
2. O Sistema retorna a lista de solicitações ativas ordenadas por data de criação, sem exigir autenticação.
3. O ator visualiza título, categoria, descrição e status de cada solicitação.

**Fluxos Alternativos:**

FA01 – Filtrar por Status ou Categoria:
1. No passo 2 do Fluxo Principal, o ator aplica filtro por `status` ou `categoria`.
2. O Sistema retorna somente as solicitações que correspondem ao filtro selecionado.

**Fluxos de Exceção:**

FE01 – Filtro com Valor Inválido: No passo 2 do FA01, se o valor do filtro não pertencer ao conjunto aceito, o Sistema retorna 422 e informa os valores válidos.

FE02 – Nenhuma Solicitação Cadastrada: No passo 2 do Fluxo Principal, se não houver solicitações, o Sistema retorna 200 com lista vazia `[]` sem exibir erro.

**Regras de Negócio:**

RN01 – Listagem é pública; nenhuma autenticação é necessária.

RN02 – Ordenação padrão é por `created_at` decrescente (mais recentes primeiro).

RN03 – Filtros por `status` e `categoria` devem usar somente valores do conjunto aceito; valores inválidos resultam em erro 422.
