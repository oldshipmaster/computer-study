"use client";

import { useState } from "react";
import { insertLinkedNode, removeLinkedNode, walkLinkedNodes, type LinkedNodes } from "@/lib/advanced-foundations/data-structures";
import { isRepeatedPointerActivation } from "@/lib/interaction-guard";

const START_NODES: LinkedNodes<string> = {
  lighthouse: { value: "灯塔", next: "cave" },
  cave: { value: "山洞", next: null },
};
const ADDRESSES: Record<string, number> = { lighthouse: 2048, dock: 4096, cave: 8192 };

export function LinkedTreasureLab({ onComplete }: { onComplete: () => void }) {
  const [nodes, setNodes] = useState(START_NODES);
  const [step, setStep] = useState(0);
  const [feedback, setFeedback] = useState("选择码头应该插入的位置。" );
  const path = walkLinkedNodes(nodes, "lighthouse");

  function advance(choice: string, detail: number) {
    if (isRepeatedPointerActivation(detail)) return;
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
      <div aria-label="链表节点在内存中的地址与指针" className="linked-memory-map" role="list">{Object.entries(nodes).map(([id, node]) => <span className={id === "dock" ? "linked-memory-node--new" : step === 2 && id === "lighthouse" ? "linked-memory-node--reconnected" : ""} key={id} role="listitem"><small>节点地址 {ADDRESSES[id]}</small><strong>{node.value}</strong><b>next 指针</b><em>{node.next ? `→ ${ADDRESSES[node.next]}（${nodes[node.next].value}）` : "→ null（终点）"}</em></span>)}</div><p className="linked-memory-note">链表节点的地址不需要连续；每个 next 指针负责告诉电脑下一站在哪里。</p>
      <p aria-live="polite" role="status">{feedback}</p>
      {step === 0 ? <div role="group" aria-label="选择码头插入位置"><button onClick={(event) => advance("between", event.detail)} type="button">插在灯塔和山洞之间</button><button onClick={(event) => advance("after", event.detail)} type="button">插在山洞终点之后</button></div> : step === 1 ? <div role="group" aria-label="选择删除后的连接"><button onClick={(event) => advance("reconnect", event.detail)} type="button">让灯塔重新指向山洞</button><button onClick={(event) => advance("break", event.detail)} type="button">让灯塔指向不存在的位置</button></div> : <button onClick={onComplete} type="button">完成链表任务</button>}
    </div>
  );
}
