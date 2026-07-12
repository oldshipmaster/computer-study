"use client";

import { useMemo, useState } from "react";
import { binarySearchTrace, linearSearchTrace } from "@/lib/advanced-foundations/algorithms";

const ITEMS = [1, 3, 5, 7, 9, 11, 13, 15];

export function SearchLab({ onComplete, strategy }: { onComplete: () => void; strategy: "linear" | "binary" }) {
  const trace = useMemo(() => strategy === "linear" ? linearSearchTrace(ITEMS, 11) : binarySearchTrace(ITEMS, 11), [strategy]);
  const [step, setStep] = useState(0);
  const [feedback, setFeedback] = useState("预测下一次检查哪个索引。" );
  const checked = trace.checkedIndexes.slice(0, step);
  const done = step >= trace.checkedIndexes.length;
  const expectedIndex = trace.checkedIndexes[step];

  function predict(index: number) {
    if (index !== expectedIndex) {
      setFeedback("这个位置还不是算法的下一步。想想它从哪里开始、怎样缩小范围。" );
      return;
    }
    setStep((value) => value + 1);
    setFeedback(index === trace.foundIndex ? `找到目标！索引 ${index}。` : `索引 ${index} 不是目标，继续预测下一步。`);
  }

  return (
    <div className="advanced-lab search-trace-lab">
      <h2>{strategy === "linear" ? "顺序查找" : "二分查找"}挑战</h2>
      <p>目标数字：11</p>
      <div aria-label="预测下一次检查哪个索引" className="search-items" role="group">{ITEMS.map((value, index) => <button aria-pressed={checked.includes(index)} className={checked.includes(index) ? "is-checked" : ""} disabled={checked.includes(index) || done} key={value} onClick={() => predict(index)} type="button"><small>索引 {index}</small>{value}</button>)}</div>
      <p role="status">{done ? `找到索引 ${trace.foundIndex}，共检查 ${trace.checkedIndexes.length} 次。` : feedback}</p>
      {done ? <button onClick={onComplete} type="button">完成查找任务</button> : null}
    </div>
  );
}
