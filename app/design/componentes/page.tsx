import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, Landmark } from "lucide-react";
import { Botao } from "@/components/ui/botao";
import { AreaTexto, CampoTexto, Selecao } from "@/components/ui/campo";
import { Cartao, Painel } from "@/components/ui/cartao";
import { CabecalhoSecao } from "@/components/ui/cabecalho-secao";
import { Selo, SeloEstadoObra, SeloGrau } from "@/components/ui/selo";
import { EsqueletoCartao, EsqueletoLista } from "@/components/ui/esqueleto";
import { ColunaProgresso } from "@/components/ui/coluna-progresso";
import { SeletorTema } from "../controles";
import { DemosInterativos } from "./interativos";

export const metadata: Metadata = { title: "Componentes — Paideia" };

// Vitrine dos componentes base. Só em desenvolvimento, fora do menu.

const MODOS = [
  { tema: "claro", nome: "Claro" },
  { tema: "escuro", nome: "Escuro" },
  { tema: "foco", nome: "Foco" },
] as const;

export default function ComponentesPage() {
  if (process.env.NODE_ENV === "production") notFound();

  return (
    <main className="mx-auto max-w-pagina space-y-secao px-gutter py-secao">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="t-titulo">Componentes base</h1>
          <p className="t-nota mt-1">
            Todos os estados nos três modos. Tokens em{" "}
            <Link href="/design" className="text-accent underline underline-offset-4">
              /design
            </Link>
            .
          </p>
        </div>
        <SeletorTema />
      </header>

      <section className="space-y-5">
        <CabecalhoSecao
          numero={1}
          titulo="Em uso"
          descricao="Gaveta, diálogo, avisos e carregamento. Seguem o tema escolhido no seletor acima."
        />
        <DemosInterativos />
      </section>

      <div className="grid gap-6 xl:grid-cols-3">
        {MODOS.map(({ tema, nome }) => (
          <div key={tema} data-theme={tema} className="min-w-0 rounded-2xl border border-rule bg-canvas p-5 text-ink">
            <p className="t-titulo mb-6">{nome}</p>
            <Vitrine />
          </div>
        ))}
      </div>
    </main>
  );
}

