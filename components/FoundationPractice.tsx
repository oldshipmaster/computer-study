"use client";

import { useMemo, useState } from "react";
import { createFoundationPractice } from "@/lib/advanced-foundations/practice";

export function FoundationPractice({ onStartCourse }: { onStartCourse: (courseId: string) => void }) {
  const [round, setRound] = useState(0);
  const [index, setIndex] = useState(0);
  const [choice, setChoice] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const questions = useMemo(() => createFoundationPractice(round), [round]);
  const question = questions[index];
  const correct = choice === question?.answer;
  const finished = index === questions.length - 1 && correct;

  function answer(option: string) {
    if (correct) return;
    setChoice(option);
    if (option === question.answer) setScore((value) => value + 1);
  }

  function next() { setIndex((value) => value + 1); setChoice(null); }
  function restart() { setRound((value) => value + 1); setIndex(0); setChoice(null); setScore(0); }

  return <section className="foundation-practice" id="foundation-practice" aria-labelledby="foundation-practice-heading">
    <header><p className="section-kicker">今日底层脑力加练</p><h2 id="foundation-practice-heading">四道题，把四条知识线连起来</h2><p>答错不会扣分。先看证据，再回到课程重新实验。</p></header>
    <div className="foundation-practice-console">
      <div className="foundation-practice-progress"><span>{question.domain} · 第 {index + 1}/{questions.length} 题</span><progress aria-label="本轮加练进度" max={questions.length} value={index + (correct ? 1 : 0)} /></div>
      <h3>{question.prompt}</h3>
      <div role="group" aria-label="选择答案">{question.options.map((option) => <button aria-pressed={choice === option} disabled={correct} key={option} onClick={() => answer(option)} type="button">{option}</button>)}</div>
      <p className={correct ? "is-correct" : ""} role="status">{choice ? correct ? `答对了：${question.explanation}` : `再想想：${question.explanation}` : "先预测，再选择最有道理的答案。"}</p>
      <div className="foundation-practice-actions"><button onClick={() => onStartCourse(question.courseId)} type="button">回到对应课程实验</button>{correct && !finished ? <button onClick={next} type="button">下一题</button> : null}{finished ? <button onClick={restart} type="button">再来一组 · 本轮 {score}/4</button> : null}</div>
    </div>
  </section>;
}
