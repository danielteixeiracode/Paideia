"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, ScrollText, KeyRound, UserCircle2, ArrowRight, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type Modo = "entrar" | "criar";

export function AuthCard() {
  const [modo, setModo] = useState<Modo>("entrar");
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [manterAberto, setManterAberto] = useState(true);
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

  return (
    <div className="overflow-hidden rounded-2xl border border-paideia-cream-300 bg-paideia-cream-50 shadow-card">
      <div className="grid grid-cols-2">
        <button
          type="button"
          onClick={() => setModo("entrar")}
          className={`py-4 text-sm font-semibold transition ${
            modo === "entrar"
              ? "bg-white text-paideia-ink"
              : "bg-paideia-cream-100 text-paideia-green-700 hover:bg-paideia-cream-200"
          }`}
        >
          Entrar na Academia
        </button>
        <button
          type="button"
          onClick={() => setModo("criar")}
          className={`py-4 text-sm font-semibold transition ${
            modo === "criar"
              ? "bg-white text-paideia-ink"
              : "bg-paideia-cream-100 text-paideia-green-700 hover:bg-paideia-cream-200"
          }`}
        >
          Criar Minha Conta
        </button>
      </div>

      <form onSubmit={onSubmit} className="space-y-5 bg-white px-7 py-8">
        {modo === "criar" && (
          <div>
            <label className="label-caps mb-2 flex items-center gap-2">
              Nome do Discípulo
            </label>
            <div className="flex items-center gap-2 rounded-lg border border-paideia-cream-300 bg-paideia-cream-50 px-3 py-2.5 focus-within:border-paideia-gold-500">
              <UserCircle2 className="h-4 w-4 text-paideia-green-700" />
              <input
                required
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Marcus Aurelius"
                className="w-full bg-transparent text-sm outline-none placeholder:text-paideia-ink/40"
              />
            </div>
          </div>
        )}

        <div>
          <label className="label-caps mb-2 flex items-center justify-between">
            Chave de Identificação (E-mail)
            <ScrollText className="h-3.5 w-3.5" />
          </label>
          <div className="flex items-center gap-2 rounded-lg border border-paideia-cream-300 bg-paideia-cream-50 px-3 py-2.5 focus-within:border-paideia-gold-500">
            <UserCircle2 className="h-4 w-4 text-paideia-green-700" />
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="discipulo@paideia.edu.br"
              className="w-full bg-transparent text-sm outline-none placeholder:text-paideia-ink/40"
            />
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="label-caps">Palavra de Passe</label>
            {modo === "entrar" && (
              <button type="button" className="text-xs font-medium text-paideia-gold-700 hover:underline">
                Esqueceu a chave de acesso?
              </button>
            )}
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-paideia-cream-300 bg-paideia-cream-50 px-3 py-2.5 focus-within:border-paideia-gold-500">
            <KeyRound className="h-4 w-4 text-paideia-green-700" />
            <input
              required
              minLength={6}
              type={mostrarSenha ? "text" : "password"}
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-transparent text-sm outline-none placeholder:text-paideia-ink/40"
            />
            <button type="button" onClick={() => setMostrarSenha((v) => !v)}>
              {mostrarSenha ? (
                <EyeOff className="h-4 w-4 text-paideia-ink/50" />
              ) : (
                <Eye className="h-4 w-4 text-paideia-ink/50" />
              )}
            </button>
          </div>
        </div>

        {modo === "entrar" && (
          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center gap-2 text-paideia-ink/70">
              <input
                type="checkbox"
                checked={manterAberto}
                onChange={(e) => setManterAberto(e.target.checked)}
                className="h-4 w-4 rounded border-paideia-cream-300 text-paideia-green-700"
              />
              Manter pergaminhos abertos
            </label>
            <span className="italic text-paideia-ink/50">Sessão Segura</span>
          </div>
        )}

        {erro && <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">{erro}</p>}
        {aviso && <p className="rounded-lg bg-paideia-gold-300/30 px-3 py-2 text-xs text-paideia-green-800">{aviso}</p>}

        <button type="submit" disabled={carregando} className="btn-primary w-full py-3 text-base">
          {carregando ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              {modo === "entrar" ? "Entrar no Paideia" : "Iniciar Minha Formação"}
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>

        <div className="flex items-center gap-3 pt-1 text-[11px] uppercase tracking-widest text-paideia-ink/40">
          <span className="h-px flex-1 bg-paideia-cream-300" />
          Ou aceda via
          <span className="h-px flex-1 bg-paideia-cream-300" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button type="button" onClick={() => onOAuth("google")} className="btn-secondary py-2.5">
            Google
          </button>
          <button type="button" onClick={() => onOAuth("apple")} className="btn-secondary py-2.5">
            Apple
          </button>
        </div>
      </form>

      <div className="border-t border-paideia-cream-300 bg-paideia-cream-100 py-3 text-center text-[11px] font-medium uppercase tracking-widest text-paideia-green-700">
        Academia de Estudos Superiores
      </div>
    </div>
  );
}
