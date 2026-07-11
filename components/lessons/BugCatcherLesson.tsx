"use client";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { LessonChrome } from "@/components/lessons/LessonChrome";
import { DebugLab } from "@/components/lessons/programming/DebugLab";
import type { LessonProps } from "@/components/lessons/types";
const STAGES = ["错误是线索", "先做预测", "运行并观察", "找到第一个不同", "只改一处再测", "三虫调试挑战"];
const MESSAGES = ["程序没按预期工作叫出现错误，小虫子是帮助我们学习的线索。", "运行前先说出你期待看到什么。", "运行程序，记录真实发生了什么。", "从第一步开始比较，找到期望和实际第一次不同的地方。", "根据证据只改一处，再运行确认问题真的解决。", "修复顺序、循环次数和条件分支三只程序小虫。"];
export function BugCatcherLesson({ initialStage, onAward, onComplete, onExit, onStageChange }: LessonProps) {
  const [stage, setStage] = useState(() => Math.max(0, Math.min(5, Math.floor(initialStage || 0)))); const headingRef = useRef<HTMLHeadingElement>(null); const awardedRef = useRef(false);
  useLayoutEffect(() => headingRef.current?.focus(), [stage]); useEffect(() => onStageChange(stage), [onStageChange, stage]);
  function finish() { if (awardedRef.current) return; awardedRef.current = true; onAward("bug-catcher", "bug-catcher"); onComplete(); }
  return <LessonChrome courseName="抓住小虫子" currentStage={stage} heading={STAGES[stage]} headingRef={headingRef} message={MESSAGES[stage]} onExit={onExit} stageNames={STAGES}><div className="bug-mission">{stage < 5 ? <div className="debug-cycle"><span>预测</span><span>→</span><span>运行</span><span>→</span><span>观察</span><span>→</span><span>修改</span><span>→</span><span>再测试</span><button className="primary-action" onClick={() => setStage((value) => value + 1)} type="button">走完调试下一步</button></div> : <DebugLab onComplete={finish}/>}</div></LessonChrome>;
}
