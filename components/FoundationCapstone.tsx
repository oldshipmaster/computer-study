"use client";

import { useState } from "react";
import { ADVANCED_COURSE_IDS } from "@/lib/advanced-foundations/course-ids";
import { FOUNDATION_CAPSTONE } from "@/lib/advanced-foundations/capstone";

export function FoundationCapstone({ completedCourseIds }: { completedCourseIds: readonly string[] }) {
  const [index, setIndex] = useState(0);
  const [choice, setChoice] = useState<string | null>(null);
  const [finished, setFinished] = useState(false);
  const advancedCompleted = ADVANCED_COURSE_IDS.filter((id) => completedCourseIds.includes(id)).length;
  const mission = FOUNDATION_CAPSTONE[index];
  const correct = choice === mission.answer;
  const suggestedRemaining = Math.max(0, 10 - advancedCompleted);

  function answer(option: string) {
    if (correct) return;
    setChoice(option);
  }
  function next() { if (index === FOUNDATION_CAPSTONE.length - 1) setFinished(true); else { setIndex((value) => value + 1); setChoice(null); } }
  function restart() { setIndex(0); setChoice(null); setFinished(false); }

  return <section className="foundation-capstone" id="foundation-capstone" aria-labelledby="foundation-capstone-heading">
    <header><p className="section-kicker">跨领域综合任务</p><h2 id="foundation-capstone-heading">比特岛系统总控台</h2><p>{suggestedRemaining ? `现在也能尝试；建议先完成另外 ${suggestedRemaining} 节高级基础课，再回来比较答案。` : "准备完成！把结构、算法、系统和网络知识连接起来。"}</p></header>
    <div className="foundation-capstone-console">
      {finished ? <div className="foundation-capstone-finish"><span aria-hidden="true">🧠</span><h3>五条系统航线全部接通</h3><p>你已经能把不同领域的知识放进同一个问题里思考。</p><button onClick={restart} type="button">重新挑战</button></div> : <><p>{mission.domains.join(" × ")} · {index + 1}/5</p><h3>{mission.prompt}</h3><div role="group" aria-label="选择系统方案">{mission.options.map((option) => <button aria-pressed={choice === option} disabled={correct} key={option} onClick={() => answer(option)} type="button">{option}</button>)}</div><p className={correct ? "is-correct" : ""} role="status">{choice ? correct ? `方案成立：${mission.explanation}` : `还缺一环：${mission.explanation}` : "先找出题目连接了哪些领域，再选择方案。"}</p>{correct ? <button className="primary-action" onClick={next} type="button">{index === 4 ? "接通总控台" : "下一条系统航线"}</button> : null}</>}
    </div>
  </section>;
}
