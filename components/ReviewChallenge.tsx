"use client";

import { useState } from "react";
import { REVIEW_QUESTIONS, answerReviewQuestion, createReviewState } from "@/lib/review-challenge";

export function ReviewChallenge() {
  const [state, setState] = useState(createReviewState);
  const question = REVIEW_QUESTIONS[state.index];

  function restart() { setState(createReviewState()); }

  return (
    <section className="review-challenge" aria-labelledby="review-heading">
      <div className="review-copy">
        <p className="section-kicker">岛屿问答站</p>
        <h2 id="review-heading">用理由点亮十六颗思考星</h2>
        <p>八座岛各有两道情境题。答错可以继续想，重要的是读懂解释。</p>
      </div>
      <div className="review-console">
        <div className="review-progress" aria-label={`已经点亮 ${state.score} 颗，共 ${REVIEW_QUESTIONS.length} 颗`}>
          {REVIEW_QUESTIONS.map((item, index) => <span className={index < state.score ? "is-lit" : ""} key={item.id} aria-hidden="true">★</span>)}
        </div>
        {state.completed ? (
          <div className="review-finish">
            <span aria-hidden="true">🏆</span>
            <h3>思考星全部点亮</h3>
            <p>你不只会操作，还能解释电脑为什么这样工作。</p>
            <button className="primary-action" onClick={restart} type="button">再挑战一次</button>
          </div>
        ) : (
          <div className="review-question">
            <span>{question.islandName} · 第 {state.index + 1} / {REVIEW_QUESTIONS.length} 题</span>
            <h3>{question.prompt}</h3>
            <div>{question.options.map((option, optionIndex) => <button key={option} onClick={() => setState((current) => answerReviewQuestion(current, optionIndex))} type="button">{option}</button>)}</div>
            <p className={`review-feedback review-feedback--${state.feedback.kind}`} role="status">{state.feedback.message}</p>
          </div>
        )}
      </div>
    </section>
  );
}
