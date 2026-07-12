import { buildLearningPlan } from "@/lib/learning-plan";

interface Props { completedCourseIds: string[]; onStartCourse: (courseId: string) => void; resume: { courseId: string; stage: number } | null; }
export function LearningPlan({ completedCourseIds, onStartCourse, resume }: Props) {
  const plan = buildLearningPlan(completedCourseIds, 5, resume);
  return (
    <section className="learning-plan" aria-labelledby="learning-plan-heading">
      <div className="learning-plan-heading">
        <div><p className="section-kicker">五次探险计划</p><h2 id="learning-plan-heading">一次一小步，九座岛轮换练</h2></div>
        {!plan.complete ? <strong>约 {plan.totalMinutes} 分钟 · 分 5 次完成</strong> : null}
      </div>
      {plan.complete ? <div className="learning-plan-complete"><span aria-hidden="true">🎉</span><p>四十五课都完成了！任选一课重玩，试着把原理讲给别人听。</p></div> : <ol>
        {plan.sessions.map((session) => <li key={session.course.id}>
          <span className="session-number">{session.sessionNumber}</span>
          <div><strong>{session.course.title}</strong><span>{session.course.skill} · {session.course.minutes} 分钟</span><small>{session.breakReminder}</small></div>
          <button onClick={() => onStartCourse(session.course.id)} type="button">{session.sessionNumber === 1 ? resume?.courseId === session.course.id ? `继续第 ${resume.stage + 1} 段` : "开始这次" : "提前探索"}</button>
        </li>)}
      </ol>}
    </section>
  );
}
