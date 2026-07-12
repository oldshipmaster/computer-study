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
  const nextId = TASKS.find((task) => !order.includes(task.id) && task.dependsOn.every((id) => order.includes(id)))?.id;

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
      <ol aria-label="任务依赖关系图" className="dependency-map">{TASKS.map((task, index) => { const done = order.includes(task.id); const ready = task.id === nextId; return <li aria-current={ready ? "step" : undefined} className={done ? "dependency-node--done" : ready ? "dependency-node--ready" : "dependency-node--blocked"} key={task.id}><small>步骤 {index + 1}</small><strong>{task.label}</strong><span>{task.dependsOn.length ? `依赖：${TASKS.find((item) => item.id === task.dependsOn[0])?.label}` : "没有前置依赖"}</span><em>{done ? "✓ 已完成" : ready ? "下一步 · 可以开始" : "🔒 等待依赖"}</em></li>; })}</ol>
      <div aria-label="安排下一项任务" role="group">{TASKS.map((task) => <button aria-pressed={order.includes(task.id)} disabled={order.includes(task.id)} key={task.id} onClick={() => choose(task.id)} type="button">{task.label}</button>)}</div>
      <p aria-live="polite" role="status">{feedback}</p>
      {complete ? <button onClick={onComplete} type="button">完成任务分解</button> : <button disabled={!order.length} onClick={() => { setOrder([]); setFeedback("顺序已清空，从目标重新开始。" ); }} type="button">重新安排</button>}
    </div>
  );
}
