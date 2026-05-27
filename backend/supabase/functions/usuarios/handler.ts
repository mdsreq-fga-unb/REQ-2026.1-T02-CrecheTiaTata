import { corsHeaders } from "../_shared/cors.ts";

// deno-lint-ignore no-explicit-any
type SupabaseClientLike = any;

export interface UsuarioPerfil {
  id?: string;
  nome: string;
  email: string;
  telefone?: string;
  disponibilidade?: string;
  acoes_preferencia?: string[];
}

async function verificarJWT(
  req: Request,
  supabase: SupabaseClientLike,
) {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;
  const token = authHeader.slice(7);
  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) return null;
  return user;
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

    const { data, error } = await supabase.auth.signInWithPassword({
      email: body.email,
      password: body.senha,
    });

    if (error || !data.session) {
      return new Response(JSON.stringify({ autenticado: false }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({
        autenticado: true,
        token: data.session.access_token,
        usuario: { id: data.user.id, email: data.user.email },
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }

  if (req.method === "GET") {
    const user = await verificarJWT(req, supabase);
    if (!user) {
      return new Response(JSON.stringify({ error: "Não autorizado" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

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

  if (req.method === "POST" && action !== null && action !== "login") {
    return new Response(JSON.stringify({ error: "Ação desconhecida" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  if (req.method === "POST" && action) {
    return new Response(
      JSON.stringify({ error: "Ação inválida" }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }

  if (req.method === "POST") {
    let body: UsuarioPerfil & { senha: string };
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

    const { data: authData, error: authError } =
      await supabase.auth.admin.createUser({
        email: body.email,
        password: body.senha,
        email_confirm: true,
      });

    if (authError) {
      return new Response(JSON.stringify({ error: authError.message }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data, error } = await supabase
      .from("usuarios")
      .insert({
        id: authData.user.id,
        nome: body.nome,
        email: body.email,
        telefone: body.telefone,
        disponibilidade: body.disponibilidade,
        acoes_preferencia: body.acoes_preferencia,
      })
      .select("id, nome, email, telefone, disponibilidade")
      .single();

    if (error) {
      await supabase.auth.admin.deleteUser(authData.user.id);
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
    const user = await verificarJWT(req, supabase);
    if (!user) {
      return new Response(JSON.stringify({ error: "Não autorizado" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!email) {
      return new Response(
        JSON.stringify({ error: "Parâmetro email obrigatório" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    let body: Partial<UsuarioPerfil>;
    try {
      body = await req.json();
    } catch {
      return new Response(JSON.stringify({ error: "Corpo inválido" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
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
    const user = await verificarJWT(req, supabase);
    if (!user) {
      return new Response(JSON.stringify({ error: "Não autorizado" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!email) {
      return new Response(
        JSON.stringify({ error: "Parâmetro email obrigatório" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const { data: usuario } = await supabase
      .from("usuarios")
      .select("id")
      .eq("email", email)
      .single();

    if (!usuario) {
      return new Response(
        JSON.stringify({ error: "Usuário não encontrado" }),
        {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const { error: profileError } = await supabase
      .from("usuarios")
      .delete()
      .eq("id", usuario.id);

    if (profileError) {
      return new Response(JSON.stringify({ error: profileError.message }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    await supabase.auth.admin.deleteUser(usuario.id);

    return new Response(null, { status: 204, headers: corsHeaders });
  }

  return new Response(JSON.stringify({ error: "Método não permitido" }), {
    status: 405,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
