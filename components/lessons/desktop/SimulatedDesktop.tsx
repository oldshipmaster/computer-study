import type { DesktopAction, DesktopAppId, DesktopState } from "@/lib/desktop-lesson";
import "./SimulatedDesktop.css";

interface SimulatedDesktopProps { state: DesktopState; history: string[]; onAction: (action: DesktopAction) => void; }
const APPS: Array<{ id: DesktopAppId; label: string; icon: string }> = [
  { id: "notes", label: "记事本", icon: "📝" },
  { id: "paint", label: "画图", icon: "🎨" },
];

function appName(id: DesktopAppId | null) {
  return APPS.find((app) => app.id === id)?.label ?? "无";
}

export function SimulatedDesktop({ state, history, onAction }: SimulatedDesktopProps) {
  return (
    <div className="simulated-desktop" aria-label="练习桌面" role="group">
      <div className="desktop-icons" aria-label="桌面图标" role="group">
        {APPS.map((app) => <button aria-pressed={state.selectedIcon === app.id} className="desktop-icon" key={app.id} onClick={() => onAction({ type: "selectIcon", appId: app.id })} onDoubleClick={() => onAction({ type: "openWindow", appId: app.id })} type="button"><span>{app.icon}</span>{app.label}<small>双击打开</small></button>)}
      </div>
      <div className="desktop-open-buttons" aria-label="键盘打开程序" role="group">
        {APPS.map((app) => <button key={app.id} onClick={() => onAction({ type: "openWindow", appId: app.id })} type="button">打开{app.label}</button>)}
      </div>
      <section className="desktop-state-panel" aria-live="polite">
        <strong>窗口状态</strong>
        <span>前台窗口：{appName(state.focusedWindow)}</span>
        <span>已最小化：{state.minimizedWindows.length ? state.minimizedWindows.map(appName).join("、") : "无"}</span>
        <span>运行中：{state.openWindows.length} 个</span>
      </section>
      <div className="window-layer">
        {state.openWindows.filter((id) => !state.minimizedWindows.includes(id)).map((id) => {
          const app = APPS.find((item) => item.id === id)!;
          const foreground = state.focusedWindow === id;
          return <section className={`sim-window ${foreground ? "is-focused" : ""}`} key={id} onPointerDown={() => onAction({ type: "focusWindow", appId: id })} aria-label={`${app.label}窗口`}><header><button onClick={() => onAction({ type: "focusWindow", appId: id })} type="button">{app.icon} {app.label}标题栏</button><b>{foreground ? "前台窗口" : "后台窗口"}</b><span><button aria-label={`最小化${app.label}`} onClick={() => onAction({ type: "minimizeWindow", appId: id })} type="button">—</button><button aria-label={`关闭${app.label}`} onClick={() => onAction({ type: "closeWindow", appId: id })} type="button">×</button></span></header><div>{id === "notes" ? "今天我学会了管理窗口。" : "一张比特岛航线图。"}</div></section>;
        })}
      </div>
      <aside className="window-operation-history" aria-label="窗口操作历史"><strong>操作历史</strong><ol>{history.length ? history.slice(-4).map((item, index) => <li key={`${item}-${index}`}>{item}</li>) : <li>等待你的第一次操作</li>}</ol></aside>
      <nav className="sim-taskbar" aria-label="任务栏">{state.openWindows.map((id) => { const app = APPS.find((item) => item.id === id)!; const minimized = state.minimizedWindows.includes(id); return <button aria-pressed={state.focusedWindow === id} key={id} onClick={() => onAction({ type: minimized ? "restoreWindow" : "focusWindow", appId: id })} type="button">{app.icon} {app.label}{minimized ? "（已最小化）" : ""}</button>; })}</nav>
    </div>
  );
}
