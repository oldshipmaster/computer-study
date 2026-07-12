"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { LessonChrome } from "@/components/lessons/LessonChrome";
import type { LessonProps } from "@/components/lessons/types";
import { DragWorkshop } from "@/components/lessons/mouse/DragWorkshop";
import { MouseTargetField } from "@/components/lessons/mouse/MouseTargetField";
import {
  INITIAL_MOUSE_STATE,
  MOUSE_STAGES,
  advanceMouseSequence,
  normalizeMouseResumeStage,
  type MouseLessonAction,
} from "@/lib/mouse-lesson";

const STAGE_NAMES = ["出发", "移动", "单击", "双击", "拖放", "独立挑战"];
const COPY = {
  intro: ["修好港口导航台", "鼠标像你的手：先移动找到目标，再用不同动作发出指令。"],
  move: ["找到三盏导航灯", "移动鼠标经过每盏灯。使用键盘时，按 Tab 依次找到它们。"],
  click: ["单击黄色信标", "轻轻按下再松开一次，就是单击。"],
  doubleClick: ["双击蓝色舱门", "在同一个位置快速单击两次，打开舱门。"],
  drag: ["把补给箱送回同色停靠位", "按住、移动、松开叫拖放；也可以用两个按钮完成。"],
  challenge: ["独立驾驶导航台", "依次完成移动、单击、双击和拖放，点亮整座导航台。"],
} as const;

export function MousePrecisionLesson({
  initialStage,
  onAward,
  onComplete,
  onExit,
  onStageChange,
}: LessonProps) {
  const initial = normalizeMouseResumeStage(initialStage);
  const [state, setState] = useState({ ...INITIAL_MOUSE_STATE, stage: initial });
  const [doubleClickCount, setDoubleClickCount] = useState(0);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const awardedRef = useRef(false);
  const doubleClickTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const stageIndex = MOUSE_STAGES.indexOf(state.stage);

  useLayoutEffect(() => headingRef.current?.focus(), [state.stage]);
  useEffect(() => onStageChange(stageIndex), [onStageChange, stageIndex]);
  useEffect(() => {
    if (!state.complete || awardedRef.current) return;
    awardedRef.current = true;
    onAward("mouse-precision", "mouse-navigator");
    onComplete();
  }, [onAward, onComplete, state.complete]);

  function act(action: MouseLessonAction) {
    setState((current) => advanceMouseSequence(current, action));
  }
  function noteDoubleClickAttempt() {
    setDoubleClickCount((value) => Math.min(2, value + 1));
    if (doubleClickTimerRef.current) clearTimeout(doubleClickTimerRef.current);
    doubleClickTimerRef.current = setTimeout(() => setDoubleClickCount(0), 650);
  }
  function finishDoubleClick() {
    if (doubleClickTimerRef.current) clearTimeout(doubleClickTimerRef.current);
    act({ type: "doubleClickTarget", targetId: "blue-hatch" });
  }

  const [heading, message] = COPY[state.stage];

  return (
    <LessonChrome
      courseName="鼠标精准训练"
      currentStage={stageIndex}
      heading={heading}
      headingRef={headingRef}
      message={message}
      onExit={onExit}
      stageNames={STAGE_NAMES}
    >
      <div className="mouse-mission" data-stage={state.stage}>
        {state.stage === "intro" ? (
          <div className="mouse-intro"><div aria-label="鼠标结构：左键、滚轮和右键" className="mouse-anatomy" role="img"><span className="mouse-part mouse-part--left"><strong>左键</strong><small>选择、单击、双击、拖动</small></span><span className="mouse-part mouse-part--wheel"><strong>滚轮</strong><small>上下浏览页面</small></span><span className="mouse-part mouse-part--right"><strong>右键</strong><small>打开更多操作；不确定时先问大人</small></span><b aria-hidden="true">🖱️</b></div><button className="primary-action" onClick={() => act({ type: "continue" })} type="button">开始维修导航台</button></div>
        ) : null}
        {state.stage === "move" ? <MouseTargetField visited={state.movedTargets} onVisit={(targetId) => act({ type: "moveTarget", targetId })} /> : null}
        {state.stage === "click" ? <button className="mouse-beacon" onClick={() => act({ type: "clickTarget", targetId: "yellow-beacon" })} type="button">黄色信标 · 单击一次</button> : null}
        {state.stage === "doubleClick" ? <div className="double-click-practice"><button className="mouse-hatch" onClick={noteDoubleClickAttempt} onDoubleClick={finishDoubleClick} type="button">蓝色舱门 · 快速双击</button><div aria-live="polite" className="double-click-meter"><span className={doubleClickCount >= 1 ? "is-detected" : ""}>第 1 次</span><b aria-hidden="true">＋</b><span className={doubleClickCount >= 2 ? "is-detected" : ""}>第 2 次</span><strong>{doubleClickCount < 2 ? `已检测 ${doubleClickCount}/2，请在同一位置快速再点` : "检测到两次，正在打开"}</strong></div><button className="keyboard-alternative" onClick={finishDoubleClick} type="button">键盘操作：打开舱门</button></div> : null}
        {state.stage === "drag" ? <DragWorkshop delivered={state.draggedCrates} onDrop={(crateId, bayId) => act({ type: "dropCrate", crateId, bayId })} /> : null}
        {state.stage === "challenge" ? (
          <div className="mouse-challenge" aria-label="鼠标独立挑战" role="group">
            {(["move", "click", "doubleClick", "drag"] as const).map((skill, index) => (
              <button disabled={state.challengeSkills.includes(skill)} key={skill} onClick={() => act({ type: "challengeSkill", skill })} type="button">
                {state.challengeSkills.includes(skill) ? "✓ " : ""}{index + 1}. {STAGE_NAMES[index + 1]}
              </button>
            ))}
          </div>
        ) : null}
        {state.wrongAttempts > 0 ? <p className="gentle-feedback" role="status">没关系，进度还在。看看颜色和动作提示，再试一次。</p> : null}
      </div>
    </LessonChrome>
  );
}
