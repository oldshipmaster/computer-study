"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { REVIEW_QUESTIONS, answerReviewQuestion, createReviewState, getAvailableReviewQuestions } from "@/lib/review-challenge";

export function ReviewChallenge({ completedCourseIds }: { completedCourseIds: string[] }) {
  const [state, setState] = useState(createReviewState);
  const availableQuestions = getAvailableReviewQuestions(completedCourseIds);
  const question = availableQuestions[state.index];
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

  function restart() { restartingRef.current = true; setState(createReviewState()); }

  return (
    <section className="review-challenge" id="review-station" aria-labelledby="review-heading">
      <div className="review-copy">
        <p className="section-kicker">岛屿问答站</p>
        <h2 id="review-heading">用理由点亮十八颗思考星</h2>
        <p>每座岛的第一课和第五课各解锁一道情境题。答错可以继续想，重要的是读懂解释。</p>
      </div>
      <div className="review-console">
        <div className="review-progress" aria-label={`已经点亮 ${state.score} 颗，本次可答 ${availableQuestions.length} 颗，共 ${REVIEW_QUESTIONS.length} 颗`}>
          {REVIEW_QUESTIONS.map((item) => { const unlockedIndex = availableQuestions.findIndex((question) => question.id === item.id); return <span className={unlockedIndex < 0 ? "" : unlockedIndex < state.score ? "is-lit" : "is-unlocked"} key={item.id} aria-hidden="true">★</span>; })}
        </div>
        {availableQuestions.length === 0 ? <div className="review-locked"><span aria-hidden="true">🔒</span><h3>先完成任意一座岛的第一课</h3><p>学会一个新概念后，第一颗思考星就会解锁。</p></div> : state.completed ? (
          <div className="review-finish">
            <span aria-hidden="true">🏆</span>
            <h3 ref={finishHeadingRef} tabIndex={-1}>思考星全部点亮</h3>
            <p>你不只会操作，还能解释电脑为什么这样工作。</p>
            <button className="primary-action" onClick={restart} type="button">再挑战一次</button>
          </div>
        ) : (
          <div className="review-question">
            <span>{question.islandName} · 本次第 {state.index + 1} / {availableQuestions.length} 题 · 全站已解锁 {availableQuestions.length} / {REVIEW_QUESTIONS.length}</span>
            <h3 ref={questionHeadingRef} tabIndex={-1}>{question.prompt}</h3>
            <div>{question.options.map((option, optionIndex) => <button key={option} onClick={() => setState((current) => answerReviewQuestion(current, optionIndex, availableQuestions))} type="button">{option}</button>)}</div>
            <p className={`review-feedback review-feedback--${state.feedback.kind}`} role="status">{state.feedback.message}</p>
          </div>
        )}
      </div>
    </section>
  );
}
