"use client";

import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle } from "lucide-react";
import { AreaTexto, CampoTexto, Selecao } from "@/components/ui/campo";
import { Botao } from "@/components/ui/botao";
import { Interruptor } from "@/components/ui/interruptor";
import { useAviso } from "@/components/ui/aviso";
import { useAvisoDeSaida } from "@/components/admin/use-aviso-saida";
import { salvarExercicio, despublicarExercicio } from "@/app/(shell)/admin/exercicios/actions";
import {
  LIMITES_EXERCICIO,
  METODOS_SUGERIDOS,
  validarExercicio,
  type DadosExercicio,
  type ErrosExercicio,
  type ResultadoSalvarExercicio,
} from "@/lib/validacao-exercicio";
import { ERRO_CONEXAO } from "@/lib/acoes";
import { cn, romano } from "@/lib/utils";

type Funcao = { id: string; numero: number; nome: string };
export type ObraOpcao = { id: string; titulo: string; ativo: boolean; funcoes: string[] };

const MENSAGEM_SAIDA = "Há alterações não salvas neste exercício. Sair mesmo assim?";

// Cadastro e edição de exercício (só administrador; o servidor confere de novo).
export function FormularioExercicio({
  exercicioId,
  inicial,
  funcoes,
  obras,
}: {
  exercicioId: string | null; // null: exercício novo
  inicial: DadosExercicio;
  funcoes: Funcao[];
  obras: ObraOpcao[];
}) {
  const [dados, setDados] = useState<DadosExercicio>(inicial);
  const [salvo, setSalvo] = useState<DadosExercicio>(inicial);
  const [erros, setErros] = useState<ErrosExercicio>({});
  const [tentou, setTentou] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [despublicando, setDespublicando] = useState(false);
  const [obraLimpa, setObraLimpa] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();
  const avisar = useAviso();

  const sujo = useMemo(() => JSON.stringify(dados) !== JSON.stringify(salvo), [dados, salvo]);
  useAvisoDeSaida(sujo, MENSAGEM_SAIDA);

  useEffect(() => {
    if (tentou) setErros(validarExercicio(dados));
  }, [dados, tentou]);

  // Só as obras que carregam a função escolhida (em obra_funcoes).
  const obrasDaFuncao = useMemo(
    () => (dados.funcao_id ? obras.filter((o) => o.funcoes.includes(dados.funcao_id)) : []),
    [obras, dados.funcao_id]
  );

  function mudarFuncao(funcao_id: string) {
    setDados((d) => {
      const obraContinua = d.obra_id && obras.find((o) => o.id === d.obra_id)?.funcoes.includes(funcao_id);
      setObraLimpa(Boolean(d.obra_id && !obraContinua));
      return { ...d, funcao_id, obra_id: obraContinua ? d.obra_id : null };
    });
  }

  const mudar = <K extends keyof DadosExercicio>(campo: K, valor: DadosExercicio[K]) => setDados((d) => ({ ...d, [campo]: valor }));

  function focarPrimeiroErro(campos: ErrosExercicio) {
    const primeiro = Object.keys(campos)[0];
    if (primeiro) formRef.current?.querySelector<HTMLElement>(`[name="${primeiro}"]`)?.focus();
  }

  async function salvar() {
    setTentou(true);
    const locais = validarExercicio(dados);
    setErros(locais);
    if (Object.keys(locais).length > 0) {
      focarPrimeiroErro(locais);
      return;
    }
    setSalvando(true);
    const enviado = dados;
    const resultado = await salvarExercicio(exercicioId, enviado).catch(
      (): ResultadoSalvarExercicio => ({ ok: false, erro: "Sem conexão com o servidor. Tente de novo." })
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
    avisar(exercicioId ? "Exercício salvo." : "Exercício criado.", { tom: "sucesso" });
    if (!exercicioId) router.replace(`/admin/exercicios/${resultado.id}/editar`);
    else router.refresh();
  }

  async function despublicar() {
    if (!exercicioId) return;
    setDespublicando(true);
    const resultado = await despublicarExercicio(exercicioId).catch(() => ERRO_CONEXAO);
    setDespublicando(false);
    if (!resultado.ok) {
      avisar(resultado.erro, { tom: "erro", acao: { rotulo: "Tentar de novo", onClick: despublicar } });
      return;
    }
    setDados((d) => ({ ...d, ativo: false }));
    setSalvo((s) => ({ ...s, ativo: false }));
    avisar("Exercício despublicado: voltou a rascunho.");
    router.refresh();
  }

  function aoEnviar(e: FormEvent) {
    e.preventDefault();
    salvar();
  }

  const qtdErros = Object.keys(erros).length;
  const ajudaObra = !dados.funcao_id
    ? "Escolha a função primeiro."
    : obrasDaFuncao.length === 0
      ? "Nenhuma obra carrega esta função ainda: o exercício será geral da função."
      : obraLimpa
        ? "A obra escolhida antes não carrega esta função; o exercício ficou geral. Escolha outra, se quiser."
        : "Vazio: o exercício vale para todas as obras desta função. Escolhida: só para aquela obra.";

  return (
    <form ref={formRef} onSubmit={aoEnviar} noValidate className="space-y-10">
      {tentou && qtdErros > 0 && (
        <div role="alert" className="flex items-start gap-2 rounded-md border-[3px] border-double border-gold-ink bg-sunken px-3 py-2 text-nota text-ink">
          <AlertCircle className="mt-px h-4 w-4 shrink-0 text-gold-ink" aria-hidden />
          {qtdErros === 1 ? "Há 1 campo para revisar." : `Há ${qtdErros} campos para revisar.`}
        </div>
      )}

      <section className="grid gap-5 lg:grid-cols-2">
        <Selecao
          rotulo="Função"
          name="funcao_id"
          obrigatorio
          value={dados.funcao_id}
          onChange={(e) => mudarFuncao(e.target.value)}
          erro={erros.funcao_id}
        >
          <option value="" disabled>
            Escolha a função
          </option>
          {funcoes.map((f) => (
            <option key={f.id} value={f.id}>
              {romano(f.numero)} {f.nome}
            </option>
          ))}
        </Selecao>
        <Selecao
          rotulo="Obra"
          name="obra_id"
          value={dados.obra_id ?? ""}
          onChange={(e) => {
            setObraLimpa(false);
            mudar("obra_id", e.target.value || null);
          }}
          disabled={obrasDaFuncao.length === 0}
          erro={erros.obra_id}
          ajuda={ajudaObra}
        >
          <option value="">Geral da função</option>
          {obrasDaFuncao.map((o) => (
            <option key={o.id} value={o.id}>
              {o.titulo}
              {o.ativo ? "" : " (rascunho)"}
            </option>
          ))}
        </Selecao>
        <div className="lg:col-span-2">
          <CampoTexto
            rotulo="Título"
            name="titulo"
            obrigatorio
            maxLength={LIMITES_EXERCICIO.titulo}
            value={dados.titulo}
            onChange={(e) => mudar("titulo", e.target.value)}
            erro={erros.titulo}
          />
        </div>
        <div className="lg:col-span-2">
          <AreaTexto
            rotulo="Enunciado"
            name="enunciado"
            obrigatorio
            rows={6}
            maxLength={LIMITES_EXERCICIO.enunciado}
            value={dados.enunciado}
            onChange={(e) => mudar("enunciado", e.target.value)}
            erro={erros.enunciado}
            ajuda="O que o aluno deve fazer, em palavras simples."
          />
        </div>
        <div>
          <CampoTexto
            rotulo="Método"
            name="metodo"
            list="metodos-sugeridos"
            maxLength={LIMITES_EXERCICIO.metodo}
            value={dados.metodo}
            onChange={(e) => mudar("metodo", e.target.value)}
            erro={erros.metodo}
            ajuda="Escolha uma sugestão ou escreva outro."
            autoComplete="off"
          />
          <datalist id="metodos-sugeridos">
            {METODOS_SUGERIDOS.map((m) => (
              <option key={m} value={m} />
            ))}
          </datalist>
        </div>
      </section>

      <section>
        <Interruptor
          rotulo="Publicado"
          name="ativo"
          ligado={dados.ativo}
          aoMudar={(v) => mudar("ativo", v)}
          ajuda={dados.ativo ? "Os alunos veem este exercício." : "Rascunho: só a administração vê este exercício."}
        />
      </section>

      <div className="filete-duplo-cima flex flex-wrap items-center gap-3 pt-5">
        <Botao type="submit" carregando={salvando}>
          {exercicioId ? "Salvar alterações" : "Criar exercício"}
        </Botao>
        {exercicioId && salvo.ativo && (
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
