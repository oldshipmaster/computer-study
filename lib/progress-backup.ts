import { COURSES } from "./course-data.ts";
import { parseProgress } from "./progress.mjs";

export interface BackupProgress { version: 1; completedCourseIds: string[]; badgeIds: string[]; confidenceByCourse: Record<string, "confident" | "practice" | "help">; settings: { sound: boolean; reducedMotion: boolean }; resume: { courseId: string; stage: number } | null; }
export type BackupParseResult = { ok: true; progress: BackupProgress } | { ok: false; message: string };
const KNOWN_COURSE_IDS = new Set(COURSES.map((course) => course.id));

export function createProgressBackup(progress: BackupProgress, exportedAt = new Date().toISOString()): string {
  return JSON.stringify({ kind: "bit-island-progress-backup", version: 1, exportedAt, progress }, null, 2);
}

export function parseProgressBackup(text: string): BackupParseResult {
  try {
    const backup = JSON.parse(text);
    if (!backup || typeof backup !== "object" || backup.kind !== "bit-island-progress-backup" || backup.version !== 1 || !backup.progress) return { ok: false, message: "这不是可识别的比特岛学习记录文件。" };
    const parsed = parseProgress(JSON.stringify(backup.progress)) as BackupProgress;
    const completedCourseIds = parsed.completedCourseIds.filter((id) => KNOWN_COURSE_IDS.has(id));
    const resume = parsed.resume && KNOWN_COURSE_IDS.has(parsed.resume.courseId) && parsed.resume.stage <= 5 ? parsed.resume : null;
    const confidenceByCourse = Object.fromEntries(Object.entries(parsed.confidenceByCourse).filter(([id]) => KNOWN_COURSE_IDS.has(id)));
    return { ok: true, progress: { ...parsed, completedCourseIds, badgeIds: parsed.badgeIds.filter((id) => /^[a-z0-9-]{1,64}$/i.test(id)), confidenceByCourse, resume } };
  } catch {
    return { ok: false, message: "文件内容无法读取，请选择之前导出的 JSON 文件。" };
  }
}
