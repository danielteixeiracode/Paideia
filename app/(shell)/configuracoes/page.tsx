import { requirePerfil } from "@/lib/data/session";
import { Card, Eyebrow } from "@/components/ui/primitives";
import { SubmitButton } from "@/components/admin/submit-button";
import { atualizarPerfil } from "./actions";

export default async function ConfiguracoesPage() {
  const { perfil } = await requirePerfil();

  return (
    <div className="max-w-xl space-y-6">
      <div>
        <Eyebrow>Régio Pessoal</Eyebrow>
        <h1 className="mt-1 font-serif text-2xl font-semibold sm:text-3xl">Configurações</h1>
      </div>

      <Card>
        <form action={atualizarPerfil} className="space-y-4">
          <div>
            <label className="label-caps mb-1.5 block">Nome</label>
            <input
              name="nome"
              defaultValue={perfil.nome}
              className="w-full rounded-lg border border-paideia-cream-300 px-3 py-2 text-sm"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label-caps mb-1.5 block">Meta Diária (min)</label>
              <input
                name="meta_diaria_min"
                type="number"
                min={10}
                defaultValue={perfil.meta_diaria_min}
                className="w-full rounded-lg border border-paideia-cream-300 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="label-caps mb-1.5 block">Meta Semanal (h)</label>
              <input
                name="meta_semanal_horas"
                type="number"
                min={1}
                step="0.5"
                defaultValue={perfil.meta_semanal_horas}
                className="w-full rounded-lg border border-paideia-cream-300 px-3 py-2 text-sm"
              />
            </div>
          </div>
          <SubmitButton label="Salvar Alterações" />
        </form>
      </Card>
    </div>
  );
}
