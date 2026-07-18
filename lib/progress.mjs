/**
 * @typedef {object} ProgressState
 * @property {1} version
 * @property {string[]} completedCourseIds
 * @property {string[]} badgeIds
 * @property {Record<string, number>} coursePlayCounts
 * @property {{ sound: boolean, reducedMotion: boolean }} settings
 * @property {{ courseId: string, stage: number } | null} resume
 * @property {Record<string, "confident" | "practice" | "help">} confidenceByCourse
 */

/** @type {ProgressState} */
export const DEFAULT_PROGRESS = {
  version: 1,
  completedCourseIds: [],
  badgeIds: [],
  coursePlayCounts: {},
  confidenceByCourse: {},
  settings: {
    sound: true,
    reducedMotion: false,
  },
  resume: null,
};

/**
 * @param {unknown} value
 * @returns {value is Record<string, unknown>}
 */
function isObject(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * @param {unknown} value
 * @returns {string[]}
 */
function uniqueStrings(value) {
  if (!Array.isArray(value)) {
    return [];
  }

  return [...new Set(value.filter((item) => typeof item === "string" && item.length > 0 && item.length <= 64))].slice(0, 100);
}

function parseConfidence(value) {
  if (!isObject(value)) return {};
  return Object.fromEntries(Object.entries(value).filter((entry) =>
    entry[0].length > 0 && entry[0].length <= 64 && ["confident", "practice", "help"].includes(entry[1]),
  ).slice(0, 100));
}

function parseCoursePlayCounts(value, completedCourseIds) {
  const parsed = isObject(value)
    ? Object.fromEntries(Object.entries(value).filter(([courseId, count]) =>
        courseId.length > 0
        && courseId.length <= 64
        && Number.isInteger(count)
        && count >= 1
        && count <= 3,
      ).slice(0, 100))
    : {};

  return Object.fromEntries(completedCourseIds.map((courseId) => [
    courseId,
    parsed[courseId] ?? 1,
  ]));
}

/**
 * @param {string | null} raw
 * @returns {ProgressState}
 */
export function parseProgress(raw) {
  if (raw === null) {
    return DEFAULT_PROGRESS;
  }

  try {
    const stored = JSON.parse(raw);

    if (!isObject(stored) || stored.version !== 1) {
      return DEFAULT_PROGRESS;
    }

    const settings = isObject(stored.settings) ? stored.settings : {};
    const resume = isObject(stored.resume)
      && typeof stored.resume.courseId === "string"
      && Number.isInteger(stored.resume.stage)
      && stored.resume.stage >= 0
      ? {
          courseId: stored.resume.courseId,
          stage: stored.resume.stage,
        }
      : null;

    const completedCourseIds = uniqueStrings(stored.completedCourseIds);

    return {
      version: 1,
      completedCourseIds,
      badgeIds: uniqueStrings(stored.badgeIds),
      coursePlayCounts: parseCoursePlayCounts(stored.coursePlayCounts, completedCourseIds),
      confidenceByCourse: parseConfidence(stored.confidenceByCourse),
      settings: {
        sound: typeof settings.sound === "boolean"
          ? settings.sound
          : DEFAULT_PROGRESS.settings.sound,
        reducedMotion: typeof settings.reducedMotion === "boolean"
          ? settings.reducedMotion
          : DEFAULT_PROGRESS.settings.reducedMotion,
      },
      resume,
    };
  } catch {
    return DEFAULT_PROGRESS;
  }
}

/**
 * @param {ProgressState} progress
 * @returns {string}
 */
export function serializeProgress(progress) {
  return JSON.stringify(progress);
}

/**
 * @param {{ setItem(key: string, value: string): void }} storage
 * @param {string} key
 * @param {ProgressState} progress
 */
export function storeProgress(storage, key, progress) {
  storage.setItem(key, serializeProgress(progress));
}

/**
 * @param {ProgressState} progress
 * @returns {ProgressState}
 */
export function resetProgress(progress) {
  return {
    ...DEFAULT_PROGRESS,
    settings: {
      ...progress.settings,
    },
  };
}

/**
 * @param {ProgressState} progress
 * @param {string} courseId
 * @param {string} badgeId
 * @returns {ProgressState}
 */
export function completeCourse(progress, courseId, badgeId) {
  const currentPlayCount = progress.coursePlayCounts?.[courseId] ?? 0;
  return {
    ...progress,
    completedCourseIds: uniqueStrings([...progress.completedCourseIds, courseId]),
    badgeIds: uniqueStrings([...progress.badgeIds, badgeId]),
    coursePlayCounts: {
      ...progress.coursePlayCounts,
      [courseId]: Math.min(3, currentPlayCount + 1),
    },
    resume: null,
  };
}


export function setCourseConfidence(progress, courseId, confidence) {
  if (!progress.completedCourseIds.includes(courseId) || !["confident", "practice", "help"].includes(confidence)) return progress;
  return {
    ...progress,
    confidenceByCourse: {
      ...progress.confidenceByCourse,
      [courseId]: confidence,
    },
  };
}
