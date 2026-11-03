"use client";

import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle } from "lucide-react";
import { AreaTexto, CampoTexto, Selecao } from "@/components/ui/campo";
import { Botao } from "@/components/ui/botao";
import { Interruptor } from "@/components/ui/interruptor";
import { useAviso } from "@/components/ui/aviso";
import { useAvisoDeSaida } from "@/components/admin/use-aviso-saida";
import { salvarObra, despublicarObra } from "@/app/(shell)/admin/obras/actions";
import { LIMITES_OBRA, validarObra, type DadosObra, type ErrosObra, type ResultadoSalvarObra } from "@/lib/validacao-obra";
import { ERRO_CONEXAO } from "@/lib/acoes";
import { cn, romano } from "@/lib/utils";

type Opcao = { id: string; numero: number; nome: string };

const MENSAGEM_SAIDA = "Há alterações não salvas nesta obra. Sair mesmo assim?";

// Cadastro e edição de obra (só administrador; o servidor confere de novo).
export function FormularioObra({
  obraId,
  inicial,
  epocas,
  funcoes,
}: {
  obraId: string | null; // null: obra nova
  inicial: DadosObra;
  epocas: Opcao[];
  funcoes: Opcao[];
}) {
  const [dados, setDados] = useState<DadosObra>(inicial);
  const [salvo, setSalvo] = useState<DadosObra>(inicial);
  const [erros, setErros] = useState<ErrosObra>({});
  const [tentou, setTentou] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [despublicando, setDespublicando] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();
  const avisar = useAviso();

  const sujo = useMemo(() => JSON.stringify(dados) !== JSON.stringify(salvo), [dados, salvo]);

  // Depois da primeira tentativa, as mensagens acompanham a digitação.
  useEffect(() => {
    if (tentou) setErros(validarObra(dados));
  }, [dados, tentou]);

  useAvisoDeSaida(sujo, MENSAGEM_SAIDA);

  const mudar = <K extends keyof DadosObra>(campo: K, valor: DadosObra[K]) => setDados((d) => ({ ...d, [campo]: valor }));

  const marcada = (id: string) => dados.funcoes.find((f) => f.funcao_id === id);
  function alternarFuncao(id: string) {
    setDados((d) =>
      marcada(id)
        ? { ...d, funcoes: d.funcoes.filter((f) => f.funcao_id !== id) }
        : { ...d, funcoes: [...d.funcoes, { funcao_id: id, nota: "" }] }
    );
  }
  function mudarNota(id: string, nota: string) {
    setDados((d) => ({ ...d, funcoes: d.funcoes.map((f) => (f.funcao_id === id ? { ...f, nota } : f)) }));
  }

  function focarPrimeiroErro(campos: ErrosObra) {
    const primeiro = Object.keys(campos)[0];
    if (!primeiro) return;
    const nome = primeiro.startsWith("nota:") ? primeiro : primeiro === "funcoes" ? "funcao" : primeiro;
    formRef.current?.querySelector<HTMLElement>(`[name="${nome}"], [data-campo="${nome}"]`)?.focus();
  }

  async function salvar() {
    setTentou(true);
    const locais = validarObra(dados);
    setErros(locais);
    if (Object.keys(locais).length > 0) {
      focarPrimeiroErro(locais);
      return;
    }
    setSalvando(true);
    const enviado = dados;
    const resultado = await salvarObra(obraId, enviado).catch(
      (): ResultadoSalvarObra => ({ ok: false, erro: "Sem conexão com o servidor. Tente de novo." })
    );
    setSalvando(false);

    if (!resultado.ok) {
      if (resultado.campos) {
        setErros(resultado.campos);
        focarPrimeiroErro(resultado.campos);
      }
      avisar(resultado.erro, { tom: "erro", acao: { rotulo: "Tentar de novo", onClick: salvar } });
      return;
    }

    setSalvo(enviado);
    avisar(obraId ? "Obra salva." : "Obra criada.", { tom: "sucesso" });
    if (!obraId) router.replace(`/admin/obras/${resultado.id}/editar`);
    else router.refresh();
  }

  async function despublicar() {
    if (!obraId) return;
    setDespublicando(true);
    const resultado = await despublicarObra(obraId).catch(() => ERRO_CONEXAO);
    setDespublicando(false);
    if (!resultado.ok) {
      avisar(resultado.erro, { tom: "erro", acao: { rotulo: "Tentar de novo", onClick: despublicar } });
      return;
    }
    setDados((d) => ({ ...d, ativo: false }));
    setSalvo((s) => ({ ...s, ativo: false }));
    avisar("Obra despublicada: voltou a rascunho.");
    router.refresh();
  }

  function aoEnviar(e: FormEvent) {
    e.preventDefault();
    salvar();
  }

  const qtdErros = Object.keys(erros).length;

  return (
    <form ref={formRef} onSubmit={aoEnviar} noValidate className="space-y-10">
      {tentou && qtdErros > 0 && (
        <div role="alert" className="flex items-start gap-2 rounded-md border-[3px] border-double border-gold-ink bg-sunken px-3 py-2 text-nota text-ink">
          <AlertCircle className="mt-px h-4 w-4 shrink-0 text-gold-ink" aria-hidden />
          {qtdErros === 1 ? "Há 1 campo para revisar." : `Há ${qtdErros} campos para revisar.`}
        </div>
      )}

      <section className="grid gap-5 lg:grid-cols-2">
        <div className="lg:col-span-2">
          <CampoTexto
            rotulo="Título"
            name="titulo"
            obrigatorio
            maxLength={LIMITES_OBRA.titulo}
            value={dados.titulo}
            onChange={(e) => mudar("titulo", e.target.value)}
            erro={erros.titulo}
          />
        </div>
        <CampoTexto
          rotulo="Autor"
          name="autor"
          maxLength={LIMITES_OBRA.autor}
          value={dados.autor}
          onChange={(e) => mudar("autor", e.target.value)}
          erro={erros.autor}
        />
        <Selecao
          rotulo="Época"
          name="epoca_id"
          value={dados.epoca_id ?? ""}
          onChange={(e) => mudar("epoca_id", e.target.value || null)}
          erro={erros.epoca_id}
        >
          <option value="">Sem época</option>
          {epocas.map((e) => (
            <option key={e.id} value={e.id}>
              {romano(e.numero)} {e.nome}
            </option>
          ))}
        </Selecao>
        <div className="lg:col-span-2">
          <AreaTexto
            rotulo="Descrição"
            name="descricao"
            rows={4}
            maxLength={LIMITES_OBRA.descricao}
            value={dados.descricao}
            onChange={(e) => mudar("descricao", e.target.value)}
            erro={erros.descricao}
            ajuda="Aparece na ficha da obra. Pode ficar vazia."
          />
        </div>
      </section>

      <fieldset className="space-y-4" aria-describedby={erros.funcoes ? "erro-funcoes" : "ajuda-funcoes"}>
        <legend className="t-subtitulo">Funções que a obra carrega</legend>
        <p id="ajuda-funcoes" className="t-nota -mt-2">
          Marque as funções que a obra exercita. Para cada uma, uma nota curta diz por quê; ela aparece na ficha da obra e da função.
        </p>
        {erros.funcoes && (
          <p id="erro-funcoes" className="flex items-start gap-1.5 text-nota font-medium text-ink">
            <AlertCircle className="mt-px h-4 w-4 shrink-0 text-gold-ink" aria-hidden />
            {erros.funcoes}
          </p>
        )}
        <ul className="divide-y-hair divide-rule-strong/40 border-y-hair border-rule-strong/40">
          {funcoes.map((f) => {
            const ligada = marcada(f.id);
            return (
              <li key={f.id} className="py-3">
                <label className="flex min-h-11 cursor-pointer items-center gap-3">
                  <input
                    type="checkbox"
                    name="funcao"
                    data-campo="funcao"
                    checked={Boolean(ligada)}
                    onChange={() => alternarFuncao(f.id)}
                    className="h-5 w-5 shrink-0 accent-[rgb(var(--c-action))]"
                  />
                  <span className="t-romano w-8 shrink-0 text-gold-ink" aria-hidden>
                    {romano(f.numero)}
                  </span>
                  <span className="text-interface text-ink">
                    <span className="sr-only">Função {f.numero}: </span>
                    {f.nome}
                  </span>
                </label>
                {ligada && (
                  <div className="mt-2 pl-[4.25rem]">
                    <CampoTexto
                      rotulo={`Nota para ${f.nome}`}
                      name={`nota:${f.id}`}
                      maxLength={LIMITES_OBRA.nota}
                      value={ligada.nota}
                      onChange={(e) => mudarNota(f.id, e.target.value)}
                      erro={erros[`nota:${f.id}`]}
                      ajuda="Opcional. Uma frase sobre o que esta obra forma nesta função."
                    />
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </fieldset>

      <section className="space-y-4">
        <Interruptor
          rotulo="Publicada"
          name="ativo"
          ligado={dados.ativo}
          aoMudar={(v) => mudar("ativo", v)}
          ajuda={dados.ativo ? "Os alunos veem esta obra." : "Rascunho: só a administração vê esta obra."}
        />
      </section>

      <div className="filete-duplo-cima flex flex-wrap items-center gap-3 pt-5">
        <Botao type="submit" carregando={salvando}>
          {obraId ? "Salvar alterações" : "Criar obra"}
        </Botao>
        {obraId && salvo.ativo && (
          <Botao variante="secundario" carregando={despublicando} onClick={despublicar} disabled={salvando}>
            Despublicar
          </Botao>
        )}
        <p className={cn("t-nota", !sujo && "sr-only")} aria-live="polite">
          {sujo ? "Alterações não salvas." : "Tudo salvo."}
        </p>
      </div>
    </form>
  );
}
