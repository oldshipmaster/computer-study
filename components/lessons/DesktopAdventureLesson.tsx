"use client";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { LessonChrome } from "@/components/lessons/LessonChrome";
import { SimulatedDesktop } from "@/components/lessons/desktop/SimulatedDesktop";
import type { LessonProps } from "@/components/lessons/types";
import { INITIAL_DESKTOP_STATE, updateDesktop, type DesktopAction } from "@/lib/desktop-lesson";

const STAGES = ["认识桌面", "打开程序", "多个窗口", "切换窗口", "最小化与恢复", "关闭程序"];
const MESSAGES = ["这里是安全的模拟桌面，不会打开电脑中的真实文件。", "先单击选中图标，再双击打开记事本；键盘也可用打开按钮。", "再打开画图，看看两个程序怎样同时工作。", "点记事本标题栏或任务栏，让它来到最前面。", "最小化记事本，再从任务栏恢复它。", "关闭记事本和画图，完成桌面整理。"];

export function DesktopAdventureLesson({ initialStage, onAward, onComplete, onExit, onStageChange }: LessonProps) {
  const [stage, setStage] = useState(() => Math.max(0, Math.min(5, Math.floor(initialStage || 0))));
  const [desktop, setDesktop] = useState(INITIAL_DESKTOP_STATE);
  const [minimizedOnce, setMinimizedOnce] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [readyToFinish, setReadyToFinish] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const awardedRef = useRef(false);
  useLayoutEffect(() => headingRef.current?.focus(), [stage]);
  useEffect(() => onStageChange(stage), [onStageChange, stage]);

  function act(action: DesktopAction) {
    const next = updateDesktop(desktop, action);
    setDesktop(next);
    const app = action.appId === "notes" ? "记事本" : "画图";
    const verbs: Record<DesktopAction["type"], string> = { selectIcon: "选中", openWindow: "打开", focusWindow: "切换到", minimizeWindow: "最小化", restoreWindow: "恢复", closeWindow: "关闭" };
    setHistory((items) => [...items, `${verbs[action.type]}${app}`]);
    if (stage === 1 && action.type === "openWindow" && action.appId === "notes") setStage(2);
    else if (stage === 2 && action.type === "openWindow" && action.appId === "paint") setStage(3);
    else if (stage === 3 && action.type === "focusWindow" && action.appId === "notes") setStage(4);
    else if (stage === 4 && action.type === "minimizeWindow" && action.appId === "notes") setMinimizedOnce(true);
    else if (stage === 4 && minimizedOnce && action.type === "restoreWindow" && action.appId === "notes") setStage(5);
    else if (stage === 5 && action.type === "closeWindow" && next.openWindows.length === 0) setReadyToFinish(true);
  }

  function finish() {
    if (awardedRef.current) return;
    awardedRef.current = true;
    onAward("desktop-adventure", "desktop-explorer");
    onComplete();
  }

  return <LessonChrome courseName="桌面探险" currentStage={stage} heading={STAGES[stage]} headingRef={headingRef} message={MESSAGES[stage]} onExit={onExit} stageNames={STAGES}><div className="desktop-mission">{stage === 0 ? <button className="primary-action" onClick={() => setStage(1)} type="button">进入模拟桌面</button> : <><SimulatedDesktop history={history} onAction={act} state={desktop} />{readyToFinish ? <section className="desktop-finish"><h2>桌面状态总结</h2><p>所有窗口都已关闭，任务栏也恢复整洁。你已经会打开、切换、最小化、恢复和关闭窗口了。</p><button className="primary-action" onClick={finish} type="button">完成桌面探险</button></section> : null}</>}</div></LessonChrome>;
}
