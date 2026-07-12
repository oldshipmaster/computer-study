import { ISLANDS } from "./course-data.ts";
export interface IslandSeal { id: string; name: string; icon: string; completedCount: number; remainingCount: number; unlocked: boolean; }
export function buildIslandSeals(completedCourseIds: readonly string[]): IslandSeal[] {
  const completed = new Set(completedCourseIds);
  return ISLANDS.map((island) => {
    const completedCount = island.courseIds.filter((id) => completed.has(id)).length;
    return { id: island.id, name: island.name, icon: island.icon, completedCount, remainingCount: island.courseIds.length - completedCount, unlocked: completedCount === island.courseIds.length };
  });
}
