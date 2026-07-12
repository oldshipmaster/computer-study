import { COURSES, ISLANDS } from "./course-data.ts";
export interface ProgressStats { completedCourses: number; remainingCourses: number; completedMinutes: number; remainingMinutes: number; totalMinutes: number; percent: number; completedIslands: number; remainingRounds: number; }
export function buildProgressStats(completedCourseIds: readonly string[]): ProgressStats {
  const completed = new Set(completedCourseIds);
  const completedCourses = COURSES.filter((course) => completed.has(course.id));
  const totalMinutes = COURSES.reduce((sum, course) => sum + course.minutes, 0);
  const completedMinutes = completedCourses.reduce((sum, course) => sum + course.minutes, 0);
  const remainingCourses = COURSES.length - completedCourses.length;
  return { completedCourses: completedCourses.length, remainingCourses, completedMinutes, remainingMinutes: totalMinutes - completedMinutes, totalMinutes, percent: Math.round((completedCourses.length / COURSES.length) * 100), completedIslands: ISLANDS.filter((island) => island.courseIds.every((id) => completed.has(id))).length, remainingRounds: Math.ceil(remainingCourses / 5) };
}
