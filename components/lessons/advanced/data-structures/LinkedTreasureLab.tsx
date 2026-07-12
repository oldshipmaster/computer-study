"use client";

import { useState } from "react";
import { insertLinkedNode, removeLinkedNode, walkLinkedNodes, type LinkedNodes } from "@/lib/advanced-foundations/data-structures";

const START_NODES: LinkedNodes<string> = {
  lighthouse: { value: "灯塔", next: "cave" },
  cave: { value: "山洞", next: null },
};

export function LinkedTreasureLab({ onComplete }: { onComplete: () => void }) {
  const [nodes, setNodes] = useState(START_NODES);
  const [step, setStep] = useState(0);
  const [feedback, setFeedback] = useState("选择码头应该插入的位置。" );
  const path = walkLinkedNodes(nodes, "lighthouse");

  function advance(choice: string) {
    if (step === 0 && choice === "between") {
      setNodes((current) => insertLinkedNode(current, "lighthouse", "dock", "码头"));
      setStep(1);
      setFeedback("插入成功：灯塔指向码头，码头再指向山洞。" );
    } else if (step === 1 && choice === "reconnect") {
      setNodes((current) => removeLinkedNode(current, "lighthouse", "dock"));
      setStep(2);
      setFeedback("删除成功：灯塔重新指向山洞，路线没有断开。" );
    } else {
      setFeedback("这会让路线位置不对或连接中断，再观察每个节点的下一站。" );
    }
  }

  return (
    <div className="advanced-lab linked-treasure-lab">
      <h2>链表寻宝挑战</h2>
      <div aria-label="沿下一站连接的节点" className="linked-path" role="list">
        {path.map((id, index) => <span key={id} role="listitem"><strong>{nodes[id].value}</strong><small>{index < path.length - 1 ? "下一站 →" : "终点"}</small></span>)}
      </div>
      <p role="status">{feedback}</p>
      {step === 0 ? <div role="group" aria-label="选择码头插入位置"><button onClick={() => advance("between")} type="button">插在灯塔和山洞之间</button><button onClick={() => advance("after")} type="button">插在山洞终点之后</button></div> : step === 1 ? <div role="group" aria-label="选择删除后的连接"><button onClick={() => advance("reconnect")} type="button">让灯塔重新指向山洞</button><button onClick={() => advance("break")} type="button">让灯塔指向不存在的位置</button></div> : <button onClick={onComplete} type="button">完成链表任务</button>}
    </div>
  );
}
