import { COURSES } from "./course-data.ts";
import type { BackupProgress } from "./progress-backup.ts";
const COURSE_IDS = new Set(COURSES.map((course) => course.id));
export function sanitizeCatalogProgress(progress: BackupProgress): BackupProgress {
  const completedCourseIds = [...new Set(progress.completedCourseIds)].filter((id) => COURSE_IDS.has(id));
  const completed = new Set(completedCourseIds);
  const resume = progress.resume && COURSE_IDS.has(progress.resume.courseId) && !completed.has(progress.resume.courseId) && progress.resume.stage >= 0 && progress.resume.stage <= 5 ? { ...progress.resume } : null;
  const confidenceByCourse = Object.fromEntries(Object.entries(progress.confidenceByCourse).filter(([id]) => COURSE_IDS.has(id) && completed.has(id)));
  const coursePlayCounts = Object.fromEntries(completedCourseIds.map((courseId) => {
    const count = progress.coursePlayCounts?.[courseId];
    return [courseId, Number.isInteger(count) && count >= 1 && count <= 3 ? count : 1];
  }));
  return { ...progress, completedCourseIds, badgeIds: [...progress.badgeIds], coursePlayCounts, confidenceByCourse, settings: { ...progress.settings }, resume };
}
