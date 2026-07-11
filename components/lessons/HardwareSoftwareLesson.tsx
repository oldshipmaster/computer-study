"use client";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { LessonChrome } from "@/components/lessons/LessonChrome";
import { SystemPairingLab } from "@/components/lessons/hardware/SystemPairingLab";
import type { LessonProps } from "@/components/lessons/types";
const STAGES = ["硬件能摸到", "软件是程序", "操作系统来协调", "任务需要搭档", "缺一不能工作", "三组搭档挑战"];
const MESSAGES = ["键盘、屏幕、鼠标等物理部件叫硬件。", "画图、浏览器和游戏等程序叫软件，它们包含指令。", "操作系统帮助程序使用屏幕、键盘、文件和其他硬件。", "硬件提供能力，软件告诉硬件怎样完成任务。", "只有打印机没有打印程序，或只有程序没有打印机，都不能输出纸张。", "为画图、打印和录音三个任务选择硬件与软件搭档。"];
export function HardwareSoftwareLesson({ initialStage, onAward, onComplete, onExit, onStageChange }: LessonProps) { const [stage, setStage] = useState(() => Math.max(0, Math.min(5, Math.floor(initialStage || 0)))); const headingRef = useRef<HTMLHeadingElement>(null); const awardedRef = useRef(false); useLayoutEffect(() => headingRef.current?.focus(), [stage]); useEffect(() => onStageChange(stage), [onStageChange, stage]); function finish() { if (awardedRef.current) return; awardedRef.current = true; onAward("hardware-software", "system-partner"); onComplete(); } return <LessonChrome courseName="硬件与软件搭档" currentStage={stage} heading={STAGES[stage]} headingRef={headingRef} message={MESSAGES[stage]} onExit={onExit} stageNames={STAGES}><div className="system-mission">{stage < 5 ? <div className="system-demo"><p>🖱️ 硬件　＋　🎨 软件　＝　完成任务</p><button className="primary-action" onClick={() => setStage((value) => value + 1)} type="button">认识下一组搭档</button></div> : <SystemPairingLab onComplete={finish}/>}</div></LessonChrome>; }
