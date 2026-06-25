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
    order: () => chain,
    eq: () => chain,
    then: undefined,
  };

  Object.defineProperty(chain, "then", {
    get() {
      return (resolve: (v: unknown) => void) => resolve(result);
    },
  });

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

// ── GET ──────────────────────────────────────────────────────────────────────

Deno.test("GET retorna 200 com lista de solicitações", async () => {
  const lista = [
    { id: "sol-1", ...SOLICITACAO_VALIDA, status: "pendente" },
    { id: "sol-2", titulo: "Voluntários", descricao: "Desc", categoria: "voluntario", status: "pendente" },
  ];
  const mock = createMockSupabase({ dbData: lista });

  const req = new Request("http://localhost/solicitacoes", { method: "GET" });
  const res = await handleSolicitacoes(req, mock);

  assertEquals(res.status, 200);
  const body = await res.json();
  assertEquals(body.length, 2);
});

Deno.test("GET retorna 200 com array vazio quando não há registros", async () => {
  const mock = createMockSupabase({ dbData: [] });

  const req = new Request("http://localhost/solicitacoes", { method: "GET" });
  const res = await handleSolicitacoes(req, mock);

  assertEquals(res.status, 200);
  const body = await res.json();
  assertEquals(body, []);
});

Deno.test("GET retorna 200 com lista quando não há registros (data null)", async () => {
  const mock = createMockSupabase({ dbData: null });

  const req = new Request("http://localhost/solicitacoes", { method: "GET" });
  const res = await handleSolicitacoes(req, mock);

  assertEquals(res.status, 200);
  const body = await res.json();
  assertEquals(body, []);
});

Deno.test("GET filtra por status", async () => {
  const lista = [{ id: "sol-1", ...SOLICITACAO_VALIDA, status: "pendente" }];
  const mock = createMockSupabase({ dbData: lista });

  const req = new Request("http://localhost/solicitacoes?status=pendente", {
    method: "GET",
  });
  const res = await handleSolicitacoes(req, mock);

  assertEquals(res.status, 200);
});

Deno.test("GET filtra por categoria", async () => {
  const lista = [{ id: "sol-1", ...SOLICITACAO_VALIDA, status: "pendente" }];
  const mock = createMockSupabase({ dbData: lista });

  const req = new Request("http://localhost/solicitacoes?categoria=material", {
    method: "GET",
  });
  const res = await handleSolicitacoes(req, mock);

  assertEquals(res.status, 200);
});

Deno.test("GET retorna 422 com status inválido", async () => {
  const mock = createMockSupabase({});

  const req = new Request(
    "http://localhost/solicitacoes?status=invalido",
    { method: "GET" },
  );
  const res = await handleSolicitacoes(req, mock);

  assertEquals(res.status, 422);
});

Deno.test("GET retorna 422 com categoria inválida", async () => {
  const mock = createMockSupabase({});

  const req = new Request(
    "http://localhost/solicitacoes?categoria=invalida",
    { method: "GET" },
  );
  const res = await handleSolicitacoes(req, mock);

  assertEquals(res.status, 422);
});

Deno.test("GET retorna 400 quando banco retorna erro", async () => {
  const mock = createMockSupabase({ dbError: { message: "Erro DB" } });

  const req = new Request("http://localhost/solicitacoes", { method: "GET" });
  const res = await handleSolicitacoes(req, mock);

  assertEquals(res.status, 400);
});

Deno.test("GET público — sem JWT funciona", async () => {
  const mock = createMockSupabase({ dbData: [] });

  const req = new Request("http://localhost/solicitacoes", { method: "GET" });
  const res = await handleSolicitacoes(req, mock);

  assertEquals(res.status, 200);
});

// ── POST ─────────────────────────────────────────────────────────────────────

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

Deno.test("POST retorna 422 quando campos obrigatórios faltam", async () => {
  const mock = createMockSupabase({ authUser: MOCK_USER });

  const req = reqComToken("http://localhost/solicitacoes", {
    method: "POST",
    body: JSON.stringify({ titulo: "Só titulo" }),
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
      categoria: "invalida",
    }),
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

Deno.test("DELETE retorna 405 método não permitido", async () => {
  const mock = createMockSupabase({ authUser: MOCK_USER });

  const req = reqComToken("http://localhost/solicitacoes", {
    method: "DELETE",
  });
  const res = await handleSolicitacoes(req, mock);

  assertEquals(res.status, 405);
});
