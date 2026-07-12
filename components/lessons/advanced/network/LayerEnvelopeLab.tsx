"use client";

import { useMemo, useState } from "react";
import { decapsulateMessage, encapsulateMessage } from "@/lib/advanced-foundations/systems-network";

const LABELS: Record<string, string> = { application: "应用层：内容类型", transport: "传输层：编号与确认", network: "网络层：源和目的地址", link: "链路层：下一站设备" };

export function LayerEnvelopeLab({ onComplete }: { onComplete: () => void }) {
  const packet = useMemo(() => encapsulateMessage("比特岛你好"), []);
  const removed = useMemo(() => decapsulateMessage(packet).removedLayers, [packet]);
  const [added, setAdded] = useState(0);
  const [opened, setOpened] = useState(0);
  const packing = added < packet.layers.length;
  const done = !packing && opened === removed.length;
  function next() { if (packing) setAdded((value) => value + 1); else setOpened((value) => value + 1); }
  const currentLabel = packing ? LABELS[packet.layers[added].name] : opened < removed.length ? `拆开${LABELS[removed[opened]]}` : "消息已交给应用";
  return <div className="advanced-lab layer-envelope-lab"><h2>网络分层信封挑战</h2><div className="layer-stack" role="list">{packet.layers.slice(0, added).map((layer) => <span key={layer.name} role="listitem">{LABELS[layer.name]}</span>)}</div><p role="status">{currentLabel}。已封装 {added}/4，已拆开 {opened}/4。</p>{done ? <button onClick={onComplete} type="button">完成分层收发</button> : <button onClick={next} type="button">{packing ? "装入下一层信封" : "在终点拆开一层"}</button>}</div>;
}
