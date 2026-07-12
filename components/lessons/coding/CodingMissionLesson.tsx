"use client";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { LessonChrome } from "@/components/lessons/LessonChrome";
import type { LessonProps } from "@/components/lessons/types";
import { answerCodingCard, createCodingState, type CodingMission } from "@/lib/coding-missions";
interface Props extends LessonProps { mission: CodingMission; }
export function CodingMissionLesson({ mission, initialStage, onAward, onComplete, onExit, onStageChange }: Props) {
  const [stage, setStage] = useState(() => Math.max(0, Math.min(5, Math.floor(initialStage || 0))));
  const [challenge, setChallenge] = useState(createCodingState);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const awardedRef = useRef(false);
  useLayoutEffect(() => headingRef.current?.focus(), [stage]);
  useEffect(() => onStageChange(stage), [onStageChange, stage]);
  const current = mission.cards[challenge.index];
  function choose(index: number, activationDetail: number) { const next = answerCodingCard(mission, challenge, index, activationDetail); setChallenge(next); if (next.completed && !awardedRef.current) { awardedRef.current = true; onAward(mission.courseId, mission.badgeId); onComplete(); } }
  return <LessonChrome courseName={mission.courseName} currentStage={stage} heading={mission.stages[stage]} headingRef={headingRef} message={mission.messages[stage]} onExit={onExit} stageNames={mission.stages}><div className="coding-mission">{stage < 5 ? <div className="coding-demo"><pre><code>{mission.cards[Math.min(stage, 3)].code}</code></pre><button className="primary-action" onClick={() => setStage((value) => value + 1)} type="button">追踪下一个编程概念</button></div> : <div className="coding-challenge"><div className="coding-progress" aria-label={`已追踪 ${challenge.solved} 段，共 4 段`} role="status">{mission.cards.map((item, index) => <span className={index < challenge.solved ? "is-complete" : ""} key={item.id}>{index < challenge.solved ? "✓" : index + 1}</span>)}</div><pre><code>{current.code}</code></pre><h2>{current.prompt}</h2><div className="coding-options">{current.options.map((option, index) => <button key={option} onClick={(event) => choose(index, event.detail)} type="button">{option}</button>)}</div><p className={`coding-feedback coding-feedback--${challenge.feedback.kind}`} role="status">{challenge.feedback.message}</p></div>}</div></LessonChrome>;
}
