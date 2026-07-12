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
      <div className="graph-node-map" role="group">{Object.keys(GRAPH).map((id) => <button aria-pressed={path.includes(id)} disabled={id !== current && (!GRAPH[current].includes(id) || path.includes(id))} key={id} onClick={(event) => travel(id, event.detail)} type="button">{LABELS[id]}</button>)}</div>
      <p role="status">路线：{path.map((id) => LABELS[id]).join(" → ")}。{complete ? `到达！最短路线需要 ${shortest.length - 1} 条边。` : "选择一个相邻节点。"}</p>
      {complete ? <button onClick={onComplete} type="button">完成航线任务</button> : path.length > 1 ? <button onClick={() => setPath(["harbor"])} type="button">重新规划</button> : null}
    </div>
  );
}
