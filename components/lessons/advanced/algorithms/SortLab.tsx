"use client";

import { useState } from "react";
import { bubbleSortPass } from "@/lib/advanced-foundations/algorithms";

export function SortLab({ onComplete }: { onComplete: () => void }) {
  const [values, setValues] = useState([4, 1, 3, 2]);
  const [passes, setPasses] = useState(0);
  const sorted = values.every((value, index) => index === 0 || values[index - 1] <= value);

  function runPass() {
    const result = bubbleSortPass(values);
    setValues(result.values);
    setPasses((value) => value + 1);
  }

  return (
    <div className="advanced-lab sort-lab">
      <h2>排序机器人挑战</h2>
      <div aria-label="等待排序的数字" className="sort-values" role="list">{values.map((value, index) => <span key={`${index}-${value}`} role="listitem">{value}</span>)}</div>
      <p role="status">{sorted ? `排序完成，共运行 ${passes} 轮。` : `已运行 ${passes} 轮；每轮从左到右比较相邻数字。`}</p>
      {sorted ? <button onClick={onComplete} type="button">完成排序任务</button> : <button onClick={runPass} type="button">运行一轮比较交换</button>}
    </div>
  );
}
