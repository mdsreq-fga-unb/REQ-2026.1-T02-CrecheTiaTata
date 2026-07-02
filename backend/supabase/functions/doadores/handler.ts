import { corsHeaders } from "../_shared/cors.ts";
import { verificarJWT } from "../_shared/auth.ts";
import { validarEmail } from "../_shared/validacao.ts";

// deno-lint-ignore no-explicit-any
type SupabaseClientLike = any;

export const TIPOS_DOADOR = ["pessoa_fisica", "pessoa_juridica"];

export interface Doador {
  id?: string;
  nome: string;
  tipo?: string;
  email?: string;
  telefone?: string;
  created_at?: string;
}

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

async function listarDoadores(
  req: Request,
  supabase: SupabaseClientLike,
): Promise<Response> {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  const nome = url.searchParams.get("nome");
  const email = url.searchParams.get("email");
  const telefone = url.searchParams.get("telefone");
  const tipo = url.searchParams.get("tipo");
  const q = url.searchParams.get("q");
  const incluirHistorico = url.searchParams.get("incluir_historico") === "true";
  const limit = Number(url.searchParams.get("limit") ?? "50");
  const offset = Number(url.searchParams.get("offset") ?? "0");

  if (Number.isNaN(limit) || limit < 1 || limit > 100) {
    return jsonResponse({ error: "Parâmetro limit inválido" }, 400);
  }

  if (Number.isNaN(offset) || offset < 0) {
    return jsonResponse({ error: "Parâmetro offset inválido" }, 400);
  }

  let query = supabase
    .from("doadores")
    .select("*", { count: "exact" })
    .order("nome", { ascending: true })
    .range(offset, offset + limit - 1);

  if (id) query = query.eq("id", id);
  if (nome) query = query.ilike("nome", `%${nome}%`);
  if (email) query = query.ilike("email", `%${email}%`);
  if (telefone) query = query.ilike("telefone", `%${telefone}%`);
  if (tipo) query = query.eq("tipo", tipo);
  if (q) query = query.or(`nome.ilike.%${q}%,email.ilike.%${q}%,telefone.ilike.%${q}%`);

  const { data, error, count } = await query;

  if (error) {
    return jsonResponse({ error: error.message }, 400);
  }

  const doadores = data ?? [];

  if (!incluirHistorico && !id) {
    return jsonResponse({ data: doadores, count: count ?? 0 }, 200);
  }

  const doadorIds = doadores.map((doador: Doador) => doador.id).filter(Boolean);

  if (doadorIds.length === 0) {
    return jsonResponse({ data: doadores, count: count ?? 0 }, 200);
  }

  const { data: doacoes, error: historicoError } = await supabase
    .from("doacoes")
    .select("*")
    .in("doador_id", doadorIds)
    .order("data_doacao", { ascending: false });

  if (historicoError) {
    return jsonResponse({ error: historicoError.message }, 400);
  }

  const doadoresComHistorico = doadores.map((doador: Doador) => ({
    ...doador,
    historico_contribuicoes: (doacoes ?? []).filter(
      (doacao: { doador_id?: string }) => doacao.doador_id === doador.id,
    ),
  }));

  return jsonResponse({ data: doadoresComHistorico, count: count ?? 0 }, 200);
}

export async function handleDoadores(
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
    let body: Doador;
    try {
      body = await req.json();
    } catch {
      return jsonResponse({ error: "Corpo inválido" }, 400);
    }

    if (!body.nome) {
      return jsonResponse({ error: "Campo obrigatório: nome" }, 422);
    }

    if (body.tipo !== undefined && !TIPOS_DOADOR.includes(body.tipo)) {
      return jsonResponse({ error: "Tipo de doador inválido" }, 422);
    }

    if (body.email !== undefined && !validarEmail(body.email)) {
      return jsonResponse({ error: "E-mail inválido ou domínio não permitido" }, 422);
    }

    const { data, error } = await supabase
      .from("doadores")
      .insert({
        nome: body.nome,
        tipo: body.tipo ?? "pessoa_fisica",
        email: body.email,
        telefone: body.telefone,
      })
      .select()
      .single();

    if (error) {
      return jsonResponse({ error: error.message }, 400);
    }

    return jsonResponse({ registrado: true, doador: data }, 201);
  }

  if (req.method === "GET") {
    return await listarDoadores(req, supabase);
  }

  return jsonResponse({ error: "Método não permitido" }, 405);
}