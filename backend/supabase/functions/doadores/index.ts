import { createClient } from "@supabase/supabase-js";
import { handleDoadores } from "./handler.ts";

Deno.serve(async (req: Request) => {
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
  );

  return await handleDoadores(req, supabase);
});
