import { COURSES } from "./course-data.ts";
import type { CourseConfidence } from "./review-queue.ts";

export interface ConfidenceStats { confident: number; practice: number; help: number; unrated: number; rated: number; }

export function buildConfidenceStats(completedCourseIds: readonly string[], confidenceByCourse: Readonly<Record<string, CourseConfidence>>): ConfidenceStats {
  const completed = new Set(completedCourseIds);
  const stats: ConfidenceStats = { confident: 0, practice: 0, help: 0, unrated: 0, rated: 0 };
  for (const course of COURSES) {
    if (!completed.has(course.id)) continue;
    const confidence = confidenceByCourse[course.id];
    if (confidence === "confident" || confidence === "practice" || confidence === "help") {
      stats[confidence] += 1;
      stats.rated += 1;
    } else {
      stats.unrated += 1;
    }
  }
  return stats;
}
