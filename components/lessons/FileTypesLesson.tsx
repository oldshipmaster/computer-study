"use client";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { LessonChrome } from "@/components/lessons/LessonChrome";
import { FileTypeSorter } from "@/components/lessons/files/FileTypeSorter";
import type { LessonProps } from "@/components/lessons/types";
const STAGES = ["扩展名线索", "图片文件", "文字文件", "声音文件", "未知文件", "分类挑战"];
const MESSAGES = ["文件名最后的 .png、.txt、.mp3 叫扩展名，是类型线索。", ".png 和 .jpg 常用来保存图片。", ".txt 和 .md 常用来保存文字。", ".mp3 和 .wav 常用来保存声音。", "不认识的扩展名不随便打开，先问可信的大人。", "把八个虚拟文件放进图片、文字、声音或未知分类盒。"];
const EXAMPLES = ["线索：海岛.png", "🖼️ 海岛.png", "📄 日记.txt", "🔊 鸟鸣.mp3", "❓ 神秘礼物.exe"];
export function FileTypesLesson({ initialStage, onAward, onComplete, onExit, onStageChange }: LessonProps) {
  const [stage, setStage] = useState(() => Math.max(0, Math.min(5, Math.floor(initialStage || 0)))); const headingRef = useRef<HTMLHeadingElement>(null); const awardedRef = useRef(false);
  useLayoutEffect(() => headingRef.current?.focus(), [stage]); useEffect(() => onStageChange(stage), [onStageChange, stage]);
  function finish() { if (awardedRef.current) return; awardedRef.current = true; onAward("file-types", "file-type-detective"); onComplete(); }
  return <LessonChrome courseName="图片、文字与声音" currentStage={stage} heading={STAGES[stage]} headingRef={headingRef} message={MESSAGES[stage]} onExit={onExit} stageNames={STAGES}><div className="file-types-mission">{stage < 5 ? <div className="type-example"><strong>{EXAMPLES[stage]}</strong><button className="primary-action" onClick={() => setStage(stage + 1)} type="button">看懂了，继续分类</button></div> : <FileTypeSorter onComplete={finish}/>}</div></LessonChrome>;
}
