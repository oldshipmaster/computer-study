import { COURSES } from "./course-data.ts";
import type { BackupProgress } from "./progress-backup.ts";
const COURSE_IDS = new Set(COURSES.map((course) => course.id));
export function sanitizeCatalogProgress(progress: BackupProgress): BackupProgress {
  const completedCourseIds = [...new Set(progress.completedCourseIds)].filter((id) => COURSE_IDS.has(id));
  const resume = progress.resume && COURSE_IDS.has(progress.resume.courseId) && progress.resume.stage >= 0 && progress.resume.stage <= 5 ? { ...progress.resume } : null;
  const confidenceByCourse = Object.fromEntries(Object.entries(progress.confidenceByCourse).filter(([id]) => COURSE_IDS.has(id)));
  return { ...progress, completedCourseIds, badgeIds: [...progress.badgeIds], confidenceByCourse, settings: { ...progress.settings }, resume };
}
