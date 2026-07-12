"use client";

import { useMemo, useState } from "react";
import { decapsulateMessage, encapsulateMessage } from "@/lib/advanced-foundations/systems-network";

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
  function choose(name: string) {
    if (name !== expected) { setFeedback("顺序不对：发送从应用层向外包装，接收从最外层反向拆开。" ); return; }
    if (packing) { setAdded((value) => value + 1); setFeedback(`已加入${LABELS[name]}。`); }
    else { setOpened((value) => value + 1); setFeedback(`已拆开${LABELS[name]}。`); }
  }
  const currentLabel = packing ? LABELS[packet.layers[added].name] : opened < removed.length ? `拆开${LABELS[removed[opened]]}` : "消息已交给应用";
  const openedNames = new Set(removed.slice(0, opened));
  return <div className="advanced-lab layer-envelope-lab"><h2>网络分层信封挑战</h2><div className="layer-stack" role="list">{packet.layers.slice(0, added).map((layer) => <span className={openedNames.has(layer.name) ? "layer-envelope--opened" : ""} key={layer.name} role="listitem">{LABELS[layer.name]}</span>)}</div>{!done ? <div role="group" aria-label="选择下一层">{packet.layers.map((layer) => <button aria-pressed={openedNames.has(layer.name)} key={layer.name} onClick={() => choose(layer.name)} type="button">{packing ? "封装" : "拆开"}{LABELS[layer.name]}</button>)}</div> : null}<p role="status">{currentLabel}。{feedback} 已封装 {added}/4，已拆开 {opened}/4。</p>{done ? <button onClick={onComplete} type="button">完成分层收发</button> : null}</div>;
}
