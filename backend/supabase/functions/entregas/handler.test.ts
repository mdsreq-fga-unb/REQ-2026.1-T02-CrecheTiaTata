import { assertEquals } from "std/assert";
import { handleEntregas } from "./handler.ts";

function createQueryResult(
  data: unknown,
  error: { message: string } | null = null,
  count: number | null = null,
) {
  return { data, error, count };
}

function createThenableChain(result: ReturnType<typeof createQueryResult>) {
  const thenableChain: Record<string, unknown> = {};

  Object.assign(thenableChain, {
    select: () => thenableChain,
    insert: () => thenableChain,
    eq: () => thenableChain,
    ilike: () => thenableChain,
    gte: () => thenableChain,
    lte: () => thenableChain,
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
    finally: (callback: () => void) =>
      Promise.resolve(result).finally(callback),
  });

  return thenableChain;
}

function createMockSupabase(options: {
  authUser?: unknown;
  authError?: { message: string } | null;
  tableResults?: Record<string, ReturnType<typeof createQueryResult>[]>;
}) {
  return {
    auth: {
      getUser: () =>
        Promise.resolve({
          data: { user: options.authUser ?? { id: "user-1" } },
          error: options.authError ?? null,
        }),
    },
    from: (table: string) => {
      const results = options.tableResults?.[table] ??
        [createQueryResult(null)];
      const result = results.shift() ?? createQueryResult(null);
      return createThenableChain(result);
    },
  };
}

function authHeaders() {
  return { Authorization: "Bearer token-valido" };
}

// RF 07 - Registrar Entrega

Deno.test("RF07 - POST /entregas registra entrega com dados válidos", async () => {
  const entregaCriada = {
    id: "1",
    item: "Cesta básica",
    quantidade: 3,
    data_entrega: "2026-06-15",
  };

  const mock = createMockSupabase({
    tableResults: { entregas: [createQueryResult(entregaCriada)] },
  });

  const req = new Request("http://localhost/entregas", {
    method: "POST",
    headers: { ...authHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify({
      item: "Cesta básica",
      quantidade: 3,
      data_entrega: "2026-06-15",
    }),
  });

  const res = await handleEntregas(req, mock);
  const body = await res.json();

  assertEquals(res.status, 201);
  assertEquals(body.item, "Cesta básica");
  assertEquals(body.quantidade, 3);
});

Deno.test("RF07 - POST /entregas retorna 422 quando campos obrigatórios faltam", async () => {
  const mock = createMockSupabase({});

  const req = new Request("http://localhost/entregas", {
    method: "POST",
    headers: { ...authHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify({ item: "Cesta básica" }),
  });

  const res = await handleEntregas(req, mock);

  assertEquals(res.status, 422);
});

Deno.test("RF07 - POST /entregas retorna 422 quando quantidade é inválida", async () => {
  const mock = createMockSupabase({});

  const req = new Request("http://localhost/entregas", {
    method: "POST",
    headers: { ...authHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify({
      item: "Cesta básica",
      quantidade: 0,
      data_entrega: "2026-06-15",
    }),
  });

  const res = await handleEntregas(req, mock);
  const body = await res.json();

  assertEquals(res.status, 422);
  assertEquals(body.error, "Quantidade deve ser maior que zero");
});

Deno.test("RF07 - POST /entregas sem JWT retorna 401", async () => {
  const mock = createMockSupabase({});

  const req = new Request("http://localhost/entregas", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      item: "Cesta básica",
      quantidade: 3,
      data_entrega: "2026-06-15",
    }),
  });

  const res = await handleEntregas(req, mock);

  assertEquals(res.status, 401);
});

Deno.test("RF07 - POST /entregas retorna 400 quando banco retorna erro", async () => {
  const mock = createMockSupabase({
    tableResults: {
      entregas: [createQueryResult(null, { message: "Erro ao inserir" })],
    },
  });

  const req = new Request("http://localhost/entregas", {
    method: "POST",
    headers: { ...authHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify({
      item: "Cesta básica",
      quantidade: 3,
      data_entrega: "2026-06-15",
    }),
  });

  const res = await handleEntregas(req, mock);
  const body = await res.json();

  assertEquals(res.status, 400);
  assertEquals(body.error, "Erro ao inserir");
});

// RF 08 - Listar Entregas

Deno.test("RF08 - GET /entregas retorna lista de entregas", async () => {
  const entregas = [
    {
      id: "1",
      item: "Cesta básica",
      quantidade: 3,
      data_entrega: "2026-06-15",
    },
    { id: "2", item: "Leite", quantidade: 10, data_entrega: "2026-06-16" },
  ];

  const mock = createMockSupabase({
    tableResults: { entregas: [createQueryResult(entregas, null, 2)] },
  });

  const req = new Request("http://localhost/entregas", {
    method: "GET",
    headers: authHeaders(),
  });

  const res = await handleEntregas(req, mock);
  const body = await res.json();

  assertEquals(res.status, 200);
  assertEquals(body.data, entregas);
  assertEquals(body.count, 2);
});

Deno.test("RF08 - GET /entregas aplica filtros", async () => {
  const entregas = [
    {
      id: "1",
      item: "Cesta básica",
      quantidade: 3,
      data_entrega: "2026-06-15",
    },
  ];

  const mock = createMockSupabase({
    tableResults: { entregas: [createQueryResult(entregas, null, 1)] },
  });

  const req = new Request(
    "http://localhost/entregas?item=Cesta&data_inicio=2026-06-01&data_fim=2026-06-30",
    { method: "GET", headers: authHeaders() },
  );

  const res = await handleEntregas(req, mock);
  const body = await res.json();

  assertEquals(res.status, 200);
  assertEquals(body.data.length, 1);
});

Deno.test("RF08 - GET /entregas retorna lista vazia", async () => {
  const mock = createMockSupabase({
    tableResults: { entregas: [createQueryResult([], null, 0)] },
  });

  const req = new Request("http://localhost/entregas", {
    method: "GET",
    headers: authHeaders(),
  });

  const res = await handleEntregas(req, mock);
  const body = await res.json();

  assertEquals(res.status, 200);
  assertEquals(body.data, []);
  assertEquals(body.count, 0);
});

Deno.test("RF08 - GET /entregas retorna 400 para limit inválido", async () => {
  const mock = createMockSupabase({});

  const req = new Request("http://localhost/entregas?limit=0", {
    method: "GET",
    headers: authHeaders(),
  });

  const res = await handleEntregas(req, mock);

  assertEquals(res.status, 400);
});

Deno.test("RF08 - GET /entregas retorna 400 quando banco retorna erro", async () => {
  const mock = createMockSupabase({
    tableResults: {
      entregas: [createQueryResult(null, { message: "Erro de conexão" })],
    },
  });

  const req = new Request("http://localhost/entregas", {
    method: "GET",
    headers: authHeaders(),
  });

  const res = await handleEntregas(req, mock);
  const body = await res.json();

  assertEquals(res.status, 400);
  assertEquals(body.error, "Erro de conexão");
});
