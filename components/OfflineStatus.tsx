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
      void window.navigator.serviceWorker.ready.then(() => {
        if (!cancelled) setOfflineReady(true);
      });
    }
    window.addEventListener("online", sync);
    window.addEventListener("offline", sync);
    const markOfflineFailed = () => setOfflineFailed(true);
    window.addEventListener("bit-island-offline-error", markOfflineFailed);
    return () => {
      cancelled = true;
      window.removeEventListener("online", sync);
      window.removeEventListener("offline", sync);
      window.removeEventListener("bit-island-offline-error", markOfflineFailed);
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
