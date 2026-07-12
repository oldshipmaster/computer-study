"use client";

import { useState } from "react";
import { readArraySlot, updateArraySlot } from "@/lib/advanced-foundations/data-structures";

export function ArrayLockerLab({ onComplete }: { onComplete: () => void }) {
  const [lockers, setLockers] = useState(["贝壳", "星星", "地图", "钥匙"]);
  const [readIndex, setReadIndex] = useState<number | null>(null);
  const [updated, setUpdated] = useState(false);
  const selected = readIndex === null ? null : readArraySlot(lockers, readIndex);

  function inspect(index: number) {
    setReadIndex(index);
  }

  function replaceSecondLocker() {
    if (readIndex !== 2) return;
    setLockers((items) => updateArraySlot(items, 1, "指南针"));
    setUpdated(true);
  }

  return (
    <div className="advanced-lab array-locker-lab">
      <h2>数组储物柜挑战</h2>
      <p>先读取索引 2，再把索引 1 更新为“指南针”。索引从 0 开始。</p>
      <div aria-label="四个连续数组位置" className="array-lockers" role="group">
        {lockers.map((item, index) => (
          <button aria-pressed={readIndex === index} key={`${index}-${item}`} onClick={() => inspect(index)} type="button">
            <small>索引 {index}</small><strong>{item}</strong>
          </button>
        ))}
      </div>
      <p role="status">{selected ? `读到：${selected}` : "还没有读取储物柜"}</p>
      {!updated ? <button disabled={readIndex !== 2} onClick={replaceSecondLocker} type="button">更新索引 1</button> : <button onClick={onComplete} type="button">确认数组任务完成</button>}
    </div>
  );
}
