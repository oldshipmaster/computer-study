"use client";

import { useState } from "react";
import { bubbleSortPass } from "@/lib/advanced-foundations/algorithms";
import { isRepeatedPointerActivation } from "@/lib/interaction-guard";

interface BubbleStep { leftIndex: number; rightIndex: number; before: [number, number]; after: [number, number]; swapped: boolean; }
function buildPassSteps(items: readonly number[]): BubbleStep[] {
  const working = [...items];
  return Array.from({ length: Math.max(0, working.length - 1) }, (_, leftIndex) => {
    const rightIndex = leftIndex + 1;
    const before: [number, number] = [working[leftIndex], working[rightIndex]];
    const swapped = before[0] > before[1];
    if (swapped) [working[leftIndex], working[rightIndex]] = [working[rightIndex], working[leftIndex]];
    return { leftIndex, rightIndex, before, after: [working[leftIndex], working[rightIndex]], swapped };
  });
}

export function SortLab({ onComplete }: { onComplete: () => void }) {
  const [values, setValues] = useState([4, 1, 3, 2]);
  const [passes, setPasses] = useState(0);
  const [lastTrace, setLastTrace] = useState<BubbleStep[]>([]);
  const [feedback, setFeedback] = useState("预测这一轮结束后的顺序。" );
  const sorted = values.every((value, index) => index === 0 || values[index - 1] <= value);
  const expected = bubbleSortPass(values).values;
  const options = [expected, values, [...values].sort((left, right) => right - left)].filter((option, index, all) => all.findIndex((candidate) => candidate.join() === option.join()) === index);

  function predict(option: number[], detail: number) {
    if (isRepeatedPointerActivation(detail)) return;
    if (option.join() !== expected.join()) { setFeedback("再想一想：一轮只比较相邻数字，并把较大的数逐步推向右边。" ); return; }
    setLastTrace(buildPassSteps(values));
    setValues(expected);
    setPasses((value) => value + 1);
    setFeedback("预测正确！较大的数字经过相邻交换向右移动。" );
  }

  return (
    <div className="advanced-lab sort-lab">
      <h2>排序机器人挑战</h2>
      <div aria-label="等待排序的数字" className="sort-values" role="list">{values.map((value, index) => <span key={`${index}-${value}`} role="listitem">{value}</span>)}</div>
      {lastTrace.length ? <ol aria-label="上一轮冒泡排序的相邻比较过程" className="bubble-pass-trace">{lastTrace.map((comparison, index) => <li className={comparison.swapped ? "comparison--swapped" : ""} key={`${passes}-${comparison.leftIndex}`}><small>相邻比较 {index + 1}</small><strong>{comparison.before.join(" ↔ ")}</strong><span>{comparison.swapped ? `交换 → ${comparison.after.join("、")}` : "顺序正确，不交换"}</span></li>)}<li className="bubble-settled"><small>本轮结果</small><strong>{lastTrace.at(-1)?.after[1]}</strong><span>较大的数冒到最右边</span></li></ol> : null}
      {!sorted ? <div aria-label="预测这一轮结束后的顺序" role="group">{options.map((option) => <button key={option.join()} onClick={(event) => predict(option, event.detail)} type="button">{option.join(" → ")}</button>)}</div> : null}
      <p aria-live="polite" role="status">{sorted ? `排序完成，共运行 ${passes} 轮。` : `${feedback} 已运行 ${passes} 轮；每轮从左到右比较相邻数字。`}</p>
      {sorted ? <button onClick={onComplete} type="button">完成排序任务</button> : null}
    </div>
  );
}
