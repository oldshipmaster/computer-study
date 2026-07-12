"use client";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { PipelineLab } from "@/components/lessons/hardware/PipelineLab";
import { LessonChrome } from "@/components/lessons/LessonChrome";
import type { LessonProps } from "@/components/lessons/types";
const STAGES = ["信息从哪里来", "输入设备", "处理器思考", "输出结果", "追踪一条信息", "三线挑战"];
const MESSAGES = ["计算机工作常能分成输入、处理、输出三个环节。", "键盘、鼠标、麦克风和摄像头把外界信息送进电脑。", "处理器按照程序解释输入并计算下一步。", "屏幕、扬声器和打印机把处理结果呈现出来。", "同一个设备可能参加不同任务，但信息仍按流水线前进。", "追踪按键、录音和打印三条完整信息流水线。"];
export function InputProcessOutputLesson({ initialStage, onAward, onComplete, onExit, onStageChange }: LessonProps) { const [stage, setStage] = useState(() => Math.max(0, Math.min(5, Math.floor(initialStage || 0)))); const headingRef = useRef<HTMLHeadingElement>(null); const awardedRef = useRef(false); useLayoutEffect(() => headingRef.current?.focus(), [stage]); useEffect(() => onStageChange(stage), [onStageChange, stage]); function finish() { if (awardedRef.current) return; awardedRef.current = true; onAward("input-process-output", "pipeline-engineer"); onComplete(); } return <LessonChrome courseName="信息加工流水线" currentStage={stage} heading={STAGES[stage]} headingRef={headingRef} message={MESSAGES[stage]} onExit={onExit} stageNames={STAGES}><div className="pipeline-mission">{stage < 5 ? <div className="pipeline-demo"><p>⌨️ 输入　→　🧠 处理　→　🖥️ 输出</p><button className="primary-action" onClick={() => setStage(stage + 1)} type="button">跟踪下一段信息</button></div> : <PipelineLab onComplete={finish}/>}</div></LessonChrome>; }
