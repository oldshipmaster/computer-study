"use client";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { LessonChrome } from "@/components/lessons/LessonChrome";
import { TransferLab } from "@/components/lessons/network/TransferLab";
import type { LessonProps } from "@/components/lessons/types";
const STAGES = ["文件可以有副本", "下载来到本机", "上传送往服务", "同步保持版本", "共享改变访问", "五步副本挑战"];
const MESSAGES = ["同一个作品可以在本机和网络服务中各有一份副本。", "下载把网络上的数据复制到本机，原来的网络副本通常仍在。", "上传把本机数据发送到网络服务，不等于删除本机文件。", "同步尝试让多个位置保持相同版本，需要留意冲突和账号。", "共享改变谁能访问，不是简单搬家；分享前确认对象和权限。", "完成下载、修改、上传、同步和家庭共享五个虚拟操作。"];
export function DownloadsCloudLesson({ initialStage, onAward, onComplete, onExit, onStageChange }: LessonProps) { const [stage, setStage] = useState(() => Math.max(0, Math.min(5, Math.floor(initialStage || 0)))); const headingRef = useRef<HTMLHeadingElement>(null); const awardedRef = useRef(false); useLayoutEffect(() => headingRef.current?.focus(), [stage]); useEffect(() => onStageChange(stage), [onStageChange, stage]); function finish() { if (awardedRef.current) return; awardedRef.current = true; onAward("downloads-and-cloud", "cloud-courier"); onComplete(); } return <LessonChrome courseName="下载、上传与云端" currentStage={stage} heading={STAGES[stage]} headingRef={headingRef} message={MESSAGES[stage]} onExit={onExit} stageNames={STAGES}><div className="transfer-mission">{stage < 5 ? <div className="transfer-demo"><p>💻 本机副本　⇄　☁️ 云端副本　·　共享是访问权限</p><button className="primary-action" onClick={() => setStage((value) => value + 1)} type="button">追踪下一种传输</button></div> : <TransferLab onComplete={finish}/>}</div></LessonChrome>; }
