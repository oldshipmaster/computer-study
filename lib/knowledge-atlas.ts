import { COURSES, ISLANDS } from "./course-data.ts";
import { CURRICULUM_GUIDE } from "./curriculum-guide.ts";

export interface KnowledgeEntry {
  courseId: string;
  order: number;
  title: string;
  unlocked: boolean;
  concepts: string[];
}

export interface KnowledgeChapter {
  islandId: string;
  name: string;
  icon: string;
  courseCount: number;
  unlockedCount: number;
  entries: KnowledgeEntry[];
}

export function buildKnowledgeAtlas(completedCourseIds: readonly string[]): KnowledgeChapter[] {
  const completed = new Set(completedCourseIds);
  const coursesById = new Map(COURSES.map((course) => [course.id, course]));

  return ISLANDS.map((island) => {
    const entries = island.courseIds.flatMap((courseId) => {
      const course = coursesById.get(courseId);
      if (!course) return [];
      const unlocked = completed.has(courseId);

      return [{
        courseId,
        order: course.order,
        title: course.title,
        unlocked,
        concepts: unlocked ? [...(CURRICULUM_GUIDE[courseId]?.objectives ?? [])] : [],
      }];
    });

    return {
      islandId: island.id,
      name: island.name,
      icon: island.icon,
      courseCount: entries.length,
      unlockedCount: entries.filter((entry) => entry.unlocked).length,
      entries,
    };
  });
}
