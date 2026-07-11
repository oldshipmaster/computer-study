"use client";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { LessonChrome } from "@/components/lessons/LessonChrome";
import { NamingWorkshop } from "@/components/lessons/files/NamingWorkshop";
import type { LessonProps } from "@/components/lessons/types";

const STAGES = ["名字有线索", "清楚的名字", "认识扩展名", "选择位置", "处理重名", "命名挑战"];
const MESSAGES = ["好名字像标签：不用打开，就能猜到里面是什么。", "“海底世界-星期五”比“新建文件”更容易找到。", ".png 是图片扩展名，是文件类型的线索；改名字时别把它弄丢。", "名称和保存位置一起组成文件的完整地址。", "同一文件夹不能有两个完全相同的名字，可以补充主题或日期。", "给虚拟画作起一个清楚、不含个人信息的名字，保存到“我的作品/图画”。"];

export function NameYourWorkLesson({ initialStage, onAward, onComplete, onExit, onStageChange }: LessonProps) {
  const [stage, setStage] = useState(() => Math.max(0, Math.min(5, Math.floor(initialStage || 0)))); const headingRef = useRef<HTMLHeadingElement>(null); const awardedRef = useRef(false);
  useLayoutEffect(() => headingRef.current?.focus(), [stage]); useEffect(() => onStageChange(stage), [onStageChange, stage]);
  function advance() { if (stage < 5) setStage((value) => value + 1); }
  function finish() { if (awardedRef.current) return; awardedRef.current = true; onAward("name-your-work", "naming-designer"); onComplete(); }
  return <LessonChrome courseName="给作品起名字" currentStage={stage} heading={STAGES[stage]} headingRef={headingRef} message={MESSAGES[stage]} onExit={onExit} stageNames={STAGES}><div className="naming-mission">{stage < 4 ? <div className="name-choice"><button type="button">再想想：新建文件.png</button><button className="good-name" onClick={advance} type="button">✓ 海底世界-星期五.png</button><p>选择更容易理解的名字继续。</p></div> : <NamingWorkshop existingNames={stage === 4 ? ["海底世界.png"] : []} initialName={stage === 4 ? "海底世界.png" : ""} onSaved={stage === 4 ? advance : finish} />}</div></LessonChrome>;
}
