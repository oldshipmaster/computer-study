import type { Course } from "./course-data.ts";

export interface CourseFilter { islandId: string; query: string; difficulty?: "all" | Course["difficulty"]; completion?: "all" | "completed" | "unfinished"; completedCourseIds?: readonly string[]; }
export function filterCourses(courses: readonly Course[], filter: CourseFilter): Course[] {
  const query = filter.query.trim().toLocaleLowerCase("zh-CN");
  const completed = new Set(filter.completedCourseIds ?? []);
  return courses.filter((course) => {
    if (filter.islandId !== "all" && course.islandId !== filter.islandId) return false;
    if (filter.difficulty && filter.difficulty !== "all" && course.difficulty !== filter.difficulty) return false;
    if (filter.completion === "completed" && !completed.has(course.id)) return false;
    if (filter.completion === "unfinished" && completed.has(course.id)) return false;
    if (!query) return true;
    return [course.title, course.summary, course.skill].some((value) => value.toLocaleLowerCase("zh-CN").includes(query));
  });
}
