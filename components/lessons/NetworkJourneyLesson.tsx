"use client";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { LessonChrome } from "@/components/lessons/LessonChrome";
import { PacketJourneyLab } from "@/components/lessons/network/PacketJourneyLab";
import type { LessonProps } from "@/components/lessons/types";
const STAGES = ["设备提出请求", "路由器指路", "网络连接许多地方", "服务器提供服务", "响应沿路返回", "三包旅行挑战"];
const MESSAGES = ["打开网络内容时，你的设备先发出请求。", "家里的路由器把本地设备连接到更大的网络。", "互联网是很多网络互相连接，不是一台巨大的电脑。", "服务器是提供网页、数据或其他服务的电脑。", "服务器生成响应，网络把数据送回请求设备。", "跟踪天气、图书和地图三个虚构请求的往返旅程。"];
export function NetworkJourneyLesson({ initialStage, onAward, onComplete, onExit, onStageChange }: LessonProps) { const [stage, setStage] = useState(() => Math.max(0, Math.min(5, Math.floor(initialStage || 0)))); const headingRef = useRef<HTMLHeadingElement>(null); const awardedRef = useRef(false); useLayoutEffect(() => headingRef.current?.focus(), [stage]); useEffect(() => onStageChange(stage), [onStageChange, stage]); function finish() { if (awardedRef.current) return; awardedRef.current = true; onAward("network-journey", "packet-guide"); onComplete(); } return <LessonChrome courseName="消息怎样穿过网络" currentStage={stage} heading={STAGES[stage]} headingRef={headingRef} message={MESSAGES[stage]} onExit={onExit} stageNames={STAGES}><div className="network-journey-mission">{stage < 5 ? <div className="network-demo"><p>设备 → 路由器 → 网络 → 服务器 → 返回</p><button className="primary-action" onClick={() => setStage((value) => value + 1)} type="button">跟到下一站</button></div> : <PacketJourneyLab onComplete={finish}/>}</div></LessonChrome>; }
