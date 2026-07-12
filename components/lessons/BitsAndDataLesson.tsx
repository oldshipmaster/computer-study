"use client";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { LessonChrome } from "@/components/lessons/LessonChrome";
import { BitBoard } from "@/components/lessons/hardware/BitBoard";
import type { LessonProps } from "@/components/lessons/types";
const STAGES = ["比特只有两种状态", "位值组合数字", "编码需要规则", "三灯组成颜色", "数据不只一种", "比特灯挑战"];
const MESSAGES = ["一个比特只有 0 或 1，像灯的关和开。", "多个比特排在一起，每个位置有不同位值，可以组合数字。", "0 和 1 本身只是状态，要知道编码规则才能解释。", "红、绿、蓝三个通道的开关可以组合八种简单颜色。", "文字、图片、声音最终也能编码成大量比特。", "分别编码数字 5、数字 10 和品红色。"];
export function BitsAndDataLesson({ initialStage, onAward, onComplete, onExit, onStageChange }: LessonProps) { const [stage, setStage] = useState(() => Math.max(0, Math.min(5, Math.floor(initialStage || 0)))); const headingRef = useRef<HTMLHeadingElement>(null); const awardedRef = useRef(false); useLayoutEffect(() => headingRef.current?.focus(), [stage]); useEffect(() => onStageChange(stage), [onStageChange, stage]); function finish() { if (awardedRef.current) return; awardedRef.current = true; onAward("bits-and-data", "bit-builder"); onComplete(); } return <LessonChrome courseName="0 和 1 的数据积木" currentStage={stage} heading={STAGES[stage]} headingRef={headingRef} message={MESSAGES[stage]} onExit={onExit} stageNames={STAGES}><div className="bits-mission">{stage < 5 ? <div className="bits-demo"><p><b>0</b> 关灯　<b>1</b> 开灯　→　组合成数据</p><button className="primary-action" onClick={() => setStage(stage + 1)} type="button">点亮下一条数据规则</button></div> : <BitBoard onComplete={finish}/>}</div></LessonChrome>; }
