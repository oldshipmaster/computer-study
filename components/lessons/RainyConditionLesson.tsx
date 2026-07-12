"use client";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { LessonChrome } from "@/components/lessons/LessonChrome";
import { ConditionLab } from "@/components/lessons/programming/ConditionLab";
import type { LessonProps } from "@/components/lessons/types";
const STAGES = ["提出问题", "真和假", "那么分支", "否则分支", "输入会变化", "天气桥梁挑战"];
const MESSAGES = ["条件程序先问一个能回答真或假的问题。", "“正在下雨”在不同时间可能是真，也可能是假。", "条件为真，就执行“那么”里面的指令。", "条件为假，就执行“否则”里面的指令。", "程序没有变，天气和信号变化会让结果不同。", "观察三个天气与桥梁场景，为机器人选择安全分支。"];
export function RainyConditionLesson({ initialStage, onAward, onComplete, onExit, onStageChange }: LessonProps) {
  const [stage, setStage] = useState(() => Math.max(0, Math.min(5, Math.floor(initialStage || 0)))); const headingRef = useRef<HTMLHeadingElement>(null); const awardedRef = useRef(false);
  useLayoutEffect(() => headingRef.current?.focus(), [stage]); useEffect(() => onStageChange(stage), [onStageChange, stage]);
  function finish() { if (awardedRef.current) return; awardedRef.current = true; onAward("rainy-condition", "condition-captain"); onComplete(); }
  return <LessonChrome courseName="如果下雨就撑伞" currentStage={stage} heading={STAGES[stage]} headingRef={headingRef} message={MESSAGES[stage]} onExit={onExit} stageNames={STAGES}><div className="condition-mission">{stage < 5 ? <div className="condition-demo"><p>如果（正在下雨）<br/>那么（撑伞）<br/>否则（戴遮阳帽）</p><button className="primary-action" onClick={() => setStage(stage + 1)} type="button">检查下一个条件</button></div> : <ConditionLab onComplete={finish}/>}</div></LessonChrome>;
}
