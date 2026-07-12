"use client";

import { useState } from "react";
import { bubbleSortPass } from "@/lib/advanced-foundations/algorithms";

export function SortLab({ onComplete }: { onComplete: () => void }) {
  const [values, setValues] = useState([4, 1, 3, 2]);
  const [passes, setPasses] = useState(0);
  const [feedback, setFeedback] = useState("预测这一轮结束后的顺序。" );
  const sorted = values.every((value, index) => index === 0 || values[index - 1] <= value);
  const expected = bubbleSortPass(values).values;
  const options = [expected, values, [...values].sort((left, right) => right - left)].filter((option, index, all) => all.findIndex((candidate) => candidate.join() === option.join()) === index);

  function predict(option: number[]) {
    if (option.join() !== expected.join()) { setFeedback("再想一想：一轮只比较相邻数字，并把较大的数逐步推向右边。" ); return; }
    setValues(expected);
    setPasses((value) => value + 1);
    setFeedback("预测正确！较大的数字经过相邻交换向右移动。" );
  }

  return (
    <div className="advanced-lab sort-lab">
      <h2>排序机器人挑战</h2>
      <div aria-label="等待排序的数字" className="sort-values" role="list">{values.map((value, index) => <span key={`${index}-${value}`} role="listitem">{value}</span>)}</div>
      {!sorted ? <div aria-label="预测这一轮结束后的顺序" role="group">{options.map((option) => <button key={option.join()} onClick={() => predict(option)} type="button">{option.join(" → ")}</button>)}</div> : null}
      <p role="status">{sorted ? `排序完成，共运行 ${passes} 轮。` : `${feedback} 已运行 ${passes} 轮；每轮从左到右比较相邻数字。`}</p>
      {sorted ? <button onClick={onComplete} type="button">完成排序任务</button> : null}
    </div>
  );
}
