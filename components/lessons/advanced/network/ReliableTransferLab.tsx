"use client";

import { useState } from "react";
import { advanceReliableTransfer, assembleTransfer, createReliableTransfer } from "@/lib/advanced-foundations/systems-network";

export function ReliableTransferLab({ onComplete }: { onComplete: () => void }) {
  const [state, setState] = useState(() => createReliableTransfer(["比", "特", "岛"], 1));
  const assembled = assembleTransfer(state);
  function send(sequence: number) { setState((current) => advanceReliableTransfer(current, { type: "send", sequence })); }
  function timeout() { setState((current) => advanceReliableTransfer(current, { type: "timeout", sequence: 1 })); }
  return <div className="advanced-lab reliable-transfer-lab"><h2>可靠传输救援</h2><div aria-label="数据包从发送站前往接收站的状态" className="transfer-route" role="group"><strong>📡 发送站</strong><div className="transfer-packets">{state.chunks.map((chunk) => { const received = state.receivedSequences.includes(chunk.sequence); const lost = chunk.sequence === 1 && state.lossTriggered && !received; const status = received ? "received" : lost ? "lost" : "waiting"; return <span className={`transfer-packet packet--${status}`} key={chunk.sequence}><b>#{chunk.sequence}</b><small>{chunk.payload}</small><em>{received ? "已确认" : lost ? "途中丢失" : "等待发送"}</em></span>; })}</div><strong>🏝️ 接收站</strong></div><div aria-label="选择要发送的数据块" className="transfer-chunks" role="group">{state.chunks.map((chunk) => <button aria-pressed={state.receivedSequences.includes(chunk.sequence)} disabled={state.receivedSequences.includes(chunk.sequence)} key={chunk.sequence} onClick={() => send(chunk.sequence)} type="button">发送块 {chunk.sequence} · {chunk.payload}</button>)}</div><p aria-live="polite" role="status">{state.feedback} 已确认：{state.acknowledgements.join("、") || "无"}</p>{state.lossTriggered && !state.receivedSequences.includes(1) ? <button onClick={timeout} type="button">⏱️ 超时，重传块 1</button> : null}{assembled ? <div className="transfer-assembly"><p>按编号拼装：<strong>{assembled}</strong></p><button onClick={onComplete} type="button">完成可靠传输</button></div> : null}</div>;
}
