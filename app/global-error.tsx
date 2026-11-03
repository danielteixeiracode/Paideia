"use client";

import "./globals.css";

// Último recurso: quando até o layout raiz falha. Substitui o <html> inteiro,
// então não tem as fontes nem o tema salvo; usa os tokens do modo claro.
export default function ErroGlobal({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="pt-BR">
      <body className="min-h-dvh bg-canvas font-serif text-ink">
        <main className="mx-auto max-w-leitura px-gutter py-24 text-center">
          <div className="marcador mx-auto max-w-[12rem]" aria-hidden>
            Erro
          </div>
          <h1 className="mt-4 text-titulo font-medium">O Paideia não abriu</h1>
          <div aria-hidden className="filete mx-auto my-6 w-24" />
          <p className="mx-auto font-sans text-leitura text-ink-muted">Algo falhou ao carregar o app. Tente de novo em instantes.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3 font-sans">
            <button
              type="button"
              onClick={reset}
              className="min-h-11 rounded-xl bg-action px-4 py-2 font-semibold text-on-action hover:bg-action-hover"
            >
              Tentar de novo
            </button>
            <a href="/inicio" className="min-h-11 rounded-xl border border-accent/50 px-4 py-2 font-semibold leading-7 text-accent">
              Voltar ao Início
            </a>
          </div>
        </main>
      </body>
    </html>
  );
}
