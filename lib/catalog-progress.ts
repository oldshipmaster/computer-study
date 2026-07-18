import { COURSES } from "./course-data.ts";
import type { BackupProgress } from "./progress-backup.ts";
import { sanitizeCompletedBossIds } from "./island-boss.ts";
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
  const knowledgeSprint = {
    bestScore: Number.isInteger(progress.knowledgeSprint?.bestScore) && progress.knowledgeSprint.bestScore >= 0 && progress.knowledgeSprint.bestScore <= 750 ? progress.knowledgeSprint.bestScore : 0,
    runsPlayed: Number.isInteger(progress.knowledgeSprint?.runsPlayed) && progress.knowledgeSprint.runsPlayed >= 0 && progress.knowledgeSprint.runsPlayed <= 10_000 ? progress.knowledgeSprint.runsPlayed : 0,
  };
  return {
    version: 1,
    completedCourseIds,
    badgeIds: [...progress.badgeIds],
    coursePlayCounts,
    knowledgeSprint,
    completedBossIds: sanitizeCompletedBossIds(progress.completedBossIds, completedCourseIds),
    confidenceByCourse,
    settings: { ...progress.settings },
    resume,
  };
}
