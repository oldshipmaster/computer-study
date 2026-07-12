import type { DesktopAction, DesktopAppId, DesktopState } from "@/lib/desktop-lesson";

interface SimulatedDesktopProps { state: DesktopState; onAction: (action: DesktopAction) => void; }
const APPS: Array<{ id: DesktopAppId; label: string; icon: string }> = [
  { id: "notes", label: "记事本", icon: "📝" },
  { id: "paint", label: "画图", icon: "🎨" },
];

export function SimulatedDesktop({ state, onAction }: SimulatedDesktopProps) {
  return (
    <div className="simulated-desktop" aria-label="练习桌面" role="group">
      <div className="desktop-icons" aria-label="桌面图标" role="group">
        {APPS.map((app) => <button aria-pressed={state.selectedIcon === app.id} className="desktop-icon" key={app.id} onClick={() => onAction({ type: "selectIcon", appId: app.id })} onDoubleClick={() => onAction({ type: "openWindow", appId: app.id })} type="button"><span>{app.icon}</span>{app.label}<small>双击打开</small></button>)}
      </div>
      <div className="desktop-open-buttons" aria-label="键盘打开程序" role="group">
        {APPS.map((app) => <button key={app.id} onClick={() => onAction({ type: "openWindow", appId: app.id })} type="button">打开{app.label}</button>)}
      </div>
      <div className="window-layer">
        {state.openWindows.filter((id) => !state.minimizedWindows.includes(id)).map((id) => {
          const app = APPS.find((item) => item.id === id)!;
          return <section className={`sim-window ${state.focusedWindow === id ? "is-focused" : ""}`} key={id} onPointerDown={() => onAction({ type: "focusWindow", appId: id })} aria-label={`${app.label}窗口`}><header><button onClick={() => onAction({ type: "focusWindow", appId: id })} type="button">{app.icon} {app.label}标题栏</button><span><button aria-label={`最小化${app.label}`} onClick={() => onAction({ type: "minimizeWindow", appId: id })} type="button">—</button><button aria-label={`关闭${app.label}`} onClick={() => onAction({ type: "closeWindow", appId: id })} type="button">×</button></span></header><div>{id === "notes" ? "今天我学会了管理窗口。" : "一张比特岛航线图。"}</div></section>;
        })}
      </div>
      <nav className="sim-taskbar" aria-label="任务栏">{state.openWindows.map((id) => { const app = APPS.find((item) => item.id === id)!; return <button aria-pressed={state.focusedWindow === id} key={id} onClick={() => onAction({ type: state.minimizedWindows.includes(id) ? "restoreWindow" : "focusWindow", appId: id })} type="button">{app.icon} {app.label}</button>; })}</nav>
    </div>
  );
}
