"use client";

import { useState } from "react";
import { advanceToyCpu, createToyCpu } from "@/lib/advanced-foundations/systems-network";

const LABELS = { fetch: "取指：从内存拿到下一条指令", decode: "译码：看懂指令要做什么", execute: "执行：完成加法或移动等工作", writeback: "写回：把结果保存到寄存器" };

export function InstructionCycleLab({ onComplete }: { onComplete: () => void }) {
  const [cpu, setCpu] = useState(createToyCpu);
  const [feedback, setFeedback] = useState("观察当前阶段，预测下一个阶段。" );
  const preview = advanceToyCpu(cpu);
  const done = cpu.programCounter >= 2;
  const expectedPhase = preview.phase;
  function predict(phase: keyof typeof LABELS) {
    if (phase !== expectedPhase) { setFeedback("顺序不对：回想取指、译码、执行、写回的循环。" ); return; }
    setCpu(preview);
    setFeedback(`预测正确：下一拍进入${LABELS[phase]}。`);
  }
  return <div className="advanced-lab instruction-cycle-lab"><h2>指令执行流水线挑战</h2><div className="toy-cpu-board"><div><span>程序计数器 PC</span><strong>{cpu.programCounter}</strong></div><div><span>指令寄存器</span><strong>{cpu.instruction ?? "等待取指：ADD A B"}</strong></div><div className="cpu-registers"><span>寄存器 A</span><strong>{cpu.registers.A}</strong><span>寄存器 B</span><strong>{cpu.registers.B}</strong><span>寄存器 OUT</span><strong>{cpu.registers.OUT}</strong></div><div><span>运算结果暂存</span><strong>{cpu.pendingResult ?? "—"}</strong></div></div><div className="instruction-phases" role="group" aria-label="预测下一个阶段">{Object.entries(LABELS).map(([phase, label]) => <button aria-pressed={phase === cpu.phase} className={phase === cpu.phase ? "is-current" : ""} disabled={done} key={phase} onClick={() => predict(phase as keyof typeof LABELS)} type="button">{label}</button>)}</div><p role="status">当前：{LABELS[cpu.phase]}。{feedback}</p>{done ? <button onClick={onComplete} type="button">完成两轮指令周期</button> : null}</div>;
}
