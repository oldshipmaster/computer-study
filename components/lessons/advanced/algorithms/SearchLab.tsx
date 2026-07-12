"use client";

import { useMemo, useState } from "react";
import { binarySearchTrace, linearSearchTrace } from "@/lib/advanced-foundations/algorithms";

const ITEMS = [1, 3, 5, 7, 9, 11, 13, 15];

export function SearchLab({ onComplete, strategy }: { onComplete: () => void; strategy: "linear" | "binary" }) {
  const trace = useMemo(() => strategy === "linear" ? linearSearchTrace(ITEMS, 11) : binarySearchTrace(ITEMS, 11), [strategy]);
  const [step, setStep] = useState(0);
  const checked = trace.checkedIndexes.slice(0, step);
  const done = step >= trace.checkedIndexes.length;

  return (
    <div className="advanced-lab search-trace-lab">
      <h2>{strategy === "linear" ? "顺序查找" : "二分查找"}挑战</h2>
      <p>目标数字：11</p>
      <div aria-label="排好序的数字" className="search-items" role="group">{ITEMS.map((value, index) => <span className={checked.includes(index) ? "is-checked" : ""} key={value}>{value}</span>)}</div>
      <p role="status">{done ? `找到索引 ${trace.foundIndex}，共检查 ${trace.checkedIndexes.length} 次。` : step === 0 ? "先预测会检查哪个位置。" : `刚检查索引 ${checked.at(-1)}，继续缩小范围。`}</p>
      {done ? <button onClick={onComplete} type="button">完成查找任务</button> : <button onClick={() => setStep((value) => value + 1)} type="button">检查下一步</button>}
    </div>
  );
}
