"use client";

import { useState } from "react";
import { advanceReliableTransfer, assembleTransfer, createReliableTransfer } from "@/lib/advanced-foundations/systems-network";

export function ReliableTransferLab({ onComplete }: { onComplete: () => void }) {
  const [state, setState] = useState(() => createReliableTransfer(["比", "特", "岛"], 1));
  const assembled = assembleTransfer(state);
  function send(sequence: number) { setState((current) => advanceReliableTransfer(current, { type: "send", sequence })); }
  function timeout() { setState((current) => advanceReliableTransfer(current, { type: "timeout", sequence: 1 })); }
  return <div className="advanced-lab reliable-transfer-lab"><h2>可靠传输救援</h2><div className="transfer-chunks" role="group">{state.chunks.map((chunk) => <button aria-pressed={state.receivedSequences.includes(chunk.sequence)} disabled={state.receivedSequences.includes(chunk.sequence)} key={chunk.sequence} onClick={() => send(chunk.sequence)} type="button">块 {chunk.sequence} · {chunk.payload}</button>)}</div><p role="status">{state.feedback} 已确认：{state.acknowledgements.join("、") || "无"}</p>{state.lossTriggered && !state.receivedSequences.includes(1) ? <button onClick={timeout} type="button">超时，重传块 1</button> : null}{assembled ? <div><p>按编号拼装：{assembled}</p><button onClick={onComplete} type="button">完成可靠传输</button></div> : null}</div>;
}
