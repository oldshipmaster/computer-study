"use client";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { LessonChrome } from "@/components/lessons/LessonChrome";
import { GridCityGame } from "@/components/lessons/programming/GridCityGame";
import type { LessonProps } from "@/components/lessons/types";
import { INITIAL_GRID_STATE, moveRobot, type GridDirection } from "@/lib/grid-city-lesson";
const STAGES = ["认识行和列", "读取坐标", "方向移动", "边界与障碍", "规划路线", "三点导航挑战"];
const MESSAGES = ["方格位置可以用第几行、第几列说清楚。", "先读行，再读列，例如 2,3 是第2行第3列。", "上下改变行，左右改变列。", "机器人不能越过边界或穿过石头，要寻找其他路线。", "先看目标坐标和障碍，再决定下一步。", "从 1,1 出发，找到 2,3、4,4 和 6,5 三个坐标信标。"];
export function GridCityNavigationLesson({ initialStage, onAward, onComplete, onExit, onStageChange }: LessonProps) {
  const [stage, setStage] = useState(() => Math.max(0, Math.min(5, Math.floor(initialStage || 0)))); const [grid, setGrid] = useState(INITIAL_GRID_STATE); const headingRef = useRef<HTMLHeadingElement>(null); const awardedRef = useRef(false);
  useLayoutEffect(() => headingRef.current?.focus(), [stage]); useEffect(() => onStageChange(stage), [onStageChange, stage]);
  useEffect(() => { function key(event: KeyboardEvent) { const direction = { ArrowUp: "up", ArrowDown: "down", ArrowLeft: "left", ArrowRight: "right" }[event.key] as GridDirection | undefined; if (direction && stage >= 2) { event.preventDefault(); move(direction); } } window.addEventListener("keydown", key); return () => window.removeEventListener("keydown", key); });
  function move(direction: GridDirection) { setGrid((current) => { const next = moveRobot(current, direction); if (stage === 2 && next.position.row !== 1) setStage(3); else if (stage === 3 && next.feedback.includes("障碍")) setStage(4); else if (stage === 4 && next.visitedTargets.length >= 1) { setStage(5); return INITIAL_GRID_STATE; } if (stage === 5 && next.visitedTargets.length === 3 && !awardedRef.current) { awardedRef.current = true; onAward("grid-city-navigation", "grid-navigator"); onComplete(); } return next; }); }
  return <LessonChrome courseName="方格城导航" currentStage={stage} heading={STAGES[stage]} headingRef={headingRef} message={MESSAGES[stage]} onExit={onExit} stageNames={STAGES}><div className="grid-city-mission">{stage < 2 ? <div className="coordinate-demo"><strong>第 2 行 · 第 3 列 = (2,3)</strong><button className="primary-action" onClick={() => setStage(stage + 1)} type="button">继续认识坐标</button></div> : <GridCityGame onMove={move} state={grid}/>}</div></LessonChrome>;
}
