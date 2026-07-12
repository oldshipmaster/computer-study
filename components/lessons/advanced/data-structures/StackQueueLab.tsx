"use client";

import { useState } from "react";
import { applyQueueAction, applyStackAction } from "@/lib/advanced-foundations/data-structures";

export function StackQueueLab({ onComplete }: { onComplete: () => void }) {
  const [stack, setStack] = useState(["红盘", "蓝盘", "黄盘"]);
  const [queue, setQueue] = useState(["海豚号", "星星号", "灯塔号"]);
  const [stackDone, setStackDone] = useState(false);
  const [queueDone, setQueueDone] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [feedback, setFeedback] = useState("分别预测栈和队列从哪一端取出。" );

  function popStack() {
    const next = applyStackAction(stack, { type: "pop" });
    setStack(next.items);
    setStackDone(next.removed === "黄盘");
    setHistory((current) => [...current, `POP：从栈顶取出 ${next.removed}`]);
    setFeedback("栈选择正确：后进先出，最后放入的黄盘先取出。" );
  }

  function dequeueShip() {
    const next = applyQueueAction(queue, { type: "dequeue" });
    setQueue(next.items);
    setQueueDone(next.removed === "海豚号");
    setHistory((current) => [...current, `DEQUEUE：从队首送走 ${next.removed}`]);
    setFeedback("队列选择正确：先进先出，最早到的海豚号先出发。" );
  }

  return (
    <div className="advanced-lab stack-queue-lab">
      <h2>栈与队列码头挑战</h2>
      <div className="stack-queue-columns">
        <section>
          <h3>盘子栈</h3>
          <p className="structure-rule"><strong>后进先出</strong>：最后放入，最先取出</p>
          <div className="stack-visual" aria-label={`盘子栈，共 ${stack.length} 个盘子`} role="img">
            <span className="end-marker top-marker">栈顶 TOP ↓</span>
            <ol>{stack.toReversed().map((item, index) => <li className={index === 0 ? "active-end" : ""} key={item}>{item}</li>)}</ol>
            <span className="end-marker">栈底</span>
          </div>
          <div role="group" aria-label="选择从栈的哪一端取盘子"><button disabled={stackDone} onClick={popStack} type="button">从栈顶取</button><button disabled={stackDone} onClick={() => setFeedback("不能从栈底取：栈只能操作顶部，规则是后进先出。" )} type="button">从栈底取</button></div>
        </section>
        <section>
          <h3>候船队列</h3>
          <p className="structure-rule"><strong>先进先出</strong>：最早到达，最先离开</p>
          <div className="queue-visual" aria-label={`候船队列，共 ${queue.length} 艘船`} role="img">
            <div className="queue-markers"><span className="end-marker">队首 FRONT ↓</span><span className="end-marker">队尾 REAR ↓</span></div>
            <ol>{queue.map((item, index) => <li className={index === 0 ? "active-end" : ""} key={item}>{item}</li>)}</ol>
          </div>
          <div role="group" aria-label="选择队列的哪一端先出发"><button disabled={queueDone} onClick={dequeueShip} type="button">让队首出发</button><button disabled={queueDone} onClick={() => setFeedback("不能从队尾出发：队列规则是先进先出。" )} type="button">从队尾出发</button></div>
        </section>
      </div>
      <p role="status">{feedback} 栈：{stackDone ? "完成" : "等待操作"}；队列：{queueDone ? "完成" : "等待操作"}</p>
      <aside className="operation-history" aria-label="操作记录">
        <strong>操作记录</strong>
        {history.length === 0 ? <p>完成一次正确操作后，记录会出现在这里。</p> : <ol>{history.map((item, index) => <li key={`${item}-${index}`}>{item}</li>)}</ol>}
      </aside>
      <button disabled={!stackDone || !queueDone} onClick={onComplete} type="button">完成两种规则比较</button>
    </div>
  );
}
