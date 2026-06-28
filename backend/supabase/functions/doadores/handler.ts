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

export async function handleDoadores(
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

    let body: Doador;
    try {
      body = await req.json();
    } catch {
      return new Response(JSON.stringify({ error: "Corpo inválido" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!body.nome) {
      return new Response(
        JSON.stringify({ error: "Campo obrigatório: nome" }),
        {
          status: 422,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    if (body.tipo !== undefined && !TIPOS_DOADOR.includes(body.tipo)) {
      return new Response(
        JSON.stringify({ error: "Tipo de doador inválido" }),
        {
          status: 422,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    if (body.email !== undefined && !validarEmail(body.email)) {
      return new Response(
        JSON.stringify({ error: "E-mail inválido ou domínio não permitido" }),
        {
          status: 422,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
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
      return new Response(JSON.stringify({ error: error.message }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({ registrado: true, doador: data }),
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