// Os estados estáticos de cada componente. Passar o mouse, pressionar e foco
// aparecem simulados ao lado dos botões reais, que respondem de verdade.
function Vitrine() {
  return (
    <div className="space-y-10">
      <section className="space-y-4">
        <CabecalhoSecao numero={2} titulo="Botões" nivel={3} />
        {(["primario", "secundario", "discreto"] as const).map((v) => (
          <div key={v} className="space-y-2">
            <p className="t-nota">{v === "primario" ? "Primário" : v === "secundario" ? "Secundário (contorno)" : "Discreto (texto)"}</p>
            <div className="flex flex-wrap items-center gap-2">
              <Botao variante={v}>Guardar</Botao>
              <Botao
                variante={v}
                className={
                  v === "primario"
                    ? "bg-action-hover"
                    : v === "secundario"
                      ? "border-accent bg-accent/[0.06]"
                      : "underline"
                }
              >
                Mouse sobre
              </Botao>
              <Botao
                variante={v}
                className={cnPressionado(v)}
              >
                Pressionado
              </Botao>
              <Botao variante={v} className="outline outline-2 outline-offset-2 outline-focus">
                Foco
              </Botao>
              <Botao variante={v} carregando>
                Carregando
              </Botao>
              <Botao variante={v} disabled>
                Desativado
              </Botao>
            </div>
          </div>
        ))}
        <div className="flex flex-wrap items-center gap-2">
          <Botao icone={<BookOpen className="h-4 w-4" aria-hidden />}>Com ícone</Botao>
          <Botao tamanho="sm">Pequeno</Botao>
          <Botao tamanho="sm" variante="secundario">
            Pequeno
          </Botao>
        </div>
      </section>

      <section className="space-y-4">
        <CabecalhoSecao numero={3} titulo="Campos" nivel={3} />
        <CampoTexto rotulo="Nome" placeholder="Como quer ser chamado" ajuda="Aparece na saudação do Início." />
        <CampoTexto rotulo="E-mail" obrigatorio defaultValue="daniel@" erro="Falta o domínio depois do @, por exemplo daniel@exemplo.com." />
        <CampoTexto rotulo="Código" disabled defaultValue="Definido pelo administrador" />
        <AreaTexto rotulo="Fruto" placeholder="Reconte o episódio com suas palavras." ajuda="Pode ser curto. O que importa é a sua voz." />
        <Selecao rotulo="Função pedagógica" defaultValue="">
          <option value="" disabled>
            Escolha uma função
          </option>
          <option>Memória e ouvido poético</option>
          <option>Formação retórica</option>
        </Selecao>
        <Selecao rotulo="Época" erro="Escolha uma época." defaultValue="">
          <option value="">Nenhuma</option>
          <option>Roma Clássica</option>
        </Selecao>
      </section>

      <section className="space-y-4">
        <CabecalhoSecao numero={4} titulo="Cartão e Painel" nivel={3} />
        <Cartao>
          <p className="t-subtitulo">Eneida</p>
          <p className="t-nota mt-1">Virgílio</p>
          <p className="t-corpo mt-3">Eneias como modelo de piedade e de dever.</p>
        </Cartao>
        <Painel titulo="Painel">
          <p className="t-corpo">Região plana, aberta por um filete de 0,5px, sem sombra.</p>
        </Painel>
      </section>

      <section className="space-y-4">
        <CabecalhoSecao numero={5} titulo="Cabeçalho de seção" nivel={3} />
        <CabecalhoSecao
          numero={7}
          titulo="Síntese crítica"
          descricao="Com descrição e uma ação à direita."
          nivel={3}
          acao={
            <Botao tamanho="sm" variante="secundario">
              Ver obras
            </Botao>
          }
        />
      </section>

      <section className="space-y-4">
        <CabecalhoSecao numero={6} titulo="Selos" nivel={3} />
        <div className="flex flex-wrap gap-2">
          <Selo>Neutro</Selo>
          <Selo tom="dourado">Dourado</Selo>
          <Selo tom="acao">Ação</Selo>
          <Selo tom="contorno">Contorno</Selo>
          <Selo tom="dourado" icone={<Landmark className="h-3.5 w-3.5" aria-hidden />}>
            Com ícone
          </Selo>
        </div>
        <div className="flex flex-wrap gap-2">
          <SeloEstadoObra estado="semente" />
          <SeloGrau grau={1} />
          <SeloGrau grau={4} />
          <SeloGrau grau={7} />
        </div>
      </section>

      <section className="space-y-4">
        <CabecalhoSecao numero={7} titulo="Esqueletos" nivel={3} />
        <EsqueletoCartao />
        <EsqueletoLista itens={3} />
      </section>

      <section className="space-y-4">
        <CabecalhoSecao numero={8} titulo="Coluna de progresso" nivel={3} />
        <div className="flex items-end gap-4">
          <ColunaProgresso valor={0} rotulo="Memória e ouvido poético" />
          <ColunaProgresso valor={0.3} rotulo="Imaginação épica" />
          <ColunaProgresso valor={0.7} rotulo="Raciocínio moral" />
          <ColunaProgresso valor={1} rotulo="Formação retórica" animar />
        </div>
        <p className="t-nota">Vazia, começando, mais da metade e cheia. Sem número escrito.</p>
      </section>
    </div>
  );
}

function cnPressionado(v: "primario" | "secundario" | "discreto") {
  return v === "primario"
    ? "translate-y-px bg-action-hover"
    : v === "secundario"
      ? "translate-y-px bg-accent/10"
      : "translate-y-px bg-accent/10";
}
