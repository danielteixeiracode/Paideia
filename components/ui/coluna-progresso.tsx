import { cn } from "@/lib/utils";

// Proporções de uma coluna do templo, em unidades do SVG. Os valores padrão
// são os da coluna grande; o templo-selo do Início passa as suas.
export interface GeometriaColuna {
  topo: number; // y do alto do capitel
  fuste: number; // altura do fuste
  largura: number; // largura do fuste
  capitel: number; // altura do capitel
  sobraCapitel: number; // quanto o capitel passa do fuste, de cada lado
  base: number; // altura da base
  sobraBase: number;
  larguraClique: number; // área de clique (normalmente o passo entre colunas)
  estrias: boolean; // caneluras do fuste (só fazem sentido em tamanho grande)
}

const PADRAO: GeometriaColuna = {
  topo: 150,
  fuste: 176,
  largura: 42,
  capitel: 12,
  sobraCapitel: 9,
  base: 10,
  sobraBase: 6,
  larguraClique: 68,
  estrias: true,
};

// Traço em pixels de tela, qualquer que seja o tamanho do desenho: nunca
// abaixo de 1,25px, mesmo no selo pequeno.
const TRACO = { vectorEffect: "non-scaling-stroke" as const };

// A coluna como grupo SVG, para ser posta dentro de outro desenho (o templo).
// A pedra é sempre a mesma, em qualquer tema: é a forma-mãe do sistema.
export function ColunaSVG({
  cx,
  preenchimento,
  destacada = false,
  animar = false,
  ordem = 0,
  geometria,
}: {
  cx: number;
  preenchimento: number; // 0 a 1
  destacada?: boolean;
  // Sobe da base ao aparecer (momento de assinatura); `ordem` escalona a entrada.
  animar?: boolean;
  ordem?: number;
  geometria?: Partial<GeometriaColuna>;
}) {
  const g = { ...PADRAO, ...geometria };
  const topoFuste = g.topo + g.capitel;
  const baseFuste = topoFuste + g.fuste;
  const x = cx - g.largura / 2;
  const cheio = g.fuste * Math.min(1, Math.max(0, preenchimento));

  return (
    <g
      className={animar ? "templo-subir" : undefined}
      style={animar ? { animationDelay: `calc(var(--motion-signature-stagger) * ${ordem})` } : undefined}
    >
      {/* área de clique da coluna inteira */}
      <rect
        x={cx - g.larguraClique / 2}
        y={g.topo}
        width={g.larguraClique}
        height={g.capitel + g.fuste + g.base}
        className="fill-transparent"
      />
      <rect x={x} y={topoFuste} width={g.largura} height={g.fuste} className="fill-paideia-cream-100" />
      {cheio > 0 && (
        <rect x={x} y={baseFuste - cheio} width={g.largura} height={cheio} className="fill-paideia-gold-500" />
      )}
      {g.estrias && (
        <>
          <line {...TRACO} x1={cx - 8} y1={topoFuste + 4} x2={cx - 8} y2={baseFuste - 4} className="stroke-paideia-green-800/15 stroke-[1.5]" />
          <line {...TRACO} x1={cx + 8} y1={topoFuste + 4} x2={cx + 8} y2={baseFuste - 4} className="stroke-paideia-green-800/15 stroke-[1.5]" />
        </>
      )}
      <rect
        {...TRACO}
        x={x}
        y={topoFuste}
        width={g.largura}
        height={g.fuste}
        className={cn(
          "fill-none transition-[stroke] duration-discreto",
          destacada ? "stroke-paideia-gold-600 stroke-[2.5]" : "stroke-paideia-green-800 stroke-[1.5]"
        )}
      />
      {/* capitel e base */}
      <rect
        {...TRACO}
        x={x - g.sobraCapitel}
        y={g.topo}
        width={g.largura + 2 * g.sobraCapitel}
        height={g.capitel}
        className="fill-paideia-cream-50 stroke-paideia-green-800 stroke-[1.5]"
      />
      <rect
        {...TRACO}
        x={x - g.sobraBase}
        y={baseFuste}
        width={g.largura + 2 * g.sobraBase}
        height={g.base}
        className="fill-paideia-cream-50 stroke-paideia-green-800 stroke-[1.5]"
      />
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
