import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Perfil } from "@/types/database";

export async function requirePerfil(): Promise<{
  supabase: ReturnType<typeof createClient>;
  perfil: Perfil;
}> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: perfil } = await supabase.from("perfis").select("*").eq("id", user.id).single();

  if (!perfil) redirect("/login");

  return { supabase, perfil: perfil as Perfil };
}

export async function requireAdmin() {
  const ctx = await requirePerfil();
  if (ctx.perfil.papel !== "administrador") redirect("/inicio");
  return ctx;
}
