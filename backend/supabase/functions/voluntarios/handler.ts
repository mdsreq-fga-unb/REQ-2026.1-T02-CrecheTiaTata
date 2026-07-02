import { corsHeaders } from "../_shared/cors.ts";

// deno-lint-ignore no-explicit-any
type SupabaseClientLike = any;

export interface Voluntario {
  id?: string;
  nome: string;
  email: string;
  telefone?: string;
  disponibilidade?: string;
  area_atuacao?: string;
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
  const nome = url.searchParams.get("nome");
  const email = url.searchParams.get("email");
  const telefone = url.searchParams.get("telefone");
  const disponibilidade = url.searchParams.get("disponibilidade");
  const areaAtuacao = url.searchParams.get("area_atuacao");
  const q = url.searchParams.get("q");
  const limit = Number(url.searchParams.get("limit") ?? "50");
  const offset = Number(url.searchParams.get("offset") ?? "0");

  if (Number.isNaN(limit) || limit < 1 || limit > 100) {
    return new Response(JSON.stringify({ error: "Parâmetro limit inválido" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  if (Number.isNaN(offset) || offset < 0) {
    return new Response(JSON.stringify({ error: "Parâmetro offset inválido" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  let query = supabase
    .from("voluntarios")
    .select("*", { count: "exact" })
    .order("nome", { ascending: true })
    .range(offset, offset + limit - 1);

  if (id) query = query.eq("id", id);
  if (nome) query = query.ilike("nome", `%${nome}%`);
  if (email) query = query.ilike("email", `%${email}%`);
  if (telefone) query = query.ilike("telefone", `%${telefone}%`);
  if (disponibilidade) query = query.ilike("disponibilidade", `%${disponibilidade}%`);
  if (areaAtuacao) query = query.ilike("area_atuacao", `%${areaAtuacao}%`);
  if (q) {
    query = query.or(
      `nome.ilike.%${q}%,email.ilike.%${q}%,telefone.ilike.%${q}%,area_atuacao.ilike.%${q}%`,
    );
  }

  const { data, error, count } = await query;

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ data: data ?? [], count: count ?? 0 }), {
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
