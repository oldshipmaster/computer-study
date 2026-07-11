"use client";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { LessonChrome } from "@/components/lessons/LessonChrome";
import { DeviceClinic } from "@/components/lessons/hardware/DeviceClinic";
import type { LessonProps } from "@/components/lessons/types";
const STAGES = ["先说清现象", "检查最简单原因", "一次改变一处", "重新测试", "知道何时求助", "四案诊断挑战"];
const MESSAGES = ["“坏了”不够具体，要说清屏幕、声音、程序或输入发生了什么。", "先检查焦点、静音、程序状态等简单又可恢复的原因。", "一次只改一个设置，才能知道是哪一步产生变化。", "每次改变后重新做原来的动作，观察问题是否解决。", "液体、焦味、异常发热、电源和设备内部都交给大人处理。", "用线索解决黑屏、无声、程序不响应和键盘无输入四个虚拟案例。"];
export function TroubleshootMachineLesson({ initialStage, onAward, onComplete, onExit, onStageChange }: LessonProps) { const [stage, setStage] = useState(() => Math.max(0, Math.min(5, Math.floor(initialStage || 0)))); const headingRef = useRef<HTMLHeadingElement>(null); const awardedRef = useRef(false); useLayoutEffect(() => headingRef.current?.focus(), [stage]); useEffect(() => onStageChange(stage), [onStageChange, stage]); function finish() { if (awardedRef.current) return; awardedRef.current = true; onAward("troubleshoot-machine", "device-doctor"); onComplete(); } return <LessonChrome courseName="电脑小医生" currentStage={stage} heading={STAGES[stage]} headingRef={headingRef} message={MESSAGES[stage]} onExit={onExit} stageNames={STAGES}><div className="clinic-mission">{stage < 5 ? <div className="clinic-demo"><p>观察 → 检查简单原因 → 改一处 → 再测试</p><button className="primary-action" onClick={() => setStage((value) => value + 1)} type="button">练习下一步诊断</button></div> : <DeviceClinic onComplete={finish}/>}</div></LessonChrome>; }
