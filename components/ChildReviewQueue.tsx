import { buildReviewQueue, type CourseConfidence } from "@/lib/review-queue";

export function ChildReviewQueue({ confidenceByCourse, onStartCourse }: { confidenceByCourse: Record<string, CourseConfidence>; onStartCourse: (courseId: string) => void }) {
  const allReviewCourses = buildReviewQueue(confidenceByCourse, Number.MAX_SAFE_INTEGER);
  const queue = allReviewCourses.slice(0, 5);
  const remaining = allReviewCourses.length - queue.length;
  if (!queue.length) return null;
  return <section className="child-review-queue" aria-labelledby="child-review-heading">
    <div><p className="section-kicker">我的加练清单</p><h2 id="child-review-heading">再试一次，知识会更牢</h2><p>这是你在课后自己选的，不是错题榜。练会后可以重新选择“我会讲了”。</p></div>
    <ol>{queue.map((entry) => <li key={entry.course.id}>
      <span aria-hidden="true">{entry.confidence === "help" ? "🙋" : "↻"}</span>
      <div><strong>{entry.course.title}</strong><small>{entry.confidence === "help" ? "和大人一起探索" : `${entry.course.minutes} 分钟再练一次`}</small></div>
      <button onClick={() => onStartCourse(entry.course.id)} type="button">开始加练</button>
    </li>)}</ol>
    {remaining > 0 ? <p className="child-review-more" role="status">还有 {remaining} 课在加练清单里。先完成上面一课，回来会继续看到。</p> : null}
  </section>;
}
