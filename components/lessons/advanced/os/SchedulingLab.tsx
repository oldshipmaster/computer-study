"use client";

import { useState } from "react";
import { runRoundRobinTick, type ScheduledTask } from "@/lib/advanced-foundations/operating-system";
import { isRepeatedPointerActivation } from "@/lib/interaction-guard";

const START: ScheduledTask[] = [{ id: "画图", remaining: 3 }, { id: "音乐", remaining: 2 }, { id: "打印", remaining: 1 }];

export function SchedulingLab({ onComplete }: { onComplete: () => void }) {
  const [tasks, setTasks] = useState(START);
  const [cursor, setCursor] = useState(0);
  const [history, setHistory] = useState<string[]>([]);
  const [feedback, setFeedback] = useState("预测下一个获得 CPU 的任务。" );
  const complete = tasks.every((task) => task.remaining === 0);
  const preview = runRoundRobinTick(tasks, cursor);
  const expectedTaskId = preview.runningId;
  function choose(id: string, detail: number) {
    if (isRepeatedPointerActivation(detail)) return;
    if (id !== expectedTaskId) { setFeedback("还没轮到这个任务：时间片结束后要从队列下一位继续。" ); return; }
    setTasks(preview.tasks); setCursor(preview.nextCursor); setHistory((items) => [...items, id]); setFeedback(`${id} 获得一个时间片，然后调度指针继续向后。`);
  }
  return <div className="advanced-lab scheduling-lab"><h2>CPU 调度转盘挑战</h2><div className="schedule-tasks" role="group" aria-label="预测下一个获得 CPU 的任务">{tasks.map((task) => <button disabled={task.remaining === 0 || complete} key={task.id} onClick={(event) => choose(task.id, event.detail)} type="button"><strong>{task.id}</strong><span>剩余 {task.remaining} 个时间片</span></button>)}</div><p role="status">{feedback} 执行记录：{history.length ? history.join(" → ") : "还没有任务获得 CPU"}</p>{complete ? <button onClick={onComplete} type="button">完成公平调度</button> : null}</div>;
}
