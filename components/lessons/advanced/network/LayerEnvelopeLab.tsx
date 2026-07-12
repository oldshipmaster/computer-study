"use client";

import { useMemo, useState } from "react";
import { decapsulateMessage, encapsulateMessage } from "@/lib/advanced-foundations/systems-network";
import { isRepeatedPointerActivation } from "@/lib/interaction-guard";

const LABELS: Record<string, string> = { application: "应用层：内容类型", transport: "传输层：编号与确认", network: "网络层：源和目的地址", link: "链路层：下一站设备" };

export function LayerEnvelopeLab({ onComplete }: { onComplete: () => void }) {
  const packet = useMemo(() => encapsulateMessage("比特岛你好"), []);
  const removed = useMemo(() => decapsulateMessage(packet).removedLayers, [packet]);
  const [added, setAdded] = useState(0);
  const [opened, setOpened] = useState(0);
  const [feedback, setFeedback] = useState("选择下一层，按正确顺序完成封装。" );
  const packing = added < packet.layers.length;
  const done = !packing && opened === removed.length;
  const expected = packing ? packet.layers[added].name : removed[opened];
  function choose(name: string, detail: number) {
    if (isRepeatedPointerActivation(detail)) return;
    if (name !== expected) { setFeedback("顺序不对：发送从应用层向外包装，接收从最外层反向拆开。" ); return; }
    if (packing) { setAdded((value) => value + 1); setFeedback(`已加入${LABELS[name]}。`); }
    else { setOpened((value) => value + 1); setFeedback(`已拆开${LABELS[name]}。`); }
  }
  const currentLabel = packing ? LABELS[packet.layers[added].name] : opened < removed.length ? `拆开${LABELS[removed[opened]]}` : "消息已交给应用";
  const openedNames = new Set(removed.slice(0, opened));
  return <div className="advanced-lab layer-envelope-lab"><h2>网络分层信封挑战</h2><div className="layer-direction"><strong>📱 发送端</strong><span aria-hidden="true">封装 → 网络旅程 → 拆封</span><strong>💻 接收端</strong></div><div aria-label={`网络数据包，已封装 ${added} 层，已拆开 ${opened} 层`} className="nested-envelopes" role="img">{[...packet.layers].reverse().map((layer) => { const layerIndex = packet.layers.findIndex((item) => item.name === layer.name); const wrapped = layerIndex < added; const isOpened = openedNames.has(layer.name); const isCurrent = layer.name === expected; return <span className={`${wrapped ? "envelope--wrapped" : "envelope--waiting"}${isOpened ? " envelope--opened" : ""}${isCurrent ? " envelope--current" : ""}`} key={layer.name}><b>{LABELS[layer.name]}</b><small>{isOpened ? "接收端已读取" : wrapped ? "包裹在消息外面" : "等待加入"}</small></span>; })}<strong className="message-core">💬 消息核心：比特岛你好</strong></div>{!done ? <div aria-label="选择下一层" role="group">{packet.layers.map((layer) => <button aria-pressed={openedNames.has(layer.name)} key={layer.name} onClick={(event) => choose(layer.name, event.detail)} type="button">{packing ? "封装" : "拆开"}{LABELS[layer.name]}</button>)}</div> : null}<p aria-live="polite" role="status">{currentLabel}。{feedback} 已封装 {added}/4，已拆开 {opened}/4。</p>{done ? <button onClick={onComplete} type="button">完成分层收发</button> : null}</div>;
}
