import { RECOMMENDED_ROUTE_IDS, getCourse, type Course } from "./course-data.ts";

export interface PlannedSession { sessionNumber: number; course: Course; breakReminder: string; }
export interface LearningPlan { sessions: PlannedSession[]; totalMinutes: number; complete: boolean; }

export function buildLearningPlan(completedCourseIds: readonly string[], count = 5, resume?: { courseId: string; stage: number } | null): LearningPlan {
  const completed = new Set(completedCourseIds);
  const resumeCourse = resume && !completed.has(resume.courseId) && resume.stage >= 0 && resume.stage <= 5 ? getCourse(resume.courseId) : undefined;
  const orderedIds = resumeCourse?.playable ? [resumeCourse.id, ...RECOMMENDED_ROUTE_IDS.filter((id) => id !== resumeCourse.id)] : RECOMMENDED_ROUTE_IDS;
  const sessions = orderedIds
    .filter((courseId) => !completed.has(courseId))
    .map((courseId) => getCourse(courseId))
    .filter((course): course is Course => Boolean(course?.playable))
    .slice(0, Math.max(0, Math.floor(count)))
    .map((course, index) => ({
      sessionNumber: index + 1,
      course,
      breakReminder: index === 4 ? "完成本轮，安排更长的离屏活动" : "完成后离开屏幕，看看远处",
    }));
  return { sessions, totalMinutes: sessions.reduce((total, item) => total + item.course.minutes, 0), complete: sessions.length === 0 };
}
