/**
 * @typedef {object} ProgressState
 * @property {1} version
 * @property {string[]} completedCourseIds
 * @property {string[]} badgeIds
 * @property {{ sound: boolean, reducedMotion: boolean }} settings
 * @property {{ courseId: string, stage: number } | null} resume
 * @property {Record<string, "confident" | "practice" | "help">} confidenceByCourse
 */

/** @type {ProgressState} */
export const DEFAULT_PROGRESS = {
  version: 1,
  completedCourseIds: [],
  badgeIds: [],
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

  return [...new Set(value.filter((item) => typeof item === "string"))];
}

function parseConfidence(value) {
  if (!isObject(value)) return {};
  return Object.fromEntries(Object.entries(value).filter((entry) =>
    typeof entry[0] === "string" && ["confident", "practice", "help"].includes(entry[1]),
  ));
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

    return {
      version: 1,
      completedCourseIds: uniqueStrings(stored.completedCourseIds),
      badgeIds: uniqueStrings(stored.badgeIds),
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
  return {
    ...progress,
    completedCourseIds: uniqueStrings([...progress.completedCourseIds, courseId]),
    badgeIds: uniqueStrings([...progress.badgeIds, badgeId]),
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
