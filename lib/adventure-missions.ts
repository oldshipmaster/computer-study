import type { Course } from "./course-data.ts";

export type AdventureMissionKind = "frontier" | "replay" | "repair" | "expedition";
export type CourseConfidence = "confident" | "practice" | "help";

export interface AdventureMission {
  id: string;
  kind: AdventureMissionKind;
  course: Course;
  eyebrow: string;
  title: string;
  description: string;
  rewardLabel: string;
}

export interface AdventureMissionInput {
  courses: readonly Course[];
  completedCourseIds: readonly string[];
  coursePlayCounts: Readonly<Record<string, number>>;
  confidenceByCourse: Readonly<Record<string, CourseConfidence>>;
  rotation: number;
}

export interface ExplorerRank {
  threshold: number;
  name: string;
  icon: string;
  message: string;
}

export interface RankProgress {
  value: number;
  max: number;
  nextRank: ExplorerRank | null;
  remaining: number;
}

export interface CourseCompletionReward {
  points: number;
  playNumber: number;
  rewarded: boolean;
}

export const EXPLORER_RANKS: readonly ExplorerRank[] = [
  { threshold: 0, name: "启航护目镜", icon: "◉", message: "看清每一条新航线" },
  { threshold: 60, name: "星图天线", icon: "⌁", message: "发现知识之间的信号" },
  { threshold: 180, name: "数据披风", icon: "◇", message: "带着数据安全远航" },
  { threshold: 360, name: "量子背包", icon: "▣", message: "装下更多解决办法" },
  { threshold: 650, name: "群岛探险冠", icon: "✦", message: "能把整座比特岛讲明白" },
] as const;

function normalizedRotation(rotation: number, length: number) {
  if (length === 0) return 0;
  const integer = Number.isFinite(rotation) ? Math.trunc(rotation) : 0;
  return ((integer % length) + length) % length;
}

function safePlayCount(count: number | undefined) {
  if (!Number.isInteger(count) || (count ?? 0) <= 0) return 0;
  return Math.min(3, count ?? 0);
}

function rankedCandidates(
  courses: readonly Course[],
  coursePlayCounts: Readonly<Record<string, number>>,
  excludedIds: ReadonlySet<string>,
) {
  return courses
    .filter((course) => course.playable && !excludedIds.has(course.id))
    .sort((first, second) => {
      const countDifference = safePlayCount(coursePlayCounts[first.id]) - safePlayCount(coursePlayCounts[second.id]);
      return countDifference || first.order - second.order;
    });
}

function rotatedPick<T>(items: readonly T[], rotation: number): T | undefined {
  return items[normalizedRotation(rotation, items.length)];
}

function rewardLabel(courseId: string, coursePlayCounts: Readonly<Record<string, number>>) {
  const count = safePlayCount(coursePlayCounts[courseId]);
  if (count === 0) return "+10 探险能量";
  if (count < 3) return "+3 探险能量";
  return "自由巩固";
}

function missionCopy(kind: AdventureMissionKind, course: Course) {
  if (kind === "frontier") return {
    eyebrow: "开新航线",
    title: course.title,
    description: `用 ${course.minutes} 分钟学会一个新本领。`,
  };
  if (kind === "replay") return {
    eyebrow: "回访藏宝洞",
    title: course.title,
    description: "再玩一次，试着比上次少看一个提示。",
  };
  if (kind === "repair") return {
    eyebrow: "修补能量站",
    title: course.title,
    description: "带着问题再试一次，完成后讲出关键原理。",
  };
  return {
    eyebrow: "随机远征",
    title: course.title,
    description: "全岛已点亮，抽一条低频航线重新探索。",
  };
}

function createMission(
  kind: AdventureMissionKind,
  course: Course,
  coursePlayCounts: Readonly<Record<string, number>>,
): AdventureMission {
  return {
    id: `${kind}-${course.id}`,
    kind,
    course,
    ...missionCopy(kind, course),
    rewardLabel: rewardLabel(course.id, coursePlayCounts),
  };
}

