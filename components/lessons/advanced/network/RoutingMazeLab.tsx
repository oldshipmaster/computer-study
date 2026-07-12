"use client";

import { useState } from "react";
import { shortestRoute, type WeightedGraph } from "@/lib/advanced-foundations/systems-network";

const NORMAL: WeightedGraph = { device: [{ to: "a", cost: 1 }, { to: "b", cost: 2 }], a: [{ to: "server", cost: 2 }], b: [{ to: "server", cost: 3 }], server: [] };
const BROKEN: WeightedGraph = { device: [{ to: "b", cost: 2 }], a: [], b: [{ to: "server", cost: 3 }], server: [] };
const LABELS: Record<string, string> = { device: "设备", a: "路由器 A", b: "路由器 B", server: "服务器" };

export function RoutingMazeLab({ onComplete }: { onComplete: () => void }) {
  const [broken, setBroken] = useState(false);
  const [checked, setChecked] = useState(false);
  const route = shortestRoute(broken ? BROKEN : NORMAL, "device", "server");
  function inspect() { if (!broken) setChecked(true); else onComplete(); }
  return <div className="advanced-lab routing-maze-lab"><h2>路由选择迷宫</h2><p className="route-path">{route.path.map((id) => LABELS[id]).join(" → ")}</p><p role="status">{broken ? `A 路线中断，改走可达路线，总代价 ${route.cost}。` : `当前最低代价是 ${route.cost}。路由器逐跳选择下一站。`}</p>{!checked ? <button onClick={inspect} type="button">确认最低代价路线</button> : !broken ? <button onClick={() => setBroken(true)} type="button">模拟路由器 A 链路中断</button> : <button onClick={inspect} type="button">完成重新路由</button>}</div>;
}
