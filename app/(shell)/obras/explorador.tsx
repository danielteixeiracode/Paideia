"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Botao } from "@/components/ui/botao";
import type { FuncaoCurta } from "@/components/corpo/romanos-funcoes";
import { CartaoObra, type ObraLista } from "@/components/corpo/cartao-obra";
import { cn, romano } from "@/lib/utils";


type EpocaFiltro = { id: string; numero: number; nome: string };

// Comparação sem acento e sem caixa: "eneida" encontra "Eneida", "agostinho" encontra "Agostinho".
function normalizar(texto: string) {
  return texto.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

// Filtros que respondem na hora, no navegador: função, época e busca por
// título ou autor. Os dados já vieram todos do servidor.
export function ExploradorObras({
  obras,
  funcoes,
  epocas,
}: {
  obras: ObraLista[];
  funcoes: FuncaoCurta[];
  epocas: EpocaFiltro[];
}) {
  const [funcao, setFuncao] = useState<string | null>(null);
  const [epoca, setEpoca] = useState<string | null>(null);
  const [busca, setBusca] = useState("");

  const visiveis = useMemo(() => {
    const q = normalizar(busca.trim());
    return obras.filter(
      (o) =>
        (!funcao || o.funcoes.includes(funcao)) &&
        (!epoca || o.epoca?.id === epoca) &&
        (!q || normalizar(`${o.titulo} ${o.autor ?? ""}`).includes(q))
    );
  }, [obras, funcao, epoca, busca]);

  const filtrando = Boolean(funcao || epoca || busca.trim());
  const limpar = () => {
    setFuncao(null);
    setEpoca(null);
    setBusca("");
  };

  return (
    <div className="space-y-8">
      <div className="space-y-5">
        <label className="relative block max-w-md">
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

        <Filtro rotulo="Função">
          <Opcao ativa={funcao === null} onClick={() => setFuncao(null)}>
            Todas
          </Opcao>
          {funcoes.map((f) => (
            <Opcao key={f.id} ativa={funcao === f.id} onClick={() => setFuncao(funcao === f.id ? null : f.id)}>
              <span className="t-romano mr-1.5 text-gold-ink">{romano(f.numero)}</span>
              {f.nome}
            </Opcao>
          ))}
        </Filtro>

        <Filtro rotulo="Época">
          <Opcao ativa={epoca === null} onClick={() => setEpoca(null)}>
            Todas
          </Opcao>
          {epocas.map((e) => (
            <Opcao
              key={e.id}
              ativa={epoca === e.id}
              onClick={() => setEpoca(epoca === e.id ? null : e.id)}
              titulo={e.nome}
              rotuloAcessivel={`Época ${romano(e.numero)}, ${e.nome}`}
            >
              <span className="t-romano">{romano(e.numero)}</span>
            </Opcao>
          ))}
        </Filtro>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <p className="t-nota" aria-live="polite">
            {visiveis.length === 1 ? "1 obra" : `${visiveis.length} obras`}
            {filtrando && ` de ${obras.length}`}
          </p>
          {filtrando && (
            <Botao variante="discreto" tamanho="sm" onClick={limpar}>
              Limpar filtros
            </Botao>
          )}
        </div>
      </div>

      {visiveis.length === 0 ? (
        <div className="filete py-10 text-center">
          <p className="t-subtitulo">Nenhuma obra com esses filtros</p>
          <p className="t-nota mt-1">Tire um dos filtros ou busque outra palavra.</p>
          <Botao variante="secundario" className="mt-4" onClick={limpar}>
            Limpar filtros
          </Botao>
        </div>
      ) : (
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visiveis.map((o) => (
            <li key={o.id}>
              <CartaoObra obra={o} funcoes={funcoes} nivel={2} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Filtro({ rotulo, children }: { rotulo: string; children: React.ReactNode }) {
  return (
    <div role="group" aria-label={`Filtrar por ${rotulo.toLowerCase()}`} className="flex flex-wrap items-center gap-1.5">
      <span className="t-nota mr-1 w-14 shrink-0">{rotulo}</span>
      {children}
    </div>
  );
}

function Opcao({
  ativa,
  onClick,
  titulo,
  rotuloAcessivel,
  children,
}: {
  ativa: boolean;
  onClick: () => void;
  titulo?: string;
  rotuloAcessivel?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={ativa}
      aria-label={rotuloAcessivel}
      title={titulo}
      onClick={onClick}
      className={cn(
        "min-h-8 min-w-11 rounded-full border px-3 py-1 text-nota transition-colors duration-discreto ease-discreto [@media(pointer:coarse)]:min-h-11",
        ativa ? "border-action bg-action font-semibold text-on-action [&_.t-romano]:text-current" : "border-rule bg-surface text-ink hover:border-ink-muted"
      )}
    >
      {children}
    </button>
  );
}
