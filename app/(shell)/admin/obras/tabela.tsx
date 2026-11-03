"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { Selo } from "@/components/ui/selo";
import { Botao } from "@/components/ui/botao";
import { cn, romano } from "@/lib/utils";

export interface ObraAdmin {
  id: string;
  titulo: string;
  autor: string | null;
  ativo: boolean;
  epoca: { numero: number; nome: string } | null;
  funcoes: { numero: number; nome: string }[];
}

type Estado = "todas" | "publicadas" | "rascunhos";

function normalizar(texto: string) {
  return texto.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

// Tabela de códice das obras, com busca e filtro de estado no navegador.
export function TabelaObras({ obras }: { obras: ObraAdmin[] }) {
  const [busca, setBusca] = useState("");
  const [estado, setEstado] = useState<Estado>("todas");

  const visiveis = useMemo(() => {
    const q = normalizar(busca.trim());
    return obras.filter(
      (o) =>
        (estado === "todas" || (estado === "publicadas" ? o.ativo : !o.ativo)) &&
        (!q || normalizar(`${o.titulo} ${o.autor ?? ""}`).includes(q))
    );
  }, [obras, busca, estado]);

  const contagem = { todas: obras.length, publicadas: obras.filter((o) => o.ativo).length, rascunhos: obras.filter((o) => !o.ativo).length };
  const filtrando = Boolean(busca.trim()) || estado !== "todas";

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <label className="relative block w-full max-w-sm">
          <span className="sr-only">Buscar por título ou autor</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" aria-hidden />
          <input
            type="search"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar por título ou autor"
            className="w-full rounded-md border border-rule bg-surface py-2 pl-9 pr-3 font-sans text-base text-ink placeholder:text-ink-muted transition-colors duration-discreto ease-discreto hover:border-ink-muted sm:text-interface [@media(pointer:coarse)]:min-h-11"
          />
        </label>
        <div role="group" aria-label="Filtrar por estado" className="flex flex-wrap gap-1.5">
          {(["todas", "publicadas", "rascunhos"] as const).map((e) => (
            <button
              key={e}
              type="button"
              aria-pressed={estado === e}
              onClick={() => setEstado(e)}
              className={cn(
                "min-h-8 rounded-full border px-3 py-1 text-nota transition-colors duration-discreto ease-discreto [@media(pointer:coarse)]:min-h-11",
                estado === e ? "border-action bg-action font-semibold text-on-action" : "border-rule bg-surface text-ink hover:border-ink-muted"
              )}
            >
              {e === "todas" ? "Todas" : e === "publicadas" ? "Publicadas" : "Rascunhos"} ({contagem[e]})
            </button>
          ))}
        </div>
      </div>

      <p className="t-nota" aria-live="polite">
        {visiveis.length === 1 ? "1 obra" : `${visiveis.length} obras`}
        {filtrando && ` de ${obras.length}`}
      </p>

      {visiveis.length === 0 ? (
        <div className="filete py-10 text-center">
          <p className="t-subtitulo">Nenhuma obra com esses filtros</p>
          <Botao
            variante="secundario"
            className="mt-4"
            onClick={() => {
              setBusca("");
              setEstado("todas");
            }}
          >
            Limpar filtros
          </Botao>
        </div>
      ) : (
        <div className="relative overflow-x-auto">
          <table className="w-full min-w-[40rem] text-left">
            <caption className="sr-only">Obras do acervo</caption>
            <thead>
              <tr className="border-b border-rule-strong/60 text-nota text-ink-muted">
                <th scope="col" className="py-2 pr-4 font-medium">Título</th>
                <th scope="col" className="py-2 pr-4 font-medium">Autor</th>
                <th scope="col" className="py-2 pr-4 font-medium">Época</th>
                <th scope="col" className="py-2 pr-4 font-medium">Funções</th>
                <th scope="col" className="py-2 font-medium">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y-hair divide-rule-strong/40">
              {visiveis.map((o) => (
                <tr key={o.id} className="align-baseline">
                  <td className="py-3 pr-4">
                    <Link href={`/admin/obras/${o.id}/editar`} className="font-serif text-lg font-medium text-ink underline-offset-4 hover:underline">
                      {o.titulo}
                    </Link>
                  </td>
                  <td className="py-3 pr-4 text-interface text-ink">{o.autor ?? <span className="text-ink-muted">Sem autor</span>}</td>
                  <td className="py-3 pr-4">
                    {o.epoca ? (
                      <span className="t-romano text-interface text-gold-ink" title={o.epoca.nome}>
                        {romano(o.epoca.numero)}
                        <span className="sr-only">, {o.epoca.nome}</span>
                      </span>
                    ) : (
                      <span className="t-nota">Sem época</span>
                    )}
                  </td>
                  <td className="py-3 pr-4">
                    {o.funcoes.length ? (
                      <span className="t-romano space-x-1.5 text-interface text-gold-ink">
                        {o.funcoes.map((f) => (
                          <span key={f.numero} title={f.nome}>
                            {romano(f.numero)}
                            <span className="sr-only">, {f.nome};</span>
                          </span>
                        ))}
                      </span>
                    ) : (
                      <span className="t-nota">Nenhuma</span>
                    )}
                  </td>
                  <td className="py-3">{o.ativo ? <Selo tom="acao">Publicada</Selo> : <Selo>Rascunho</Selo>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
