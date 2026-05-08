# Frontend da Creche Tia Tata

## Como rodar o frontend

1. Navegue até a pasta do frontend:

```bash
cd frontend
```

2. Instale as dependências:

```bash
pnpm install
```

3. Inicie a aplicação em modo de desenvolvimento:

```bash
pnpm start
```

4. Abra o navegador em:

```text
http://localhost:3000
```

## Scripts disponíveis

- `pnpm start` — inicia o frontend em modo de desenvolvimento.
- `pnpm build` — gera a versão de produção em `build/`.
- `pnpm test` — executa os testes.

## Estrutura de pastas

- `public/`
  - Arquivos estáticos públicos usados pelo app, como `index.html`.

- `src/`
  - `App.jsx` — componente raiz da aplicação.
  - `index.jsx` — ponto de entrada que renderiza o `App`.
  - `components/` — componentes.
  - `hooks/` — hooks do React.
  - `pages/` — páginas do site.
  - `styles/` — estilos CSS .

- `package.json` — dependências, scripts e configuração do frontend.