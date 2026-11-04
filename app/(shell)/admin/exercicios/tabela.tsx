"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { Selo } from "@/components/ui/selo";
import { Botao } from "@/components/ui/botao";
import { cn, romano } from "@/lib/utils";

export interface ExercicioAdmin {
  id: string;
  titulo: string;
  metodo: string | null;
  ativo: boolean;
  funcao: { id: string; numero: number; nome: string } | null;
  obra: { id: string; titulo: string } | null;
}

function normalizar(texto: string) {
  return texto.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

const SELECAO =
  "min-h-9 rounded-md border border-rule bg-surface px-3 py-1.5 font-sans text-base text-ink transition-colors duration-discreto ease-discreto hover:border-ink-muted sm:text-interface [@media(pointer:coarse)]:min-h-11";

// Tabela de códice dos exercícios, com busca e filtros no navegador.
export function TabelaExercicios({
  exercicios,
  funcoes,
}: {
  exercicios: ExercicioAdmin[];
  funcoes: { id: string; numero: number; nome: string }[];
}) {
  const [busca, setBusca] = useState("");
  const [funcao, setFuncao] = useState("");
  const [obra, setObra] = useState("todas"); // "todas", "gerais" ou o id da obra

  const obras = useMemo(() => {
    const mapa = new Map<string, string>();
    for (const e of exercicios) if (e.obra) mapa.set(e.obra.id, e.obra.titulo);
    return Array.from(mapa, ([id, titulo]) => ({ id, titulo })).sort((a, b) => a.titulo.localeCompare(b.titulo, "pt-BR"));
  }, [exercicios]);

  const visiveis = useMemo(() => {
    const q = normalizar(busca.trim());
    return exercicios.filter(
      (e) =>
        (!funcao || e.funcao?.id === funcao) &&
        (obra === "todas" || (obra === "gerais" ? !e.obra : e.obra?.id === obra)) &&
        (!q || normalizar(e.titulo).includes(q))
    );
  }, [exercicios, busca, funcao, obra]);

  const filtrando = Boolean(busca.trim() || funcao) || obra !== "todas";
  const limpar = () => {
    setBusca("");
    setFuncao("");
    setObra("todas");
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end gap-3">
        <label className="relative block w-full max-w-sm">
          <span className="sr-only">Buscar por título</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" aria-hidden />
          <input
            type="search"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar por título"
            className="w-full rounded-md border border-rule bg-surface py-2 pl-9 pr-3 font-sans text-base text-ink placeholder:text-ink-muted transition-colors duration-discreto ease-discreto hover:border-ink-muted sm:text-interface [@media(pointer:coarse)]:min-h-11"
          />
        </label>
        <label className="flex min-w-0 max-w-full flex-col gap-1">
          <span className="t-nota">Função</span>
          <select value={funcao} onChange={(e) => setFuncao(e.target.value)} className={cn(SELECAO, "max-w-full")}>
            <option value="">Todas</option>
            {funcoes.map((f) => (
              <option key={f.id} value={f.id}>
                {romano(f.numero)} {f.nome}
              </option>
            ))}
          </select>
        </label>
        <label className="flex min-w-0 max-w-full flex-col gap-1">
          <span className="t-nota">Obra</span>
          <select value={obra} onChange={(e) => setObra(e.target.value)} className={cn(SELECAO, "max-w-full")}>
            <option value="todas">Todas</option>
            <option value="gerais">Gerais</option>
            {obras.map((o) => (
              <option key={o.id} value={o.id}>
                {o.titulo}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <p className="t-nota" aria-live="polite">
          {visiveis.length === 1 ? "1 exercício" : `${visiveis.length} exercícios`}
          {filtrando && ` de ${exercicios.length}`}
        </p>
        {filtrando && (
          <Botao variante="discreto" tamanho="sm" onClick={limpar}>
            Limpar filtros
          </Botao>
        )}
      </div>

      {visiveis.length === 0 ? (
        <div className="filete py-10 text-center">
          <p className="t-subtitulo">Nenhum exercício com esses filtros</p>
          <Botao variante="secundario" className="mt-4" onClick={limpar}>
            Limpar filtros
          </Botao>
        </div>
      ) : (
        <div className="relative overflow-x-auto">
          <table className="w-full min-w-[44rem] text-left">
            <caption className="sr-only">Exercícios</caption>
            <thead>
              <tr className="border-b border-rule-strong/60 text-nota text-ink-muted">
                <th scope="col" className="py-2 pr-4 font-medium">Título</th>
                <th scope="col" className="py-2 pr-4 font-medium">Função</th>
                <th scope="col" className="py-2 pr-4 font-medium">Obra</th>
                <th scope="col" className="py-2 pr-4 font-medium">Método</th>
                <th scope="col" className="py-2 font-medium">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y-hair divide-rule-strong/40">
              {visiveis.map((e) => (
                <tr key={e.id} className="align-baseline">
                  <td className="py-3 pr-4">
                    <Link href={`/admin/exercicios/${e.id}/editar`} className="alvo-toque text-interface font-semibold text-ink underline-offset-4 hover:underline">
                      {e.titulo}
                    </Link>
                  </td>
                  <td className="py-3 pr-4 text-interface text-ink">
                    {e.funcao ? (
                      <>
                        <span className="t-romano mr-1.5 text-gold-ink">{romano(e.funcao.numero)}</span>
                        {e.funcao.nome}
                      </>
                    ) : (
                      <span className="text-ink-muted">Sem função</span>
                    )}
                  </td>
                  <td className="py-3 pr-4 text-interface">
                    {e.obra ? <span className="text-ink">{e.obra.titulo}</span> : <span className="text-ink-muted">Geral da função</span>}
                  </td>
                  <td className="py-3 pr-4">{e.metodo ? <Selo tom="contorno">{e.metodo}</Selo> : <span className="t-nota">Sem método</span>}</td>
                  <td className="py-3">{e.ativo ? <Selo tom="acao">Publicado</Selo> : <Selo>Rascunho</Selo>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
