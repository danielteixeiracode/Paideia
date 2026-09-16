import { readFileSync } from "node:fs";
import path from "node:path";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// O processo do Playwright roda fora do Next, então o .env.local não é carregado sozinho.
function carregarEnvLocal() {
  const conteudo = readFileSync(path.join(process.cwd(), ".env.local"), "utf8");
  for (const linha of conteudo.split("\n")) {
    const match = linha.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)$/);
    if (match && !process.env[match[1]]) {
      process.env[match[1]] = match[2].trim().replace(/^["']|["']$/g, "");
    }
  }
}

export function criarAdminClient(): SupabaseClient {
  carregarEnvLocal();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRole) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY são obrigatórias no .env.local");
  }
  return createClient(url, serviceRole, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export async function criarAdminDeTeste(supabase: SupabaseClient) {
  const sufixo = Date.now();
  const email = `qa-e2e-${sufixo}@paideia.test`;
  const senha = `qa-${sufixo}-${Math.random().toString(36).slice(2, 10)}`;

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password: senha,
    email_confirm: true,
    user_metadata: { nome: "QA E2E" },
  });
  if (error) throw error;

  const userId = data.user.id;
  const { error: erroPapel } = await supabase
    .from("perfis")
    .update({ papel: "administrador" })
    .eq("id", userId);
  if (erroPapel) throw erroPapel;

  return { userId, email, senha };
}
