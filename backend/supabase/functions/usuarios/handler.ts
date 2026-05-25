import { corsHeaders } from "../_shared/cors.ts";

// deno-lint-ignore no-explicit-any
type SupabaseClientLike = any;

export interface Usuario {
  id?: string;
  nome: string;
  email: string;
  senha?: string;
  telefone?: string;
  disponibilidade?: string;
  acoes_preferencia?: string[];
  created_at?: string;
}

async function hashSenha(senha: string): Promise<string> {
  const data = new TextEncoder().encode(senha);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function handleUsuarios(
  req: Request,
  supabase: SupabaseClientLike,
): Promise<Response> {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const url = new URL(req.url);
  const email = url.searchParams.get("email");
  const action = url.searchParams.get("action");

  if (req.method === "GET") {
    if (!email) {
      return new Response(
        JSON.stringify({ error: "Parâmetro email obrigatório" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const { data, error } = await supabase
      .from("usuarios")
      .select("nome, email, telefone, disponibilidade")
      .eq("email", email)
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

  if (req.method === "POST" && action === "login") {
    let body: { email: string; senha: string };
    try {
      body = await req.json();
    } catch {
      return new Response(JSON.stringify({ error: "Corpo inválido" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!body.email || !body.senha) {
      return new Response(
        JSON.stringify({ error: "Campos obrigatórios: email, senha" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const senhaHash = await hashSenha(body.senha);
    const { data, error } = await supabase
      .from("usuarios")
      .select("id, nome, email")
      .eq("email", body.email)
      .eq("senha", senhaHash)
      .single();

    if (error || !data) {
      return new Response(
        JSON.stringify({ autenticado: false }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    return new Response(
      JSON.stringify({ autenticado: true, usuario: data }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }

  if (req.method === "POST") {
    let body: Usuario;
    try {
      body = await req.json();
    } catch {
      return new Response(JSON.stringify({ error: "Corpo inválido" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!body.nome || !body.email || !body.senha) {
      return new Response(
        JSON.stringify({ error: "Campos obrigatórios: nome, email, senha" }),
        {
          status: 422,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const senhaHash = await hashSenha(body.senha);

    const { data, error } = await supabase
      .from("usuarios")
      .insert({ ...body, senha: senhaHash })
      .select("id, nome, email, telefone, disponibilidade")
      .single();

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ criado: true, usuario: data }), {
      status: 201,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  if (req.method === "PUT") {
    if (!email) {
      return new Response(
        JSON.stringify({ error: "Parâmetro email obrigatório" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    let body: Partial<Usuario>;
    try {
      body = await req.json();
    } catch {
      return new Response(JSON.stringify({ error: "Corpo inválido" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (body.senha) {
      body = { ...body, senha: await hashSenha(body.senha) };
    }

    const { data, error } = await supabase
      .from("usuarios")
      .update(body)
      .eq("email", email)
      .select("id, nome, email, telefone, disponibilidade, acoes_preferencia")
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
    let deleteBody: { senha: string };
    try {
      deleteBody = await req.json();
    } catch {
      return new Response(JSON.stringify({ error: "Corpo inválido" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!email || !deleteBody.senha) {
      return new Response(
        JSON.stringify({ error: "Parâmetros obrigatórios: email (query), senha (body)" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const senhaHash = await hashSenha(deleteBody.senha);
    const { data: usuario, error: authError } = await supabase
      .from("usuarios")
      .select("id")
      .eq("email", email)
      .eq("senha", senhaHash)
      .single();

    if (authError || !usuario) {
      return new Response(
        JSON.stringify({ error: "Credenciais inválidas" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const { error } = await supabase
      .from("usuarios")
      .delete()
      .eq("id", usuario.id);

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
