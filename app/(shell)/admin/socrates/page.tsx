import { requireAdmin } from "@/lib/data/session";
import { Card, Eyebrow } from "@/components/ui/primitives";
import { AdminTabs } from "@/components/admin/admin-tabs";
import { SubmitButton } from "@/components/admin/submit-button";
import { atualizarConfigSocrates } from "@/app/(shell)/admin/actions";

export default async function AdminSocratesPage() {
  const { supabase } = await requireAdmin();

  const { data: config } = await supabase
    .from("config_socrates")
    .select("*")
    .order("atualizado_em", { ascending: false })
    .limit(1)
    .maybeSingle();

  return (
    <div className="space-y-6">
      <div>
        <Eyebrow>Administratio Paideiae</Eyebrow>
        <h1 className="mt-1 font-serif text-2xl font-semibold sm:text-3xl">Configuração do Sócrates</h1>
        <p className="mt-1 text-sm text-paideia-ink/60">
          Ajuste o prompt de sistema, o modelo e os parâmetros do mentor de IA usado em{" "}
          <span className="font-semibold">Diálogo com Sócrates</span>.
        </p>
      </div>
      <AdminTabs />

      <Card>
        <form action={atualizarConfigSocrates} className="space-y-4">
          <input type="hidden" name="id" value={config?.id ?? ""} />

          <div>
            <label className="label-caps mb-1.5 block">Prompt de Sistema (Maiêutica)</label>
            <textarea
              name="system_prompt"
              required
              rows={10}
              defaultValue={config?.system_prompt}
              className="w-full rounded-lg border border-paideia-cream-300 bg-paideia-cream-50 px-3 py-2.5 text-sm outline-none focus:border-paideia-gold-500"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="label-caps mb-1.5 block">Modelo</label>
              <input
                name="modelo"
                defaultValue={config?.modelo ?? "claude-sonnet-5"}
                className="w-full rounded-lg border border-paideia-cream-300 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="label-caps mb-1.5 block">Temperatura</label>
              <input
                name="temperatura"
                type="number"
                step="0.05"
                min="0"
                max="1"
                defaultValue={config?.temperatura ?? 0.7}
                className="w-full rounded-lg border border-paideia-cream-300 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="label-caps mb-1.5 block">Máx. Tokens</label>
              <input
                name="max_tokens"
                type="number"
                min="128"
                max="4096"
                defaultValue={config?.max_tokens ?? 1024}
                className="w-full rounded-lg border border-paideia-cream-300 px-3 py-2 text-sm"
              />
            </div>
          </div>

          <SubmitButton label={config ? "Salvar Configuração" : "Criar Configuração"} />
        </form>
      </Card>
    </div>
  );
}
