# Paideia — Formação Clássica

Next.js 14 (App Router) + Tailwind + Supabase. PWA instalável.

## Setup

1. Instale as dependências:
   ```
   npm install
   ```

2. Crie um projeto no [Supabase](https://supabase.com) e rode, na ordem, no SQL Editor:
   - `supabase/schema.sql` — tabelas, enums, triggers e políticas de RLS.
   - `supabase/seed.sql` — eixos, capacidades, trilha das Sete Artes Liberais, ativos de exemplo e prompt inicial do Sócrates.

3. Copie `.env.local.example` para `.env.local` e preencha:
   - `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` — em Project Settings → API.
   - `SUPABASE_SERVICE_ROLE_KEY` — idem (mantenha em segredo, só é usada em rotas de servidor).
   - `ANTHROPIC_API_KEY` — chave da API Anthropic (Sócrates).

4. No Auth do Supabase, habilite o provedor de e-mail/senha. Google/Apple são opcionais (os botões na tela de login chamam `signInWithOAuth`; configure-os em Auth → Providers se quiser usá-los).

5. Torne seu usuário administrador após o primeiro cadastro:
   ```sql
   update perfis set papel = 'administrador' where email = 'seu-email@exemplo.com';
   ```

6. Rode o app:
   ```
   npm run dev
   ```

## Estrutura

- `app/` — rotas (App Router). `app/(shell)` agrupa as páginas autenticadas (sidebar + topbar); `app/(shell)/admin` é restrito a administradores (checado no `middleware.ts` e em `lib/data/session.ts`).
- `app/api/socrates/route.ts` — integração com a API Anthropic (Claude), injetando contexto da Carteira Intelectual e da Trilha de Formação do usuário no prompt de sistema.
- `components/` — UI, organizada por domínio.
- `lib/supabase/` — clients Supabase (browser, server, service role).
- `lib/data/` — funções de leitura server-side (sessão, dashboard).
- `types/database.ts` — tipos equivalentes ao schema SQL.
- `supabase/` — `schema.sql` e `seed.sql`.

## PWA

`public/manifest.json` + `public/sw.js` (registrado em `components/pwa-register.tsx`). Ícones em `public/icons/` são placeholders gerados localmente — substitua pela identidade visual final antes de publicar.
