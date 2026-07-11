"use client";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { LessonChrome } from "@/components/lessons/LessonChrome";
import { MemoryLab } from "@/components/lessons/hardware/MemoryLab";
import type { LessonProps } from "@/components/lessons/types";
const STAGES = ["三个不同岗位", "CPU 做计算", "内存放工作中内容", "存储长期保留", "保存再启动", "作品保留挑战"];
const MESSAGES = ["处理器、内存和存储一起工作，但负责不同任务。", "CPU 按程序快速处理指令和数据。", "内存像当前工作台，程序运行时把正在用的内容放在这里。", "存储像长期仓库，保存后关机再开仍能找到。", "只在内存里修改还不够，保存会把新版本写入存储。", "载入草图、CPU 添加灯塔、保存、重新启动，再载入确认。"];
export function CpuMemoryStorageLesson({ initialStage, onAward, onComplete, onExit, onStageChange }: LessonProps) { const [stage, setStage] = useState(() => Math.max(0, Math.min(5, Math.floor(initialStage || 0)))); const headingRef = useRef<HTMLHeadingElement>(null); const awardedRef = useRef(false); useLayoutEffect(() => headingRef.current?.focus(), [stage]); useEffect(() => onStageChange(stage), [onStageChange, stage]); function finish() { if (awardedRef.current) return; awardedRef.current = true; onAward("cpu-memory-storage", "memory-manager"); onComplete(); } return <LessonChrome courseName="处理器、内存与存储" currentStage={stage} heading={STAGES[stage]} headingRef={headingRef} message={MESSAGES[stage]} onExit={onExit} stageNames={STAGES}><div className="memory-mission">{stage < 5 ? <div className="memory-demo"><p>CPU 工作　·　内存暂放　·　存储长期保留</p><button className="primary-action" onClick={() => setStage((value) => value + 1)} type="button">认识下一个岗位</button></div> : <MemoryLab onComplete={finish}/>}</div></LessonChrome>; }
