import { corsHeaders } from "../_shared/cors.ts";
import { verificarJWT } from "../_shared/auth.ts";

// deno-lint-ignore no-explicit-any
type SupabaseClientLike = any;

export const TIPOS_DOACAO = [
  "dinheiro",
  "alimento",
  "roupa",
  "brinquedo",
  "material",
  "outro",
];

export interface Doacao {
  id?: string;
  doador_nome?: string;
  doador_id?: string;
  tipo: string;
  item?: string;
  descricao: string;
  quantidade?: number;
  data_doacao?: string;
  observacoes?: string;
  created_at?: string;
  updated_at?: string;
}

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function getAllowedUpdateFields(body: Partial<Doacao>): Partial<Doacao> {
  const allowedFields: (keyof Doacao)[] = [
    "doador_id",
    "tipo",
    "item",
    "descricao",
    "quantidade",
    "data_doacao",
    "observacoes",
  ];

  const updateData: Partial<Doacao> = {};

  for (const field of allowedFields) {
    if (body[field] !== undefined) {
      updateData[field] = body[field] as never;
    }
  }

  return updateData;
}

function getChangedFields(
  anterior: Record<string, unknown>,
  novo: Record<string, unknown>,
): string[] {
  return Object.keys(novo).filter((field) => anterior[field] !== novo[field]);
}

async function listarDoacoes(
  req: Request,
  supabase: SupabaseClientLike,
): Promise<Response> {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  const doadorId = url.searchParams.get("doador_id");
  const tipo = url.searchParams.get("tipo");
  const item = url.searchParams.get("item");
  const dataInicio = url.searchParams.get("data_inicio");
  const dataFim = url.searchParams.get("data_fim");
  const q = url.searchParams.get("q");
  const limit = Number(url.searchParams.get("limit") ?? "50");
  const offset = Number(url.searchParams.get("offset") ?? "0");

  if (Number.isNaN(limit) || limit < 1 || limit > 100) {
    return jsonResponse({ error: "Parâmetro limit inválido" }, 400);
  }

  if (Number.isNaN(offset) || offset < 0) {
    return jsonResponse({ error: "Parâmetro offset inválido" }, 400);
  }

  let query = supabase
    .from("doacoes")
    .select("*", { count: "exact" })
    .order("data_doacao", { ascending: false })
    .range(offset, offset + limit - 1);

  if (id) query = query.eq("id", id);
  if (doadorId) query = query.eq("doador_id", doadorId);
  if (tipo) query = query.eq("tipo", tipo);
  if (item) query = query.ilike("item", `%${item}%`);
  if (dataInicio) query = query.gte("data_doacao", dataInicio);
  if (dataFim) query = query.lte("data_doacao", dataFim);
  if (q) query = query.or(`item.ilike.%${q}%,descricao.ilike.%${q}%`);

  const { data, error, count } = await query;

  if (error) {
    return jsonResponse({ error: error.message }, 400);
  }

  return jsonResponse({ data: data ?? [], count: count ?? 0 }, 200);
}

async function editarDoacao(
  req: Request,
  supabase: SupabaseClientLike,
  user: { id?: string },
): Promise<Response> {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");

  if (!id) {
    return jsonResponse({ error: "Parâmetro id obrigatório" }, 400);
  }

  let body: Partial<Doacao>;
  try {
    body = await req.json();
  } catch {
    return jsonResponse({ error: "Corpo inválido" }, 400);
  }

  const updateData = getAllowedUpdateFields(body);

  if (Object.keys(updateData).length === 0) {
    return jsonResponse({ error: "Nenhum campo válido para atualização" }, 422);
  }

  const { data: doacaoAtual, error: buscaError } = await supabase
    .from("doacoes")
    .select("*")
    .eq("id", id)
    .single();

  if (buscaError || !doacaoAtual) {
    return jsonResponse({ error: "Doação não encontrada" }, 404);
  }

  const { data: doacaoAtualizada, error: updateError } = await supabase
    .from("doacoes")
    .update(updateData)
    .eq("id", id)
    .select("*")
    .single();

  if (updateError) {
    return jsonResponse({ error: updateError.message }, 400);
  }

  const camposAlterados = getChangedFields(
    doacaoAtual as Record<string, unknown>,
    updateData as Record<string, unknown>,
  );

  const { error: historicoError } = await supabase
    .from("doacoes_historico")
    .insert({
      doacao_id: id,
      alterado_por: user.id ?? null,
      dados_anteriores: doacaoAtual,
      dados_novos: doacaoAtualizada,
      campos_alterados: camposAlterados,
    });

  if (historicoError) {
    return jsonResponse({ error: historicoError.message }, 400);
  }

  return jsonResponse(doacaoAtualizada, 200);
}

export async function handleDoacoes(
  req: Request,
  supabase: SupabaseClientLike,
): Promise<Response> {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const user = await verificarJWT(req, supabase);
  if (!user) {
    return jsonResponse({ error: "Não autorizado" }, 401);
  }

  if (req.method === "POST") {
    let body: Doacao;
    try {
      body = await req.json();
    } catch {
      return jsonResponse({ error: "Corpo inválido" }, 400);
    }

    if (!body.tipo || !body.descricao) {
      return jsonResponse({ error: "Campos obrigatórios: tipo, descricao" }, 422);
    }

    if (!TIPOS_DOACAO.includes(body.tipo)) {
      return jsonResponse({ error: "Tipo de doação inválido" }, 422);
    }

    if (body.quantidade !== undefined) {
      if (
        typeof body.quantidade !== "number" ||
        !Number.isInteger(body.quantidade) ||
        body.quantidade <= 0
      ) {
        return jsonResponse({ error: "Quantidade deve ser um inteiro maior que zero" }, 422);
      }
    }

    const { data, error } = await supabase
      .from("doacoes")
      .insert({
        doador_nome: body.doador_nome,
        tipo: body.tipo,
        descricao: body.descricao,
        quantidade: body.quantidade ?? 1,
        data_doacao: body.data_doacao,
      })
      .select()
      .single();

    if (error) {
      return jsonResponse({ error: error.message }, 400);
    }

    return jsonResponse({ registrada: true, doacao: data }, 201);
  }

  if (req.method === "GET") {
    return await listarDoacoes(req, supabase);
  }

  if (req.method === "PUT") {
    return await editarDoacao(req, supabase, user);
  }

  return jsonResponse({ error: "Método não permitido" }, 405);
}