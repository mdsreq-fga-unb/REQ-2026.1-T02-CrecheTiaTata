import { assertEquals } from "std/assert";
import { handleSolicitacoes } from "./handler.ts";

const MOCK_USER = { id: "uuid-1", email: "admin@gmail.com" };
const MOCK_TOKEN = "valid-jwt-token";

function createMockSupabase({
  dbData = null as unknown,
  dbError = null as { message: string } | null,
  authUser = null as typeof MOCK_USER | null,
  authError = null as { message: string } | null,
} = {}) {
  const result = { data: dbData, error: dbError };

  const chain: Record<string, unknown> = {
    insert: () => chain,
    select: () => chain,
    single: () => Promise.resolve(result),
  };

  return {
    from: () => chain,
    auth: {
      getUser: (_token: string) =>
        Promise.resolve({
          data: { user: authUser },
          error: authError,
        }),
    },
  };
}

function reqComToken(url: string, init: RequestInit = {}) {
  return new Request(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${MOCK_TOKEN}`,
      ...(init.headers as Record<string, string>),
    },
  });
}

const SOLICITACAO_VALIDA = {
  titulo: "Precisamos de fraldas",
  descricao: "Estamos sem estoque de fraldas tamanho P e M",
  categoria: "material",
};

Deno.test("POST cria solicitação com dados válidos", async () => {
  const criada = { id: "sol-1", ...SOLICITACAO_VALIDA, status: "pendente" };
  const mock = createMockSupabase({ dbData: criada, authUser: MOCK_USER });

  const req = reqComToken("http://localhost/solicitacoes", {
    method: "POST",
    body: JSON.stringify(SOLICITACAO_VALIDA),
  });
  const res = await handleSolicitacoes(req, mock);

  assertEquals(res.status, 201);
  const body = await res.json();
  assertEquals(body.publicada, true);
  assertEquals(body.solicitacao.titulo, "Precisamos de fraldas");
  assertEquals(body.solicitacao.status, "pendente");
});

Deno.test("POST cria solicitação com status explícito", async () => {
  const payload = { ...SOLICITACAO_VALIDA, status: "em_andamento" };
  const criada = { id: "sol-2", ...payload };
  const mock = createMockSupabase({ dbData: criada, authUser: MOCK_USER });

  const req = reqComToken("http://localhost/solicitacoes", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  const res = await handleSolicitacoes(req, mock);

  assertEquals(res.status, 201);
  const body = await res.json();
  assertEquals(body.publicada, true);
});

Deno.test("POST retorna 401 sem JWT", async () => {
  const mock = createMockSupabase({});

  const req = new Request("http://localhost/solicitacoes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(SOLICITACAO_VALIDA),
  });
  const res = await handleSolicitacoes(req, mock);

  assertEquals(res.status, 401);
});

Deno.test("POST retorna 422 quando titulo falta", async () => {
  const mock = createMockSupabase({ authUser: MOCK_USER });

  const req = reqComToken("http://localhost/solicitacoes", {
    method: "POST",
    body: JSON.stringify({ descricao: "Sem titulo", categoria: "material" }),
  });
  const res = await handleSolicitacoes(req, mock);

  assertEquals(res.status, 422);
});

Deno.test("POST retorna 422 quando descricao falta", async () => {
  const mock = createMockSupabase({ authUser: MOCK_USER });

  const req = reqComToken("http://localhost/solicitacoes", {
    method: "POST",
    body: JSON.stringify({ titulo: "Sem descricao", categoria: "material" }),
  });
  const res = await handleSolicitacoes(req, mock);

  assertEquals(res.status, 422);
});

Deno.test("POST retorna 422 quando categoria falta", async () => {
  const mock = createMockSupabase({ authUser: MOCK_USER });

  const req = reqComToken("http://localhost/solicitacoes", {
    method: "POST",
    body: JSON.stringify({ titulo: "Titulo", descricao: "Desc" }),
  });
  const res = await handleSolicitacoes(req, mock);

  assertEquals(res.status, 422);
});

Deno.test("POST retorna 422 quando categoria é inválida", async () => {
  const mock = createMockSupabase({ authUser: MOCK_USER });

  const req = reqComToken("http://localhost/solicitacoes", {
    method: "POST",
    body: JSON.stringify({
      titulo: "Titulo",
      descricao: "Desc",
      categoria: "categoria_invalida",
    }),
  });
  const res = await handleSolicitacoes(req, mock);

  assertEquals(res.status, 422);
});

Deno.test("POST retorna 422 quando status é inválido", async () => {
  const mock = createMockSupabase({ authUser: MOCK_USER });

  const req = reqComToken("http://localhost/solicitacoes", {
    method: "POST",
    body: JSON.stringify({ ...SOLICITACAO_VALIDA, status: "status_invalido" }),
  });
  const res = await handleSolicitacoes(req, mock);

  assertEquals(res.status, 422);
});

Deno.test("POST retorna 400 quando corpo é inválido", async () => {
  const mock = createMockSupabase({ authUser: MOCK_USER });

  const req = reqComToken("http://localhost/solicitacoes", {
    method: "POST",
    body: "não é json",
  });
  const res = await handleSolicitacoes(req, mock);

  assertEquals(res.status, 400);
});

Deno.test("POST retorna 400 quando banco retorna erro", async () => {
  const mock = createMockSupabase({
    authUser: MOCK_USER,
    dbError: { message: "Erro ao inserir" },
  });

  const req = reqComToken("http://localhost/solicitacoes", {
    method: "POST",
    body: JSON.stringify(SOLICITACAO_VALIDA),
  });
  const res = await handleSolicitacoes(req, mock);

  assertEquals(res.status, 400);
});

Deno.test("GET retorna 405 método não permitido", async () => {
  const mock = createMockSupabase({ authUser: MOCK_USER });

  const req = reqComToken("http://localhost/solicitacoes", { method: "GET" });
  const res = await handleSolicitacoes(req, mock);

  assertEquals(res.status, 405);
});
