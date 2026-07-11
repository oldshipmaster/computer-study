export const MOUSE_STAGES = [
  "intro",
  "move",
  "click",
  "doubleClick",
  "drag",
  "challenge",
] as const;

export type MouseLessonStage = (typeof MOUSE_STAGES)[number];
export type MouseSkill = "move" | "click" | "doubleClick" | "drag";

export interface MouseLessonState {
  stage: MouseLessonStage;
  movedTargets: string[];
  draggedCrates: string[];
  challengeSkills: MouseSkill[];
  wrongAttempts: number;
  complete: boolean;
}

export type MouseLessonAction =
  | { type: "continue" }
  | { type: "moveTarget"; targetId: string }
  | { type: "clickTarget"; targetId: string }
  | { type: "doubleClickTarget"; targetId: string }
  | { type: "dropCrate"; crateId: string; bayId: string }
  | { type: "challengeSkill"; skill: MouseSkill };

export const INITIAL_MOUSE_STATE: MouseLessonState = {
  stage: "intro",
  movedTargets: [],
  draggedCrates: [],
  challengeSkills: [],
  wrongAttempts: 0,
  complete: false,
};

function appendUnique<T>(items: readonly T[], value: T): T[] {
  return items.includes(value) ? [...items] : [...items, value];
}

export function advanceMouseSequence(
  state: MouseLessonState,
  action: MouseLessonAction,
): MouseLessonState {
  if (state.complete) return state;

  if (state.stage === "intro" && action.type === "continue") {
    return { ...state, stage: "move" };
  }
  if (state.stage === "move" && action.type === "moveTarget") {
    const movedTargets = appendUnique(state.movedTargets, action.targetId);
    return { ...state, movedTargets, stage: movedTargets.length >= 3 ? "click" : "move" };
  }
  if (state.stage === "click" && action.type === "clickTarget") {
    return action.targetId === "yellow-beacon"
      ? { ...state, stage: "doubleClick" }
      : { ...state, wrongAttempts: state.wrongAttempts + 1 };
  }
  if (state.stage === "doubleClick" && action.type === "doubleClickTarget") {
    return action.targetId === "blue-hatch"
      ? { ...state, stage: "drag" }
      : { ...state, wrongAttempts: state.wrongAttempts + 1 };
  }
  if (state.stage === "doubleClick" && action.type === "clickTarget") return state;
  if (state.stage === "drag" && action.type === "dropCrate") {
    if (action.crateId !== action.bayId) {
      return { ...state, wrongAttempts: state.wrongAttempts + 1 };
    }
    const draggedCrates = appendUnique(state.draggedCrates, action.crateId);
    return { ...state, draggedCrates, stage: draggedCrates.length >= 3 ? "challenge" : "drag" };
  }
  if (state.stage === "challenge" && action.type === "challengeSkill") {
    const challengeSkills = appendUnique(state.challengeSkills, action.skill);
    return { ...state, challengeSkills, complete: challengeSkills.length === 4 };
  }
  return state;
}

export function isUsefulMouseAction(previous: MouseLessonState, next: MouseLessonState): boolean {
  return previous.stage !== next.stage ||
    previous.movedTargets.length !== next.movedTargets.length ||
    previous.draggedCrates.length !== next.draggedCrates.length ||
    previous.challengeSkills.length !== next.challengeSkills.length ||
    (!previous.complete && next.complete);
}

export function normalizeMouseResumeStage(value: unknown): MouseLessonStage {
  const index = typeof value === "number" && Number.isFinite(value)
    ? Math.max(0, Math.min(MOUSE_STAGES.length - 1, Math.floor(value)))
    : 0;
  return MOUSE_STAGES[index];
}
