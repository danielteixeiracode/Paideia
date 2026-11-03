import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";

// Título da aba nas fichas: o nome vem do banco, pela sessão de quem abre
// (RLS). O layout raiz acrescenta " – Paideia".
export async function tituloDaFicha(
  tabela: "obras" | "funcoes_pedagogicas" | "epocas" | "exercicios",
  coluna: "titulo" | "nome",
  id: string,
  prefixo = ""
): Promise<Metadata> {
  const { data } = await createClient().from(tabela).select(coluna).eq("id", id).maybeSingle();
  const nome = (data as Record<string, string> | null)?.[coluna];
  return { title: nome ? `${prefixo}${nome}` : "Não encontrado" };
}
