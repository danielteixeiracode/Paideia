"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Selo } from "@/components/ui/selo";
import { Botao } from "@/components/ui/botao";
import { Dialogo } from "@/components/ui/sobreposicao";
import { useAviso } from "@/components/ui/aviso";
import { atualizarPapelUsuario } from "@/app/(shell)/admin/actions";
import { ERRO_CONEXAO } from "@/lib/acoes";
import type { PapelUsuario } from "@/types/database";

export interface UsuarioAdmin {
  id: string;
  nome: string;
  email: string;
  papel: PapelUsuario;
  criado_em: string;
}

const NOME_PAPEL: Record<PapelUsuario, string> = { aluno: "Aluno", administrador: "Administrador" };
const DATA = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short", year: "numeric" });

function normalizar(texto: string) {
  return texto.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

// Usuários em tabela de códice, com busca; a mudança de papel (a mesma ação
// de antes) passa por um diálogo de confirmação.
export function TabelaUsuarios({ usuarios }: { usuarios: UsuarioAdmin[] }) {
  const [busca, setBusca] = useState("");
  const [alvo, setAlvo] = useState<UsuarioAdmin | null>(null);
  const [mudando, setMudando] = useState(false);
  const router = useRouter();
  const avisar = useAviso();

  const visiveis = useMemo(() => {
    const q = normalizar(busca.trim());
    return q ? usuarios.filter((u) => normalizar(`${u.nome} ${u.email}`).includes(q)) : usuarios;
  }, [usuarios, busca]);

  const novoPapel: PapelUsuario | null = alvo ? (alvo.papel === "administrador" ? "aluno" : "administrador") : null;

  async function confirmar() {
    if (!alvo || !novoPapel) return;
    const usuario = alvo;
    const papel = novoPapel;
    setMudando(true);
    const resultado = await atualizarPapelUsuario(usuario.id, papel).catch(() => ERRO_CONEXAO);
    setMudando(false);
    setAlvo(null);
    if (!resultado.ok) {
      avisar(resultado.erro, {
        tom: "erro",
        acao: { rotulo: "Tentar de novo", onClick: () => setAlvo(usuario) },
      });
      return;
    }
    avisar(`${usuario.nome} agora é ${NOME_PAPEL[papel].toLowerCase()}.`, { tom: "sucesso" });
    router.refresh();
  }

  return (
    <div className="space-y-5">
      <label className="relative block w-full max-w-sm">
        <span className="sr-only">Buscar por nome ou e-mail</span>
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" aria-hidden />
        <input
          type="search"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Buscar por nome ou e-mail"
          className="w-full rounded-md border border-rule bg-surface py-2 pl-9 pr-3 font-sans text-base text-ink placeholder:text-ink-muted transition-colors duration-discreto ease-discreto hover:border-ink-muted sm:text-interface [@media(pointer:coarse)]:min-h-11"
        />
      </label>

      <p className="t-nota" aria-live="polite">
        {visiveis.length === 1 ? "1 pessoa" : `${visiveis.length} pessoas`}
        {busca.trim() && ` de ${usuarios.length}`}
      </p>

      {visiveis.length === 0 ? (
        <div className="filete py-10 text-center">
          <p className="t-subtitulo">Ninguém com esse nome ou e-mail</p>
          <Botao variante="secundario" className="mt-4" onClick={() => setBusca("")}>
            Limpar a busca
          </Botao>
        </div>
      ) : (
        <div className="relative overflow-x-auto">
          <table className="w-full min-w-[44rem] text-left">
            <caption className="sr-only">Usuários</caption>
            <thead>
              <tr className="border-b border-rule-strong/60 text-nota text-ink-muted">
                <th scope="col" className="py-2 pr-4 font-medium">Nome</th>
                <th scope="col" className="py-2 pr-4 font-medium">E-mail</th>
                <th scope="col" className="py-2 pr-4 font-medium">Papel</th>
                <th scope="col" className="py-2 pr-4 font-medium">Criado em</th>
                <th scope="col" className="py-2 font-medium">
                  <span className="sr-only">Ações</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y-hair divide-rule-strong/40">
              {visiveis.map((u) => (
                <tr key={u.id} className="align-baseline">
                  <td className="py-3 pr-4 text-interface font-semibold text-ink">{u.nome}</td>
                  <td className="py-3 pr-4 text-interface text-ink">{u.email}</td>
                  <td className="py-3 pr-4">
                    <Selo tom={u.papel === "administrador" ? "acao" : "neutro"}>{NOME_PAPEL[u.papel]}</Selo>
                  </td>
                  <td className="py-3 pr-4">
                    <time dateTime={u.criado_em} className="t-nota">
                      {DATA.format(new Date(u.criado_em))}
                    </time>
                  </td>
                  <td className="py-3 text-right">
                    <Botao variante="discreto" tamanho="sm" onClick={() => setAlvo(u)} aria-haspopup="dialog">
                      {u.papel === "administrador" ? "Tornar aluno" : "Tornar administrador"}
                      <span className="sr-only">: {u.nome}</span>
                    </Botao>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Dialogo
        aberto={Boolean(alvo)}
        onFechar={() => !mudando && setAlvo(null)}
        alerta
        titulo={alvo && novoPapel ? `Tornar ${alvo.nome} ${NOME_PAPEL[novoPapel].toLowerCase()}?` : "Mudar papel"}
        descricao={
          novoPapel === "administrador"
            ? "Administradores cadastram obras e exercícios, configuram o Sócrates e mudam o papel de outras pessoas."
            : "A pessoa deixa de ver a administração e passa a usar o Paideia como aluno."
        }
        acoes={
          <>
            <Botao variante="discreto" onClick={() => setAlvo(null)} disabled={mudando}>
              Cancelar
            </Botao>
            <Botao onClick={confirmar} carregando={mudando}>
              {novoPapel === "administrador" ? "Tornar administrador" : "Tornar aluno"}
            </Botao>
          </>
        }
      />
    </div>
  );
}
