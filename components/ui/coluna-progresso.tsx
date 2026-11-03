import { cn } from "@/lib/utils";

// Geometria de uma coluna do templo, em unidades do SVG. O centro horizontal
// é `cx`; capitel em y=150, fuste de 162 a 338, base até 348.
const FUSTE = { topo: 162, base: 338, meiaLargura: 21 };
const ALTURA_FUSTE = FUSTE.base - FUSTE.topo;

// A coluna como grupo SVG, para ser posta dentro de outro desenho (o templo).
// A pedra é sempre a mesma, em qualquer tema: é a forma-mãe do sistema.
export function ColunaSVG({
  cx,
  preenchimento,
  destacada = false,
  animar = false,
  ordem = 0,
}: {
  cx: number;
  preenchimento: number; // 0 a 1
  destacada?: boolean;
  // Sobe da base ao aparecer (momento de assinatura); `ordem` escalona a entrada.
  animar?: boolean;
  ordem?: number;
}) {
  const cheio = ALTURA_FUSTE * Math.min(1, Math.max(0, preenchimento));
  return (
    <g
      className={animar ? "templo-subir" : undefined}
      style={animar ? { animationDelay: `calc(var(--motion-signature-stagger) * ${ordem})` } : undefined}
    >
      {/* área de clique da coluna inteira */}
      <rect x={cx - 34} y="150" width="68" height="198" className="fill-transparent" />
      <rect
        x={cx - FUSTE.meiaLargura}
        y={FUSTE.topo}
        width={FUSTE.meiaLargura * 2}
        height={ALTURA_FUSTE}
        className="fill-paideia-cream-100"
      />
      {cheio > 0 && (
        <rect
          x={cx - FUSTE.meiaLargura}
          y={FUSTE.base - cheio}
          width={FUSTE.meiaLargura * 2}
          height={cheio}
          className="fill-paideia-gold-400"
        />
      )}
      <line x1={cx - 8} y1={FUSTE.topo + 4} x2={cx - 8} y2={FUSTE.base - 4} className="stroke-paideia-green-800/15 stroke-[1.5]" />
      <line x1={cx + 8} y1={FUSTE.topo + 4} x2={cx + 8} y2={FUSTE.base - 4} className="stroke-paideia-green-800/15 stroke-[1.5]" />
      <rect
        x={cx - FUSTE.meiaLargura}
        y={FUSTE.topo}
        width={FUSTE.meiaLargura * 2}
        height={ALTURA_FUSTE}
        className={cn(
          "fill-none transition-[stroke]",
          destacada ? "stroke-paideia-gold-600 stroke-[3]" : "stroke-paideia-green-800 stroke-[2]"
        )}
      />
      {/* capitel e base */}
      <rect x={cx - 30} y="150" width="60" height="12" className="fill-paideia-cream-50 stroke-paideia-green-800 stroke-[2]" />
      <rect x={cx - 27} y="338" width="54" height="10" className="fill-paideia-cream-50 stroke-paideia-green-800 stroke-[2]" />
    </g>
  );
}

// Descrição sem número: o progresso não se escreve em porcentagem.
function descreverPreenchimento(p: number) {
  if (p <= 0) return "vazia";
  if (p >= 1) return "cheia";
  if (p < 0.5) return "começando a encher";
  return "mais da metade cheia";
}

// Barra de progresso em forma de coluna do templo, sozinha.
export function ColunaProgresso({
  valor,
  rotulo,
  animar = false,
  className,
}: {
  valor: number; // 0 a 1
  rotulo: string; // o que a coluna mede, para leitores de tela
  animar?: boolean;
  className?: string;
}) {
  return (
    <svg
      viewBox="62 144 72 210"
      role="img"
      aria-label={`${rotulo}: coluna ${descreverPreenchimento(valor)}`}
      className={cn("h-auto w-10", className)}
    >
      <ColunaSVG cx={98} preenchimento={valor} animar={animar} />
    </svg>
  );
}
