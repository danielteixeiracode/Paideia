"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { NAV_ALUNO } from "@/lib/nav";
import { romano } from "@/lib/utils";
import { Dialogo } from "@/components/ui/sobreposicao";
import { Kbd, PaletaComandos } from "@/components/comandos/paleta";

// g seguido da letra leva a cada tela do aluno.
const IR_PARA: Record<string, string> = {
  i: "/inicio",
  o: "/obras",
  f: "/funcoes",
  e: "/epocas",
  c: "/carteira",
  s: "/socrates",
};
const LETRA_DA_ROTA = Object.fromEntries(Object.entries(IR_PARA).map(([letra, href]) => [href, letra]));
const ESPERA_SEQUENCIA_MS = 1200;

const ComandosCtx = createContext<{ abrirPaleta: () => void }>({ abrirPaleta: () => {} });

export function useComandos() {
  return useContext(ComandosCtx);
}

// Enquanto o aluno digita, nenhum atalho de uma tecla dispara.
function estaDigitando(alvo: EventTarget | null) {
  if (!(alvo instanceof HTMLElement)) return false;
  if (alvo.isContentEditable) return true;
  const tag = alvo.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT";
}

// Fica no layout do (shell): paleta de comandos, atalhos de teclado e a lista
// de atalhos. Esc fecha o que estiver aberto (tratado em cada camada).
export function Comandos({ isAdmin, children }: { isAdmin: boolean; children: React.ReactNode }) {
  const [paleta, setPaleta] = useState(false);
  const [ajuda, setAjuda] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const esperandoG = useRef<number | null>(null);
  // Estado atual lido dentro do ouvinte de teclado.
  const proprias = useRef({ paleta, ajuda });
  proprias.current = { paleta, ajuda };

  const abrirPaleta = useCallback(() => {
    setAjuda(false);
    setPaleta(true);
  }, []);

  // Navegar fecha a paleta e a lista de atalhos.
  useEffect(() => {
    setPaleta(false);
    setAjuda(false);
  }, [pathname]);

  useEffect(() => {
    function limparG() {
      if (esperandoG.current) window.clearTimeout(esperandoG.current);
      esperandoG.current = null;
    }

    function onKey(e: KeyboardEvent) {
      // Ctrl+K / Cmd+K: abre ou fecha a paleta, mesmo dentro de um campo.
      if ((e.ctrlKey || e.metaKey) && !e.altKey && e.key.toLowerCase() === "k") {
        e.preventDefault();
        // Com outra janela aberta (gaveta do Sócrates, um diálogo), não empilha a paleta por cima.
        const { paleta: paletaAberta, ajuda: ajudaAberta } = proprias.current;
        if (!paletaAberta && !ajudaAberta && document.querySelector("[aria-modal=\"true\"]")) return;
        setAjuda(false);
        setPaleta((v) => !v);
        return;
      }
      if (e.defaultPrevented || e.ctrlKey || e.metaKey || e.altKey || estaDigitando(e.target)) return;

      if (esperandoG.current) {
        const destino = IR_PARA[e.key.toLowerCase()];
        limparG();
        if (destino) {
          e.preventDefault();
          router.push(destino);
        }
        return;
      }

      if (e.key === "g") {
        esperandoG.current = window.setTimeout(limparG, ESPERA_SEQUENCIA_MS);
        return;
      }
      if (e.key === "?" && !document.querySelector("[aria-modal=\"true\"]")) {
        e.preventDefault();
        setPaleta(false);
        setAjuda(true);
      }
    }

    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      limparG();
    };
  }, [router]);

  return (
    <ComandosCtx.Provider value={{ abrirPaleta }}>
      {children}
      <PaletaComandos aberta={paleta} onFechar={() => setPaleta(false)} isAdmin={isAdmin} />
      <Dialogo aberto={ajuda} onFechar={() => setAjuda(false)} titulo="Atalhos de teclado" descricao="Não funcionam enquanto você digita num campo.">
        <div className="space-y-4 pb-1">
          <Grupo titulo="Geral">
            <Atalho teclas={["Ctrl", "K"]} acao="Buscar ou ir para (no Mac, Cmd K)" />
            <Atalho teclas={["?"]} acao="Mostrar esta lista" />
            <Atalho teclas={["Esc"]} acao="Fechar o que estiver aberto" />
          </Grupo>
          <Grupo titulo="Ir para">
            {NAV_ALUNO.map((n) => (
              <Atalho
                key={n.href}
                teclas={["g", LETRA_DA_ROTA[n.href]]}
                acao={
                  <>
                    <span className="t-romano mr-1.5 text-gold-ink" aria-hidden>
                      {romano(n.numero)}
                    </span>
                    {n.label}
                  </>
                }
              />
            ))}
          </Grupo>
        </div>
      </Dialogo>
    </ComandosCtx.Provider>
  );
}

function Grupo({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="t-nota mb-1.5">{titulo}</p>
      <dl className="divide-y divide-rule rounded-md border border-rule">{children}</dl>
    </div>
  );
}

function Atalho({ teclas, acao }: { teclas: string[]; acao: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 px-3 py-2">
      <dt className="text-interface text-ink">{acao}</dt>
      <dd className="flex shrink-0 items-center gap-1">
        {teclas.map((t, i) => (
          <Kbd key={i}>{t}</Kbd>
        ))}
      </dd>
    </div>
  );
}
