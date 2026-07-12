"use client";

import { useState } from "react";
import { advanceInstructionCycle } from "@/lib/advanced-foundations/systems-network";

const LABELS = { fetch: "取指：从内存拿到下一条指令", decode: "译码：看懂指令要做什么", execute: "执行：完成加法或移动等工作", writeback: "写回：把结果保存到寄存器" };

export function InstructionCycleLab({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(0);
  const current = advanceInstructionCycle(step);
  const done = step >= 7;
  return <div className="advanced-lab instruction-cycle-lab"><h2>指令执行流水线挑战</h2><div className="instruction-phases">{Object.entries(LABELS).map(([phase, label]) => <span className={phase === current.phase ? "is-current" : ""} key={phase}>{label}</span>)}</div><p role="status">第 {step + 1} 拍：{LABELS[current.phase]}</p>{done ? <button onClick={onComplete} type="button">完成两轮指令周期</button> : <button onClick={() => setStep((value) => value + 1)} type="button">前进一个时钟节拍</button>}</div>;
}
