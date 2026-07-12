"use client";

import { useState } from "react";
import { applyQueueAction, applyStackAction } from "@/lib/advanced-foundations/data-structures";

export function StackQueueLab({ onComplete }: { onComplete: () => void }) {
  const [stack, setStack] = useState(["红盘", "蓝盘", "黄盘"]);
  const [queue, setQueue] = useState(["海豚号", "星星号", "灯塔号"]);
  const [stackDone, setStackDone] = useState(false);
  const [queueDone, setQueueDone] = useState(false);

  function popStack() {
    const next = applyStackAction(stack, { type: "pop" });
    setStack(next.items);
    setStackDone(next.removed === "黄盘");
  }

  function dequeueShip() {
    const next = applyQueueAction(queue, { type: "dequeue" });
    setQueue(next.items);
    setQueueDone(next.removed === "海豚号");
  }

  return (
    <div className="advanced-lab stack-queue-lab">
      <h2>栈与队列码头挑战</h2>
      <div className="stack-queue-columns">
        <section><h3>盘子栈</h3><ol>{stack.map((item) => <li key={item}>{item}</li>)}</ol><button disabled={stackDone} onClick={popStack} type="button">从顶部取盘子</button></section>
        <section><h3>候船队列</h3><ol>{queue.map((item) => <li key={item}>{item}</li>)}</ol><button disabled={queueDone} onClick={dequeueShip} type="button">让队首出发</button></section>
      </div>
      <p role="status">栈：{stackDone ? "正确，最后放入的黄盘先取出" : "等待操作"}；队列：{queueDone ? "正确，最早到的海豚号先出发" : "等待操作"}</p>
      <button disabled={!stackDone || !queueDone} onClick={onComplete} type="button">完成两种规则比较</button>
    </div>
  );
}
