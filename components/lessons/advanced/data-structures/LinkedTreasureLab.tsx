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
  const path = walkLinkedNodes(nodes, "lighthouse");

  function advance() {
    if (step === 0) {
      setNodes((current) => insertLinkedNode(current, "lighthouse", "dock", "码头"));
      setStep(1);
    } else if (step === 1) {
      setNodes((current) => removeLinkedNode(current, "lighthouse", "dock"));
      setStep(2);
    } else {
      onComplete();
    }
  }

  return (
    <div className="advanced-lab linked-treasure-lab">
      <h2>链表寻宝挑战</h2>
      <div aria-label="沿下一站连接的节点" className="linked-path" role="list">
        {path.map((id, index) => <span key={id} role="listitem"><strong>{nodes[id].value}</strong><small>{index < path.length - 1 ? "下一站 →" : "终点"}</small></span>)}
      </div>
      <p role="status">{step === 0 ? "在灯塔和山洞之间插入码头。" : step === 1 ? "删除码头，并把灯塔重新连到山洞。" : "连接已恢复，链表仍能到达终点。"}</p>
      <button onClick={advance} type="button">{step === 0 ? "插入码头节点" : step === 1 ? "删除并重新连接" : "完成链表任务"}</button>
    </div>
  );
}
