const CACHE_NAME = "bit-island-shell-v1";
const scopeUrl = new URL(self.registration.scope);
const CORE_FILES = ["manifest.webmanifest", "favicon.svg", "icon-192.png", "icon-512.png"].map(
  (path) => new URL(path, scopeUrl).href,
);

async function warmShellCache() {
  const cache = await caches.open(CACHE_NAME);
  const shellUrl = new URL("./", scopeUrl).href;
  const shellResponse = await fetch(shellUrl, { cache: "reload" });
  if (!shellResponse.ok) throw new Error("Unable to cache the course shell");
  const html = await shellResponse.clone().text();
  const resourceUrls = [...html.matchAll(/(?:src|href)="([^"]+)"/g)]
    .map((match) => new URL(match[1], shellUrl))
    .filter((url) => url.origin === scopeUrl.origin && url.pathname.startsWith(scopeUrl.pathname))
    .map((url) => url.href);
  await cache.put(shellUrl, shellResponse);
  await cache.addAll([...new Set([...CORE_FILES, ...resourceUrls])]);
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    warmShellCache(),
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((names) => Promise.all(names.filter((name) => name.startsWith("bit-island-") && name !== CACHE_NAME).map((name) => caches.delete(name))))
      .then(() => self.clients.claim()),
  );
});

async function networkFirst(request, allowShellFallback = false) {
  const cache = await caches.open(CACHE_NAME);
  try {
    const response = await fetch(request);
    if (response.ok) await cache.put(request, response.clone());
    return response;
  } catch {
    const cached = await cache.match(request);
    if (cached) return cached;
    if (allowShellFallback) {
      const shell = await cache.match(new URL("./", scopeUrl));
      if (shell) return shell;
    }
    return Response.error();
  }
}

async function cacheFirst(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  if (response.ok) await cache.put(request, response.clone());
  return response;
}

self.addEventListener("fetch", (event) => {
  const requestUrl = new URL(event.request.url);
  if (event.request.method !== "GET" || requestUrl.origin !== scopeUrl.origin) return;
  const mutableCoreFile = ["manifest.webmanifest", "favicon.svg", "icon-192.png", "icon-512.png"].some((name) => requestUrl.pathname.endsWith(`/${name}`));
  event.respondWith(event.request.mode === "navigate" ? networkFirst(event.request, true) : mutableCoreFile ? networkFirst(event.request) : cacheFirst(event.request));
});
