"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { TERM_MATCH_QUESTIONS, answerTermMatch, createTermMatchState, getUnlockedTermQuestions } from "@/lib/term-match";
import { ISLANDS } from "@/lib/course-data";

export function TermMatchChallenge({ completedCourseIds }: { completedCourseIds: string[] }) {
  const [state, setState] = useState(createTermMatchState);
  const questions = getUnlockedTermQuestions(completedCourseIds);
  const question = questions[state.index];
  const island = question ? ISLANDS.find((candidate) => candidate.id === question.islandId) : undefined;
  const questionHeadingRef = useRef<HTMLHeadingElement>(null);
  const finishHeadingRef = useRef<HTMLHeadingElement>(null);
  const restartingRef = useRef(false);
  useLayoutEffect(() => {
    if (state.completed) finishHeadingRef.current?.focus();
    else if (state.index > 0 || restartingRef.current) {
      restartingRef.current = false;
      questionHeadingRef.current?.focus();
    }
  }, [state.completed, state.index]);
  const restart = () => { restartingRef.current = true; setState(createTermMatchState()); };
  return <section className="term-match" id="term-match" aria-labelledby="term-match-heading">
    <div><p className="section-kicker">概念配对舱</p><h2 id="term-match-heading">每完成一课，解锁一个核心词</h2><p>读懂解释再选词，不用背英文。65 节课各有一道概念题。</p></div>
    <div className="term-match-console">
      <div className="term-match-progress"><progress aria-label="本次概念配对进度" max={Math.max(questions.length, 1)} value={state.correct} /><span>{state.correct} / {questions.length} 已配对 · 全站 {questions.length} / {TERM_MATCH_QUESTIONS.length} 已解锁</span></div>
      {!question ? <div className="term-match-locked"><span aria-hidden="true">🔒</span><p>先完成任意一课，就会解锁对应的核心词。</p></div> : state.completed ? <div className="term-match-finish"><span aria-hidden="true">🎯</span><h3 ref={finishHeadingRef} tabIndex={-1}>概念全部配对成功</h3><p>试着不用看答案，把其中一个词讲给家长听。</p><button onClick={restart} type="button">再配对一次</button></div> : <div className="term-match-question"><span>{island ? `${island.icon} ${island.name} · ` : ""}第 {state.index + 1} / {questions.length} 题</span><h3 ref={questionHeadingRef} tabIndex={-1}>{question.prompt}</h3><div>{question.options.map((option, index) => <button key={option} onClick={(event) => setState((current) => answerTermMatch(current, index, questions, event.detail))} type="button">{option}</button>)}</div><p role="status">{state.feedback}</p></div>}
    </div>
  </section>;
}
