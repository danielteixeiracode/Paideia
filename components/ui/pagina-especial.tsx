import Link from "next/link";
import { classesBotao } from "@/components/ui/botao";

// Página de exceção (404, erro): marcador, título em serifa, filete, uma
// frase direta e o caminho de volta. Tom sóbrio, sem culpar ninguém.
export function PaginaEspecial({
  marcador,
  titulo,
  texto,
  acao,
}: {
  marcador: string;
  titulo: string;
  texto: string;
  acao?: React.ReactNode; // além do "Voltar ao Início"
}) {
  return (
    <section className="mx-auto max-w-leitura py-16 text-center sm:py-24">
      <div className="marcador mx-auto max-w-[12rem]" aria-hidden>
        {marcador}
      </div>
      <h1 className="t-titulo mt-4">{titulo}</h1>
      <div aria-hidden className="filete mx-auto my-6 w-24" />
      <p className="t-leitura mx-auto text-ink-muted">{texto}</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        {acao}
        <Link href="/inicio" className={classesBotao({ variante: acao ? "secundario" : "primario" })}>
          Voltar ao Início
        </Link>
      </div>
    </section>
  );
}
