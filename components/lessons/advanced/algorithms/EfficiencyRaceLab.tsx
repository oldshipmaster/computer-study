"use client";

import { useState } from "react";
import { compareSearchCosts } from "@/lib/advanced-foundations/algorithms";

const SIZES = [8, 16, 32, 64];

export function EfficiencyRaceLab({ onComplete }: { onComplete: () => void }) {
  const [seen, setSeen] = useState<number[]>([]);
  const [currentSize, setCurrentSize] = useState(8);
  const costs = compareSearchCosts(currentSize);
  const complete = seen.length === SIZES.length;

  function inspect(size: number) {
    setCurrentSize(size);
    setSeen((items) => items.includes(size) ? items : [...items, size]);
  }

  return (
    <div className="advanced-lab efficiency-race-lab">
      <h2>算法效率赛</h2>
      <div role="group">{SIZES.map((size) => <button aria-pressed={seen.includes(size)} key={size} onClick={() => inspect(size)} type="button">{size} 项</button>)}</div>
      <div aria-label={`${currentSize} 项数据最多需要的比较次数`} className="efficiency-bars" role="group"><label><span>🐢 顺序查找：最多 {costs.linear} 次</span><meter aria-label={`顺序查找 ${costs.linear} 次`} max={currentSize} min="0" value={costs.linear} /></label><label><span>🐇 二分查找：最多 {costs.binary} 次</span><meter aria-label={`二分查找 ${costs.binary} 次`} max={currentSize} min="0" value={costs.binary} /></label></div>
      <p role="status">已比较 {seen.length}/{SIZES.length} 种数据量。{currentSize >= 32 ? "数据越多，二分查找的增长越慢。" : "继续增加数据量观察差距。"}</p>
      {complete ? <button onClick={onComplete} type="button">完成效率比较</button> : null}
    </div>
  );
}
