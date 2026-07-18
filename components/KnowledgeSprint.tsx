"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState, type MouseEvent } from "react";
import { getCourse, getMapMission } from "@/lib/course-data";
import {
  advanceKnowledgeSprint,
  answerKnowledgeSprint,
  buildKnowledgeSprintDeck,
  createKnowledgeSprintState,
} from "@/lib/knowledge-sprint";

interface KnowledgeSprintProps {
  completedCourseIds: string[];
  bestScore: number;
  runsPlayed: number;
  onRecordSprint: (score: number) => void;
  onStartCourse: (courseId: string) => void;
}

export function KnowledgeSprint({
  completedCourseIds,
  bestScore,
  runsPlayed,
  onRecordSprint,
  onStartCourse,
}: KnowledgeSprintProps) {
  const [rotation, setRotation] = useState(0);
  const deck = useMemo(
    () => buildKnowledgeSprintDeck(completedCourseIds, rotation),
    [completedCourseIds, rotation],
  );
  const [state, setState] = useState(() => createKnowledgeSprintState(deck.length));
  const [started, setStarted] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const reportedRunRef = useRef(false);
  const questionHeadingRef = useRef<HTMLHeadingElement>(null);
  const completionHeadingRef = useRef<HTMLHeadingElement>(null);
  const shouldFocusRef = useRef(false);
  const locked = deck.length < 3;
  const nextCourse = getMapMission(completedCourseIds).course;
  const question = deck[state.index];

  useEffect(() => {
    if (!locked && started && state.phase === "complete" && !reportedRunRef.current) {
      reportedRunRef.current = true;
      onRecordSprint(state.score);
    }
  }, [locked, onRecordSprint, started, state.phase, state.score]);

  useLayoutEffect(() => {
    if (!shouldFocusRef.current) return;
    if (state.phase === "complete") completionHeadingRef.current?.focus();
    else if (state.phase === "answering") questionHeadingRef.current?.focus();
    shouldFocusRef.current = false;
  }, [state.index, state.phase]);

  function startSprint() {
    reportedRunRef.current = false;
    setSelectedOption(null);
    setState(createKnowledgeSprintState(deck.length));
    setStarted(true);
    shouldFocusRef.current = true;
    window.setTimeout(() => questionHeadingRef.current?.focus(), 0);
  }

  function answerQuestion(event: MouseEvent<HTMLButtonElement>, optionIndex: number) {
    setSelectedOption(optionIndex);
    setState((current) => answerKnowledgeSprint(current, optionIndex, deck, event.detail));
  }

  function advanceQuestion(event: MouseEvent<HTMLButtonElement>) {
    if (event.detail > 1) return;
    shouldFocusRef.current = true;
    setSelectedOption(null);
    setState((current) => advanceKnowledgeSprint(current, deck, event.detail));
  }

  function replaySprint() {
    const nextRotation = rotation + 1;
    const nextDeck = buildKnowledgeSprintDeck(completedCourseIds, nextRotation);
    reportedRunRef.current = false;
    shouldFocusRef.current = true;
    setRotation(nextRotation);
    setSelectedOption(null);
    setState(createKnowledgeSprintState(nextDeck.length));
  }

  if (locked) {
    return (
      <section className="knowledge-sprint knowledge-sprint--locked" id="knowledge-sprint" aria-labelledby="knowledge-sprint-heading">
        <div className="sprint-lock-icon" aria-hidden="true">⚡</div>
        <div>
          <p className="sprint-kicker">2–4 分钟 · 无倒计时</p>
          <h2 id="knowledge-sprint-heading">比特知识闪击赛</h2>
          <p>再完成课程来解锁。积累至少 3 道题后，就能用小挑战检验刚学会的电脑知识。</p>
        </div>
        {nextCourse ? <button className="sprint-next" onClick={() => onStartCourse(nextCourse.id)} type="button">先完成「{nextCourse.title}」</button> : null}
      </section>
    );
  }

  if (!started) {
    return (
      <section className="knowledge-sprint" id="knowledge-sprint" aria-labelledby="knowledge-sprint-heading">
        <div className="sprint-intro-copy">
          <p className="sprint-kicker">2–4 分钟 · 5 道知识题</p>
          <h2 id="knowledge-sprint-heading">比特知识闪击赛</h2>
          <p>概念题和情境题交替出现。答对会累积连击分，答错也不会出局，先想清楚再选择。</p>
        </div>
        <div className="sprint-best-card" aria-label="闪击赛本机记录">
          <span>本机最佳</span><strong>{bestScore}</strong><small>已经挑战 {runsPlayed} 局</small>
        </div>
        <button className="sprint-next" onClick={startSprint} type="button">开始闪击赛 <span aria-hidden="true">→</span></button>
      </section>
    );
  }

  if (state.phase === "complete") {
    const missedCourse = state.missedCourseIds[0] ? getCourse(state.missedCourseIds[0]) : undefined;
    return (
      <section className="knowledge-sprint knowledge-sprint--complete" id="knowledge-sprint" aria-labelledby="sprint-complete-heading">
        <div className="sprint-result-burst" aria-hidden="true">★</div>
        <div className="sprint-result-copy">
          <p className="sprint-kicker">闪击战报</p>
          <h2 id="sprint-complete-heading" ref={completionHeadingRef} tabIndex={-1}>这局完成了！</h2>
          <p>{state.correct} / {state.questionCount} 题答对，最佳连击 {state.bestStreak}。</p>
        </div>
        <dl className="sprint-result-score">
          <div><dt>本局得分</dt><dd>{state.score}</dd></div>
          <div><dt>本机最佳</dt><dd>{Math.max(bestScore, state.score)}</dd></div>
        </dl>
        <div className="sprint-result-actions">
          <button className="sprint-next" onClick={replaySprint} type="button">换一组再挑战</button>
          {missedCourse ? <button className="sprint-course-link" onClick={() => onStartCourse(state.missedCourseIds[0])} type="button">回到对应课程加练：{missedCourse.title}</button> : <p>五题全对！可以换一组继续保持好状态。</p>}
        </div>
      </section>
    );
  }

  return (
    <section className="knowledge-sprint knowledge-sprint--playing" id="knowledge-sprint" aria-labelledby="sprint-question-heading">
      <aside className="sprint-console" aria-label="闪击赛状态">
        <p className="sprint-kicker">知识闪击进行中</p>
        <div className="sprint-score"><span>分数</span><strong>{state.score}</strong></div>
        <div className="sprint-combo" aria-label={`当前连击 ${state.streak}`}><span aria-hidden="true">⚡</span><strong>{state.streak} 连击</strong></div>
        <div className="sprint-shields" aria-label={`护盾剩余 ${state.shields} 个`}>
          <span>护盾</span>
          <span>{[0, 1, 2].map((index) => <i className={`sprint-shield ${index < state.shields ? "sprint-shield--active" : ""}`} key={index} aria-hidden="true">◆</i>)}</span>
        </div>
        <label className="sprint-progress"><span>第 {state.index + 1} / {state.questionCount} 题</span><progress max={state.questionCount} value={state.index + 1} /></label>
      </aside>
      <div className="sprint-question-panel">
        <span className="sprint-question-kind">{question.kind === "concept" ? "概念识别" : "情境判断"}</span>
        <h2 id="sprint-question-heading" ref={questionHeadingRef} tabIndex={-1}>{question.prompt}</h2>
        <div className="sprint-answers" role="group" aria-label="选择一个答案">
          {question.options.map((option, optionIndex) => (
            <button
              className={`sprint-answer ${selectedOption === optionIndex ? "sprint-answer--selected" : ""}`}
              disabled={state.phase !== "answering"}
              key={option}
              onClick={(event) => answerQuestion(event, optionIndex)}
              type="button"
            >
              <span aria-hidden="true">{String.fromCharCode(65 + optionIndex)}</span>{option}
            </button>
          ))}
        </div>
        <p className={`sprint-feedback sprint-feedback--${state.feedback.kind}`} role="status">{state.feedback.message}</p>
        {state.phase === "feedback" ? <button className="sprint-next" onClick={advanceQuestion} type="button">{state.index === state.questionCount - 1 ? "查看战报" : "下一题"} <span aria-hidden="true">→</span></button> : null}
      </div>
    </section>
  );
}
