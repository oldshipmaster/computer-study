import { COURSES } from "./course-data.ts";
import { parseProgress } from "./progress.mjs";
import { sanitizeCompletedBossIds } from "./island-boss.ts";

export interface BackupProgress { version: 1; completedCourseIds: string[]; badgeIds: string[]; coursePlayCounts: Record<string, number>; knowledgeSprint: { bestScore: number; runsPlayed: number }; completedBossIds: string[]; confidenceByCourse: Record<string, "confident" | "practice" | "help">; settings: { sound: boolean; reducedMotion: boolean }; resume: { courseId: string; stage: number } | null; }
export type BackupParseResult = { ok: true; progress: BackupProgress } | { ok: false; message: string };
const KNOWN_COURSE_IDS = new Set(COURSES.map((course) => course.id));

function safeKnowledgeSprint(value: unknown): BackupProgress["knowledgeSprint"] {
  const sprint = value && typeof value === "object" ? value as Partial<BackupProgress["knowledgeSprint"]> : {};
  return {
    bestScore: Number.isInteger(sprint.bestScore) && sprint.bestScore! >= 0 && sprint.bestScore! <= 750 ? sprint.bestScore! : 0,
    runsPlayed: Number.isInteger(sprint.runsPlayed) && sprint.runsPlayed! >= 0 && sprint.runsPlayed! <= 10_000 ? sprint.runsPlayed! : 0,
  };
}

export function createProgressBackup(progress: BackupProgress, exportedAt = new Date().toISOString()): string {
  const safeProgress: BackupProgress = {
    version: 1,
    completedCourseIds: [...progress.completedCourseIds],
    badgeIds: [...progress.badgeIds],
    coursePlayCounts: Object.fromEntries(progress.completedCourseIds.map((courseId) => {
      const count = progress.coursePlayCounts?.[courseId];
      return [courseId, Number.isInteger(count) && count >= 1 && count <= 3 ? count : 1];
    })),
    knowledgeSprint: safeKnowledgeSprint(progress.knowledgeSprint),
    completedBossIds: sanitizeCompletedBossIds(progress.completedBossIds, progress.completedCourseIds),
    confidenceByCourse: { ...progress.confidenceByCourse },
    settings: {
      sound: progress.settings.sound,
      reducedMotion: progress.settings.reducedMotion,
    },
    resume: progress.resume ? { ...progress.resume } : null,
  };
  return JSON.stringify({ kind: "bit-island-progress-backup", version: 1, exportedAt, progress: safeProgress }, null, 2);
}

export function parseProgressBackup(text: string): BackupParseResult {
  try {
    const backup = JSON.parse(text);
    if (!backup || typeof backup !== "object" || backup.kind !== "bit-island-progress-backup" || backup.version !== 1 || !backup.progress) return { ok: false, message: "这不是可识别的比特岛学习记录文件。" };
    const parsed = parseProgress(JSON.stringify(backup.progress)) as BackupProgress;
    const completedCourseIds = parsed.completedCourseIds.filter((id) => KNOWN_COURSE_IDS.has(id));
    const completed = new Set(completedCourseIds);
    const resume = parsed.resume && KNOWN_COURSE_IDS.has(parsed.resume.courseId) && !completed.has(parsed.resume.courseId) && parsed.resume.stage <= 5 ? parsed.resume : null;
    const confidenceByCourse = Object.fromEntries(Object.entries(parsed.confidenceByCourse).filter(([id]) => KNOWN_COURSE_IDS.has(id) && completed.has(id)));
    const coursePlayCounts = Object.fromEntries(completedCourseIds.map((courseId) => {
      const count = parsed.coursePlayCounts[courseId];
      return [courseId, Number.isInteger(count) && count >= 1 && count <= 3 ? count : 1];
    }));
    return { ok: true, progress: { ...parsed, completedCourseIds, badgeIds: parsed.badgeIds.filter((id) => /^[a-z0-9-]{1,64}$/i.test(id)), coursePlayCounts, knowledgeSprint: safeKnowledgeSprint(parsed.knowledgeSprint), completedBossIds: sanitizeCompletedBossIds(parsed.completedBossIds, completedCourseIds), confidenceByCourse, resume } };
  } catch {
    return { ok: false, message: "文件内容无法读取，请选择之前导出的 JSON 文件。" };
  }
}
