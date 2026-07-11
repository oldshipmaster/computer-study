"use client";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { LessonChrome } from "@/components/lessons/LessonChrome";
import { BackpackOrganizer } from "@/components/lessons/files/BackpackOrganizer";
import type { LessonProps } from "@/components/lessons/types";
import { INITIAL_BACKPACK_STATE, updateBackpack, type BackpackAction } from "@/lib/learning-backpack-lesson";
const STAGES = ["打开学习背包", "搜索目标", "排序观察", "重命名", "回收与恢复", "一周整理挑战"];
const MESSAGES = ["少量、清楚、固定的文件夹，比一层套一层更容易找到。", "在搜索框输入“数学”，快速找到数学练习。", "按名称排序，观察文件怎样排成稳定顺序。", "把数学练习重命名为“周一数学练习.txt”。", "把春游照片放进回收站，再从回收站恢复。", "把数学、科学和照片移到对应文件夹，并把重复数学练习放入回收站。"];
export function LearningBackpackLesson({ initialStage, onAward, onComplete, onExit, onStageChange }: LessonProps) {
  const [stage, setStage] = useState(() => Math.max(0, Math.min(5, Math.floor(initialStage || 0)))); const [bag, setBag] = useState(INITIAL_BACKPACK_STATE); const [trashedPhoto, setTrashedPhoto] = useState(false); const headingRef = useRef<HTMLHeadingElement>(null); const awardedRef = useRef(false);
  useLayoutEffect(() => headingRef.current?.focus(), [stage]); useEffect(() => onStageChange(stage), [onStageChange, stage]);
  function act(action: BackpackAction) { const next = updateBackpack(bag, action); setBag(next);
    if (stage === 3 && action.type === "rename" && next.items.find((i) => i.id === "math")?.name === "周一数学练习.txt") setStage(4);
    else if (stage === 4 && action.type === "trash" && action.itemId === "photo") setTrashedPhoto(true);
    else if (stage === 4 && trashedPhoto && action.type === "restore" && action.itemId === "photo") { setStage(5); setBag(INITIAL_BACKPACK_STATE); }
    else if (stage === 5) { const done = next.items.find((i) => i.id === "math")?.folder === "数学" && next.items.find((i) => i.id === "science")?.folder === "科学" && next.items.find((i) => i.id === "photo")?.folder === "图片" && next.items.find((i) => i.id === "duplicate")?.trashed; if (done && !awardedRef.current) { awardedRef.current = true; onAward("learning-backpack", "digital-organizer"); onComplete(); } }
  }
  return <LessonChrome courseName="整理学习背包" currentStage={stage} heading={STAGES[stage]} headingRef={headingRef} message={MESSAGES[stage]} onExit={onExit} stageNames={STAGES}><div className="backpack-mission">{stage === 0 ? <button className="primary-action" onClick={() => setStage(1)} type="button">打开虚拟学习背包</button> : <BackpackOrganizer onAction={act} onSearch={(query) => stage === 1 && query.includes("数学") && setStage(2)} onSort={() => stage === 2 && setStage(3)} state={bag}/>}</div></LessonChrome>;
}
