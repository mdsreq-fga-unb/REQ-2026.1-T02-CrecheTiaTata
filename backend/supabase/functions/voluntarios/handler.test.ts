import { assertEquals } from "std/assert";
import { handleVoluntarios } from "./handler.ts";

function createMockSupabase(
  data: unknown,
  error: { message: string } | null = null,
  count: number | null = null,
) {
  const result = { data, error, count };

  const thenableChain: Record<string, unknown> = {};

  Object.assign(thenableChain, {
    select: () => thenableChain,
    insert: () => thenableChain,
    update: () => thenableChain,
    delete: () => thenableChain,
    eq: () => thenableChain,
    ilike: () => thenableChain,
    or: () => thenableChain,
    order: () => thenableChain,
    range: () => thenableChain,
    single: () => Promise.resolve(result),
    then: (
      resolve: (value: typeof result) => unknown,
      reject?: (reason: unknown) => unknown,
    ) => Promise.resolve(result).then(resolve, reject),
    catch: (reject: (reason: unknown) => unknown) =>
      Promise.resolve(result).catch(reject),
    finally: (callback: () => void) => Promise.resolve(result).finally(callback),
  });

  return { from: () => thenableChain };
}

// GET

Deno.test("GET retorna lista de voluntários", async () => {
  const voluntarios = [
    { id: "1", nome: "Ana", email: "ana@email.com", telefone: "61999999999" },
    { id: "2", nome: "Bruno", email: "bruno@email.com", telefone: null },
  ];
  const mock = createMockSupabase(voluntarios, null, 2);

  const req = new Request("http://localhost/voluntarios", { method: "GET" });
  const res = await handleVoluntarios(req, mock);

  assertEquals(res.status, 200);
  assertEquals(await res.json(), { data: voluntarios, count: 2 });
});

Deno.test("GET retorna 400 quando banco retorna erro", async () => {
  const mock = createMockSupabase(null, { message: "Erro de conexão" });

  const req = new Request("http://localhost/voluntarios", { method: "GET" });
  const res = await handleVoluntarios(req, mock);

  assertEquals(res.status, 400);
  assertEquals((await res.json()).error, "Erro de conexão");
});

// POST

Deno.test("POST cria voluntário com dados válidos", async () => {
  const novo = { id: "3", nome: "Carlos", email: "carlos@email.com" };
  const mock = createMockSupabase(novo);

  const req = new Request("http://localhost/voluntarios", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nome: "Carlos", email: "carlos@ema il.com" }),
  });
  const res = await handleVoluntarios(req, mock);

  assertEquals(res.status, 201);
  assertEquals((await res.json()).nome, "Carlos");
});

Deno.test("POST retorna 422 quando nome ou email faltam", async () => {
  const mock = createMockSupabase(null);

  const req = new Request("http://localhost/voluntarios", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nome: "Carlos" }),
  });
  const res = await handleVoluntarios(req, mock);

  assertEquals(res.status, 422);
});

Deno.test("POST retorna 400 quando banco retorna erro ao inserir", async () => {
  const mock = createMockSupabase(null, { message: "Email duplicado" });

  const req = new Request("http://localhost/voluntarios", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nome: "Duda", email: "duda@email.com" }),
  });
  const res = await handleVoluntarios(req, mock);

  assertEquals(res.status, 400);
  assertEquals((await res.json()).error, "Email duplicado");
});

// PUT

Deno.test("PUT atualiza voluntário existente", async () => {
  const atualizado = { id: "1", nome: "Ana Silva", email: "ana@email.com" };
  const mock = createMockSupabase(atualizado);

  const req = new Request("http://localhost/voluntarios?id=1", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nome: "Ana Silva" }),
  });
  const res = await handleVoluntarios(req, mock);

  assertEquals(res.status, 200);
  assertEquals((await res.json()).nome, "Ana Silva");
});

Deno.test("PUT retorna 400 quando id não informado", async () => {
  const mock = createMockSupabase(null);

  const req = new Request("http://localhost/voluntarios", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nome: "Ana Silva" }),
  });
  const res = await handleVoluntarios(req, mock);

  assertEquals(res.status, 400);
});

// DELETE

Deno.test("DELETE remove voluntário existente", async () => {
  const mock = createMockSupabase(null);

  const req = new Request("http://localhost/voluntarios?id=1", {
    method: "DELETE",
  });
  const res = await handleVoluntarios(req, mock);

  assertEquals(res.status, 204);
});

Deno.test("DELETE retorna 400 quando id não informado", async () => {
  const mock = createMockSupabase(null);

  const req = new Request("http://localhost/voluntarios", {
    method: "DELETE",
  });
  const res = await handleVoluntarios(req, mock);

  assertEquals(res.status, 400);
});
