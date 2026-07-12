"use client";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { LessonChrome } from "@/components/lessons/LessonChrome";
import { LoopLab } from "@/components/lessons/programming/LoopLab";
import type { LessonProps } from "@/components/lessons/types";
const STAGES = ["发现重复", "折叠指令", "选择次数", "预测结果", "运行观察", "正方形挑战"];
const MESSAGES = ["连续做同样的事时，可以用循环让程序更短。", "把四个“向前、右转”折叠进一个重复积木。", "重复次数告诉电脑循环身体要执行几遍。", "先预测：正方形有几条边，需要重复几次？", "运行后观察位置、方向和收集到的电池。", "选择正确次数，让机器人画完正方形并收集四块电池。"];
export function RepeatPowerLesson({ initialStage, onAward, onComplete, onExit, onStageChange }: LessonProps) {
  const [stage, setStage] = useState(() => Math.max(0, Math.min(5, Math.floor(initialStage || 0)))); const headingRef = useRef<HTMLHeadingElement>(null); const awardedRef = useRef(false);
  useLayoutEffect(() => headingRef.current?.focus(), [stage]); useEffect(() => onStageChange(stage), [onStageChange, stage]);
  function success() { if (stage < 5) { setStage(stage + 1); return; } if (!awardedRef.current) { awardedRef.current = true; onAward("repeat-power", "loop-builder"); onComplete(); } }
  return <LessonChrome courseName="重复的力量" currentStage={stage} heading={STAGES[stage]} headingRef={headingRef} message={MESSAGES[stage]} onExit={onExit} stageNames={STAGES}><div className="repeat-mission">{stage < 2 ? <div className="repeat-demo"><p>前进 → 右转 → 前进 → 右转 → …</p><button className="primary-action" onClick={() => setStage(stage + 1)} type="button">用重复积木变短</button></div> : <LoopLab onSuccess={success}/>}</div></LessonChrome>;
}
