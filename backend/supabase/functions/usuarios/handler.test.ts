import { assertEquals } from "std/assert";
import { handleUsuarios } from "./handler.ts";

const MOCK_USER = { id: "uuid-1", email: "ana@email.com" };
const MOCK_TOKEN = "valid-jwt-token";
const MOCK_SESSION = { access_token: MOCK_TOKEN };

function createMockSupabase({
  dbData = null as unknown,
  dbError = null as { message: string } | null,
  authUser = null as typeof MOCK_USER | null,
  authError = null as { message: string } | null,
  session = null as typeof MOCK_SESSION | null,
  dbResults = null as Array<{ data: unknown; error: { message: string } | null }> | null,
} = {}) {
  let dbCallIndex = 0;

  const getDbResult = () => {
    if (dbResults) {
      const r = dbResults[Math.min(dbCallIndex++, dbResults.length - 1)];
      return { data: r.data, error: r.error };
    }
    return { data: dbData, error: dbError };
  };

  const makeChain = () => {
    const result = getDbResult();

    const chain: Record<string, unknown> = {
      select: () => thenableChain,
      insert: () => chain,
      update: () => chain,
      delete: () => thenableChain,
      eq: () => thenableChain,
      single: () => Promise.resolve(result),
    };

    const thenableChain = {
      ...chain,
      then: (
        resolve: (v: typeof result) => unknown,
        reject?: (e: unknown) => unknown,
      ) => Promise.resolve(result).then(resolve, reject),
      catch: (reject: (e: unknown) => unknown) =>
        Promise.resolve(result).catch(reject),
      finally: (fn: () => void) => Promise.resolve(result).finally(fn),
    };

    return thenableChain;
  };

  return {
    from: () => makeChain(),
    auth: {
      signInWithPassword: () =>
        Promise.resolve({
          data: session
            ? { session, user: authUser }
            : { session: null, user: null },
          error: authError,
        }),
      getUser: (_token: string) =>
        Promise.resolve({
          data: { user: authUser },
          error: authError,
        }),
      admin: {
        createUser: () =>
          Promise.resolve({
            data: authUser ? { user: authUser } : null,
            error: authError,
          }),
        deleteUser: () => Promise.resolve({ data: {}, error: null }),
      },
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

// POST login

Deno.test("POST login retorna token com credenciais válidas", async () => {
  const mock = createMockSupabase({ authUser: MOCK_USER, session: MOCK_SESSION });

  const req = new Request("http://localhost/usuarios?action=login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "ana@email.com", senha: "senha123" }),
  });
  const res = await handleUsuarios(req, mock);

  assertEquals(res.status, 200);
  const body = await res.json();
  assertEquals(body.autenticado, true);
  assertEquals(body.token, MOCK_TOKEN);
});

Deno.test("POST login retorna 401 com credenciais inválidas", async () => {
  const mock = createMockSupabase({ authError: { message: "Invalid credentials" } });

  const req = new Request("http://localhost/usuarios?action=login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "ana@email.com", senha: "errada" }),
  });
  const res = await handleUsuarios(req, mock);

  assertEquals(res.status, 401);
  assertEquals((await res.json()).autenticado, false);
});

Deno.test("POST login retorna 400 quando campos faltam", async () => {
  const mock = createMockSupabase({});

  const req = new Request("http://localhost/usuarios?action=login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "ana@email.com" }),
  });
  const res = await handleUsuarios(req, mock);

  assertEquals(res.status, 400);
});

// GET perfil

Deno.test("GET perfil retorna dados com JWT válido", async () => {
  const perfil = { nome: "Ana", email: "ana@email.com", telefone: "61999999999", disponibilidade: "manhã" };
  const mock = createMockSupabase({ dbData: perfil, authUser: MOCK_USER });

  const req = reqComToken("http://localhost/usuarios?email=ana@email.com", { method: "GET" });
  const res = await handleUsuarios(req, mock);

  assertEquals(res.status, 200);
  assertEquals(await res.json(), perfil);
});

Deno.test("GET perfil retorna 401 sem JWT", async () => {
  const mock = createMockSupabase({ dbData: null });

  const req = new Request("http://localhost/usuarios?email=ana@email.com", { method: "GET" });
  const res = await handleUsuarios(req, mock);

  assertEquals(res.status, 401);
});

Deno.test("GET perfil retorna 400 quando email não informado", async () => {
  const mock = createMockSupabase({ authUser: MOCK_USER });

  const req = reqComToken("http://localhost/usuarios", { method: "GET" });
  const res = await handleUsuarios(req, mock);

  assertEquals(res.status, 400);
});

Deno.test("GET perfil retorna 400 quando banco retorna erro", async () => {
  const mock = createMockSupabase({ dbError: { message: "Não encontrado" }, authUser: MOCK_USER });

  const req = reqComToken("http://localhost/usuarios?email=naoexiste@email.com", { method: "GET" });
  const res = await handleUsuarios(req, mock);

  assertEquals(res.status, 400);
});

// POST criar conta

