"use client";

import { useState } from "react";
import { shortestRoute, type WeightedGraph } from "@/lib/advanced-foundations/systems-network";

const NORMAL: WeightedGraph = { device: [{ to: "a", cost: 1 }, { to: "b", cost: 2 }], a: [{ to: "server", cost: 2 }], b: [{ to: "server", cost: 3 }], server: [] };
const BROKEN: WeightedGraph = { device: [{ to: "b", cost: 2 }], a: [], b: [{ to: "server", cost: 3 }], server: [] };
const LABELS: Record<string, string> = { device: "设备", a: "路由器 A", b: "路由器 B", server: "服务器" };

export function RoutingMazeLab({ onComplete }: { onComplete: () => void }) {
  const [broken, setBroken] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [feedback, setFeedback] = useState("选择总代价最低的可达路线。" );
  const route = shortestRoute(broken ? BROKEN : NORMAL, "device", "server");
  const correctChoice = route.path[1];
  const solved = selected === correctChoice;
  function choose(id: string) {
    setSelected(id);
    if (broken && id === "a") { setFeedback("这条路线现在不可达：路由器 A 的链路已经中断。" ); return; }
    if (id !== correctChoice) { setFeedback("这条路线仍可到达，但总代价更高。把每段代价相加再比较。" ); return; }
    setFeedback(`选择正确：${route.path.map((node) => LABELS[node]).join(" → ")}，总代价 ${route.cost}。`);
  }
  function breakRoute() { setBroken(true); setSelected(null); setFeedback("A 路线中断了，排除不可达路线并重新选择。" ); }
  return <div className="advanced-lab routing-maze-lab"><h2>路由选择迷宫</h2><div className="routing-choice-map"><span>设备</span><span className={broken ? "is-broken" : ""}>A · 1 + 2 = 3</span><span>B · 2 + 3 = 5</span><span>服务器</span></div><div role="group" aria-label="选择总代价最低的可达路线"><button aria-pressed={selected === "a"} className={selected === "a" ? "route-choice--selected" : ""} onClick={() => choose("a")} type="button">设备 → A → 服务器</button><button aria-pressed={selected === "b"} className={selected === "b" ? "route-choice--selected" : ""} onClick={() => choose("b")} type="button">设备 → B → 服务器</button></div><p className="route-path">{solved ? route.path.map((id) => LABELS[id]).join(" → ") : "等待选择路线"}</p><p role="status">{feedback}</p>{solved && !broken ? <button onClick={breakRoute} type="button">模拟路由器 A 链路中断</button> : solved && broken ? <button onClick={onComplete} type="button">完成重新路由</button> : null}</div>;
}
