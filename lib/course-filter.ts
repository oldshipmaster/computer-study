import type { Course } from "./course-data.ts";
import { DICTIONARY_ENTRIES } from "./computer-dictionary.ts";

const DICTIONARY_TERMS_BY_COURSE = new Map<string, string>();
for (const entry of DICTIONARY_ENTRIES) {
  DICTIONARY_TERMS_BY_COURSE.set(entry.courseId, `${DICTIONARY_TERMS_BY_COURSE.get(entry.courseId) ?? ""} ${entry.term} ${entry.english}`);
}

function matchesCourseQuery(course: Course, query: string): boolean {
  const haystack = [course.title, course.summary, course.skill, DICTIONARY_TERMS_BY_COURSE.get(course.id) ?? ""].join(" ").toLocaleLowerCase("zh-CN");
  return /^[a-z0-9]{1,2}$/.test(query)
    ? haystack.split(/[^a-z0-9]+/).includes(query)
    : haystack.includes(query);
}

export interface CourseFilter { islandId: string; query: string; difficulty?: "all" | Course["difficulty"]; completion?: "all" | "completed" | "unfinished"; completedCourseIds?: readonly string[]; }
export function filterCourses(courses: readonly Course[], filter: CourseFilter): Course[] {
  const query = filter.query.trim().toLocaleLowerCase("zh-CN").replace(/\s+/g, " ");
  const completed = new Set(filter.completedCourseIds ?? []);
  return courses.filter((course) => {
    if (filter.islandId !== "all" && course.islandId !== filter.islandId) return false;
    if (filter.difficulty && filter.difficulty !== "all" && course.difficulty !== filter.difficulty) return false;
    if (filter.completion === "completed" && !completed.has(course.id)) return false;
    if (filter.completion === "unfinished" && completed.has(course.id)) return false;
    if (!query) return true;
    return matchesCourseQuery(course, query);
  });
}
