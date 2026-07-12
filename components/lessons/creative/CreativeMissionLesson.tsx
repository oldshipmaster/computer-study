"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { LessonChrome } from "@/components/lessons/LessonChrome";
import type { LessonProps } from "@/components/lessons/types";
import { answerCreativeCard, createCreativeState, type CreativeMission } from "@/lib/creative-missions";
import "./CreativeMissionLesson.css";

interface CreativeMissionLessonProps extends LessonProps { mission: CreativeMission; }
interface CreativeProof { id: string; prompt: string; answer: string; explanation: string; }

export function CreativeMissionLesson({ mission, initialStage, onAward, onComplete, onExit, onStageChange }: CreativeMissionLessonProps) {
  const [stage, setStage] = useState(() => Math.max(0, Math.min(5, Math.floor(initialStage || 0))));
  const [challenge, setChallenge] = useState(createCreativeState);
  const [proof, setProof] = useState<CreativeProof | null>(null);
  const [checklist, setChecklist] = useState<CreativeProof[]>([]);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const awardedRef = useRef(false);
  useLayoutEffect(() => headingRef.current?.focus(), [stage]);
  useEffect(() => onStageChange(stage), [onStageChange, stage]);

  const currentCard = mission.cards[challenge.index];
  function choose(optionIndex: number, activationDetail: number) {
    const next = answerCreativeCard(mission, challenge, optionIndex, activationDetail);
    if (next.solved > challenge.solved) {
      const nextProof = { id: currentCard.id, prompt: currentCard.prompt, answer: currentCard.answer, explanation: currentCard.explanation };
      setProof(nextProof);
      setChecklist((items) => [...items, nextProof]);
    }
    setChallenge(next);
  }
  function finish() {
    if (!challenge.completed || awardedRef.current) return;
    awardedRef.current = true;
    onAward(mission.courseId, mission.badgeId);
    onComplete();
  }

  return (
    <LessonChrome courseName={mission.courseName} currentStage={stage} heading={mission.stages[stage]} headingRef={headingRef} message={mission.messages[stage]} onExit={onExit} stageNames={mission.stages}>
      <div className="creative-mission">
        {stage < 5 ? <div className="creative-demo"><p>{mission.demo}</p><button className="primary-action" onClick={() => setStage(stage + 1)} type="button">探索下一个创作概念</button></div> : proof ? <section className="creative-proof-card"><span aria-hidden="true">📌</span><h2>设计决定已验证</h2><dl><div><dt>要解决的问题</dt><dd>{proof.prompt}</dd></div><div><dt>设计决定</dt><dd>{proof.answer}</dd></div><div><dt>为什么这样做</dt><dd>{proof.explanation}</dd></div></dl><button className="primary-action" onClick={() => setProof(null)} type="button">{challenge.completed ? "查看作品总结" : "加入作品检查单"}</button></section> : challenge.completed ? <section className="creative-finish"><span aria-hidden="true">🎨✨</span><h2>作品质量总结</h2><ul>{checklist.map((item) => <li key={item.id}><strong>✓ {item.answer}</strong><small>{item.explanation}</small></li>)}</ul><button className="primary-action" onClick={finish} type="button">领取创作徽章</button></section> : <div className="creative-challenge">
          <div className="creative-card-progress" aria-label={`已完成 ${challenge.solved} 张，共 4 张`} role="status">{mission.cards.map((card, index) => <span className={index < challenge.solved ? "is-complete" : index === challenge.index ? "is-current" : ""} key={card.id}>{index < challenge.solved ? "✓" : index + 1}</span>)}</div>
          <h2>{currentCard.prompt}</h2>
          <div className="creative-options">{currentCard.options.map((option, index) => <button key={option} onClick={(event) => choose(index, event.detail)} type="button">{option}</button>)}</div>
          <p className={`creative-feedback creative-feedback--${challenge.feedback.kind}`} role="status">{challenge.feedback.message}</p>
        </div>}
      </div>
    </LessonChrome>
  );
}
