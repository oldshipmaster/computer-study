"use client";

import { useState } from "react";
import { findTreePath } from "@/lib/advanced-foundations/data-structures";
import { isRepeatedPointerActivation } from "@/lib/interaction-guard";

const TREE: Record<string, string[]> = { library: ["science", "stories"], science: ["space", "animals"], stories: ["adventure"], space: [], animals: [], adventure: [] };
const LABELS: Record<string, string> = { library: "图书馆", science: "科学", stories: "故事", space: "太空", animals: "动物", adventure: "冒险" };

export function TreeLibraryLab({ onComplete }: { onComplete: () => void }) {
  const targetPath = findTreePath(TREE, "library", "space");
  const [path, setPath] = useState(["library"]);
  const current = path.at(-1)!;
  const complete = path.join("/") === targetPath.join("/");

  function choose(id: string, detail: number) {
    if (isRepeatedPointerActivation(detail)) return;
    if (!TREE[current].includes(id)) return;
    setPath((items) => [...items, id]);
  }

  return (
    <div className="advanced-lab tree-library-lab">
      <h2>树形图书馆挑战</h2>
      <p>从根节点找到“太空”叶节点。</p>
      <div aria-label="图书馆树：一个根节点、两个分类节点和三个叶节点" className="tree-structure" role="tree"><span aria-current={current === "library" ? "true" : undefined} className={current === "library" ? "tree-node--current" : ""} role="treeitem">🏛️ 图书馆<small>根节点</small></span><div role="group"><span aria-current={current === "science" ? "true" : undefined} className={current === "science" ? "tree-node--current" : ""} role="treeitem">🔬 科学<small>分类节点</small></span><span aria-current={current === "stories" ? "true" : undefined} className={current === "stories" ? "tree-node--current" : ""} role="treeitem">📚 故事<small>分类节点</small></span></div><div role="group"><span aria-current={current === "space" ? "true" : undefined} className={current === "space" ? "tree-node--current" : ""} role="treeitem">🚀 太空<small>叶节点</small></span><span aria-current={current === "animals" ? "true" : undefined} className={current === "animals" ? "tree-node--current" : ""} role="treeitem">🐾 动物<small>叶节点</small></span><span aria-current={current === "adventure" ? "true" : undefined} className={current === "adventure" ? "tree-node--current" : ""} role="treeitem">🧭 冒险<small>叶节点</small></span></div></div>
      <p className="tree-breadcrumb">{path.map((id) => LABELS[id]).join(" → ")}</p>
      <div aria-label={`当前节点：${LABELS[current]}`} role="group">{TREE[current].map((id) => <button key={id} onClick={(event) => choose(id, event.detail)} type="button">进入 {LABELS[id]}</button>)}</div>
      <p role="status">{complete ? "找到太空叶节点！这条路径经过根、分类和叶节点。" : `正在 ${LABELS[current]}，请选择一个子节点。`}</p>
      {complete ? <button onClick={onComplete} type="button">完成树形查找</button> : path.length > 1 ? <button onClick={() => setPath(["library"])} type="button">回到根节点</button> : null}
    </div>
  );
}
