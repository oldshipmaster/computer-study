"use client";

import { useState } from "react";
import { runRoundRobinTick, type ScheduledTask } from "@/lib/advanced-foundations/operating-system";

const START: ScheduledTask[] = [{ id: "画图", remaining: 3 }, { id: "音乐", remaining: 2 }, { id: "打印", remaining: 1 }];

export function SchedulingLab({ onComplete }: { onComplete: () => void }) {
  const [tasks, setTasks] = useState(START);
  const [cursor, setCursor] = useState(0);
  const [history, setHistory] = useState<string[]>([]);
  const complete = tasks.every((task) => task.remaining === 0);
  function tick() { const next = runRoundRobinTick(tasks, cursor); setTasks(next.tasks); setCursor(next.nextCursor); if (next.runningId) setHistory((items) => [...items, next.runningId]); }
  return <div className="advanced-lab scheduling-lab"><h2>CPU 调度转盘挑战</h2><div className="schedule-tasks">{tasks.map((task) => <p key={task.id}><strong>{task.id}</strong><span>剩余 {task.remaining} 个时间片</span></p>)}</div><p role="status">执行记录：{history.length ? history.join(" → ") : "还没有任务获得 CPU"}</p>{complete ? <button onClick={onComplete} type="button">完成公平调度</button> : <button onClick={tick} type="button">转动一个时间片</button>}</div>;
}
