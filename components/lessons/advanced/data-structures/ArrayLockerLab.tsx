"use client";

import { useState } from "react";
import { readArraySlot, updateArraySlot } from "@/lib/advanced-foundations/data-structures";

export function ArrayLockerLab({ onComplete }: { onComplete: () => void }) {
  const [lockers, setLockers] = useState(["贝壳", "星星", "地图", "钥匙"]);
  const [readIndex, setReadIndex] = useState<number | null>(null);
  const [updated, setUpdated] = useState(false);
  const [feedback, setFeedback] = useState("先读取索引 2。" );
  const selected = readIndex === null ? null : readArraySlot(lockers, readIndex);

  function inspect(index: number) {
    setReadIndex(index);
    setFeedback(index === 2 ? "读取正确：索引 2 是地图。现在选择要更新的索引。" : `读到了索引 ${index}，但任务要先读取索引 2。`);
  }

  function replaceSecondLocker(index: number) {
    if (readIndex !== 2) return;
    if (index !== 1) { setFeedback("这个索引不对。数组更新只会改变指定索引，题目要求索引 1。" ); return; }
    setLockers((items) => updateArraySlot(items, 1, "指南针"));
    setUpdated(true);
    setFeedback("更新成功：只有索引 1 变成指南针，其他位置保持原样。" );
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
      <p role="status">{selected ? `读到：${selected}。${feedback}` : feedback}</p>
      {!updated && readIndex === 2 ? <div role="group" aria-label="选择要更新的索引">{lockers.map((_, index) => <button key={index} onClick={() => replaceSecondLocker(index)} type="button">把索引 {index} 更新为指南针</button>)}</div> : updated ? <button onClick={onComplete} type="button">确认数组任务完成</button> : null}
    </div>
  );
}
