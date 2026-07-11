import { ISLANDS } from "./course-data.ts";

export function summarizeIslandProgress(completedCourseIds: readonly string[]) {
  const completed = new Set(completedCourseIds);
  return ISLANDS.map((island) => ({
    id: island.id,
    name: island.name,
    icon: island.icon,
    completed: island.courseIds.filter((courseId) => completed.has(courseId)).length,
    total: island.courseIds.length,
  }));
}
