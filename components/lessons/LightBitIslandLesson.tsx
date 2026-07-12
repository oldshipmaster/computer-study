"use client";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { IslandRescueMission } from "@/components/lessons/capstone/IslandRescueMission";
import { LessonChrome } from "@/components/lessons/LessonChrome";
import type { LessonProps } from "@/components/lessons/types";
const STAGES = ["前四岛发出信号", "整理工具箱", "规划救援顺序", "安全规则确认", "预测再行动", "点亮前四岛"];
const MESSAGES = ["前四座知识岛的八座能量塔需要你用已经学会的本领重新点亮。", "回想文件、键盘、输入、顺序、循环、条件、调试和安全工具。", "一次解决一座塔，读清任务再选择行动。", "任何索要私密信息或意外下载都先关闭并求助。", "先预测结果，行动后用反馈修正，不会因为尝试失去进度。", "完成八项综合任务，为后面的硬件、网络、创作、未来协作和代码星港做好准备。"];
export function LightBitIslandLesson({ initialStage, onAward, onComplete, onExit, onStageChange }: LessonProps) { const [stage, setStage] = useState(() => Math.max(0, Math.min(5, Math.floor(initialStage || 0)))); const headingRef = useRef<HTMLHeadingElement>(null); const awardedRef = useRef(false); useLayoutEffect(() => headingRef.current?.focus(), [stage]); useEffect(() => onStageChange(stage), [onStageChange, stage]); function finish() { if (awardedRef.current) return; awardedRef.current = true; onAward("light-bit-island", "island-lighter"); onComplete(); } return <LessonChrome courseName="点亮比特岛" currentStage={stage} heading={STAGES[stage]} headingRef={headingRef} message={MESSAGES[stage]} onExit={onExit} stageNames={STAGES}><div className="capstone-mission">{stage < 5 ? <div className="capstone-intro"><div>⌨️ 🗂️ 🤖 🔁 🔀 🐛 🛡️</div><button className="primary-action" onClick={() => setStage(stage + 1)} type="button">准备下一组救援工具</button></div> : <IslandRescueMission onComplete={finish}/>}</div></LessonChrome>; }
