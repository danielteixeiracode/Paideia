import { requirePerfil } from "@/lib/data/session";
import { Cartao } from "@/components/ui/cartao";
import { Botao } from "@/components/ui/botao";
import { CampoTexto } from "@/components/ui/campo";
import { FormularioOtimista } from "@/components/ui/formulario-otimista";
import { atualizarPerfil } from "./actions";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Configurações" };

export default async function ConfiguracoesPage() {
  const { perfil } = await requirePerfil();

  return (
    <div className="max-w-xl space-y-8">
      <header className="filete pt-4">
        <h1 className="t-titulo">Configurações</h1>
        <p className="t-nota mt-1">Seu nome e suas metas de estudo.</p>
      </header>

      <Cartao>
        <FormularioOtimista action={atualizarPerfil} sucesso="Alterações salvas." className="space-y-5">
          <CampoTexto rotulo="Nome" name="nome" defaultValue={perfil.nome} autoComplete="name" />
          <div className="grid gap-5 sm:grid-cols-2">
            <CampoTexto rotulo="Meta diária (min)" name="meta_diaria_min" type="number" min={10} defaultValue={perfil.meta_diaria_min} />
            <CampoTexto
              rotulo="Meta semanal (h)"
              name="meta_semanal_horas"
              type="number"
              min={1}
              step="0.5"
              defaultValue={perfil.meta_semanal_horas}
            />
          </div>
          <Botao type="submit">Salvar alterações</Botao>
        </FormularioOtimista>
      </Cartao>
    </div>
  );
}
