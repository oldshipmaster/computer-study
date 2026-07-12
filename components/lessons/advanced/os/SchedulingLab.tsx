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
  return <div className="advanced-lab scheduling-lab"><h2>CPU 调度转盘挑战</h2><div aria-label={`轮转调度器，调度指针下一站是 ${expectedTaskId ?? "完成"}`} className="schedule-turntable" role="img"><strong className="schedule-cpu">CPU</strong>{tasks.map((task) => <span className={`${task.id === expectedTaskId ? "schedule-task--next" : ""}${task.remaining === 0 ? " schedule-task--done" : ""}`} key={task.id}><b>{task.id}</b><small>{task.id === expectedTaskId ? "调度指针 → 下一位" : task.remaining === 0 ? "已完成" : "等待轮转"}</small><i aria-label={`剩余 ${task.remaining} 个时间片`}>{Array.from({ length: 3 }, (_, index) => <em className={index < task.remaining ? "time-slice" : "time-slice time-slice--used"} key={index} />)}</i></span>)}</div><div aria-label="预测下一个获得 CPU 的任务" className="schedule-tasks" role="group">{tasks.map((task) => <button disabled={task.remaining === 0 || complete} key={task.id} onClick={(event) => choose(task.id, event.detail)} type="button"><strong>{task.id}</strong><span>剩余 {task.remaining} 个时间片</span></button>)}</div><div aria-label="CPU 执行历史" className="schedule-history" role="list">{history.length ? history.map((id, index) => <span key={`${id}-${index}`} role="listitem"><small>时间片 {index + 1}</small>{id}</span>) : <span role="listitem">等待第一个时间片</span>}</div><p aria-live="polite" role="status">{feedback} 执行记录：{history.length ? history.join(" → ") : "还没有任务获得 CPU"}</p>{complete ? <button onClick={onComplete} type="button">完成公平调度</button> : null}</div>;
}
