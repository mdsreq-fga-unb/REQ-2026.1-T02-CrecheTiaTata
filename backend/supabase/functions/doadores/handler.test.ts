import { assertEquals } from "std/assert";
import { handleDoadores } from "./handler.ts";

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
    eq: () => thenableChain,
    ilike: () => thenableChain,
    or: () => thenableChain,
    in: () => thenableChain,
    order: () => thenableChain,
    range: () => thenableChain,
    then: (
      resolve: (v: typeof result) => unknown,
      reject?: (e: unknown) => unknown,
    ) => Promise.resolve(result).then(resolve, reject),
    catch: (reject: (e: unknown) => unknown) =>
      Promise.resolve(result).catch(reject),
    finally: (fn: () => void) => Promise.resolve(result).finally(fn),
  };

  const thenableChain = chain;
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
          data: { user: options.authUser ?? { id: "admin-1" } },
          error: options.authError ?? null,
        }),
    },
    from: (table: string) => {
      const results = options.tableResults?.[table] ?? [createQueryResult(null)];
      const result = results.shift() ?? createQueryResult(null);
      return createThenableChain(result);
    },
  };
}

function authHeaders() {
  return { Authorization: "Bearer token-valido" };
}

Deno.test("RF06 - GET /doadores retorna lista de doadores", async () => {
  const doadores = [
    { id: "1", nome: "Maria", email: "maria@email.com" },
    { id: "2", nome: "João", email: "joao@email.com" },
  ];

  const mock = createMockSupabase({
    tableResults: { doadores: [createQueryResult(doadores, null, 2)] },
  });

  const req = new Request("http://localhost/doadores", {
    method: "GET",
    headers: authHeaders( ),
  });

  const res = await handleDoadores(req, mock);
  const body = await res.json();

  assertEquals(res.status, 200);
  assertEquals(body.data, doadores);
  assertEquals(body.count, 2);
});

Deno.test("RF06 - GET /doadores aplica filtros", async () => {
  const doadores = [{ id: "1", nome: "Maria", email: "maria@email.com" }];

  const mock = createMockSupabase({
    tableResults: { doadores: [createQueryResult(doadores, null, 1)] },
  });

  const req = new Request("http://localhost/doadores?nome=Maria&tipo=pessoa_fisica", {
    method: "GET",
    headers: authHeaders( ),
  });

  const res = await handleDoadores(req, mock);
  const body = await res.json();

  assertEquals(res.status, 200);
  assertEquals(body.data.length, 1);
});

Deno.test("RF06 - GET /doadores retorna histórico de contribuições quando solicitado", async () => {
  const doadores = [{ id: "1", nome: "Maria", email: "maria@email.com" }];
  const doacoes = [
    { id: "d1", doador_id: "1", item: "Arroz", quantidade: 10 },
    { id: "d2", doador_id: "1", item: "Feijão", quantidade: 5 },
  ];

  const mock = createMockSupabase({
    tableResults: {
      doadores: [createQueryResult(doadores, null, 1)],
      doacoes: [createQueryResult(doacoes)],
    },
  });

  const req = new Request("http://localhost/doadores?id=1&incluir_historico=true", {
    method: "GET",
    headers: authHeaders( ),
  });

  const res = await handleDoadores(req, mock);
  const body = await res.json();

  assertEquals(res.status, 200);
  assertEquals(body.data[0].historico_contribuicoes.length, 2);
});

Deno.test("RF06 - GET /doadores retorna lista vazia quando não há resultados", async () => {
  const mock = createMockSupabase({
    tableResults: { doadores: [createQueryResult([], null, 0)] },
  });

  const req = new Request("http://localhost/doadores", {
    method: "GET",
    headers: authHeaders( ),
  });

  const res = await handleDoadores(req, mock);
  const body = await res.json();

  assertEquals(res.status, 200);
  assertEquals(body.data, []);
  assertEquals(body.count, 0);
});

Deno.test("RF06 - GET /doadores sem JWT retorna 401", async () => {
  const mock = createMockSupabase({});

  const req = new Request("http://localhost/doadores", { method: "GET" } );
  const res = await handleDoadores(req, mock);

  assertEquals(res.status, 401);
});

Deno.test("RF06 - GET /doadores retorna 400 quando banco retorna erro", async () => {
  const mock = createMockSupabase({
    tableResults: {
      doadores: [createQueryResult(null, { message: "Erro de conexão" })],
    },
  });

  const req = new Request("http://localhost/doadores", {
    method: "GET",
    headers: authHeaders( ),
  });

  const res = await handleDoadores(req, mock);
  const body = await res.json();

  assertEquals(res.status, 400);
  assertEquals(body.error, "Erro de conexão");
});