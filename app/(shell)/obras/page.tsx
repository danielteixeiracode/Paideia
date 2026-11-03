import Link from "next/link";
import { requirePerfil } from "@/lib/data/session";
import { ExploradorObras, type ObraLista } from "./explorador";

type ObraBanco = {
  id: string;
  titulo: string;
  autor: string | null;
  epoca: { id: string; numero: number; nome: string } | null;
  obra_funcoes: { funcao_id: string }[];
};

export default async function ObrasPage() {
  const { supabase, perfil } = await requirePerfil();

  // Tudo pela sessão do aluno (RLS): obras publicadas e a Carteira dele.
  const [obrasR, funcoesR, epocasR, carteiraR] = await Promise.all([
    supabase
      .from("obras")
      .select("id, titulo, autor, epoca:epocas(id, numero, nome), obra_funcoes(funcao_id)")
      .eq("ativo", true)
      .order("ordem")
      .order("titulo"),
    supabase.from("funcoes_pedagogicas").select("id, numero, nome").order("numero"),
    supabase.from("epocas").select("id, numero, nome").order("numero"),
    supabase.from("carteira_obras").select("obra_id").eq("user_id", perfil.id),
  ]);

  const naCarteira = new Set(((carteiraR.data ?? []) as { obra_id: string }[]).map((c) => c.obra_id));
  const obras: ObraLista[] = ((obrasR.data ?? []) as unknown as ObraBanco[]).map((o) => ({
    id: o.id,
    titulo: o.titulo,
    autor: o.autor,
    epoca: o.epoca,
    funcoes: o.obra_funcoes.map((l) => l.funcao_id),
    naCarteira: naCarteira.has(o.id),
  }));

  return (
    <div className="space-y-10">
      <header>
        <div className="marcador max-w-md" aria-hidden>
          II
        </div>
        <h1 className="t-display mt-3">Obras</h1>
        <p className="t-leitura mt-3 text-ink-muted">
          A formação universal: poucas obras, escolhidas pelo que formam. Em dourado, as funções que cada uma exercita.
        </p>
      </header>

      {obras.length === 0 ? (
        <div className="filete py-10 text-center">
          <p className="t-subtitulo">Nenhuma obra publicada ainda</p>
          <p className="t-nota mt-1">
            As obras da formação aparecem aqui assim que forem cadastradas. Enquanto isso, veja as{" "}
            <Link href="/funcoes" className="text-accent underline underline-offset-4">
              funções pedagógicas
            </Link>
            .
          </p>
        </div>
      ) : (
        <ExploradorObras
          obras={obras}
          funcoes={(funcoesR.data ?? []) as { id: string; numero: number; nome: string }[]}
          epocas={(epocasR.data ?? []) as { id: string; numero: number; nome: string }[]}
        />
      )}
    </div>
  );
}
