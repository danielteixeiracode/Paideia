"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, Hourglass, Landmark, Loader2, MessageSquareQuote, Moon, Search, Sprout, Sun, BookOpenText, CornerDownLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { NAV_ADMIN, NAV_ALUNO } from "@/lib/nav";
import { definirTema } from "@/lib/tema";
import { EVENTO_ABRIR_SOCRATES } from "@/lib/socrates";
import { cn, romano } from "@/lib/utils";
import { Dialogo } from "@/components/ui/sobreposicao";
import { useAviso } from "@/components/ui/aviso";
import { useContextoTela } from "@/components/socrates/contexto-tela";
import { guardarObra } from "@/app/(shell)/obras/actions";

type Grupo = "Recentes" | "Obras" | "Funções" | "Épocas" | "Ir para" | "Administração" | "Ações";

interface Item {
  chave: string;
  grupo: Grupo;
  rotulo: string;
  detalhe?: string;
  marcador?: React.ReactNode; // romano ou ícone à esquerda
  executar: () => void | Promise<void>;
  // Destinos guardados como recentes ao serem escolhidos.
  recente?: Recente;
}

interface Recente {
  rotulo: string;
  detalhe?: string;
  href: string;
}

const CHAVE_RECENTES = "paideia-recentes";
const ORDEM: Grupo[] = ["Recentes", "Obras", "Funções", "Épocas", "Ir para", "Administração", "Ações"];

function lerRecentes(): Recente[] {
  try {
    const bruto = JSON.parse(localStorage.getItem(CHAVE_RECENTES) ?? "[]");
    return Array.isArray(bruto) ? bruto.filter((r) => r && typeof r.href === "string").slice(0, 5) : [];
  } catch {
    return [];
  }
}

function guardarRecente(r: Recente) {
  try {
    const lista = [r, ...lerRecentes().filter((x) => x.href !== r.href)].slice(0, 5);
    localStorage.setItem(CHAVE_RECENTES, JSON.stringify(lista));
  } catch {
    // sem armazenamento: os recentes valem só nesta visita
  }
}

