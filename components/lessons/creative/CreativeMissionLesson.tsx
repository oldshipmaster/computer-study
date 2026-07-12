"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { LessonChrome } from "@/components/lessons/LessonChrome";
import type { LessonProps } from "@/components/lessons/types";
import { answerCreativeCard, createCreativeState, type CreativeMission } from "@/lib/creative-missions";

interface CreativeMissionLessonProps extends LessonProps { mission: CreativeMission; }

export function CreativeMissionLesson({ mission, initialStage, onAward, onComplete, onExit, onStageChange }: CreativeMissionLessonProps) {
  const [stage, setStage] = useState(() => Math.max(0, Math.min(5, Math.floor(initialStage || 0))));
  const [challenge, setChallenge] = useState(createCreativeState);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const awardedRef = useRef(false);
  useLayoutEffect(() => headingRef.current?.focus(), [stage]);
  useEffect(() => onStageChange(stage), [onStageChange, stage]);

  function choose(optionIndex: number) {
    const next = answerCreativeCard(mission, challenge, optionIndex);
    setChallenge(next);
    if (next.completed && !awardedRef.current) {
      awardedRef.current = true;
      onAward(mission.courseId, mission.badgeId);
      onComplete();
    }
  }

  const currentCard = mission.cards[challenge.index];
  return (
    <LessonChrome courseName={mission.courseName} currentStage={stage} heading={mission.stages[stage]} headingRef={headingRef} message={mission.messages[stage]} onExit={onExit} stageNames={mission.stages}>
      <div className="creative-mission">
        {stage < 5 ? (
          <div className="creative-demo">
            <p>{mission.demo}</p>
            <button className="primary-action" onClick={() => setStage((value) => value + 1)} type="button">探索下一个创作概念</button>
          </div>
        ) : (
          <div className="creative-challenge">
            <div className="creative-card-progress" aria-label={`已完成 ${challenge.solved} 张，共 4 张`}>
              {mission.cards.map((card, index) => <span className={index < challenge.solved ? "is-complete" : ""} key={card.id}>{index < challenge.solved ? "✓" : index + 1}</span>)}
            </div>
            <h2>{currentCard.prompt}</h2>
            <div className="creative-options">{currentCard.options.map((option, index) => <button key={option} onClick={() => choose(index)} type="button">{option}</button>)}</div>
            <p className={`creative-feedback creative-feedback--${challenge.feedback.kind}`} role="status">{challenge.feedback.message}</p>
          </div>
        )}
      </div>
    </LessonChrome>
  );
}
