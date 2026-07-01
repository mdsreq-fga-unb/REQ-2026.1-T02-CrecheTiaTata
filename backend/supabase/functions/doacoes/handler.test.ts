import { assertEquals } from "std/assert";
import { handleDoacoes } from "./handler.ts";

const MOCK_USER = { id: "uuid-1", email: "admin@gmail.com" };
const MOCK_TOKEN = "valid-jwt-token";

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
  dbData?: unknown;
  dbError?: { message: string } | null;
}) {
  const tableCalls: string[] = [];

  return {
    tableCalls,
    auth: {
      getUser: () =>
        Promise.resolve({
          data: { user: options.authUser !== undefined ? options.authUser : MOCK_USER },
          error: options.authError ?? null,
        }),
    },
    from: (table: string) => {
      tableCalls.push(table);
      
      if (options.dbData !== undefined || options.dbError !== undefined) {
        return createThenableChain(createQueryResult(options.dbData, options.dbError));
      }
      
      const results = options.tableResults?.[table] ?? [createQueryResult(null)];
      const result = results.shift() ?? createQueryResult(null);
      return createThenableChain(result);
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

// --- Testes de POST (existentes) ---

Deno.test("POST registra doação com dados válidos", async () => {
  const criada = { id: "doacao-1", ...DOACAO_VALIDA };
  const mock = createMockSupabase({ dbData: criada });

  const req = reqComToken("http://localhost/doacoes", {
    method: "POST",
    body: JSON.stringify(DOACAO_VALIDA ),
  });
  const res = await handleDoacoes(req, mock);

  assertEquals(res.status, 201);
  const body = await res.json();
  assertEquals(body.registrada, true);
  assertEquals(body.doacao.tipo, "alimento");
});

Deno.test("POST retorna 401 sem JWT", async () => {
  const mock = createMockSupabase({ authUser: null });

  const req = new Request("http://localhost/doacoes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(DOACAO_VALIDA ),
  });
  const res = await handleDoacoes(req, mock);

  assertEquals(res.status, 401);
});

// --- Testes de GET (RF 03) ---

Deno.test("GET /doacoes retorna lista de doações", async () => {
  const doacoes = [
    { id: "1", descricao: "Arroz", quantidade: 10, doador_id: "doador-1" },
    { id: "2", descricao: "Feijão", quantidade: 5, doador_id: "doador-2" },
  ];

  const mock = createMockSupabase({
    tableResults: { doacoes: [createQueryResult(doacoes, null, 2)] },
  });

  const req = reqComToken("http://localhost/doacoes", { method: "GET" } );
  const res = await handleDoacoes(req, mock);
  const body = await res.json();

  assertEquals(res.status, 200);
  assertEquals(body.data, doacoes);
  assertEquals(body.count, 2);
});

Deno.test("GET /doacoes retorna lista vazia quando não há resultados", async () => {
  const mock = createMockSupabase({
    tableResults: { doacoes: [createQueryResult([], null, 0)] },
  });

  const req = reqComToken("http://localhost/doacoes", { method: "GET" } );
  const res = await handleDoacoes(req, mock);
  const body = await res.json();

  assertEquals(res.status, 200);
  assertEquals(body.data, []);
  assertEquals(body.count, 0);
});

// --- Testes de PUT (RF 04) ---

Deno.test("PUT /doacoes atualiza doação e registra histórico", async () => {
  const antiga = { id: "1", descricao: "Arroz", quantidade: 10 };
  const atualizada = { id: "1", descricao: "Arroz", quantidade: 20 };

  const mock = createMockSupabase({
    tableResults: {
      doacoes: [
        createQueryResult(antiga),
        createQueryResult(atualizada),
      ],
      doacoes_historico: [createQueryResult(null)],
    },
  });

  const req = reqComToken("http://localhost/doacoes?id=1", {
    method: "PUT",
    body: JSON.stringify({ quantidade: 20 } ),
  });

  const res = await handleDoacoes(req, mock);
  const body = await res.json();

  assertEquals(res.status, 200);
  assertEquals(body.quantidade, 20);
  assertEquals(mock.tableCalls.includes("doacoes_historico"), true);
});

Deno.test("PUT /doacoes sem id retorna 400", async () => {
  const mock = createMockSupabase({});

  const req = reqComToken("http://localhost/doacoes", {
    method: "PUT",
    body: JSON.stringify({ quantidade: 20 } ),
  });

  const res = await handleDoacoes(req, mock);
  assertEquals(res.status, 400);
});