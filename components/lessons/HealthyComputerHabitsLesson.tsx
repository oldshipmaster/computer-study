"use client";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { LessonChrome } from "@/components/lessons/LessonChrome";
import { HabitPlanner } from "@/components/lessons/safety/HabitPlanner";
import type { LessonProps } from "@/components/lessons/types";
const STAGES = ["坐稳有支撑", "屏幕舒适可见", "光线合适", "短课后离屏", "不舒服就停止", "健康节奏挑战"];
const MESSAGES = ["椅子坐稳，双脚有支撑，肩膀和手臂放松。", "调整到不用前伸脖子或眯眼也能看清的位置，并请家长帮忙。", "避免刺眼反光和太暗的环境。", "一节短课后离开屏幕，看远处、眨眼、站起来活动。", "出现不舒服就停止，不硬撑，马上告诉家长或老师。", "完成学习前检查，并安排学习、离屏休息、再学习的节奏。"];
export function HealthyComputerHabitsLesson({ initialStage, onAward, onComplete, onExit, onStageChange }: LessonProps) { const [stage, setStage] = useState(() => Math.max(0, Math.min(5, Math.floor(initialStage || 0)))); const headingRef = useRef<HTMLHeadingElement>(null); const awardedRef = useRef(false); useLayoutEffect(() => headingRef.current?.focus(), [stage]); useEffect(() => onStageChange(stage), [onStageChange, stage]); function finish() { if (awardedRef.current) return; awardedRef.current = true; onAward("healthy-computer-habits", "healthy-tech-user"); onComplete(); } return <LessonChrome courseName="健康电脑习惯" currentStage={stage} heading={STAGES[stage]} headingRef={headingRef} message={MESSAGES[stage]} onExit={onExit} stageNames={STAGES}><div className="habits-mission">{stage < 5 ? <div className="habit-demo"><p>准备舒服 → 学习短课 → 离屏休息 → 活动身体</p><button className="primary-action" onClick={() => setStage((value) => value + 1)} type="button">练习下一项习惯</button></div> : <HabitPlanner onComplete={finish}/>}</div></LessonChrome>; }
