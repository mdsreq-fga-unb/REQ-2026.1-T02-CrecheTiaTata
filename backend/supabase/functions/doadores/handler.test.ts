import { assertEquals } from "std/assert";
import { handleDoadores } from "./handler.ts";

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

const DOADOR_VALIDO = {
  nome: "Maria Silva",
  tipo: "pessoa_fisica",
  email: "maria@gmail.com",
  telefone: "61999999999",
};

Deno.test("POST registra doador com dados válidos", async () => {
  const criado = { id: "doador-1", ...DOADOR_VALIDO };
  const mock = createMockSupabase({ dbData: criado, authUser: MOCK_USER });

  const req = reqComToken("http://localhost/doadores", {
    method: "POST",
    body: JSON.stringify(DOADOR_VALIDO),
  });
  const res = await handleDoadores(req, mock);

  assertEquals(res.status, 201);
  const body = await res.json();
  assertEquals(body.registrado, true);
  assertEquals(body.doador.nome, "Maria Silva");
});

Deno.test("POST registra doador apenas com nome", async () => {
  const criado = { id: "doador-2", nome: "Empresa X", tipo: "pessoa_fisica" };
  const mock = createMockSupabase({ dbData: criado, authUser: MOCK_USER });

  const req = reqComToken("http://localhost/doadores", {
    method: "POST",
    body: JSON.stringify({ nome: "Empresa X" }),
  });
  const res = await handleDoadores(req, mock);

  assertEquals(res.status, 201);
});

Deno.test("POST retorna 401 sem JWT", async () => {
  const mock = createMockSupabase({});

  const req = new Request("http://localhost/doadores", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(DOADOR_VALIDO),
  });
  const res = await handleDoadores(req, mock);

  assertEquals(res.status, 401);
});

Deno.test("POST retorna 422 quando nome falta", async () => {
  const mock = createMockSupabase({ authUser: MOCK_USER });

  const req = reqComToken("http://localhost/doadores", {
    method: "POST",
    body: JSON.stringify({ email: "maria@gmail.com" }),
  });
  const res = await handleDoadores(req, mock);

  assertEquals(res.status, 422);
});

Deno.test("POST retorna 422 quando tipo é inválido", async () => {
  const mock = createMockSupabase({ authUser: MOCK_USER });

  const req = reqComToken("http://localhost/doadores", {
    method: "POST",
    body: JSON.stringify({ nome: "Maria", tipo: "alienigena" }),
  });
  const res = await handleDoadores(req, mock);

  assertEquals(res.status, 422);
});

Deno.test("POST retorna 422 quando email é inválido", async () => {
  const mock = createMockSupabase({ authUser: MOCK_USER });

  const req = reqComToken("http://localhost/doadores", {
    method: "POST",
    body: JSON.stringify({ nome: "Maria", email: "maria@dominioqualquer.xyz" }),
  });
  const res = await handleDoadores(req, mock);

  assertEquals(res.status, 422);
});

Deno.test("POST retorna 400 quando corpo é inválido", async () => {
  const mock = createMockSupabase({ authUser: MOCK_USER });

  const req = reqComToken("http://localhost/doadores", {
    method: "POST",
    body: "não é json",
  });
  const res = await handleDoadores(req, mock);

  assertEquals(res.status, 400);
});

Deno.test("POST retorna 400 quando banco retorna erro", async () => {
  const mock = createMockSupabase({
    authUser: MOCK_USER,
    dbError: { message: "Erro ao inserir" },
  });

  const req = reqComToken("http://localhost/doadores", {
    method: "POST",
    body: JSON.stringify(DOADOR_VALIDO),
  });
  const res = await handleDoadores(req, mock);

  assertEquals(res.status, 400);
});

Deno.test("GET retorna 405 método não permitido", async () => {
  const mock = createMockSupabase({ authUser: MOCK_USER });

  const req = reqComToken("http://localhost/doadores", { method: "GET" });
  const res = await handleDoadores(req, mock);

  assertEquals(res.status, 405);
});
