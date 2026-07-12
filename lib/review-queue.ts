import { COURSES, type Course } from "./course-data.ts";

export type CourseConfidence = "confident" | "practice" | "help";
export interface ReviewQueueEntry { course: Course; confidence: "practice" | "help"; }

export function buildReviewQueue(confidenceByCourse: Readonly<Record<string, CourseConfidence>>, limit = 5): ReviewQueueEntry[] {
  if (!Number.isInteger(limit) || limit <= 0) return [];
  return COURSES.flatMap((course) => {
    const confidence = confidenceByCourse[course.id];
    return confidence === "practice" || confidence === "help" ? [{ course, confidence }] : [];
  }).sort((a, b) => {
    if (a.confidence !== b.confidence) return a.confidence === "help" ? -1 : 1;
    return a.course.order - b.course.order;
  }).slice(0, limit);
}
