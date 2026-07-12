"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { LessonChrome } from "@/components/lessons/LessonChrome";
import type { LessonProps } from "@/components/lessons/types";
import { answerFutureCard, createFutureState, type FutureMission } from "@/lib/future-missions";
import "./FutureMissionLesson.css";

interface Props extends LessonProps { mission: FutureMission; }
interface DecisionRecord { id: string; prompt: string; answer: string; risks: string[]; explanation: string; }

export function FutureMissionLesson({ mission, initialStage, onAward, onComplete, onExit, onStageChange }: Props) {
  const [stage, setStage] = useState(() => Math.max(0, Math.min(5, Math.floor(initialStage || 0))));
  const [challenge, setChallenge] = useState(createFutureState);
  const [review, setReview] = useState<DecisionRecord | null>(null);
  const [records, setRecords] = useState<DecisionRecord[]>([]);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const awardedRef = useRef(false);
  useLayoutEffect(() => headingRef.current?.focus(), [stage]);
  useEffect(() => onStageChange(stage), [onStageChange, stage]);
  const current = mission.cards[challenge.index];
  function choose(index: number, activationDetail: number) {
    const next = answerFutureCard(mission, challenge, index, activationDetail);
    if (next.solved > challenge.solved) {
      const record = { id: current.id, prompt: current.prompt, answer: current.answer, risks: current.options.filter((option) => option !== current.answer), explanation: current.explanation };
      setReview(record);
      setRecords((items) => [...items, record]);
    }
    setChallenge(next);
  }
  function finish() {
    if (!challenge.completed || awardedRef.current) return;
    awardedRef.current = true;
    onAward(mission.courseId, mission.badgeId);
    onComplete();
  }
  return <LessonChrome courseName={mission.courseName} currentStage={stage} heading={mission.stages[stage]} headingRef={headingRef} message={mission.messages[stage]} onExit={onExit} stageNames={mission.stages}>
    <div className="future-mission">
      {stage < 5 ? <div className="future-demo"><p>{mission.symbol}</p><button className="primary-action" onClick={() => setStage(stage + 1)} type="button">前往下一座未来站</button></div> : review ? <section className="decision-evidence-card"><span aria-hidden="true">🧭</span><h2>这次决策有证据</h2><dl><div><dt>目标</dt><dd>{review.prompt}</dd></div><div><dt>我的选择</dt><dd>{review.answer}</dd></div><div><dt>避开的风险</dt><dd>{review.risks.join("；")}</dd></div><div><dt>判断证据</dt><dd>{review.explanation}</dd></div></dl><button className="primary-action" onClick={() => setReview(null)} type="button">{challenge.completed ? "查看决策总结" : "确认记录，下一项"}</button></section> : challenge.completed ? <section className="future-finish"><span aria-hidden="true">🚀✨</span><h2>未来素养决策总结</h2><ol>{records.map((record) => <li key={record.id}><strong>{record.answer}</strong><small>{record.explanation}</small></li>)}</ol><button className="primary-action" onClick={finish} type="button">领取未来素养徽章</button></section> : <div className="future-challenge">
        <div className="future-progress" aria-label={`已完成 ${challenge.solved} 项，共 4 项`} role="status">{mission.cards.map((item, index) => <span className={index < challenge.solved ? "is-complete" : index === challenge.index ? "is-current" : ""} key={item.id}>{index < challenge.solved ? "✓" : index + 1}</span>)}</div>
        <h2>{current.prompt}</h2>
        <div className="future-options">{current.options.map((option, index) => <button key={option} onClick={(event) => choose(index, event.detail)} type="button">{option}</button>)}</div>
        <p className={`future-feedback future-feedback--${challenge.feedback.kind}`} role="status">{challenge.feedback.message}</p>
      </div>}
    </div>
  </LessonChrome>;
}
