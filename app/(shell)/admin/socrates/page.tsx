import { requireAdmin } from "@/lib/data/session";
import { AdminTabs } from "@/components/admin/admin-tabs";
import { FormularioSocrates } from "@/components/admin/formulario-socrates";

export default async function AdminSocratesPage() {
  const { supabase } = await requireAdmin();

  const { data: config } = await supabase
    .from("config_socrates")
    .select("*")
    .order("atualizado_em", { ascending: false })
    .limit(1)
    .maybeSingle();

  return (
    <div className="space-y-8">
      <header>
        <h1 className="t-titulo">Configuração do Sócrates</h1>
        <p className="t-nota mt-1 max-w-leitura">
          O prompt de sistema, o modelo e os parâmetros do mentor usado no diálogo e na gaveta. A conversa e a lógica não mudam por aqui.
        </p>
      </header>

      <AdminTabs />

      <div className="max-w-3xl">
        <FormularioSocrates
          inicial={{
            id: config?.id ?? null,
            system_prompt: config?.system_prompt ?? "",
            modelo: config?.modelo ?? "claude-sonnet-5",
            temperatura: String(config?.temperatura ?? 0.7),
            max_tokens: String(config?.max_tokens ?? 1024),
          }}
        />
      </div>
    </div>
  );
}
