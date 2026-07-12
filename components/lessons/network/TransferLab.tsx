import { useState } from "react";
import { INITIAL_TRANSFER_STATE, updateTransfer, type TransferAction } from "@/lib/download-cloud-lesson";

interface Props { onComplete: () => void; }
const CONCEPTS = [
  { id: "download", label: "下载", explanation: "云端保留，同时建立本机副本" },
  { id: "edit", label: "修改", explanation: "先改变本机副本的版本" },
  { id: "upload", label: "上传", explanation: "把本机版本复制到云端" },
  { id: "sync", label: "同步", explanation: "让两端版本保持一致" },
  { id: "share", label: "共享", explanation: "改变访问权限，不搬走文件" },
];

export function TransferLab({ onComplete }: Props) {
  const [state, setState] = useState(INITIAL_TRANSFER_STATE);
  const [completed, setCompleted] = useState<string[]>([]);
  const [lastAction, setLastAction] = useState<TransferAction["type"] | "start">("start");

  function act(action: TransferAction) {
    const next = updateTransfer(state, action);
    setState(next);
    setLastAction(action.type);
    const done = new Set(completed);
    if (action.type === "download" && next.local.exists) done.add("download");
    if (action.type === "editLocal" && done.has("download")) done.add("edit");
    if (action.type === "upload" && next.cloud.version === next.local.version) done.add("upload");
    if (action.type === "sync" && next.cloud.version === next.local.version) done.add("sync");
    if (action.type === "share") done.add("share");
    const list = [...done];
    setCompleted(list);
    if (["download", "edit", "upload", "sync", "share"].every((item) => done.has(item))) onComplete();
  }

  const direction = lastAction === "download" ? "云端 → 本机" : lastAction === "upload" ? "本机 → 云端" : lastAction === "sync" ? "两端互相对齐" : lastAction === "share" ? "只改变访问权限" : lastAction === "editLocal" ? "修改本机副本" : "等待操作";
  return <div className="transfer-lab"><div className="copy-map"><section><span>💻</span><h2>本机副本</h2><p>{state.local.exists ? `第 ${state.local.version} 版` : "没有副本"}</p></section><b aria-label={`传输方向：${direction}`} className={lastAction === "start" ? "transfer-direction" : "transfer-direction transfer-direction--active"}>{lastAction === "download" ? "←" : lastAction === "upload" ? "→" : "⇄"}<small>{direction}</small></b><section><span>☁️</span><h2>云端副本</h2><p>{state.cloud.exists ? `第 ${state.cloud.version} 版` : "没有副本"}</p><small>访问权限：{state.sharedWith === "family" ? "仅家庭" : "未共享"}</small></section></div><ol aria-label="传输与共享概念" className="transfer-concepts">{CONCEPTS.map((concept) => <li className={completed.includes(concept.id) ? "is-complete" : ""} key={concept.id}><strong>{completed.includes(concept.id) ? "✓ " : ""}{concept.label}</strong><small>{concept.explanation}</small></li>)}</ol><div className="transfer-actions"><button onClick={() => act({ type: "download" })} type="button">下载到本机</button><button onClick={() => act({ type: "editLocal" })} type="button">修改本机副本</button><button onClick={() => act({ type: "upload" })} type="button">上传到云端</button><button onClick={() => act({ type: "sync" })} type="button">同步版本</button><button onClick={() => act({ type: "share", audience: "family" })} type="button">只与家庭共享</button></div><p aria-live="polite" role="status">{state.feedback} 已完成 {completed.length}/5 个概念。</p><aside>真实上传、下载和共享前要确认文件、服务和共享对象，并请家长帮助；本课不会进行真实传输。</aside></div>;
}
