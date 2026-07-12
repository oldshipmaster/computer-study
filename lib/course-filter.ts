import type { Course } from "./course-data.ts";

export interface CourseFilter { islandId: string; query: string; difficulty?: "all" | Course["difficulty"]; }
export function filterCourses(courses: readonly Course[], filter: CourseFilter): Course[] {
  const query = filter.query.trim().toLocaleLowerCase("zh-CN");
  return courses.filter((course) => {
    if (filter.islandId !== "all" && course.islandId !== filter.islandId) return false;
    if (filter.difficulty && filter.difficulty !== "all" && course.difficulty !== filter.difficulty) return false;
    if (!query) return true;
    return [course.title, course.summary, course.skill].some((value) => value.toLocaleLowerCase("zh-CN").includes(query));
  });
}
