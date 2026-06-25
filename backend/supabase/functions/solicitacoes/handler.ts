import { corsHeaders } from "../_shared/cors.ts";
import { verificarJWT } from "../_shared/auth.ts";

// deno-lint-ignore no-explicit-any
type SupabaseClientLike = any;

export const CATEGORIAS_SOLICITACAO = [
  "alimentacao",
  "material",
  "voluntario",
  "financeiro",
  "outro",
];

export const STATUS_SOLICITACAO = ["pendente", "em_andamento", "concluida"];

export interface Solicitacao {
  id?: string;
  titulo: string;
  descricao: string;
  categoria: string;
  status?: string;
  created_at?: string;
}

export async function handleSolicitacoes(
  req: Request,
  supabase: SupabaseClientLike,
): Promise<Response> {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method === "POST") {
    const user = await verificarJWT(req, supabase);
    if (!user) {
      return new Response(JSON.stringify({ error: "Não autorizado" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let body: Solicitacao;
    try {
      body = await req.json();
    } catch {
      return new Response(JSON.stringify({ error: "Corpo inválido" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!body.titulo || !body.descricao || !body.categoria) {
      return new Response(
        JSON.stringify({
          error: "Campos obrigatórios: titulo, descricao, categoria",
        }),
        {
          status: 422,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    if (!CATEGORIAS_SOLICITACAO.includes(body.categoria)) {
      return new Response(
        JSON.stringify({ error: "Categoria inválida" }),
        {
          status: 422,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    if (body.status !== undefined && !STATUS_SOLICITACAO.includes(body.status)) {
      return new Response(
        JSON.stringify({ error: "Status inválido" }),
        {
          status: 422,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const { data, error } = await supabase
      .from("solicitacoes_apoio")
      .insert({
        titulo: body.titulo,
        descricao: body.descricao,
        categoria: body.categoria,
        status: body.status ?? "pendente",
      })
      .select()
      .single();

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({ publicada: true, solicitacao: data }),
      {
        status: 201,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }

  return new Response(JSON.stringify({ error: "Método não permitido" }), {
    status: 405,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
