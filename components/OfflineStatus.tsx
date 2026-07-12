"use client";

import { useEffect, useState } from "react";

export function OfflineStatus() {
  const [online, setOnline] = useState(true);
  const [offlineReady, setOfflineReady] = useState(false);
  const [offlineFailed, setOfflineFailed] = useState(false);

  useEffect(() => {
    const sync = () => setOnline(window.navigator.onLine);
    sync();
    let cancelled = false;
    if ("serviceWorker" in window.navigator) {
      const manifestLink = document.querySelector<HTMLLinkElement>('link[rel="manifest"]');
      const offlineBase = new URL("./", manifestLink?.href ?? window.location.href);
      void window.navigator.serviceWorker.register(new URL("sw.js", offlineBase), { scope: offlineBase.pathname }).catch(() => {
        if (!cancelled) setOfflineFailed(true);
      });
      void window.navigator.serviceWorker.ready.then(() => {
        if (!cancelled) setOfflineReady(true);
      });
    } else {
      queueMicrotask(() => {
        if (!cancelled) setOfflineFailed(true);
      });
    }
    window.addEventListener("online", sync);
    window.addEventListener("offline", sync);
    return () => {
      cancelled = true;
      window.removeEventListener("online", sync);
      window.removeEventListener("offline", sync);
    };
  }, []);

  return (
    <p className={`offline-status ${online ? "is-online" : "is-offline"}`} role="status">
      <span aria-hidden="true">{online && offlineReady ? "✓" : offlineFailed ? "!" : "↻"}</span>
      {online
        ? offlineReady ? "课程已支持离线重访" : offlineFailed ? "离线功能未准备好 · 联网仍可学习" : "联网学习中 · 正在准备离线课程"
        : offlineReady ? "当前离线：继续学习已打开过的课程" : "当前离线 · 请联网打开一次课程"}
    </p>
  );
}
