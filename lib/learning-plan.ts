import { RECOMMENDED_ROUTE_IDS, getCourse, type Course } from "./course-data.ts";

export interface PlannedSession { sessionNumber: number; course: Course; breakReminder: string; }
export interface LearningPlan { sessions: PlannedSession[]; totalMinutes: number; complete: boolean; }

export function buildLearningPlan(completedCourseIds: readonly string[], count = 5): LearningPlan {
  const completed = new Set(completedCourseIds);
  const sessions = RECOMMENDED_ROUTE_IDS
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
