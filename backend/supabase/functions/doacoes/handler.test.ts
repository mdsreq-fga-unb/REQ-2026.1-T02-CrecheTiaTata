import { assertEquals } from "std/assert";
import { handleDoacoes } from "./handler.ts";

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

const DOACAO_VALIDA = {
  doador_nome: "Maria",
  tipo: "alimento",
  descricao: "10 cestas básicas",
  quantidade: 10,
};

Deno.test("POST registra doação com dados válidos", async () => {
  const criada = { id: "doacao-1", ...DOACAO_VALIDA };
  const mock = createMockSupabase({ dbData: criada, authUser: MOCK_USER });

  const req = reqComToken("http://localhost/doacoes", {
    method: "POST",
    body: JSON.stringify(DOACAO_VALIDA),
  });
  const res = await handleDoacoes(req, mock);

  assertEquals(res.status, 201);
  const body = await res.json();
  assertEquals(body.registrada, true);
  assertEquals(body.doacao.tipo, "alimento");
});

Deno.test("POST retorna 401 sem JWT", async () => {
  const mock = createMockSupabase({});

  const req = new Request("http://localhost/doacoes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(DOACAO_VALIDA),
  });
  const res = await handleDoacoes(req, mock);

  assertEquals(res.status, 401);
});

Deno.test("POST retorna 422 quando campos obrigatórios faltam", async () => {
  const mock = createMockSupabase({ authUser: MOCK_USER });

  const req = reqComToken("http://localhost/doacoes", {
    method: "POST",
    body: JSON.stringify({ doador_nome: "Maria" }),
  });
  const res = await handleDoacoes(req, mock);

  assertEquals(res.status, 422);
});

Deno.test("POST retorna 422 quando tipo é inválido", async () => {
  const mock = createMockSupabase({ authUser: MOCK_USER });

  const req = reqComToken("http://localhost/doacoes", {
    method: "POST",
    body: JSON.stringify({ tipo: "carro", descricao: "um carro" }),
  });
  const res = await handleDoacoes(req, mock);

  assertEquals(res.status, 422);
});

Deno.test("POST retorna 422 quando quantidade é zero ou negativa", async () => {
  const mock = createMockSupabase({ authUser: MOCK_USER });

  const req = reqComToken("http://localhost/doacoes", {
    method: "POST",
    body: JSON.stringify({ tipo: "alimento", descricao: "arroz", quantidade: 0 }),
  });
  const res = await handleDoacoes(req, mock);

  assertEquals(res.status, 422);
});

Deno.test("POST retorna 400 quando corpo é inválido", async () => {
  const mock = createMockSupabase({ authUser: MOCK_USER });

  const req = reqComToken("http://localhost/doacoes", {
    method: "POST",
    body: "não é json",
  });
  const res = await handleDoacoes(req, mock);

  assertEquals(res.status, 400);
});

Deno.test("POST retorna 400 quando banco retorna erro", async () => {
  const mock = createMockSupabase({
    authUser: MOCK_USER,
    dbError: { message: "Erro ao inserir" },
  });

  const req = reqComToken("http://localhost/doacoes", {
    method: "POST",
    body: JSON.stringify(DOACAO_VALIDA),
  });
  const res = await handleDoacoes(req, mock);

  assertEquals(res.status, 400);
});

Deno.test("GET retorna 405 método não permitido", async () => {
  const mock = createMockSupabase({ authUser: MOCK_USER });

  const req = reqComToken("http://localhost/doacoes", { method: "GET" });
  const res = await handleDoacoes(req, mock);

  assertEquals(res.status, 405);
});
