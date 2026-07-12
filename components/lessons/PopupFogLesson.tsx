"use client";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { LessonChrome } from "@/components/lessons/LessonChrome";
import { PromptInspector } from "@/components/lessons/safety/PromptInspector";
import type { LessonProps } from "@/components/lessons/types";
const STAGES = ["弹窗先别点", "检查来源", "看它要什么", "识别催促", "关闭与求助", "迷雾判断挑战"];
const MESSAGES = ["弹窗出现时先停手，页面里的大按钮不一定是正确行动。", "看是谁发来的、地址是否熟悉、是不是你正在做的事情。", "索要密码、验证码、个人信息或意外下载时立即关闭。", "“马上、最后机会、账号消失”常用来让人来不及思考。", "关闭页面不会让你吃亏；需要的内容可以让家长或老师确认。", "检查五个完全虚拟的提示，选择关闭、问大人或确认后继续。"];
export function PopupFogLesson({ initialStage, onAward, onComplete, onExit, onStageChange }: LessonProps) { const [stage, setStage] = useState(() => Math.max(0, Math.min(5, Math.floor(initialStage || 0)))); const headingRef = useRef<HTMLHeadingElement>(null); const awardedRef = useRef(false); useLayoutEffect(() => headingRef.current?.focus(), [stage]); useEffect(() => onStageChange(stage), [onStageChange, stage]); function finish() { if (awardedRef.current) return; awardedRef.current = true; onAward("popup-fog", "popup-scout"); onComplete(); } return <LessonChrome courseName="弹窗迷雾" currentStage={stage} heading={STAGES[stage]} headingRef={headingRef} message={MESSAGES[stage]} onExit={onExit} stageNames={STAGES}><div className="popup-mission">{stage < 5 ? <div className="popup-checklist"><p>停手 → 看来源 → 看请求 → 关闭或求助</p><button className="primary-action" onClick={() => setStage(stage + 1)} type="button">检查下一条线索</button></div> : <PromptInspector onComplete={finish}/>}</div></LessonChrome>; }
