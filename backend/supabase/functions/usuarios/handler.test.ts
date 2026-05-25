import { assertEquals } from "std/assert";
import { handleUsuarios } from "./handler.ts";

function createMockSupabase(
  data: unknown,
  error: { message: string } | null = null,
) {
  const result = { data, error };

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

  return { from: () => thenableChain };
}

function createSequentialMockSupabase(
  results: Array<{ data: unknown; error: { message: string } | null }>,
) {
  let callIndex = 0;

  return {
    from: () => {
      const result = results[Math.min(callIndex++, results.length - 1)];

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
    },
  };
}

// POST login

Deno.test("POST login retorna autenticado true com credenciais válidas", async () => {
  const usuario = { id: "1", nome: "Ana", email: "ana@email.com" };
  const mock = createMockSupabase(usuario);

  const req = new Request(
    "http://localhost/usuarios?action=login",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "ana@email.com", senha: "senha123" }),
    },
  );
  const res = await handleUsuarios(req, mock);

  assertEquals(res.status, 200);
  const body = await res.json();
  assertEquals(body.autenticado, true);
  assertEquals(body.usuario.nome, "Ana");
});

Deno.test("POST login retorna 401 quando credenciais inválidas", async () => {
  const mock = createMockSupabase(null, { message: "Not found" });

  const req = new Request(
    "http://localhost/usuarios?action=login",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "ana@email.com", senha: "errada" }),
    },
  );
  const res = await handleUsuarios(req, mock);

  assertEquals(res.status, 401);
  assertEquals((await res.json()).autenticado, false);
});

Deno.test("POST login retorna 400 quando email ou senha faltam", async () => {
  const mock = createMockSupabase(null);

  const req = new Request(
    "http://localhost/usuarios?action=login",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "ana@email.com" }),
    },
  );
  const res = await handleUsuarios(req, mock);

  assertEquals(res.status, 400);
});

// GET perfil

Deno.test("GET perfil retorna dados do usuário", async () => {
  const perfil = {
    nome: "Ana",
    email: "ana@email.com",
    telefone: "61999999999",
    disponibilidade: "manhã",
  };
  const mock = createMockSupabase(perfil);

  const req = new Request(
    "http://localhost/usuarios?email=ana@email.com",
    { method: "GET" },
  );
  const res = await handleUsuarios(req, mock);

  assertEquals(res.status, 200);
  assertEquals(await res.json(), perfil);
});

Deno.test("GET perfil retorna 400 quando email não informado", async () => {
  const mock = createMockSupabase(null);

  const req = new Request("http://localhost/usuarios", { method: "GET" });
  const res = await handleUsuarios(req, mock);

  assertEquals(res.status, 400);
});

Deno.test("GET perfil retorna 400 quando banco retorna erro", async () => {
  const mock = createMockSupabase(null, { message: "Usuário não encontrado" });

  const req = new Request(
    "http://localhost/usuarios?email=naoexiste@email.com",
    { method: "GET" },
  );
  const res = await handleUsuarios(req, mock);

  assertEquals(res.status, 400);
  assertEquals((await res.json()).error, "Usuário não encontrado");
});

// POST

Deno.test("POST cria conta com dados válidos", async () => {
  const novo = { id: "1", nome: "Bruno", email: "bruno@email.com" };
  const mock = createMockSupabase(novo);

  const req = new Request("http://localhost/usuarios", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      nome: "Bruno",
      email: "bruno@email.com",
      senha: "senha123",
    }),
  });
  const res = await handleUsuarios(req, mock);

  assertEquals(res.status, 201);
  const body = await res.json();
  assertEquals(body.criado, true);
  assertEquals(body.usuario.nome, "Bruno");
});

Deno.test("POST retorna 422 quando campos obrigatórios faltam", async () => {
  const mock = createMockSupabase(null);

  const req = new Request("http://localhost/usuarios", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nome: "Bruno", email: "bruno@email.com" }),
  });
  const res = await handleUsuarios(req, mock);

  assertEquals(res.status, 422);
});

Deno.test("POST retorna 400 quando banco retorna erro (ex: email duplicado)", async () => {
  const mock = createMockSupabase(null, { message: "duplicate key value" });

  const req = new Request("http://localhost/usuarios", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      nome: "Bruno",
      email: "bruno@email.com",
      senha: "senha123",
    }),
  });
  const res = await handleUsuarios(req, mock);

  assertEquals(res.status, 400);
});

// PUT

Deno.test("PUT atualiza dados do usuário", async () => {
  const atualizado = {
    id: "1",
    nome: "Ana",
    email: "novo@email.com",
    disponibilidade: "tarde",
    acoes_preferencia: ["atividades"],
  };
  const mock = createMockSupabase(atualizado);

  const req = new Request("http://localhost/usuarios?email=ana@email.com", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "novo@email.com", disponibilidade: "tarde" }),
  });
  const res = await handleUsuarios(req, mock);

  assertEquals(res.status, 200);
  assertEquals((await res.json()).email, "novo@email.com");
});

Deno.test("PUT retorna 400 quando email não informado", async () => {
  const mock = createMockSupabase(null);

  const req = new Request("http://localhost/usuarios", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ disponibilidade: "tarde" }),
  });
  const res = await handleUsuarios(req, mock);

  assertEquals(res.status, 400);
});

Deno.test("PUT retorna 400 quando banco retorna erro", async () => {
  const mock = createMockSupabase(null, { message: "Erro ao atualizar" });

  const req = new Request("http://localhost/usuarios?email=ana@email.com", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ disponibilidade: "noite" }),
  });
  const res = await handleUsuarios(req, mock);

  assertEquals(res.status, 400);
});

// DELETE

Deno.test("DELETE remove conta com credenciais válidas", async () => {
  const mock = createSequentialMockSupabase([
    { data: { id: "1" }, error: null },
    { data: null, error: null },
  ]);

  const req = new Request(
    "http://localhost/usuarios?email=ana@email.com",
    {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ senha: "senha123" }),
    },
  );
  const res = await handleUsuarios(req, mock);

  assertEquals(res.status, 204);
});

Deno.test("DELETE retorna 401 com credenciais inválidas", async () => {
  const mock = createMockSupabase(null, { message: "Not found" });

  const req = new Request(
    "http://localhost/usuarios?email=ana@email.com",
    {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ senha: "errada" }),
    },
  );
  const res = await handleUsuarios(req, mock);

  assertEquals(res.status, 401);
  assertEquals((await res.json()).error, "Credenciais inválidas");
});

Deno.test("DELETE retorna 400 quando email ou senha faltam", async () => {
  const mock = createMockSupabase(null);

  const req = new Request(
    "http://localhost/usuarios?email=ana@email.com",
    {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    },
  );
  const res = await handleUsuarios(req, mock);

  assertEquals(res.status, 400);
});

Deno.test("DELETE retorna 400 quando banco retorna erro ao deletar", async () => {
  const mock = createSequentialMockSupabase([
    { data: { id: "1" }, error: null },
    { data: null, error: { message: "Erro ao deletar" } },
  ]);

  const req = new Request(
    "http://localhost/usuarios?email=ana@email.com",
    {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ senha: "senha123" }),
    },
  );
  const res = await handleUsuarios(req, mock);

  assertEquals(res.status, 400);
  assertEquals((await res.json()).error, "Erro ao deletar");
});
