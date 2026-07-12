import { getVisibleEntries, type FileHomeAction, type FileHomeState } from "@/lib/file-home-lesson";
interface Props { state: FileHomeState; onAction: (action: FileHomeAction) => void; }

export function VirtualFileExplorer({ state, onAction }: Props) {
  const entries = getVisibleEntries(state.path);
  return <section className="virtual-explorer" aria-label="虚拟文件浏览器">
    <header><button disabled={state.path.length === 0} onClick={() => onAction({ type: "goBack" })} type="button">← 上一级</button><button onClick={() => onAction({ type: "goRoot" })} type="button">⌂ 根目录</button><div className="file-address" aria-label={`当前位置 ${state.address}`} role="status">{state.address}</div></header>
    <div className="virtual-entry-grid">{entries.map((entry) => <button aria-pressed={state.selectedName === entry.name} className="virtual-entry" key={entry.name} onClick={() => onAction({ type: "select", name: entry.name })} onDoubleClick={() => onAction({ type: entry.kind === "folder" ? "openFolder" : "openFile", name: entry.name })} type="button"><span aria-hidden="true">{entry.icon}</span><strong>{entry.name}</strong><small>{entry.kind === "folder" ? "文件夹 · 双击进入" : "文件 · 双击打开"}</small></button>)}</div>
    <div className="file-keyboard-actions" aria-label="键盘操作" role="group">{entries.map((entry) => <button key={entry.name} onClick={() => onAction({ type: entry.kind === "folder" ? "openFolder" : "openFile", name: entry.name })} type="button">打开{entry.name}</button>)}</div>
    {state.openedFile ? <div className="file-preview" role="status"><span aria-hidden="true">🖼️</span><strong>已打开：{state.openedFile}</strong><p>这是虚拟预览，不会读取电脑中的文件。</p></div> : null}
  </section>;
}
