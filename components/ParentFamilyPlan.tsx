"use client";

import { useEffect } from "react";
import { buildLearningPlan } from "@/lib/learning-plan";
import { CURRICULUM_GUIDE } from "@/lib/curriculum-guide";

export function ParentFamilyPlan({ completedCourseIds, resume }: { completedCourseIds: string[]; resume: { courseId: string; stage: number } | null }) {
  const plan = buildLearningPlan(completedCourseIds, 5, resume);

  useEffect(() => {
    const cleanup = () => document.documentElement.classList.remove("print-family-plan");
    window.addEventListener("afterprint", cleanup);
    return () => {
      cleanup();
      window.removeEventListener("afterprint", cleanup);
    };
  }, []);

  function printPlan() {
    document.documentElement.classList.add("print-family-plan");
    window.print();
  }

  return <section className="family-plan" aria-labelledby="family-plan-heading">
    <header><div><p className="section-kicker">家庭陪学卡</p><h2 id="family-plan-heading">接下来五次 · 一次 8–10 分钟</h2></div>{!plan.complete ? <button onClick={printPlan} type="button">打印五次学习卡</button> : null}</header>
    {plan.complete ? <p>45 课已经完成。请孩子任选一课重玩，再用“是什么、为什么、还能怎么做”三句话讲给家长听。</p> : <ol>{plan.sessions.map((session) => {
      const guide = CURRICULUM_GUIDE[session.course.id];
      return <li key={session.course.id}>
        <div><span>第 {session.sessionNumber} 次</span><strong>第 {session.course.order} 课 · {session.course.title}</strong><small>{session.course.minutes} 分钟 · {session.course.skill}</small></div>
        {guide ? <><ul>{guide.objectives.map((objective) => <li key={objective}>{objective}</li>)}</ul><p><strong>一起聊：</strong>{guide.parentPrompt}</p></> : null}
        <footer>完成后离开屏幕，看远处或活动身体。</footer>
      </li>;
    })}</ol>}
    <small>本卡不含孩子姓名、答题内容或账号信息。</small>
  </section>;
}
