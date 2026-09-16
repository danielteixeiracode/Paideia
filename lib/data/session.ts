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

export async function getConstanciaDias(
  supabase: ReturnType<typeof createClient>,
  userId: string
) {
  const { data } = await supabase
    .from("constancia_diaria")
    .select("data, estudou")
    .eq("user_id", userId)
    .eq("estudou", true)
    .order("data", { ascending: false })
    .limit(60);

  if (!data || data.length === 0) return 0;

  let dias = 0;
  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);
  const datasEstudadas = new Set(data.map((d) => d.data));

  // conta a partir de hoje (ou ontem, se hoje ainda não registrou) para trás
  if (!datasEstudadas.has(cursor.toISOString().slice(0, 10))) {
    cursor.setDate(cursor.getDate() - 1);
  }

  while (datasEstudadas.has(cursor.toISOString().slice(0, 10))) {
    dias += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return dias;
}
