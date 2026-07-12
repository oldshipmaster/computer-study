"use client";

import { useMemo, useState } from "react";
import { binarySearchTrace, linearSearchTrace } from "@/lib/advanced-foundations/algorithms";
import { isRepeatedPointerActivation } from "@/lib/interaction-guard";

const ITEMS = [1, 3, 5, 7, 9, 11, 13, 15];

export function SearchLab({ onComplete, strategy }: { onComplete: () => void; strategy: "linear" | "binary" }) {
  const linearTrace = useMemo(() => linearSearchTrace(ITEMS, 11), []);
  const binaryTrace = useMemo(() => binarySearchTrace(ITEMS, 11), []);
  const trace = strategy === "linear" ? linearTrace : binaryTrace;
  const [step, setStep] = useState(0);
  const [feedback, setFeedback] = useState("预测下一次检查哪个索引。" );
  const checked = trace.checkedIndexes.slice(0, step);
  const done = step >= trace.checkedIndexes.length;
  const expectedIndex = trace.checkedIndexes[step];
  const lastChecked = checked.at(-1);
  const currentRange = strategy === "binary" ? binaryTrace.ranges[Math.min(step, binaryTrace.ranges.length - 1)] : [Math.min(step, ITEMS.length - 1), ITEMS.length - 1];

  function predict(index: number, detail: number) {
    if (isRepeatedPointerActivation(detail)) return;
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
      {strategy === "binary" ? <div aria-label={`二分查找候选区间从索引 ${currentRange[0]} 到 ${currentRange[1]}`} className="binary-range" role="status"><strong>候选区间：索引 {currentRange[0]}–{currentRange[1]}</strong><span>还剩 {currentRange[1] - currentRange[0] + 1} 项</span><small>选择区间中间位置；比较后排除不可能的一半。</small></div> : null}
      <div aria-label="预测下一次检查哪个索引" className="search-items" role="group">{ITEMS.map((value, index) => { const excluded = strategy === "binary" && (index < currentRange[0] || index > currentRange[1]); const classes = [checked.includes(index) ? "is-checked" : "", excluded ? "search-item--excluded" : "", index === lastChecked ? "search-item--midpoint" : ""].filter(Boolean).join(" "); return <button aria-pressed={checked.includes(index)} className={classes} disabled={checked.includes(index) || excluded || done} key={value} onClick={(event) => predict(index, event.detail)} type="button"><small>索引 {index}</small>{value}{excluded ? <em>已排除</em> : index === lastChecked ? <em>上次中间位置</em> : null}</button>; })}</div>
      <p aria-live="polite" role="status">{done ? `找到索引 ${trace.foundIndex}，共检查 ${trace.checkedIndexes.length} 次。` : feedback}</p>
      {done ? <button onClick={onComplete} type="button">完成查找任务</button> : null}
    </div>
  );
}
