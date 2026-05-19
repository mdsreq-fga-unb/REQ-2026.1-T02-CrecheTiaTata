#  Guia de Contribuição e Padronização

##  Fluxo de Trabalho (Git Flow)

Para manter a estabilidade do projeto, **não é permitido realizar commits diretamente na `main`**.

1.  **Issues:** Antes de iniciar qualquer tarefa, certifique-se de que existe uma Issue aberta e atribuída a você.
2.  **Branches:** Crie uma ramificação a partir da `develop` para sua tarefa:
3.  **Pull Requests (PR):** Ao finalizar, abra um PR para a branch `develop`.

---

##  Gestão de Branches

 O formato deve ser:
`tipo/escopo-XX-descricao-curta` (XX representa o número da issue relacionada)

### Exemplos de Tipos:
* `feature/`: Para novas funcionalidades, componentes ou peças.
* `fix/`: Para correções de erros.
* `test/`: Para alterações nos testes.
* `docs/`: Para alterações em documentação.
* `refactor/`: Para refatoração do código.
* `style`: Para alterações na estilização

**Exemplos de nomes de branches:**
- `feature/frontend-21-criacao-componentes`
- `fix/frontend-87-endpoint-doacoes`

---

## Padronização de Commits

`<tipo>(escopo): <descrição curta >`

**Exemplos:**
- `feature(frontend): implementa botão interativo`
- `style(frontend): ajusta cores do botão`

---