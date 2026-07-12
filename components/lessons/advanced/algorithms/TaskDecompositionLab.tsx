"use client";

import { useState } from "react";
import { validateTaskOrder } from "@/lib/advanced-foundations/algorithms";

const TASKS = [
  { id: "goal", label: "确定任务目标", dependsOn: [] },
  { id: "parts", label: "拆成三个小任务", dependsOn: ["goal"] },
  { id: "build", label: "分别完成小任务", dependsOn: ["parts"] },
  { id: "check", label: "组合并检查结果", dependsOn: ["build"] },
];

export function TaskDecompositionLab({ onComplete }: { onComplete: () => void }) {
  const [order, setOrder] = useState<string[]>([]);
  const [feedback, setFeedback] = useState("先选择没有依赖的任务。" );
  const complete = validateTaskOrder(TASKS, order).valid;

  function choose(id: string) {
    if (order.includes(id)) return;
    const proposed = [...order, id];
    const result = validateTaskOrder(TASKS, proposed);
    if (result.blockedTaskId) {
      setFeedback("这个任务还在等待前一步，先检查它依赖什么。" );
      return;
    }
    setOrder(proposed);
    setFeedback(`顺序可执行：已安排 ${proposed.length}/${TASKS.length} 项。`);
  }

  return (
    <div className="advanced-lab task-decomposition-lab">
      <h2>拆分任务工坊挑战</h2>
      <div role="group">{TASKS.map((task) => <button aria-pressed={order.includes(task.id)} disabled={order.includes(task.id)} key={task.id} onClick={() => choose(task.id)} type="button">{task.label}</button>)}</div>
      <ol>{order.map((id) => <li key={id}>{TASKS.find((task) => task.id === id)?.label}</li>)}</ol>
      <p role="status">{feedback}</p>
      {complete ? <button onClick={onComplete} type="button">完成任务分解</button> : <button disabled={!order.length} onClick={() => { setOrder([]); setFeedback("顺序已清空，从目标重新开始。" ); }} type="button">重新安排</button>}
    </div>
  );
}
