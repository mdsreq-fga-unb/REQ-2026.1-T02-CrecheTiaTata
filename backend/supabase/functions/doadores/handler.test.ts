import { assertEquals } from "std/assert";
import { handleDoadores } from "./handler.ts";

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
    eq: () => thenableChain,
    ilike: () => thenableChain,
    or: () => thenableChain,
    in: () => thenableChain,
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
  return {
    auth: {
      getUser: () =>
        Promise.resolve({
          data: {
            user: options.authUser !== undefined ? options.authUser : MOCK_USER,
          },
          error: options.authError ?? null,
        }),
    },
    from: (table: string) => {
      if (options.dbData !== undefined || options.dbError !== undefined) {
        return createThenableChain(
          createQueryResult(options.dbData, options.dbError),
        );
      }

      const results = options.tableResults?.[table] ??
        [createQueryResult(null)];
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

const DOADOR_VALIDO = {
  nome: "Maria Silva",
  tipo: "pessoa_fisica",
  email: "maria@gmail.com",
  telefone: "61999999999",
};

// --- Testes de POST (existentes) ---

Deno.test("POST registra doador com dados válidos", async () => {
  const criado = { id: "doador-1", ...DOADOR_VALIDO };
  const mock = createMockSupabase({ dbData: criado });

  const req = reqComToken("http://localhost/doadores", {
    method: "POST",
    body: JSON.stringify(DOADOR_VALIDO),
  });
  const res = await handleDoadores(req, mock);

  assertEquals(res.status, 201);
});

Deno.test("POST retorna 401 sem JWT", async () => {
  const mock = createMockSupabase({ authUser: null });

  const req = new Request("http://localhost/doadores", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(DOADOR_VALIDO),
  });
  const res = await handleDoadores(req, mock);

  assertEquals(res.status, 401);
});

// --- Testes de GET (RF 06) ---

Deno.test("GET /doadores retorna lista de doadores", async () => {
  const doadores = [
    { id: "1", nome: "Maria", email: "maria@email.com" },
    { id: "2", nome: "João", email: "joao@email.com" },
  ];

  const mock = createMockSupabase({
    tableResults: { doadores: [createQueryResult(doadores, null, 2)] },
  });

  const req = reqComToken("http://localhost/doadores", { method: "GET" });
  const res = await handleDoadores(req, mock);
  const body = await res.json();

  assertEquals(res.status, 200);
  assertEquals(body.data, doadores);
  assertEquals(body.count, 2);
});

Deno.test("GET /doadores aplica filtros", async () => {
  const doadores = [{ id: "1", nome: "Maria", email: "maria@email.com" }];

  const mock = createMockSupabase({
    tableResults: { doadores: [createQueryResult(doadores, null, 1)] },
  });

  const req = reqComToken(
    "http://localhost/doadores?nome=Maria&tipo=pessoa_fisica",
    { method: "GET" },
  );
  const res = await handleDoadores(req, mock);
  const body = await res.json();

  assertEquals(res.status, 200);
  assertEquals(body.data.length, 1);
});

Deno.test("GET /doadores retorna histórico de contribuições quando solicitado", async () => {
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

  const req = reqComToken(
    "http://localhost/doadores?id=1&incluir_historico=true",
    { method: "GET" },
  );
  const res = await handleDoadores(req, mock);
  const body = await res.json();

  assertEquals(res.status, 200);
  assertEquals(body.data[0].historico_contribuicoes.length, 2);
});
