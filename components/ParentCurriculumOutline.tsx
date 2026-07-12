import { COURSES, ISLANDS } from "@/lib/course-data";
import { CURRICULUM_GUIDE } from "@/lib/curriculum-guide";

export function ParentCurriculumOutline({ completedCourseIds }: { completedCourseIds: string[] }) {
  const completed = new Set(completedCourseIds);
  return (
    <details className="parent-curriculum-outline">
      <summary><span><strong>查看 45 课完整课程大纲</strong><small>九座岛 · 每课 3 个目标 · 8–10 分钟</small></span><span aria-hidden="true">＋</span></summary>
      <div>
        {ISLANDS.map((island) => <section aria-labelledby={`parent-outline-${island.id}`} key={island.id}>
          <h3 id={`parent-outline-${island.id}`}><span aria-hidden="true">{island.icon}</span>{island.name}</h3>
          <ol>{island.courseIds.map((courseId) => {
            const course = COURSES.find((item) => item.id === courseId);
            const guide = CURRICULUM_GUIDE[courseId];
            if (!course || !guide) return null;
            return <li className={completed.has(courseId) ? "is-complete" : ""} key={courseId}>
              <div><strong>第 {course.order} 课 · {course.title}</strong><span>{course.minutes} 分钟 · {completed.has(courseId) ? "已完成" : "待探索"}</span></div>
              <ul>{guide.objectives.map((objective) => <li key={objective}>{objective}</li>)}</ul>
            </li>;
          })}</ol>
        </section>)}
      </div>
    </details>
  );
}