// Comparação sem acento e sem caixa: "funcoes" encontra "Funções".
function normalizar(texto: string) {
  return texto.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

// Tira do termo os caracteres que mudam o sentido do filtro no PostgREST.
function termoSeguro(texto: string) {
  return texto.replace(/[%_,()*\\]/g, " ").trim();
}

interface Resultados {
  obras: { id: string; titulo: string; autor: string | null }[];
  funcoes: { id: string; numero: number; nome: string }[];
  epocas: { id: string; numero: number; nome: string }[];
}

const VAZIO: Resultados = { obras: [], funcoes: [], epocas: [] };

// Busca no banco com uma pequena espera depois da última tecla. A leitura usa
// a sessão do aluno, então vale a RLS (só o conteúdo publicado para ele).
function useBusca(termo: string) {
  const [resultados, setResultados] = useState<Resultados>(VAZIO);
  const [buscando, setBuscando] = useState(false);

  useEffect(() => {
    const q = termoSeguro(termo);
    if (q.length < 2) {
      setResultados(VAZIO);
      setBuscando(false);
      return;
    }
    setBuscando(true);
    let cancelado = false;
    const espera = setTimeout(async () => {
      const supabase = createClient();
      const padrao = `%${q}%`;
      const [obras, funcoes, epocas] = await Promise.all([
        supabase.from("obras").select("id, titulo, autor").eq("ativo", true).or(`titulo.ilike.${padrao},autor.ilike.${padrao}`).order("ordem").limit(5),
        supabase.from("funcoes_pedagogicas").select("id, numero, nome").ilike("nome", padrao).order("numero").limit(5),
        supabase.from("epocas").select("id, numero, nome").ilike("nome", padrao).order("numero").limit(5),
      ]);
      if (cancelado) return;
      setResultados({
        obras: (obras.data ?? []) as Resultados["obras"],
        funcoes: (funcoes.data ?? []) as Resultados["funcoes"],
        epocas: (epocas.data ?? []) as Resultados["epocas"],
      });
      setBuscando(false);
    }, 250);
    return () => {
      cancelado = true;
      clearTimeout(espera);
    };
  }, [termo]);

  return { resultados, buscando };
}

export function PaletaComandos({ aberta, onFechar, isAdmin }: { aberta: boolean; onFechar: () => void; isAdmin: boolean }) {
  const [termo, setTermo] = useState("");
  const [ativo, setAtivo] = useState(0);
  const [recentes, setRecentes] = useState<Recente[]>([]);
  const router = useRouter();
  const avisar = useAviso();
  const contexto = useContextoTela();
  const { resultados, buscando } = useBusca(termo);
  const listaRef = useRef<HTMLUListElement>(null);
  const id = useId();

  // Cada abertura começa limpa, com os recentes do navegador.
  useEffect(() => {
    if (!aberta) return;
    setTermo("");
    setAtivo(0);
    setRecentes(lerRecentes());
  }, [aberta]);

  const itens = useMemo<Item[]>(() => {
    const ir = (r: Recente) => () => {
      guardarRecente(r);
      router.push(r.href);
    };
    const lista: Item[] = [];
    const q = normalizar(termo.trim());

    if (!q) {
      for (const r of recentes) {
        lista.push({ chave: `recente:${r.href}`, grupo: "Recentes", rotulo: r.rotulo, detalhe: r.detalhe, executar: ir(r) });
      }
    }

    for (const o of resultados.obras) {
      const r = { rotulo: o.titulo, detalhe: o.autor ?? undefined, href: `/obras/${o.id}` };
      lista.push({ chave: `obra:${o.id}`, grupo: "Obras", rotulo: o.titulo, detalhe: o.autor ?? undefined, marcador: <BookOpen className="h-4 w-4" aria-hidden />, executar: ir(r) });
    }
    for (const f of resultados.funcoes) {
      const r = { rotulo: f.nome, detalhe: `Função ${f.numero}`, href: `/funcoes/${f.id}` };
      lista.push({ chave: `funcao:${f.id}`, grupo: "Funções", rotulo: f.nome, detalhe: `Função ${f.numero}`, marcador: <Sprout className="h-4 w-4" aria-hidden />, executar: ir(r) });
    }
    for (const e of resultados.epocas) {
      const r = { rotulo: e.nome, detalhe: `Época ${romano(e.numero)}`, href: `/epocas/${e.id}` };
      lista.push({ chave: `epoca:${e.id}`, grupo: "Épocas", rotulo: e.nome, detalhe: `Época ${romano(e.numero)}`, marcador: <Hourglass className="h-4 w-4" aria-hidden />, executar: ir(r) });
    }

    const combina = (texto: string) => !q || normalizar(texto).includes(q);

    for (const n of NAV_ALUNO) {
      if (!combina(n.label)) continue;
      lista.push({
        chave: `nav:${n.href}`,
        grupo: "Ir para",
        rotulo: n.label,
        marcador: <span className="t-romano text-nota text-gold-ink">{romano(n.numero)}</span>,
        executar: ir({ rotulo: n.label, href: n.href }),
      });
    }
    if (isAdmin) {
      for (const a of NAV_ADMIN) {
        if (!combina(`administração ${a.label}`)) continue;
        lista.push({
          chave: `admin:${a.href}`,
          grupo: "Administração",
          rotulo: a.label,
          detalhe: "Administração",
          marcador: <a.icon className="h-4 w-4" aria-hidden />,
          executar: ir({ rotulo: a.label, detalhe: "Administração", href: a.href }),
        });
      }
    }

    const acoes: Item[] = [
      { chave: "acao:claro", grupo: "Ações", rotulo: "Modo claro", marcador: <Sun className="h-4 w-4" aria-hidden />, executar: () => definirTema("claro") },
      { chave: "acao:escuro", grupo: "Ações", rotulo: "Modo escuro", marcador: <Moon className="h-4 w-4" aria-hidden />, executar: () => definirTema("escuro") },
      { chave: "acao:foco", grupo: "Ações", rotulo: "Modo foco para leitura", marcador: <BookOpenText className="h-4 w-4" aria-hidden />, executar: () => definirTema("foco") },
      {
        chave: "acao:socrates",
        grupo: "Ações",
        rotulo: "Abrir o Sócrates",
        marcador: <MessageSquareQuote className="h-4 w-4" aria-hidden />,
        executar: () => {
          window.dispatchEvent(new CustomEvent(EVENTO_ABRIR_SOCRATES));
        },
      },
    ];
    if (contexto.tipo === "obra" && contexto.id) {
      const obraId = contexto.id;
      acoes.unshift({
        chave: "acao:guardar",
        grupo: "Ações",
        rotulo: "Guardar esta obra na Carteira",
        marcador: <Landmark className="h-4 w-4" aria-hidden />,
        executar: async () => {
          await guardarObra(obraId);
          avisar("Obra guardada na Carteira.", { tom: "sucesso" });
        },
      });
    }
    for (const a of acoes) if (combina(a.rotulo)) lista.push(a);

    return lista.sort((a, b) => ORDEM.indexOf(a.grupo) - ORDEM.indexOf(b.grupo));
  }, [termo, recentes, resultados, isAdmin, contexto, router, avisar]);

  // O destaque volta ao primeiro item quando a lista muda.
  useEffect(() => setAtivo(0), [termo, resultados]);

  // Mantém o item destacado visível ao andar com as setas.
  useEffect(() => {
    listaRef.current?.querySelector(`[data-indice="${ativo}"]`)?.scrollIntoView({ block: "nearest" });
  }, [ativo]);

  async function escolher(item: Item) {
    onFechar();
    await item.executar();
  }

  function onTeclas(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setAtivo((i) => (itens.length ? (i + 1) % itens.length : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setAtivo((i) => (itens.length ? (i - 1 + itens.length) % itens.length : 0));
    } else if (e.key === "Home") {
      e.preventDefault();
      setAtivo(0);
    } else if (e.key === "End") {
      e.preventDefault();
      setAtivo(Math.max(0, itens.length - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const item = itens[ativo];
      if (item) escolher(item);
    }
  }

  const termoCurto = termoSeguro(termo).length > 0 && termoSeguro(termo).length < 2;

  return (
    <Dialogo aberto={aberta} onFechar={onFechar} titulo="Buscar ou ir para" posicao="topo" semCabecalho className="max-w-xl overflow-hidden">
      <div className="flex items-center gap-3 border-b border-rule px-4">
        {buscando ? (
          <Loader2 className="h-4 w-4 shrink-0 animate-spin text-ink-muted" aria-hidden />
        ) : (
          <Search className="h-4 w-4 shrink-0 text-ink-muted" aria-hidden />
        )}
        <input
          data-autofoco
          role="combobox"
          aria-expanded="true"
          aria-controls={`${id}-lista`}
          aria-activedescendant={itens[ativo] ? `${id}-item-${ativo}` : undefined}
          aria-autocomplete="list"
          aria-label="Buscar obras, funções e épocas, ou ir para uma tela"
          value={termo}
          onChange={(e) => setTermo(e.target.value)}
          onKeyDown={onTeclas}
          placeholder="Buscar obras, funções, épocas ou telas"
          className="h-14 min-w-0 flex-1 bg-transparent font-sans text-base text-ink outline-none placeholder:text-ink-muted sm:text-corpo"
          autoComplete="off"
          spellCheck={false}
        />
        <button
          type="button"
          onClick={onFechar}
          className="shrink-0 rounded border border-rule bg-sunken px-1.5 py-0.5 text-micro text-ink-muted hover:text-ink"
        >
          Esc
        </button>
      </div>

      <ul ref={listaRef} id={`${id}-lista`} role="listbox" aria-label="Resultados" className="max-h-[min(60dvh,26rem)] overflow-y-auto p-2">
        {itens.length === 0 && (
          <li role="presentation" className="px-3 py-8 text-center">
            <p className="t-corpo">Nada encontrado.</p>
            <p className="t-nota mt-1">Tente outra palavra, como o título ou o autor da obra.</p>
          </li>
        )}
        {itens.map((item, i) => {
          const novoGrupo = i === 0 || itens[i - 1].grupo !== item.grupo;
          return (
            <li key={item.chave} role="presentation">
              {novoGrupo && (
                <p role="presentation" className="px-3 pb-1 pt-3 text-nota text-ink-muted first:pt-1">
                  {item.grupo}
                </p>
              )}
              <div
                id={`${id}-item-${i}`}
                role="option"
                aria-selected={i === ativo}
                data-indice={i}
                onMouseMove={() => setAtivo(i)}
                onClick={() => escolher(item)}
                className={cn(
                  "flex min-h-11 cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-interface",
                  i === ativo ? "bg-sunken text-ink" : "text-ink"
                )}
              >
                <span className="flex w-6 shrink-0 justify-center text-ink-muted">{item.marcador}</span>
                <span className="min-w-0 flex-1 truncate">{item.rotulo}</span>
                {item.detalhe && <span className="t-nota hidden shrink-0 sm:inline">{item.detalhe}</span>}
                {i === ativo && <CornerDownLeft className="h-3.5 w-3.5 shrink-0 text-ink-muted" aria-hidden />}
              </div>
            </li>
          );
        })}
      </ul>

      <p className="sr-only" aria-live="polite">
        {termoCurto ? "Digite ao menos duas letras para buscar no acervo." : buscando ? "Buscando." : `${itens.length} resultados.`}
      </p>
      <div className="hidden items-center gap-4 border-t border-rule px-4 py-2 text-micro text-ink-muted sm:flex">
        <span>
          <Kbd>↑</Kbd> <Kbd>↓</Kbd> navegar
        </span>
        <span>
          <Kbd>Enter</Kbd> abrir
        </span>
        <span>
          <Kbd>?</Kbd> atalhos
        </span>
      </div>
    </Dialogo>
  );
}

export function Kbd({ children }: { children: React.ReactNode }) {
  return <kbd className="rounded border border-rule bg-sunken px-1.5 py-0.5 font-sans text-micro text-ink-muted">{children}</kbd>;
}
