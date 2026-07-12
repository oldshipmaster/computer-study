import { FOUNDATION_ROADMAP } from "@/lib/advanced-foundations/roadmap";
import { getCourse } from "@/lib/course-data";

interface FoundationRoadmapProps {
  completedCourseIds: readonly string[];
  onStartCourse: (courseId: string) => void;
}

export function FoundationRoadmap({ completedCourseIds, onStartCourse }: FoundationRoadmapProps) {
  const completed = new Set(completedCourseIds);
  return <section className="foundation-roadmap" id="foundation-roadmap" aria-labelledby="foundation-roadmap-heading">
    <header><p className="section-kicker">深度知识连接图</p><h2 id="foundation-roadmap-heading">从信息结构，一路潜到计算机和网络底层</h2><p>这不是背名词路线。每一课都回答上一步留下的新问题，也为下一步准备工具。</p></header>
    <div className="foundation-roadmap-grid">
      {FOUNDATION_ROADMAP.map((thread) => <article key={thread.islandId}>
        <div className="foundation-roadmap-title"><span aria-hidden="true">{thread.icon}</span><div><h3>{thread.title}</h3><p><strong>为什么要学这条线？</strong>{thread.bigQuestion}</p></div></div>
        <ol>{thread.steps.map((step, index) => {
          const course = getCourse(step.courseId);
          const done = completed.has(step.courseId);
          return <li className={done ? "foundation-roadmap-step--complete" : ""} key={step.courseId}>
            <span>{done ? "✓" : index + 1}</span><div><strong>{step.label}</strong><small>{step.connection}</small></div>
            <button onClick={() => onStartCourse(step.courseId)} type="button">{done ? "重玩" : course?.title ?? "开始"}</button>
          </li>;
        })}</ol>
      </article>)}
    </div>
  </section>;
}
