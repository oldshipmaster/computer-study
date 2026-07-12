import { useState } from "react";
import { INITIAL_TRANSFER_STATE, updateTransfer, type TransferAction } from "@/lib/download-cloud-lesson";
import "./TransferLab.css";

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
  const [phase, setPhase] = useState(0);
  const [completed, setCompleted] = useState<string[]>([]);
  const [lastAction, setLastAction] = useState<TransferAction["type"] | "start">("start");
  const [history, setHistory] = useState<string[]>([]);

  function act(action: TransferAction, concept?: string) {
    const next = updateTransfer(state, action);
    setState(next);
    setLastAction(action.type);
    setPhase((value) => value + 1);
    if (concept) setCompleted((items) => items.includes(concept) ? items : [...items, concept]);
    setHistory((items) => [...items, next.feedback]);
  }

  const direction = lastAction === "download" ? "云端 → 本机" : lastAction === "upload" ? "本机 → 云端" : lastAction === "sync" ? "两端互相对齐" : lastAction === "share" ? "只改变访问权限" : lastAction === "editLocal" ? "修改本机副本" : "等待操作";
  const versionsDiffer = state.local.exists && state.local.version !== state.cloud.version;
  return (
    <div className="transfer-lab">
      <div className="copy-map"><section><span>💻</span><h2>本机副本</h2><p>{state.local.exists ? `第 ${state.local.version} 版` : "没有副本"}</p></section><b aria-label={`传输方向：${direction}`} className={lastAction === "start" ? "transfer-direction" : "transfer-direction transfer-direction--active"}>{lastAction === "download" ? "←" : lastAction === "upload" ? "→" : "⇄"}<small>{direction}</small></b><section><span>☁️</span><h2>云端副本</h2><p>{state.cloud.exists ? `第 ${state.cloud.version} 版` : "没有副本"}</p><small>访问权限：{state.sharedWith === "family" ? "仅家庭" : "未共享"}</small></section></div>
      <p className={`version-comparison ${versionsDiffer ? "has-conflict" : ""}`}>{versionsDiffer ? `⚠️ 版本不同：本机第 ${state.local.version} 版，云端第 ${state.cloud.version} 版` : state.local.exists ? `✓ 两端都是第 ${state.local.version} 版` : "本机还没有副本"}</p>
      <ol aria-label="传输与共享概念" className="transfer-concepts">{CONCEPTS.map((concept) => <li className={completed.includes(concept.id) ? "is-complete" : ""} key={concept.id}><strong>{completed.includes(concept.id) ? "✓ " : ""}{concept.label}</strong><small>{concept.explanation}</small></li>)}</ol>
      <ol className="transfer-journey" aria-label="云端副本实验步骤">{["下载", "修改", "上传", "再次修改", "同步", "共享"].map((label, index) => <li className={index < phase ? "is-done" : index === phase ? "is-current" : ""} key={label}>{index + 1}. {label}</li>)}</ol>
      <div className="transfer-actions"><button disabled={phase !== 0} onClick={() => act({ type: "download" }, "download")} type="button">下载到本机</button><button disabled={phase !== 1} onClick={() => act({ type: "editLocal" }, "edit")} type="button">修改本机副本</button><button disabled={phase !== 2} onClick={() => act({ type: "upload" }, "upload")} type="button">上传到云端</button><button disabled={phase !== 3} onClick={() => act({ type: "editLocal" })} type="button">再次修改，制造版本差</button><button disabled={phase !== 4} onClick={() => act({ type: "sync" }, "sync")} type="button">同步版本</button><button disabled={phase !== 5} onClick={() => act({ type: "share", audience: "family" }, "share")} type="button">只与家庭共享</button></div>
      <p aria-live="polite" role="status">{state.feedback} 已完成 {completed.length}/5 个概念。</p>
      <aside className="transfer-history"><strong>副本与版本记录</strong>{history.length ? <ol>{history.map((item, index) => <li key={`${item}-${index}`}>{item}</li>)}</ol> : <p>开始下载后，每次副本变化会记录在这里。</p>}</aside>
      {phase === 6 ? <section className="transfer-finish"><span aria-hidden="true">💻☁️✨</span><h2>两端版本与权限都清楚了</h2><button className="primary-action" onClick={onComplete} type="button">完成云端副本实验</button></section> : null}
      <aside>真实上传、下载和共享前要确认文件、服务和共享对象，并请家长帮助；本课不会进行真实传输。</aside>
    </div>
  );
}
