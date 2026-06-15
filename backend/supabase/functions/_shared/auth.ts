// deno-lint-ignore no-explicit-any
type SupabaseClientLike = any;

export async function verificarJWT(
  req: Request,
  supabase: SupabaseClientLike,
) {
  const authHeader = req.headers.get("Authorization");

  if (!authHeader?.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.slice(7);
  const { data: { user }, error } = await supabase.auth.getUser(token);

  if (error || !user) {
    return null;
  }

  return user;
}