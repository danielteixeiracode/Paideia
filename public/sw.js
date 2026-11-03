// Service worker do Paideia.
//
// Regra: nunca guardar em cache páginas que exigem login (nem respostas da
// API), para que um aparelho compartilhado não mostre a tela de uma pessoa a
// outra. Só entram no cache os arquivos estáticos (código e estilos do Next,
// ícones, manifest) e a página offline, que não tem dado de ninguém.
//
// v2: a v1 guardava qualquer página, inclusive /inicio. Ao ativar, as caches
// antigas são apagadas.

const CACHE = "paideia-estaticos-v2";
const OFFLINE = "/offline.html";
const PRECACHE = [OFFLINE, "/manifest.json", "/icons/icon-192.png", "/icons/icon-512.png"];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(PRECACHE)).catch(() => {}));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((chaves) => Promise.all(chaves.filter((c) => c !== CACHE).map((c) => caches.delete(c))))
  );
  self.clients.claim();
});

function ehEstatico(url) {
  return (
    url.pathname.startsWith("/_next/static/") ||
    url.pathname.startsWith("/icons/") ||
    url.pathname === "/manifest.json" ||
    url.pathname === OFFLINE ||
    /\.(?:png|svg|ico|woff2?)$/.test(url.pathname)
  );
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // Páginas: sempre da rede, nunca do cache. Sem rede, a página offline.
  if (request.mode === "navigate") {
    event.respondWith(fetch(request).catch(() => caches.match(OFFLINE)));
    return;
  }

  // Arquivos estáticos: do cache se houver; senão da rede, guardando a cópia.
  if (ehEstatico(url)) {
    event.respondWith(
      caches.match(request).then(
        (guardado) =>
          guardado ||
          fetch(request).then((resposta) => {
            if (resposta.ok) {
              const copia = resposta.clone();
              caches.open(CACHE).then((cache) => cache.put(request, copia)).catch(() => {});
            }
            return resposta;
          })
      )
    );
  }
  // Todo o resto (dados das páginas, /api/...) passa direto, sem cache.
});
