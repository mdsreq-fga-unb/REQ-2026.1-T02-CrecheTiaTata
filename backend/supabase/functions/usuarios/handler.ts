import { corsHeaders } from "../_shared/cors.ts";
import { validarEmail } from "../_shared/validacao.ts";

// deno-lint-ignore no-explicit-any
type SupabaseClientLike = any;

export interface UsuarioPerfil {
  id?: string;
  nome: string;
  email: string;
  telefone?: string;
  disponibilidade?: string;
  acoes_preferencia?: string[];
  papel?: "admin" | "usuario";
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
    let body: { email: string; password: string };
    try {
      body = await req.json();
    } catch {
      return new Response(JSON.stringify({ error: "Corpo inválido" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!body.email || !body.password) {
      return new Response(
        JSON.stringify({ error: "Campos obrigatórios: email, password" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: body.email,
      password: body.password,
    });

    if (error || !data.session) {
      return new Response(JSON.stringify({ autenticado: false }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: perfil } = await supabase
      .from("usuarios")
      .select("papel")
      .eq("id", data.user.id)
      .single();

    if (!perfil || perfil.papel !== "admin") {
      return new Response(
        JSON.stringify({
          autenticado: false,
          error: "Acesso restrito a administradores",
        }),
        {
          status: 403,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    return new Response(
      JSON.stringify({
        autenticado: true,
        token: data.session.access_token,
        usuario: { id: data.user.id, email: data.user.email, papel: perfil.papel },
        user: { id: data.user.id, email: data.user.email, papel: perfil.papel },
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
    let body: {
      name: string;
      email: string;
      password: string;
      telefone?: string;
      disponibilidade?: string;
      acoes_preferencia?: string[];
      papel?: "admin" | "usuario";
    };
    try {
      body = await req.json();
    } catch {
      return new Response(JSON.stringify({ error: "Corpo inválido" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!body.name || !body.email || !body.password) {
      return new Response(
        JSON.stringify({ error: "Campos obrigatórios: name, email, password" }),
        {
          status: 422,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    if (!validarEmail(body.email)) {
      return new Response(
        JSON.stringify({ error: "E-mail inválido ou domínio não permitido" }),
        {
          status: 422,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const { data: authData, error: authError } =
      await supabase.auth.admin.createUser({
        email: body.email,
        password: body.password,
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
        nome: body.name,
        email: body.email,
        telefone: body.telefone,
        disponibilidade: body.disponibilidade,
        acoes_preferencia: body.acoes_preferencia,
        papel: body.papel ?? "admin",
      })
      .select("id, nome, email, telefone, disponibilidade, papel")
      .single();

    if (error) {
      await supabase.auth.admin.deleteUser(authData.user.id);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: sessionData } = await supabase.auth.signInWithPassword({
      email: body.email,
      password: body.password,
    });

    return new Response(
      JSON.stringify({
        criado: true,
        token: sessionData?.session?.access_token ?? null,
        usuario: data,
        user: data,
      }),
      {
        status: 201,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
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

    let body: Partial<UsuarioPerfil> & { password?: string };
    try {
      body = await req.json();
    } catch {
      return new Response(JSON.stringify({ error: "Corpo inválido" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { password, ...perfil } = body;

    const { data: alvo, error: alvoError } = await supabase
      .from("usuarios")
      .select("id")
      .eq("email", email)
      .single();

    if (alvoError || !alvo) {
      return new Response(
        JSON.stringify({ error: "Usuário não encontrado" }),
        {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    if (password) {
      const { error: senhaError } = await supabase.auth.admin.updateUserById(
        alvo.id,
        { password },
      );

      if (senhaError) {
        return new Response(JSON.stringify({ error: senhaError.message }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    if (Object.keys(perfil).length === 0) {
      const { data } = await supabase
        .from("usuarios")
        .select("id, nome, email, telefone, disponibilidade, acoes_preferencia")
        .eq("email", email)
        .single();

      return new Response(JSON.stringify(data), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data, error } = await supabase
      .from("usuarios")
      .update(perfil)
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
