import { useLayoutEffect, useRef, useState } from "react";

export interface ConceptReflection {
  prompt: string;
  options: readonly [string, string, string];
  answer: string;
  reason: string;
}

export function ConceptReflectionGate({ reflection, onComplete }: { reflection: ConceptReflection; onComplete: () => void }) {
  const [choice, setChoice] = useState<string | null>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const correct = choice === reflection.answer;
  useLayoutEffect(() => headingRef.current?.focus(), []);
  return <section className="concept-reflection" aria-labelledby="concept-reflection-heading">
    <p className="section-kicker">先讲明白，再领取徽章</p>
    <h2 id="concept-reflection-heading" ref={headingRef} tabIndex={-1}>{reflection.prompt}</h2>
    <div role="group" aria-label="选择最有道理的解释">{reflection.options.map((option) => <button aria-pressed={choice === option} key={option} onClick={() => setChoice(option)} type="button">{option}</button>)}</div>
    <p className={correct ? "concept-reflection-feedback is-correct" : "concept-reflection-feedback"} role="status">{choice ? correct ? `答对了：${reflection.reason}` : `再想一想：${reflection.reason}` : "先选一个答案，再用自己的话讲一遍理由。"}</p>
    {correct ? <button className="primary-action" onClick={onComplete} type="button">我能讲明白，领取徽章</button> : null}
  </section>;
}
