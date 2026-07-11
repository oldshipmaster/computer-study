"use client";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { LessonChrome } from "@/components/lessons/LessonChrome";
import { MoveCopyWorkspace } from "@/components/lessons/files/MoveCopyWorkspace";
import type { LessonProps } from "@/components/lessons/types";
import { INITIAL_MOVE_COPY_STATE, updateMoveCopy, type MoveCopyAction } from "@/lib/move-copy-lesson";
const STAGES = ["搬家还是分身", "复制与粘贴", "剪切与移动", "观察数量", "撤销修正", "整理挑战"];
const MESSAGES = ["移动像搬家，原处不再有；复制像分身，原处和新位置都有。", "复制数学练习，再粘贴到今日作业。", "剪切春游照片，再粘贴到图片。", "数一数：练习有两份，照片仍然只有一份。", "把科学笔记误移到图片，再用撤销让它回家。", "独立完成复制练习、移动照片，并用撤销修正一次错误。"];

export function MoveAndCopyLesson({ initialStage, onAward, onComplete, onExit, onStageChange }: LessonProps) {
  const [stage, setStage] = useState(() => Math.max(0, Math.min(5, Math.floor(initialStage || 0)))); const [workspace, setWorkspace] = useState(INITIAL_MOVE_COPY_STATE); const [madeMistake, setMadeMistake] = useState(false); const headingRef = useRef<HTMLHeadingElement>(null); const awardedRef = useRef(false);
  useLayoutEffect(() => headingRef.current?.focus(), [stage]); useEffect(() => onStageChange(stage), [onStageChange, stage]);
  function act(action: MoveCopyAction) { const next = updateMoveCopy(workspace, action); setWorkspace(next);
    if (stage === 1 && next.files.some((f) => f.name === "数学练习.txt" && f.folder === "今日作业")) setStage(2);
    else if (stage === 2 && next.files.find((f) => f.id === "photo")?.folder === "图片") setStage(3);
    else if (stage === 4 && action.type === "move" && action.fileId === "note" && action.folder === "图片") setMadeMistake(true);
    else if (stage === 4 && madeMistake && action.type === "undo") { setStage(5); setWorkspace(INITIAL_MOVE_COPY_STATE); }
    else if (stage === 5) { const copied = next.files.some((f) => f.name === "数学练习.txt" && f.folder === "今日作业"); const moved = next.files.find((f) => f.id === "photo")?.folder === "图片"; if (copied && moved && !awardedRef.current) { awardedRef.current = true; onAward("move-and-copy", "file-mover"); onComplete(); } }
  }
  return <LessonChrome courseName="搬家与复制术" currentStage={stage} heading={STAGES[stage]} headingRef={headingRef} message={MESSAGES[stage]} onExit={onExit} stageNames={STAGES}><div className="move-copy-mission">{stage === 0 ? <button className="primary-action" onClick={() => setStage(1)} type="button">打开虚拟整理台</button> : stage === 3 ? <button className="primary-action" onClick={() => setStage(4)} type="button">我看懂了数量变化</button> : <><MoveCopyWorkspace onAction={act} state={workspace}/>{stage === 4 ? <button onClick={() => act({ type: "move", fileId: "note", folder: "图片" })} type="button">练习：把科学笔记误放到图片</button> : null}</>}</div></LessonChrome>;
}
