import { useState } from "react";
import type { MoveCopyAction, MoveCopyState } from "@/lib/move-copy-lesson";
interface Props { state: MoveCopyState; onAction: (action: MoveCopyAction) => void; }
const FOLDERS = ["收件箱", "今日作业", "图片"];

export function MoveCopyWorkspace({ state, onAction }: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  return <div className="move-copy-workspace"><div className="file-command-bar"><button disabled={!selectedId} onClick={() => selectedId && onAction({ type: "copy", fileId: selectedId })} type="button">复制</button><button disabled={!selectedId} onClick={() => selectedId && onAction({ type: "cut", fileId: selectedId })} type="button">剪切</button><button disabled={!state.previousFiles} onClick={() => onAction({ type: "undo" })} type="button">↶ 撤销</button><span role="status">{state.clipboard ? `${state.clipboard.mode === "copy" ? "已复制" : "已剪切"}，请选择目标文件夹` : "先选择一个文件"}</span></div><div className="folder-board">{FOLDERS.map((folder) => <section key={folder} aria-label={folder}><header>📁 {folder}<button disabled={!state.clipboard} onClick={() => onAction({ type: "paste", folder })} type="button">粘贴到这里</button></header><div>{state.files.filter((file) => file.folder === folder).map((file) => <button aria-pressed={selectedId === file.id} className="movable-file" key={file.id} onClick={() => setSelectedId(file.id)} type="button"><span>{file.icon}</span>{file.name}</button>)}</div></section>)}</div></div>;
}
