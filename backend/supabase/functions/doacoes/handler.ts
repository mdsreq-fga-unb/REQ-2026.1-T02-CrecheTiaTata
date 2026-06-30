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
  tipo: string;
  descricao: string;
  quantidade?: number;
  data_doacao?: string;
  created_at?: string;
}

export async function handleDoacoes(
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

    let body: Doacao;
    try {
      body = await req.json();
    } catch {
      return new Response(JSON.stringify({ error: "Corpo inválido" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!body.tipo || !body.descricao) {
      return new Response(
        JSON.stringify({ error: "Campos obrigatórios: tipo, descricao" }),
        {
          status: 422,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    if (!TIPOS_DOACAO.includes(body.tipo)) {
      return new Response(
        JSON.stringify({ error: "Tipo de doação inválido" }),
        {
          status: 422,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    if (body.quantidade !== undefined) {
      if (
        typeof body.quantidade !== "number" ||
        !Number.isInteger(body.quantidade) ||
        body.quantidade <= 0
      ) {
        return new Response(
          JSON.stringify({
            error: "Quantidade deve ser um inteiro maior que zero",
          }),
          {
            status: 422,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          },
        );
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
      return new Response(JSON.stringify({ error: error.message }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({ registrada: true, doacao: data }),
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