Deno.test("POST cria conta com dados válidos", async () => {
  const perfil = { id: "uuid-1", nome: "Bruno", email: "bruno@email.com" };
  const mock = createMockSupabase({ dbData: perfil, authUser: MOCK_USER });

  const req = new Request("http://localhost/usuarios", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nome: "Bruno", email: "bruno@email.com", senha: "senha123" }),
  });
  const res = await handleUsuarios(req, mock);

  assertEquals(res.status, 201);
  const body = await res.json();
  assertEquals(body.criado, true);
  assertEquals(body.usuario.nome, "Bruno");
});

Deno.test("POST retorna 422 quando campos obrigatórios faltam", async () => {
  const mock = createMockSupabase({});

  const req = new Request("http://localhost/usuarios", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nome: "Bruno", email: "bruno@email.com" }),
  });
  const res = await handleUsuarios(req, mock);

  assertEquals(res.status, 422);
});

Deno.test("POST retorna 400 quando auth retorna erro (email duplicado)", async () => {
  const mock = createMockSupabase({ authError: { message: "User already registered" } });

  const req = new Request("http://localhost/usuarios", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nome: "Bruno", email: "bruno@email.com", senha: "senha123" }),
  });
  const res = await handleUsuarios(req, mock);

  assertEquals(res.status, 400);
});

// PUT

Deno.test("PUT atualiza dados com JWT válido", async () => {
  const atualizado = { id: "uuid-1", nome: "Ana", email: "ana@email.com", disponibilidade: "tarde" };
  const mock = createMockSupabase({ dbData: atualizado, authUser: MOCK_USER });

  const req = reqComToken("http://localhost/usuarios?email=ana@email.com", {
    method: "PUT",
    body: JSON.stringify({ disponibilidade: "tarde" }),
  });
  const res = await handleUsuarios(req, mock);

  assertEquals(res.status, 200);
  assertEquals((await res.json()).disponibilidade, "tarde");
});

Deno.test("PUT retorna 401 sem JWT", async () => {
  const mock = createMockSupabase({});

  const req = new Request("http://localhost/usuarios?email=ana@email.com", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ disponibilidade: "tarde" }),
  });
  const res = await handleUsuarios(req, mock);

  assertEquals(res.status, 401);
});

Deno.test("PUT retorna 400 quando email não informado", async () => {
  const mock = createMockSupabase({ authUser: MOCK_USER });

  const req = reqComToken("http://localhost/usuarios", {
    method: "PUT",
    body: JSON.stringify({ disponibilidade: "tarde" }),
  });
  const res = await handleUsuarios(req, mock);

  assertEquals(res.status, 400);
});

Deno.test("PUT retorna 400 quando banco retorna erro", async () => {
  const mock = createMockSupabase({ dbError: { message: "Erro ao atualizar" }, authUser: MOCK_USER });

  const req = reqComToken("http://localhost/usuarios?email=ana@email.com", {
    method: "PUT",
    body: JSON.stringify({ disponibilidade: "noite" }),
  });
  const res = await handleUsuarios(req, mock);

  assertEquals(res.status, 400);
});

// DELETE

Deno.test("DELETE remove conta com JWT válido", async () => {
  const mock = createMockSupabase({
    authUser: MOCK_USER,
    dbResults: [
      { data: { id: "uuid-1" }, error: null },
      { data: null, error: null },
    ],
  });

  const req = reqComToken("http://localhost/usuarios?email=ana@email.com", { method: "DELETE" });
  const res = await handleUsuarios(req, mock);

  assertEquals(res.status, 204);
});

Deno.test("DELETE retorna 401 sem JWT", async () => {
  const mock = createMockSupabase({});

  const req = new Request("http://localhost/usuarios?email=ana@email.com", { method: "DELETE" });
  const res = await handleUsuarios(req, mock);

  assertEquals(res.status, 401);
});

Deno.test("DELETE retorna 400 quando email não informado", async () => {
  const mock = createMockSupabase({ authUser: MOCK_USER });

  const req = reqComToken("http://localhost/usuarios", { method: "DELETE" });
  const res = await handleUsuarios(req, mock);

  assertEquals(res.status, 400);
});

Deno.test("DELETE retorna 404 quando usuário não encontrado", async () => {
  const mock = createMockSupabase({ dbData: null, authUser: MOCK_USER });

  const req = reqComToken("http://localhost/usuarios?email=naoexiste@email.com", { method: "DELETE" });
  const res = await handleUsuarios(req, mock);

  assertEquals(res.status, 404);
});

Deno.test("DELETE retorna 400 quando banco retorna erro ao deletar", async () => {
  const mock = createMockSupabase({
    authUser: MOCK_USER,
    dbResults: [
      { data: { id: "uuid-1" }, error: null },
      { data: null, error: { message: "Erro ao deletar" } },
    ],
  });

  const req = reqComToken("http://localhost/usuarios?email=ana@email.com", { method: "DELETE" });
  const res = await handleUsuarios(req, mock);

  assertEquals(res.status, 400);
});
