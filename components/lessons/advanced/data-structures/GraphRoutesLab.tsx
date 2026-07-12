"use client";

import { useState } from "react";
import { findGraphPath } from "@/lib/advanced-foundations/data-structures";
import { isRepeatedPointerActivation } from "@/lib/interaction-guard";

const GRAPH: Record<string, string[]> = { harbor: ["forest", "lab"], forest: ["harbor", "tower"], lab: ["harbor", "tower"], tower: ["forest", "lab", "cave"], cave: ["tower"] };
const LABELS: Record<string, string> = { harbor: "港口", forest: "森林", lab: "实验室", tower: "灯塔", cave: "山洞" };

export function GraphRoutesLab({ onComplete }: { onComplete: () => void }) {
  const shortest = findGraphPath(GRAPH, "harbor", "cave");
  const [path, setPath] = useState(["harbor"]);
  const current = path.at(-1)!;
  const complete = current === "cave";

  function travel(id: string, detail: number) {
    if (isRepeatedPointerActivation(detail)) return;
    if (!GRAPH[current].includes(id) || path.includes(id)) return;
    setPath((items) => [...items, id]);
  }

  return (
    <div className="advanced-lab graph-routes-lab">
      <h2>图结构航线挑战</h2>
      <p>沿“边”从港口到山洞，不重复经过节点。</p>
      <div aria-label="图中连接的边" className="graph-edge-map" role="list"><span role="listitem">港口—森林</span><span role="listitem">港口—实验室</span><span role="listitem">森林—灯塔</span><span role="listitem">实验室—灯塔</span><span role="listitem">灯塔—山洞</span></div>
      <div aria-label="选择相邻节点" className="graph-node-map" role="group">{Object.keys(GRAPH).map((id) => { const reachable = GRAPH[current].includes(id) && !path.includes(id); return <button aria-current={id === current ? "step" : undefined} aria-pressed={path.includes(id)} className={id === current ? "graph-node--current" : reachable ? "graph-node--reachable" : ""} disabled={id !== current && !reachable} key={id} onClick={(event) => travel(id, event.detail)} type="button">{LABELS[id]}<small>{id === current ? "当前位置" : reachable ? "有边相连" : path.includes(id) ? "已经过" : "不可直达"}</small></button>; })}</div>
      <p role="status">路线：{path.map((id) => LABELS[id]).join(" → ")}。{complete ? `到达！最短路线需要 ${shortest.length - 1} 条边。` : "选择一个相邻节点。"}</p>
      {complete ? <button onClick={onComplete} type="button">完成航线任务</button> : path.length > 1 ? <button onClick={() => setPath(["harbor"])} type="button">重新规划</button> : null}
    </div>
  );
}
