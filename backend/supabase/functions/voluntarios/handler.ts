import { corsHeaders } from "../_shared/cors.ts";

// deno-lint-ignore no-explicit-any
type SupabaseClientLike = any;

export interface Voluntario {
  id?: string;
  nome: string;
  email: string;
  telefone?: string;
  disponibilidade?: string;
  created_at?: string;
}

export async function handleVoluntarios(
  req: Request,
  supabase: SupabaseClientLike,
): Promise<Response> {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const url = new URL(req.url);
  const id = url.searchParams.get("id");

  if (req.method === "GET") {
    const query = supabase.from("voluntarios").select("*");
    const { data, error } = id ? await query.eq("id", id) : await query;

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  if (req.method === "POST") {
    let body: Voluntario;
    try {
      body = await req.json();
    } catch {
      return new Response(JSON.stringify({ error: "Corpo inválido" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!body.nome || !body.email) {
      return new Response(
        JSON.stringify({ error: "Campos obrigatórios: nome, email" }),
        {
          status: 422,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const { data, error } = await supabase
      .from("voluntarios")
      .insert(body)
      .select()
      .single();

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(data), {
      status: 201,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  if (req.method === "PUT") {
    if (!id) {
      return new Response(
        JSON.stringify({ error: "Parâmetro id obrigatório" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    let body: Partial<Voluntario>;
    try {
      body = await req.json();
    } catch {
      return new Response(JSON.stringify({ error: "Corpo inválido" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data, error } = await supabase
      .from("voluntarios")
      .update(body)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  if (req.method === "DELETE") {
    if (!id) {
      return new Response(
        JSON.stringify({ error: "Parâmetro id obrigatório" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const { error } = await supabase
      .from("voluntarios")
      .delete()
      .eq("id", id);

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(null, { status: 204, headers: corsHeaders });
  }

  return new Response(JSON.stringify({ error: "Método não permitido" }), {
    status: 405,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
