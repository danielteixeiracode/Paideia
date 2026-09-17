import type { FaseTrilho } from "@/lib/trilhos";

/** Classes literais por fase — o scanner do Tailwind não enxerga nomes montados em runtime. */
export const FASE_ESTILO: Record<
  FaseTrilho,
  {
    texto: string;
    chip: string;
    faixa: string;
    borda: string;
    espinha: string;
    ponto: string;
    pontoVazio: string;
  }
> = {
  ordem: {
    texto: "text-paideia-fase-ordem-deep",
    chip: "bg-paideia-fase-ordem-soft text-paideia-fase-ordem-deep",
    faixa: "bg-paideia-fase-ordem-soft/70 hover:bg-paideia-fase-ordem-soft",
    borda: "border-paideia-fase-ordem-base",
    espinha: "bg-paideia-fase-ordem-base/30",
    ponto: "bg-paideia-fase-ordem-base",
    pontoVazio: "border-paideia-fase-ordem-base/50",
  },
  crise: {
    texto: "text-paideia-fase-crise-deep",
    chip: "bg-paideia-fase-crise-soft text-paideia-fase-crise-deep",
    faixa: "bg-paideia-fase-crise-soft/70 hover:bg-paideia-fase-crise-soft",
    borda: "border-paideia-fase-crise-base",
    espinha: "bg-paideia-fase-crise-base/30",
    ponto: "bg-paideia-fase-crise-base",
    pontoVazio: "border-paideia-fase-crise-base/50",
  },
  restauracao: {
    texto: "text-paideia-fase-restauracao-deep",
    chip: "bg-paideia-fase-restauracao-soft text-paideia-fase-restauracao-deep",
    faixa: "bg-paideia-fase-restauracao-soft/70 hover:bg-paideia-fase-restauracao-soft",
    borda: "border-paideia-fase-restauracao-base",
    espinha: "bg-paideia-fase-restauracao-base/30",
    ponto: "bg-paideia-fase-restauracao-base",
    pontoVazio: "border-paideia-fase-restauracao-base/50",
  },
};

/** Traço de passagem entre duas fases — marca onde a curva vira. */
export const FASE_TRANSICAO: Record<string, string> = {
  "ordem-crise": "from-paideia-fase-ordem-base/50 to-paideia-fase-crise-base/60",
  "ordem-restauracao": "from-paideia-fase-ordem-base/50 to-paideia-fase-restauracao-base/60",
  "crise-restauracao": "from-paideia-fase-crise-base/50 to-paideia-fase-restauracao-base/60",
};
