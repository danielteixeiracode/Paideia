"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, ArrowRight, AlertCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Botao } from "@/components/ui/botao";
import { CampoTexto } from "@/components/ui/campo";
import { cn } from "@/lib/utils";

type Modo = "entrar" | "criar";

export function AuthCard() {
  const [modo, setModo] = useState<Modo>("entrar");
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [aviso, setAviso] = useState<string | null>(null);

  const router = useRouter();
  const supabase = createClient();

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setErro(null);
    setAviso(null);
    setCarregando(true);
    try {
      if (modo === "entrar") {
        const { error } = await supabase.auth.signInWithPassword({ email, password: senha });
        if (error) throw error;
        router.push("/inicio");
        router.refresh();
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password: senha,
          options: { data: { nome } },
        });
        if (error) throw error;
        setAviso("Conta criada. Verifique seu e-mail para confirmar a inscrição na Academia.");
        setModo("entrar");
      }
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Não foi possível concluir a solicitação.");
    } finally {
      setCarregando(false);
    }
  }

  async function onOAuth(provider: "google" | "apple") {
    setErro(null);
    await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  }

  const aba = (ativo: boolean) =>
    cn(
      "min-h-12 px-3 text-interface font-semibold transition-colors duration-discreto ease-discreto",
      ativo ? "border-b-2 border-gold bg-surface text-ink" : "border-b border-rule bg-sunken text-ink-muted hover:text-ink"
    );

  return (
    <div className="overflow-hidden rounded-2xl border border-rule bg-surface shadow-card">
      <div className="grid grid-cols-2" role="group" aria-label="Entrar ou criar conta">
        <button type="button" aria-pressed={modo === "entrar"} onClick={() => setModo("entrar")} className={aba(modo === "entrar")}>
          Entrar na Academia
        </button>
        <button type="button" aria-pressed={modo === "criar"} onClick={() => setModo("criar")} className={aba(modo === "criar")}>
          Criar Minha Conta
        </button>
      </div>

      <form onSubmit={onSubmit} className="space-y-5 px-6 py-7 sm:px-7">
        {modo === "criar" && (
          <CampoTexto
            rotulo="Nome do Discípulo"
            required
            autoComplete="name"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Marcus Aurelius"
          />
        )}

        <CampoTexto
          rotulo="Chave de Identificação (E-mail)"
          required
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="discipulo@paideia.edu.br"
        />

        <div className="space-y-1">
          <CampoTexto
            rotulo="Palavra de Passe"
            required
            minLength={6}
            type={mostrarSenha ? "text" : "password"}
            autoComplete={modo === "entrar" ? "current-password" : "new-password"}
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            fim={
              <button
                type="button"
                onClick={() => setMostrarSenha((v) => !v)}
                aria-label={mostrarSenha ? "Esconder a senha" : "Mostrar a senha"}
                aria-pressed={mostrarSenha}
                className="flex h-9 w-9 items-center justify-center rounded-md text-ink-muted hover:text-ink [@media(pointer:coarse)]:h-11 [@media(pointer:coarse)]:w-11"
              >
                {mostrarSenha ? <EyeOff className="h-4 w-4" aria-hidden /> : <Eye className="h-4 w-4" aria-hidden />}
              </button>
            }
          />
        </div>

        {erro && (
          <p role="alert" className="flex items-start gap-2 rounded-md border-2 border-gold-ink bg-sunken px-3 py-2 text-nota text-ink">
            <AlertCircle className="mt-px h-4 w-4 shrink-0 text-gold-ink" aria-hidden />
            {erro}
          </p>
        )}
        {aviso && (
          <p role="status" className="rounded-md bg-muted px-3 py-2 text-nota text-ink">
            {aviso}
          </p>
        )}

        <Botao type="submit" carregando={carregando} className="w-full min-h-12 text-corpo">
          {modo === "entrar" ? "Entrar no Paideia" : "Iniciar Minha Formação"}
          {!carregando && <ArrowRight className="h-4 w-4" aria-hidden />}
        </Botao>

        <div className="flex items-center gap-3 text-nota text-ink-muted">
          <span aria-hidden className="filete flex-1" />
          Ou aceda via
          <span aria-hidden className="filete flex-1" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Botao variante="secundario" onClick={() => onOAuth("google")}>
            Google
          </Botao>
          <Botao variante="secundario" onClick={() => onOAuth("apple")}>
            Apple
          </Botao>
        </div>
      </form>

      <p className="border-t border-rule bg-sunken py-3 text-center text-nota text-ink-muted">
        Academia de Estudos Superiores
      </p>
    </div>
  );
}
