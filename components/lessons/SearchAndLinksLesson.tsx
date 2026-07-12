"use client";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { LessonChrome } from "@/components/lessons/LessonChrome";
import { SearchLab } from "@/components/lessons/network/SearchLab";
import type { LessonProps } from "@/components/lessons/types";
const STAGES = ["问题变关键词", "比较结果标题", "查看来源线索", "链接通向新位置", "标签页帮助返回", "月相搜索挑战"];
const MESSAGES = ["把长问题留下主题和关键特点，搜索会更集中。", "标题与多个关键词匹配，通常更接近问题，但还不是正确证明。", "比较网站身份、作者、日期和内容说明，重要信息要交叉核实。", "链接像通往另一个位置的门，打开前先看它要去哪里。", "新标签页保留原来的搜索结果，用完关闭能减少混乱。", "用“月亮 变化”寻找更匹配的虚构结果，在新标签页预览后安全返回。"];
export function SearchAndLinksLesson({ initialStage, onAward, onComplete, onExit, onStageChange }: LessonProps) { const [stage, setStage] = useState(() => Math.max(0, Math.min(5, Math.floor(initialStage || 0)))); const headingRef = useRef<HTMLHeadingElement>(null); const awardedRef = useRef(false); useLayoutEffect(() => headingRef.current?.focus(), [stage]); useEffect(() => onStageChange(stage), [onStageChange, stage]); function finish() { if (awardedRef.current) return; awardedRef.current = true; onAward("search-and-links", "search-navigator"); onComplete(); } return <LessonChrome courseName="搜索与链接导航" currentStage={stage} heading={STAGES[stage]} headingRef={headingRef} message={MESSAGES[stage]} onExit={onExit} stageNames={STAGES}><div className="search-mission">{stage < 5 ? <div className="search-demo"><p>“我想知道月亮为什么会变化？” → 月亮　变化</p><button className="primary-action" onClick={() => setStage(stage + 1)} type="button">提炼下一条搜索线索</button></div> : <SearchLab onComplete={finish}/>}</div></LessonChrome>; }
