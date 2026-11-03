"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle } from "lucide-react";
import { AreaTexto, CampoTexto } from "@/components/ui/campo";
import { Botao } from "@/components/ui/botao";
import { TituloBloco } from "@/components/ui/titulo-bloco";
import { useAviso } from "@/components/ui/aviso";
import { useAvisoDeSaida } from "@/components/admin/use-aviso-saida";
import { atualizarConfigSocrates } from "@/app/(shell)/admin/actions";
import { ERRO_CONEXAO } from "@/lib/acoes";
import { cn } from "@/lib/utils";

export interface ConfigSocratesForm {
  id: string | null;
  system_prompt: string;
  modelo: string;
  temperatura: string;
  max_tokens: string;
}

// Os mesmos limites que o formulário já tinha (min/max dos campos).
function validar(d: ConfigSocratesForm) {
  const erros: Record<string, string> = {};
  if (!d.system_prompt.trim()) erros.system_prompt = "Escreva o prompt de sistema.";
  const t = Number(d.temperatura);
  if (d.temperatura === "" || Number.isNaN(t) || t < 0 || t > 1) erros.temperatura = "Use um número entre 0 e 1.";
  const m = Number(d.max_tokens);
  if (d.max_tokens === "" || !Number.isInteger(m) || m < 128 || m > 4096) erros.max_tokens = "Use um número inteiro entre 128 e 4096.";
  return erros;
}

// Configuração do Sócrates: os mesmos campos e a mesma ação de antes, no
// padrão novo (seções, ajuda e erro, aviso, aviso de saída).
export function FormularioSocrates({ inicial }: { inicial: ConfigSocratesForm }) {
  const [dados, setDados] = useState(inicial);
  const [salvo, setSalvo] = useState(inicial);
  const [erros, setErros] = useState<Record<string, string>>({});
  const [tentou, setTentou] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const router = useRouter();
  const avisar = useAviso();

  const sujo = useMemo(() => JSON.stringify(dados) !== JSON.stringify(salvo), [dados, salvo]);
  useAvisoDeSaida(sujo, "Há alterações não salvas na configuração do Sócrates. Sair mesmo assim?");

  useEffect(() => {
    if (tentou) setErros(validar(dados));
  }, [dados, tentou]);

  const mudar = (campo: keyof ConfigSocratesForm, valor: string) => setDados((d) => ({ ...d, [campo]: valor }));

  async function salvar() {
    setTentou(true);
    const locais = validar(dados);
    setErros(locais);
    if (Object.keys(locais).length) {
      document.querySelector<HTMLElement>(`[name="${Object.keys(locais)[0]}"]`)?.focus();
      return;
    }
    const form = new FormData();
    form.set("id", dados.id ?? "");
    form.set("system_prompt", dados.system_prompt);
    form.set("modelo", dados.modelo);
    form.set("temperatura", dados.temperatura);
    form.set("max_tokens", dados.max_tokens);

    setSalvando(true);
    const resultado = await atualizarConfigSocrates(form).catch(() => ERRO_CONEXAO);
    setSalvando(false);
    if (!resultado.ok) {
      avisar(resultado.erro, { tom: "erro", acao: { rotulo: "Tentar de novo", onClick: salvar } });
      return;
    }
    setSalvo(dados);
    avisar("Configuração do Sócrates salva.", { tom: "sucesso" });
    router.refresh();
  }

  function aoEnviar(e: FormEvent) {
    e.preventDefault();
    salvar();
  }

  const qtdErros = Object.keys(erros).length;

  return (
    <form onSubmit={aoEnviar} noValidate className="space-y-10">
      {tentou && qtdErros > 0 && (
        <div role="alert" className="flex items-start gap-2 rounded-md border-[3px] border-double border-gold-ink bg-sunken px-3 py-2 text-nota text-ink">
          <AlertCircle className="mt-px h-4 w-4 shrink-0 text-gold-ink" aria-hidden />
          {qtdErros === 1 ? "Há 1 campo para revisar." : `Há ${qtdErros} campos para revisar.`}
        </div>
      )}

      <section className="space-y-4">
        <TituloBloco titulo="Prompt de sistema" grande />
        <AreaTexto
          rotulo="Prompt de sistema (maiêutica)"
          name="system_prompt"
          obrigatorio
          rows={16}
          value={dados.system_prompt}
          onChange={(e) => mudar("system_prompt", e.target.value)}
          erro={erros.system_prompt}
          ajuda="A base de quem o Sócrates é e de como conduz o diálogo. O contexto do aluno é acrescentado a cada conversa."
        />
      </section>

      <section className="space-y-4">
        <TituloBloco titulo="Modelo e parâmetros" grande />
        <div className="grid gap-5 sm:grid-cols-3">
          <CampoTexto
            rotulo="Modelo"
            name="modelo"
            value={dados.modelo}
            onChange={(e) => mudar("modelo", e.target.value)}
            ajuda="Identificador do modelo da Anthropic."
            autoComplete="off"
            spellCheck={false}
          />
          <CampoTexto
            rotulo="Temperatura"
            name="temperatura"
            type="number"
            inputMode="decimal"
            step="0.05"
            min="0"
            max="1"
            value={dados.temperatura}
            onChange={(e) => mudar("temperatura", e.target.value)}
            erro={erros.temperatura}
            ajuda="De 0 a 1. Mais alto, respostas mais variadas."
          />
          <CampoTexto
            rotulo="Máximo de tokens"
            name="max_tokens"
            type="number"
            inputMode="numeric"
            min="128"
            max="4096"
            value={dados.max_tokens}
            onChange={(e) => mudar("max_tokens", e.target.value)}
            erro={erros.max_tokens}
            ajuda="Tamanho máximo de cada resposta, de 128 a 4096."
          />
        </div>
      </section>

      <div className="filete-duplo-cima flex flex-wrap items-center gap-3 pt-5">
        <Botao type="submit" carregando={salvando}>
          {dados.id ? "Salvar configuração" : "Criar configuração"}
        </Botao>
        <p className={cn("t-nota", !sujo && "sr-only")} aria-live="polite">
          {sujo ? "Alterações não salvas." : "Tudo salvo."}
        </p>
      </div>
    </form>
  );
}
