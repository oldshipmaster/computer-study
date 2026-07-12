"use client";

import { useState } from "react";
import { advanceReliableTransfer, assembleTransfer, createReliableTransfer } from "@/lib/advanced-foundations/systems-network";

export function ReliableTransferLab({ onComplete }: { onComplete: () => void }) {
  const [state, setState] = useState(() => createReliableTransfer(["比", "特", "岛"], 1));
  const [events, setEvents] = useState<string[]>([]);
  const [duplicateSeen, setDuplicateSeen] = useState(false);
  const assembled = assembleTransfer(state);
  function send(sequence: number) {
    const wasReceived = state.receivedSequences.includes(sequence);
    const next = advanceReliableTransfer(state, { type: "send", sequence });
    setState(next);
    setEvents((items) => [...items, next.feedback]);
    if (wasReceived) setDuplicateSeen(true);
  }
  function timeout() {
    const next = advanceReliableTransfer(state, { type: "timeout", sequence: 1 });
    setState(next);
    setEvents((items) => [...items, next.feedback]);
  }
  return (
    <div className="advanced-lab reliable-transfer-lab">
      <h2>可靠传输救援</h2>
      <p>每块都有序号；接收站收到后返回 ACK 确认。丢失就重传，重复块被忽略，最后按序号拼装。</p>
      <div aria-label="数据包从发送站前往接收站的状态" className="transfer-route" role="group"><strong>📡 发送站</strong><div className="transfer-packets">{state.chunks.map((chunk) => { const received = state.receivedSequences.includes(chunk.sequence); const lost = chunk.sequence === 1 && state.lossTriggered && !received; const status = received ? "received" : lost ? "lost" : "waiting"; return <span className={`transfer-packet packet--${status}`} key={chunk.sequence}><b>#{chunk.sequence}</b><small>{chunk.payload}</small><em>{received ? "已确认" : lost ? "途中丢失" : "等待发送"}</em></span>; })}</div><strong>🏝️ 接收站</strong></div>
      <div className="transfer-protocol-board">
        <section><h3>接收槽 · 按序号排列</h3><ol className="receiver-slots">{state.chunks.map((chunk) => { const received = state.receivedSequences.includes(chunk.sequence); return <li className={received ? "is-filled" : ""} key={chunk.sequence}><small>序号 {chunk.sequence}</small><strong>{received ? chunk.payload : "?"}</strong></li>; })}</ol></section>
        <section><h3>ACK 确认</h3><div className="ack-list">{state.acknowledgements.length ? state.acknowledgements.map((sequence) => <span key={sequence}>ACK {sequence} ←</span>) : <p>尚未返回确认</p>}</div></section>
      </div>
      <div aria-label="选择要发送的数据块" className="transfer-chunks" role="group">{state.chunks.map((chunk) => <button aria-pressed={state.receivedSequences.includes(chunk.sequence)} disabled={state.receivedSequences.includes(chunk.sequence)} key={chunk.sequence} onClick={() => send(chunk.sequence)} type="button">发送块 {chunk.sequence} · {chunk.payload}</button>)}</div>
      <p aria-live="polite" role="status">{state.feedback} 已确认：{state.acknowledgements.join("、") || "无"}</p>
      {state.lossTriggered && !state.receivedSequences.includes(1) ? <button onClick={timeout} type="button">⏱️ 超时，重传块 1</button> : null}
      {assembled && !duplicateSeen ? <button onClick={() => send(0)} type="button">模拟重复发送块 0</button> : null}
      <aside className="transfer-event-log"><strong>传输事件记录</strong>{events.length ? <ol>{events.map((event, index) => <li key={`${event}-${index}`}>{event}</li>)}</ol> : <p>发送数据后，事件会依次记录在这里。</p>}</aside>
      {assembled ? <div className="transfer-assembly"><p>按编号拼装：<strong>{assembled}</strong></p>{duplicateSeen ? <button onClick={onComplete} type="button">完成可靠传输</button> : <small>还要试一次重复包，观察接收站如何保护结果。</small>}</div> : null}
    </div>
  );
}
