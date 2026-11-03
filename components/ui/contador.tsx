"use client";

import { useEffect, useRef, useState } from "react";
import { assinaturaJaVista, movimentoReduzido } from "@/lib/assinatura";

// Número que conta de zero até o valor no momento de assinatura do Início.
// O servidor já entrega o valor final; o CSS esconde o número até aqui
// decidir se conta ou não, para ele não aparecer pronto e voltar a zero.
// Com movimento reduzido ou assinatura já vista, mostra o valor direto.
export function Contador({ valor, className }: { valor: number; className?: string }) {
  const [mostrado, setMostrado] = useState(valor);
  const ref = useRef<HTMLSpanElement>(null);
  const jaDecidiu = useRef(false);

  useEffect(() => {
    const el = ref.current;
    // Só a primeira montagem pode contar; mudanças depois aparecem direto.
    if (jaDecidiu.current || !el || valor <= 0 || assinaturaJaVista() || movimentoReduzido()) {
      jaDecidiu.current = true;
      setMostrado(valor);
      el?.setAttribute("data-contador-pronto", "");
      return;
    }
    jaDecidiu.current = true;

    const estilos = getComputedStyle(document.documentElement);
    const duracao = parseFloat(estilos.getPropertyValue("--motion-signature-duration")) || 1100;
    const inicio = performance.now();
    let quadro = 0;

    setMostrado(0);
    el.setAttribute("data-contador-pronto", "");

    const passo = (agora: number) => {
      const t = Math.min(1, (agora - inicio) / duracao);
      const suave = 1 - Math.pow(1 - t, 3); // desacelera no fim, como as colunas
      setMostrado(Math.round(valor * suave));
      if (t < 1) quadro = requestAnimationFrame(passo);
    };
    quadro = requestAnimationFrame(passo);
    return () => {
      cancelAnimationFrame(quadro);
      // Interrompida (por exemplo, a montagem dupla do React em desenvolvimento):
      // a próxima montagem pode contar de novo.
      jaDecidiu.current = false;
    };
  }, [valor]);

  return (
    <span ref={ref} data-contador className={className} style={{ fontVariantNumeric: "tabular-nums" }}>
      {mostrado}
    </span>
  );
}
