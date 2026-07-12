"use client";

import { useState } from "react";
import { advanceInstructionCycle } from "@/lib/advanced-foundations/systems-network";

const LABELS = { fetch: "取指：从内存拿到下一条指令", decode: "译码：看懂指令要做什么", execute: "执行：完成加法或移动等工作", writeback: "写回：把结果保存到寄存器" };

export function InstructionCycleLab({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(0);
  const [feedback, setFeedback] = useState("观察当前阶段，预测下一个阶段。" );
  const current = advanceInstructionCycle(step);
  const done = step >= 7;
  const expectedPhase = advanceInstructionCycle(step + 1).phase;
  function predict(phase: keyof typeof LABELS) {
    if (phase !== expectedPhase) { setFeedback("顺序不对：回想取指、译码、执行、写回的循环。" ); return; }
    setStep((value) => value + 1);
    setFeedback(`预测正确：下一拍进入${LABELS[phase]}。`);
  }
  return <div className="advanced-lab instruction-cycle-lab"><h2>指令执行流水线挑战</h2><div className="instruction-phases" role="group" aria-label="预测下一个阶段">{Object.entries(LABELS).map(([phase, label]) => <button aria-pressed={phase === current.phase} className={phase === current.phase ? "is-current" : ""} disabled={done} key={phase} onClick={() => predict(phase as keyof typeof LABELS)} type="button">{label}</button>)}</div><p role="status">第 {step + 1} 拍：{LABELS[current.phase]}。{feedback}</p>{done ? <button onClick={onComplete} type="button">完成两轮指令周期</button> : null}</div>;
}
