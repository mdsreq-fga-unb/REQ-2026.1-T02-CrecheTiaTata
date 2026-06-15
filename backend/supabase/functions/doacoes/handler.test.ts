import { assertEquals } from "std/assert";
import { handleDoacoes } from "./handler.ts";

function createQueryResult(
  data: unknown,
  error: { message: string } | null = null,
  count: number | null = null,
) {
  return { data, error, count };
}

function createThenableChain(result: ReturnType<typeof createQueryResult>) {
  const chain: Record<string, unknown> = {
    select: () => thenableChain,
    insert: () => thenableChain,
    update: () => thenableChain,
    eq: () => thenableChain,
    ilike: () => thenableChain,
    gte: () => thenableChain,
    lte: () => thenableChain,
    or: () => thenableChain,
    order: () => thenableChain,
    range: () => thenableChain,
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
}

function createMockSupabase(options: {
  authUser?: unknown;
  authError?: { message: string } | null;
  tableResults?: Record<string, ReturnType<typeof createQueryResult>[]>;
}) {
  const tableCalls: string[] = [];

  return {
    tableCalls,
    auth: {
      getUser: () =>
        Promise.resolve({
          data: { user: options.authUser ?? { id: "admin-1" } },
          error: options.authError ?? null,
        }),
    },
    from: (table: string) => {
      tableCalls.push(table);
      const results = options.tableResults?.[table] ?? [createQueryResult(null)];
      const result = results.shift() ?? createQueryResult(null);
      return createThenableChain(result);
    },
  };
}

function authHeaders() {
  return { Authorization: "Bearer token-valido" };
}

// RF 03 - Listar Doações

Deno.test("RF03 - GET /doacoes retorna lista de doações", async () => {
  const doacoes = [
    { id: "1", item: "Arroz", quantidade: 10, doador_id: "doador-1" },
    { id: "2", item: "Feijão", quantidade: 5, doador_id: "doador-2" },
  ];

  const mock = createMockSupabase({
    tableResults: { doacoes: [createQueryResult(doacoes, null, 2)] },
  });

  const req = new Request("http://localhost/doacoes", {
    method: "GET",
    headers: authHeaders( ),
  });

  const res = await handleDoacoes(req, mock);
  const body = await res.json();

  assertEquals(res.status, 200);
  assertEquals(body.data, doacoes);
  assertEquals(body.count, 2);
});

Deno.test("RF03 - GET /doacoes aplica filtros e retorna 200", async () => {
  const doacoes = [{ id: "1", item: "Arroz", doador_id: "doador-1" }];

  const mock = createMockSupabase({
    tableResults: { doacoes: [createQueryResult(doacoes, null, 1)] },
  });

  const req = new Request(
    "http://localhost/doacoes?doador_id=doador-1&item=Arroz&data_inicio=2026-01-01&data_fim=2026-12-31",
    { method: "GET", headers: authHeaders( ) },
  );

  const res = await handleDoacoes(req, mock);
  const body = await res.json();

  assertEquals(res.status, 200);
  assertEquals(body.data.length, 1);
});

Deno.test("RF03 - GET /doacoes retorna lista vazia quando não há resultados", async () => {
  const mock = createMockSupabase({
    tableResults: { doacoes: [createQueryResult([], null, 0)] },
  });

  const req = new Request("http://localhost/doacoes", {
    method: "GET",
    headers: authHeaders( ),
  });

  const res = await handleDoacoes(req, mock);
  const body = await res.json();

  assertEquals(res.status, 200);
  assertEquals(body.data, []);
  assertEquals(body.count, 0);
});

Deno.test("RF03 - GET /doacoes sem JWT retorna 401", async () => {
  const mock = createMockSupabase({});

  const req = new Request("http://localhost/doacoes", { method: "GET" } );
  const res = await handleDoacoes(req, mock);

  assertEquals(res.status, 401);
});

Deno.test("RF03 - GET /doacoes retorna 400 quando banco retorna erro", async () => {
  const mock = createMockSupabase({
    tableResults: {
      doacoes: [createQueryResult(null, { message: "Erro de conexão" })],
    },
  });

  const req = new Request("http://localhost/doacoes", {
    method: "GET",
    headers: authHeaders( ),
  });

  const res = await handleDoacoes(req, mock);
  const body = await res.json();

  assertEquals(res.status, 400);
  assertEquals(body.error, "Erro de conexão");
});

// RF 04 - Editar Doação

Deno.test("RF04 - PUT /doacoes atualiza doação e registra histórico", async () => {
  const antiga = { id: "1", item: "Arroz", quantidade: 10 };
  const atualizada = { id: "1", item: "Arroz", quantidade: 20 };

  const mock = createMockSupabase({
    authUser: { id: "admin-1" },
    tableResults: {
      doacoes: [
        createQueryResult(antiga),
        createQueryResult(atualizada),
      ],
      doacoes_historico: [createQueryResult(null)],
    },
  });

  const req = new Request("http://localhost/doacoes?id=1", {
    method: "PUT",
    headers: { ...authHeaders( ), "Content-Type": "application/json" },
    body: JSON.stringify({ quantidade: 20 }),
  });

  const res = await handleDoacoes(req, mock);
  const body = await res.json();

  assertEquals(res.status, 200);
  assertEquals(body.quantidade, 20);
  assertEquals(mock.tableCalls.includes("doacoes_historico"), true);
});

Deno.test("RF04 - PUT /doacoes sem id retorna 400", async () => {
  const mock = createMockSupabase({});

  const req = new Request("http://localhost/doacoes", {
    method: "PUT",
    headers: { ...authHeaders( ), "Content-Type": "application/json" },
    body: JSON.stringify({ quantidade: 20 }),
  });

  const res = await handleDoacoes(req, mock);

  assertEquals(res.status, 400);
});

Deno.test("RF04 - PUT /doacoes sem campos válidos retorna 422", async () => {
  const mock = createMockSupabase({});

  const req = new Request("http://localhost/doacoes?id=1", {
    method: "PUT",
    headers: { ...authHeaders( ), "Content-Type": "application/json" },
    body: JSON.stringify({ campo_inexistente: "valor" }),
  });

  const res = await handleDoacoes(req, mock);

  assertEquals(res.status, 422);
});

Deno.test("RF04 - PUT /doacoes inexistente retorna 404", async () => {
  const mock = createMockSupabase({
    tableResults: {
      doacoes: [createQueryResult(null, { message: "Not found" })],
    },
  });

  const req = new Request("http://localhost/doacoes?id=999", {
    method: "PUT",
    headers: { ...authHeaders( ), "Content-Type": "application/json" },
    body: JSON.stringify({ quantidade: 20 }),
  });

  const res = await handleDoacoes(req, mock);
  const body = await res.json();

  assertEquals(res.status, 404);
  assertEquals(body.error, "Doação não encontrada");
});

Deno.test("RF04 - PUT /doacoes sem JWT retorna 401", async () => {
  const mock = createMockSupabase({});

  const req = new Request("http://localhost/doacoes?id=1", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ quantidade: 20 } ),
  });

  const res = await handleDoacoes(req, mock);

  assertEquals(res.status, 401);
});