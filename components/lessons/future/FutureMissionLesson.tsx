"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { LessonChrome } from "@/components/lessons/LessonChrome";
import type { LessonProps } from "@/components/lessons/types";
import { answerFutureCard, createFutureState, type FutureMission } from "@/lib/future-missions";

interface Props extends LessonProps { mission: FutureMission; }
export function FutureMissionLesson({ mission, initialStage, onAward, onComplete, onExit, onStageChange }: Props) {
  const [stage, setStage] = useState(() => Math.max(0, Math.min(5, Math.floor(initialStage || 0))));
  const [challenge, setChallenge] = useState(createFutureState);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const awardedRef = useRef(false);
  useLayoutEffect(() => headingRef.current?.focus(), [stage]);
  useEffect(() => onStageChange(stage), [onStageChange, stage]);
  const current = mission.cards[challenge.index];
  function choose(index: number) {
    const next = answerFutureCard(mission, challenge, index);
    setChallenge(next);
    if (next.completed && !awardedRef.current) {
      awardedRef.current = true;
      onAward(mission.courseId, mission.badgeId);
      onComplete();
    }
  }
  return <LessonChrome courseName={mission.courseName} currentStage={stage} heading={mission.stages[stage]} headingRef={headingRef} message={mission.messages[stage]} onExit={onExit} stageNames={mission.stages}>
    <div className="future-mission">
      {stage < 5 ? <div className="future-demo"><p>{mission.symbol}</p><button className="primary-action" onClick={() => setStage((value) => value + 1)} type="button">前往下一座未来站</button></div> : <div className="future-challenge">
        <div className="future-progress" aria-label={`已完成 ${challenge.solved} 项，共 4 项`} role="status">{mission.cards.map((item, index) => <span className={index < challenge.solved ? "is-complete" : ""} key={item.id}>{index < challenge.solved ? "✓" : index + 1}</span>)}</div>
        <h2>{current.prompt}</h2>
        <div className="future-options">{current.options.map((option, index) => <button key={option} onClick={() => choose(index)} type="button">{option}</button>)}</div>
        <p className={`future-feedback future-feedback--${challenge.feedback.kind}`} role="status">{challenge.feedback.message}</p>
      </div>}
    </div>
  </LessonChrome>;
}
