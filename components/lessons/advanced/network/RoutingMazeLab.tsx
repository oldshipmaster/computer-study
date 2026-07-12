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
  function breakRoute() { setBroken(true); setSelected(null); setFeedback("A 路线中断了，重新计算可达路线并选择下一条最短路。" ); }
  return (
    <div className="advanced-lab routing-maze-lab">
      <h2>路由选择迷宫</h2>
      <p>每条线旁的数字是链路成本。把同一路线的两段成本相加，再排除断掉的线。</p>
      <div className="network-route-diagram" aria-label="设备到服务器有上下两条候选路线">
        <span className="route-node route-node--device">💻<b>设备</b></span>
        <div className={`route-lane route-lane--a ${selected === "a" ? "is-selected" : ""} ${broken ? "is-broken" : ""}`}>
          <span className="route-edge"><small>链路成本 1</small></span>
          <span className="route-node">📡<b>路由器 A</b></span>
          <span className="route-edge"><small>链路成本 2</small></span>
          {selected === "a" && <span className="route-packet" aria-label="数据包正在走这条路">📦</span>}
        </div>
        <div className={`route-lane route-lane--b ${selected === "b" ? "is-selected" : ""}`}>
          <span className="route-edge"><small>链路成本 2</small></span>
          <span className="route-node">📡<b>路由器 B</b></span>
          <span className="route-edge"><small>链路成本 3</small></span>
          {selected === "b" && <span className="route-packet" aria-label="数据包正在走这条路">📦</span>}
        </div>
        <span className="route-node route-node--server">🗄️<b>服务器</b></span>
      </div>
      <div className="route-cost-summary" aria-label="候选路线成本"><span className={broken ? "is-broken" : ""}>A 路线：1 + 2 = <strong>3</strong></span><span>B 路线：2 + 3 = <strong>5</strong></span></div>
      <div role="group" aria-label="选择总代价最低的可达路线"><button aria-pressed={selected === "a"} className={selected === "a" ? "route-choice--selected" : ""} onClick={() => choose("a")} type="button">设备 → A → 服务器</button><button aria-pressed={selected === "b"} className={selected === "b" ? "route-choice--selected" : ""} onClick={() => choose("b")} type="button">设备 → B → 服务器</button></div>
      <p className="route-path">{solved ? route.path.map((id) => LABELS[id]).join(" → ") : "等待选择路线"}</p>
      <p role="status">{feedback}</p>
      {solved && !broken ? <button onClick={breakRoute} type="button">模拟路由器 A 链路中断</button> : solved && broken ? <button onClick={onComplete} type="button">完成重新路由</button> : null}
    </div>
  );
}
