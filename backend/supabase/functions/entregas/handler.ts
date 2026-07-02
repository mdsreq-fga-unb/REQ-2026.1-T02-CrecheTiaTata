import { verificarJWT } from "../_shared/auth.ts";
import { corsHeaders } from "../_shared/cors.ts";

// deno-lint-ignore no-explicit-any
type SupabaseClientLike = any;

export interface Entrega {
  id?: string;
  item: string;
  quantidade: number;
  data_entrega: string;
  destinatario?: string;
  observacoes?: string;
  created_at?: string;
}

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function validarEntrega(body: Partial<Entrega>): string | null {
  if (!body.item || body.quantidade === undefined || !body.data_entrega) {
    return "Campos obrigatórios: item, quantidade, data_entrega";
  }

  if (Number(body.quantidade) <= 0) {
    return "Quantidade deve ser maior que zero";
  }

  return null;
}

async function registrarEntrega(
  req: Request,
  supabase: SupabaseClientLike,
): Promise<Response> {
  let body: Entrega;

  try {
    body = await req.json();
  } catch {
    return jsonResponse({ error: "Corpo inválido" }, 400);
  }

  const validationError = validarEntrega(body);

  if (validationError) {
    return jsonResponse({ error: validationError }, 422);
  }

  const { data, error } = await supabase
    .from("entregas")
    .insert({
      item: body.item,
      quantidade: Number(body.quantidade),
      data_entrega: body.data_entrega,
      destinatario: body.destinatario,
      observacoes: body.observacoes,
    })
    .select("*")
    .single();

  if (error) {
    return jsonResponse({ error: error.message }, 400);
  }

  return jsonResponse(data, 201);
}

async function listarEntregas(
  req: Request,
  supabase: SupabaseClientLike,
): Promise<Response> {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  const item = url.searchParams.get("item");
  const destinatario = url.searchParams.get("destinatario");
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
    .from("entregas")
    .select("*", { count: "exact" })
    .order("data_entrega", { ascending: false })
    .range(offset, offset + limit - 1);

  if (id) query = query.eq("id", id);
  if (item) query = query.ilike("item", `%${item}%`);
  if (destinatario) query = query.ilike("destinatario", `%${destinatario}%`);
  if (dataInicio) query = query.gte("data_entrega", dataInicio);
  if (dataFim) query = query.lte("data_entrega", dataFim);
  if (q) {
    query = query.or(
      `item.ilike.%${q}%,destinatario.ilike.%${q}%,observacoes.ilike.%${q}%`,
    );
  }

  const { data, error, count } = await query;

  if (error) {
    return jsonResponse({ error: error.message }, 400);
  }

  return jsonResponse({ data: data ?? [], count: count ?? 0 }, 200);
}

export async function handleEntregas(
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
    return await registrarEntrega(req, supabase);
  }

  if (req.method === "GET") {
    return await listarEntregas(req, supabase);
  }

  return jsonResponse({ error: "Método não permitido" }, 405);
}
