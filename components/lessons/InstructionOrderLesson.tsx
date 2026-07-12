"use client";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { LessonChrome } from "@/components/lessons/LessonChrome";
import { SequenceBuilder } from "@/components/lessons/programming/SequenceBuilder";
import type { LessonProps } from "@/components/lessons/types";
import type { RepairInstruction } from "@/lib/instruction-order-lesson";
const STAGES = ["顺序会改变结果", "生活中的顺序", "先预测再运行", "调整指令", "逐步观察", "维修挑战"];
const MESSAGES = ["电脑严格按从上到下的顺序执行指令。", "穿鞋前先穿袜子；修桥前先拿工具。", "同样四条指令，顺序不同，结果也会不同。", "用上下箭头把维修指令排成正确顺序。", "运行后按顺序读每一步，解释机器人为什么成功。", "独立整理唤醒、拿工具、修桥、返回四条指令。"];
const SCRAMBLED: RepairInstruction[] = ["repair", "wake", "return", "collect"];
export function InstructionOrderLesson({ initialStage, onAward, onComplete, onExit, onStageChange }: LessonProps) {
  const [stage, setStage] = useState(() => Math.max(0, Math.min(5, Math.floor(initialStage || 0)))); const [queue, setQueue] = useState(SCRAMBLED); const headingRef = useRef<HTMLHeadingElement>(null); const awardedRef = useRef(false);
  useLayoutEffect(() => headingRef.current?.focus(), [stage]); useEffect(() => onStageChange(stage), [onStageChange, stage]);
  function success() { if (stage < 5) { setStage(stage + 1); setQueue([...SCRAMBLED].reverse()); return; } if (!awardedRef.current) { awardedRef.current = true; onAward("instruction-order", "sequence-engineer"); onComplete(); } }
  return <LessonChrome courseName="指令排排队" currentStage={stage} heading={STAGES[stage]} headingRef={headingRef} message={MESSAGES[stage]} onExit={onExit} stageNames={STAGES}><div className="sequence-mission">{stage < 3 ? <div className="sequence-story"><p>🧦 穿袜子 → 👟 穿鞋子 → 🚪 出门</p><button className="primary-action" onClick={() => setStage(stage + 1)} type="button">我来预测下一步</button></div> : <SequenceBuilder onSuccess={success} queue={queue} setQueue={setQueue}/>}</div></LessonChrome>;
}
