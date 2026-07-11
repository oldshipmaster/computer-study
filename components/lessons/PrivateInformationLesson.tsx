"use client";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { LessonChrome } from "@/components/lessons/LessonChrome";
import { PrivacySorter } from "@/components/lessons/safety/PrivacySorter";
import type { LessonProps } from "@/components/lessons/types";
const STAGES = ["信息有不同范围", "谁在询问", "在哪里询问", "先停再想", "求助可信大人", "信息分类挑战"];
const MESSAGES = ["有些兴趣可以在合适场景分享，有些个人信息需要保护。", "即使对方自称朋友，也不能证明他真的是认识的人。", "课堂、家庭和陌生网站的分享范围不同。", "不确定时先不发送，关闭请求，给自己思考时间。", "把页面和问题直接给家长或老师看，比独自猜更安全。", "把八张虚构信息卡分到可以分享、先问大人、停止并关闭。"];
export function PrivateInformationLesson({ initialStage, onAward, onComplete, onExit, onStageChange }: LessonProps) { const [stage, setStage] = useState(() => Math.max(0, Math.min(5, Math.floor(initialStage || 0)))); const headingRef = useRef<HTMLHeadingElement>(null); const awardedRef = useRef(false); useLayoutEffect(() => headingRef.current?.focus(), [stage]); useEffect(() => onStageChange(stage), [onStageChange, stage]); function finish() { if (awardedRef.current) return; awardedRef.current = true; onAward("private-information", "privacy-sentinel"); onComplete(); } return <LessonChrome courseName="什么信息不能说" currentStage={stage} heading={STAGES[stage]} headingRef={headingRef} message={MESSAGES[stage]} onExit={onExit} stageNames={STAGES}><div className="privacy-mission">{stage < 5 ? <div className="privacy-rule"><p>停一下 → 看内容和场景 → 不确定就问大人</p><button className="primary-action" onClick={() => setStage((value) => value + 1)} type="button">练习下一条规则</button></div> : <PrivacySorter onComplete={finish}/>}</div></LessonChrome>; }
