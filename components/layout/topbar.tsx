"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Bell, LogOut, User, ShieldCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Perfil } from "@/types/database";

export function Topbar({
  perfil,
  naoLidas,
}: {
  perfil: Perfil;
  naoLidas: number;
}) {
  const [menuAberto, setMenuAberto] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function sair() {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-20 flex items-center gap-4 border-b border-paideia-cream-300 bg-paideia-cream-50/90 px-5 py-3 backdrop-blur">
      <div className="hidden flex-1 items-center gap-2 rounded-lg border border-paideia-cream-300 bg-white px-3 py-2 text-sm text-paideia-ink/50 sm:flex sm:max-w-sm">
        <Search className="h-4 w-4" />
        <input
          placeholder="Buscar diálogos, cânones, notas..."
          className="w-full bg-transparent outline-none placeholder:text-paideia-ink/40"
        />
      </div>

      <p className="hidden flex-1 text-center font-serif text-sm italic text-paideia-ink/60 md:block">
        &ldquo;Nosce te ipsum&rdquo; — Templo de Apolo
      </p>

      <div className="ml-auto flex items-center gap-3">
        <span className="hidden items-center gap-1.5 rounded-full bg-paideia-gold-300/30 px-3 py-1.5 text-xs font-semibold text-paideia-green-800 sm:flex">
          🏆 {perfil.grau_atual}
        </span>

        <button className="relative rounded-full p-2 text-paideia-green-800 hover:bg-white">
          <Bell className="h-[18px] w-[18px]" />
          {naoLidas > 0 && (
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-paideia-gold-500" />
          )}
        </button>

        <div className="relative">
          <button
            onClick={() => setMenuAberto((v) => !v)}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-paideia-green-900 text-paideia-gold-300"
          >
            <User className="h-4 w-4" />
          </button>
          {menuAberto && (
            <div className="absolute right-0 top-11 w-48 overflow-hidden rounded-lg border border-paideia-cream-300 bg-white shadow-card">
              <div className="border-b border-paideia-cream-200 px-3 py-2.5">
                <p className="truncate text-sm font-semibold">{perfil.nome}</p>
                <p className="truncate text-xs text-paideia-ink/50">{perfil.email}</p>
              </div>
              {perfil.papel === "administrador" && (
                <Link
                  href="/admin"
                  onClick={() => setMenuAberto(false)}
                  className="flex w-full items-center gap-2 border-b border-paideia-cream-200 px-3 py-2.5 text-left text-sm text-paideia-ink hover:bg-paideia-cream-100"
                >
                  <ShieldCheck className="h-4 w-4" /> Painel Administrativo
                </Link>
              )}
              <button
                onClick={sair}
                className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm text-red-700 hover:bg-red-50"
              >
                <LogOut className="h-4 w-4" /> Sair
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
