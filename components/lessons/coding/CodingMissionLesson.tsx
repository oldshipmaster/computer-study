"use client";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { LessonChrome } from "@/components/lessons/LessonChrome";
import type { LessonProps } from "@/components/lessons/types";
import { answerCodingCard, createCodingState, type CodingMission } from "@/lib/coding-missions";
import { isRepeatedPointerActivation } from "@/lib/interaction-guard";
import "./CodingMissionLesson.css";

interface Props extends LessonProps { mission: CodingMission; }
export function CodingMissionLesson({ mission, initialStage, onAward, onComplete, onExit, onStageChange }: Props) {
  const [stage, setStage] = useState(() => Math.max(0, Math.min(5, Math.floor(initialStage || 0))));
  const [challenge, setChallenge] = useState(createCodingState);
  const [traceStep, setTraceStep] = useState(0);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const awardedRef = useRef(false);
  useLayoutEffect(() => headingRef.current?.focus(), [stage]);
  useEffect(() => onStageChange(stage), [onStageChange, stage]);
  const current = mission.cards[challenge.index];
  const traceParts = current.code.split(/[；;]/).map((part) => part.trim()).filter(Boolean);
  function advanceTrace(detail: number) {
    if (isRepeatedPointerActivation(detail)) return;
    setTraceStep((value) => Math.min(traceParts.length, value + 1));
  }
  function choose(index: number, activationDetail: number) {
    if (traceStep < traceParts.length) return;
    const next = answerCodingCard(mission, challenge, index, activationDetail);
    setChallenge(next);
    if (next.index !== challenge.index) setTraceStep(0);
  }
  function finish() {
    if (!challenge.completed || awardedRef.current) return;
    awardedRef.current = true;
    onAward(mission.courseId, mission.badgeId);
    onComplete();
  }
  return (
    <LessonChrome courseName={mission.courseName} currentStage={stage} heading={mission.stages[stage]} headingRef={headingRef} message={mission.messages[stage]} onExit={onExit} stageNames={mission.stages}>
      <div className="coding-mission">{stage < 5 ? <div className="coding-demo"><pre><code>{mission.cards[Math.min(stage, 3)].code}</code></pre><button className="primary-action" onClick={() => setStage(stage + 1)} type="button">追踪下一个编程概念</button></div> : !challenge.completed ? <div className="coding-challenge">
        <div className="coding-progress" aria-label={`已追踪 ${challenge.solved} 段，共 4 段`} role="status">{mission.cards.map((item, index) => <span className={index < challenge.solved ? "is-complete" : index === challenge.index ? "is-current" : ""} key={item.id}>{index < challenge.solved ? "✓" : index + 1}</span>)}</div>
        <pre><code>{current.code}</code></pre>
        <section className="trace-paper"><header><strong>逐句执行追踪纸</strong><span>{traceStep}/{traceParts.length}</span></header><ol className="code-trace-lane">{traceParts.map((part, index) => <li className={index < traceStep ? "is-executed" : index === traceStep ? "is-next" : ""} key={`${part}-${index}`}><span>{index + 1}</span><code>{part}</code><small>{index < traceStep ? "已执行" : index === traceStep ? "下一句" : "等待"}</small></li>)}</ol><button disabled={traceStep >= traceParts.length} onClick={(event) => advanceTrace(event.detail)} type="button">{traceStep >= traceParts.length ? "全部语句已追踪" : `执行第 ${traceStep + 1} 句`}</button></section>
        <h2>{traceStep < traceParts.length ? "先逐句执行，再预测结果" : current.prompt}</h2>
        <div className="coding-options">{current.options.map((option, index) => <button disabled={traceStep < traceParts.length} key={option} onClick={(event) => choose(index, event.detail)} type="button">{option}</button>)}</div>
        <p className={`coding-feedback coding-feedback--${challenge.feedback.kind}`} role="status">{challenge.feedback.message}</p>
      </div> : <section className="coding-finish"><span aria-hidden="true">🧩✨</span><h2>追踪总结</h2><ul>{mission.cards.map((card) => <li key={card.id}><code>{card.code}</code><small>{card.explanation}</small></li>)}</ul><button className="primary-action" onClick={finish} type="button">领取编程徽章</button></section>}</div>
    </LessonChrome>
  );
}