export function buildAdventureMissions(input: AdventureMissionInput): AdventureMission[] {
  const playableCourses = [...input.courses].filter((course) => course.playable).sort((a, b) => a.order - b.order);
  const knownIds = new Set(playableCourses.map((course) => course.id));
  const completedIds = new Set(input.completedCourseIds.filter((id) => knownIds.has(id)));
  const completedCourses = playableCourses.filter((course) => completedIds.has(course.id));
  const incompleteCourses = playableCourses.filter((course) => !completedIds.has(course.id));
  const selectedIds = new Set<string>();
  const missions: AdventureMission[] = [];

  const repairCandidates = (confidence: CourseConfidence) => rankedCandidates(
    completedCourses.filter((course) => input.confidenceByCourse[course.id] === confidence),
    input.coursePlayCounts,
    selectedIds,
  );
  const reservedRepair = rotatedPick(repairCandidates("help"), input.rotation)
    ?? rotatedPick(repairCandidates("practice"), input.rotation);

  const leadCourse = incompleteCourses[0]
    ?? rotatedPick(rankedCandidates(completedCourses, input.coursePlayCounts, selectedIds), input.rotation);
  if (leadCourse) {
    const kind: AdventureMissionKind = incompleteCourses.length > 0 ? "frontier" : "expedition";
    missions.push(createMission(kind, leadCourse, input.coursePlayCounts));
    selectedIds.add(leadCourse.id);
  }

  const replayExcluded = new Set(selectedIds);
  if (reservedRepair) replayExcluded.add(reservedRepair.id);
  const replayCourse = rotatedPick(
    rankedCandidates(completedCourses, input.coursePlayCounts, replayExcluded),
    input.rotation,
  );
  if (replayCourse) {
    missions.push(createMission("replay", replayCourse, input.coursePlayCounts));
    selectedIds.add(replayCourse.id);
  }

  const repairCourse = reservedRepair && !selectedIds.has(reservedRepair.id)
    ? reservedRepair
    : rotatedPick(rankedCandidates(completedCourses, input.coursePlayCounts, selectedIds), input.rotation + 1);
  if (repairCourse) {
    missions.push(createMission("repair", repairCourse, input.coursePlayCounts));
  }

  return missions.slice(0, 3);
}

export function getAdventureEnergy(coursePlayCounts: Readonly<Record<string, number>>) {
  return Object.values(coursePlayCounts).reduce((total, rawCount) => {
    const count = safePlayCount(rawCount);
    return total + (count >= 1 ? 10 + Math.min(2, count - 1) * 3 : 0);
  }, 0);
}

export function getCourseCompletionReward(previousPlayCount: number): CourseCompletionReward {
  const safePreviousCount = Number.isInteger(previousPlayCount) && previousPlayCount >= 0
    ? previousPlayCount
    : 0;
  const points = safePreviousCount === 0 ? 10 : safePreviousCount < 3 ? 3 : 0;
  return {
    points,
    playNumber: safePreviousCount + 1,
    rewarded: points > 0,
  };
}

export function getExplorerRank(energy: number): ExplorerRank {
  const safeEnergy = Number.isFinite(energy) ? Math.max(0, energy) : 0;
  return [...EXPLORER_RANKS].reverse().find((rank) => safeEnergy >= rank.threshold) ?? EXPLORER_RANKS[0];
}

export function getRankProgress(energy: number): RankProgress {
  const safeEnergy = Number.isFinite(energy) ? Math.max(0, Math.trunc(energy)) : 0;
  const currentIndex = EXPLORER_RANKS.findIndex((rank) => rank === getExplorerRank(safeEnergy));
  const nextRank = EXPLORER_RANKS[currentIndex + 1] ?? null;
  const max = nextRank?.threshold ?? EXPLORER_RANKS.at(-1)?.threshold ?? 0;
  return {
    value: Math.min(safeEnergy, max),
    max,
    nextRank,
    remaining: nextRank ? Math.max(0, nextRank.threshold - safeEnergy) : 0,
  };
}
