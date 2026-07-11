import { CHALLENGE, runProgram } from "../../lib/flight-engine.mjs";

export const COURSE_ID = "keyboard-flight";
export const BADGE_ID = "keyboard-pilot";
export const HINT_DELAY_MS = 8_000;
export const SECOND_HINT_DELAY_MS = 16_000;
export const FAILURE_MESSAGE = "差一点，看看哪一步可以换一换";

export const LESSON_STAGES = ["intro", "keys", "practice", "program", "complete"] as const;
export const PROGRAM_SOLUTION = ["forward", "forward", "left", "forward", "collect"] as const;

export type LessonStage = (typeof LESSON_STAGES)[number];
export type Direction = "north" | "east" | "south" | "west";
export type ProgramInstruction = "forward" | "left" | "right" | "collect";
export type RunState = "idle" | "running" | "failure" | "success";

export interface ProgramQueueItem {
  id: number;
  instruction: ProgramInstruction;
}

export interface Position {
  x: number;
  y: number;
}

export interface CompletionGate {
  current: boolean;
}

export interface KeyDefinition {
  key: "ArrowUp" | "ArrowRight" | "ArrowDown" | "ArrowLeft" | " ";
  label: string;
  name: string;
  slot: string;
}

interface PracticeMove {
  delta: Position;
  direction: Direction;
  key: Exclude<KeyDefinition["key"], " ">;
}

export interface PracticeAction {
  collected: boolean;
  direction: Direction | null;
  position: Position;
  progressed: boolean;
}

export const KEY_DEFINITIONS: KeyDefinition[] = [
  { key: "ArrowUp", label: "↑", name: "上", slot: "up" },
  { key: "ArrowLeft", label: "←", name: "左", slot: "left" },
  { key: "ArrowDown", label: "↓", name: "下", slot: "down" },
  { key: "ArrowRight", label: "→", name: "右", slot: "right" },
  { key: " ", label: "空格键", name: "行动", slot: "space" },
];

export const PROGRAM_DEFINITIONS: Array<{
  instruction: ProgramInstruction;
  label: string;
  symbol: string;
}> = [
  { instruction: "forward", label: "前进", symbol: "↑" },
  { instruction: "left", label: "左转", symbol: "↶" },
  { instruction: "right", label: "右转", symbol: "↷" },
  { instruction: "collect", label: "收集", symbol: "★" },
];

export const STAGE_TITLES: Record<LessonStage, string> = {
  intro: "启航港紧急呼叫",
  keys: "方向键热身",
  practice: "飞船训练场",
  program: "指令积木",
  complete: "航线点亮",
};

export const STAGE_GUIDES: Record<LessonStage, string> = {
  intro: "飞船的控制台失灵了！准备好后，和我一起把它重新启动。",
  keys: "按下四个方向键和空格键。也可以点击画面里的按键。",
  practice: "用方向键飞到能量星旁边，再按空格键收集它。",
  program: "把指令按顺序放进轨道，然后运行飞船。",
  complete: "你会用键盘和顺序指令驾驶飞船了！",
};

export const SECOND_HINTS: Partial<Record<LessonStage, string>> = {
  keys: "看看正在发光的按键或下一步按钮，从那里继续。",
  practice: "看看正在发光的方向键或下一步按钮，从那里继续。",
  program: "从发光的积木开始，把飞船的路线一步一步排出来。",
};

export const START_POSITION: Position = { ...CHALLENGE.start };
export const START_DIRECTION = CHALLENGE.startDirection as Direction;

const PRACTICE_MOVES: PracticeMove[] = [
  { key: "ArrowUp", direction: "north", delta: { x: 0, y: -1 } },
  { key: "ArrowRight", direction: "east", delta: { x: 1, y: 0 } },
  { key: "ArrowDown", direction: "south", delta: { x: 0, y: 1 } },
  { key: "ArrowLeft", direction: "west", delta: { x: -1, y: 0 } },
];

export function samePosition(first: Position, second: Position) {
  return first.x === second.x && first.y === second.y;
}

export function normalizeKeyboardKey(key: string, code: string) {
  if (["ArrowUp", "ArrowRight", "ArrowDown", "ArrowLeft"].includes(key)) {
    return key as KeyDefinition["key"];
  }

  if (key === " " || key === "Spacebar" || code === "Space") {
    return " " as const;
  }

  return null;
}

export function shouldCaptureLessonKey(
  key: KeyDefinition["key"],
  interactiveTarget: boolean,
) {
  return key !== " " || !interactiveTarget;
}

export function isNewTutorialKey(pressedKeys: ReadonlySet<string>, key: KeyDefinition["key"]) {
  return !pressedKeys.has(key);
}

export function normalizeInitialLessonStage(initialStage: number) {
  const lastPlayableStage = LESSON_STAGES.indexOf("complete") - 1;

  if (!Number.isInteger(initialStage) || initialStage < 0) {
    return 0;
  }

  return Math.min(initialStage, lastPlayableStage);
}

export function claimCompletionAward(
  completionGate: CompletionGate,
  onAward: () => void,
) {
  if (completionGate.current) {
    return false;
  }

  completionGate.current = true;
  onAward();
  return true;
}

export function getPracticeAction(
  position: Position,
  key: KeyDefinition["key"],
): PracticeAction {
  if (key === " ") {
    const collected = samePosition(position, CHALLENGE.star);
    return { collected, direction: null, position, progressed: collected };
  }

  const move = PRACTICE_MOVES.find((candidate) => candidate.key === key);
  if (!move) {
    return { collected: false, direction: null, position, progressed: false };
  }

  const nextPosition = {
    x: position.x + move.delta.x,
    y: position.y + move.delta.y,
  };
  const outsideGrid =
    nextPosition.x < 0 ||
    nextPosition.x >= CHALLENGE.width ||
    nextPosition.y < 0 ||
    nextPosition.y >= CHALLENGE.height;
  const blocked = CHALLENGE.asteroids.some((asteroid) =>
    samePosition(nextPosition, asteroid),
  );

  return {
    collected: false,
    direction: move.direction,
    position: outsideGrid || blocked ? position : nextPosition,
    progressed: !outsideGrid && !blocked,
  };
}

export function instructionLabel(instruction: ProgramInstruction) {
  return PROGRAM_DEFINITIONS.find((item) => item.instruction === instruction)?.label ?? instruction;
}

export function getProgramProgressScore(queue: ProgramInstruction[]) {
  if (runProgram(queue, CHALLENGE).success) {
    return (PROGRAM_SOLUTION.length + 1) ** 2;
  }

  let correctPrefixLength = 0;
  while (
    correctPrefixLength < PROGRAM_SOLUTION.length &&
    queue[correctPrefixLength] === PROGRAM_SOLUTION[correctPrefixLength]
  ) {
    correctPrefixLength += 1;
  }

  const offTrackLength = queue.length - correctPrefixLength;
  return correctPrefixLength * (PROGRAM_SOLUTION.length + 1) - offTrackLength;
}

export function hasProgramMadeProgress(
  queue: ProgramInstruction[],
  bestProgressScore: number,
) {
  return getProgramProgressScore(queue) > bestProgressScore;
}

export function moveProgramQueueItem(
  queue: ProgramQueueItem[],
  sourceIndex: number,
  targetIndex: number,
) {
  if (
    sourceIndex === targetIndex ||
    sourceIndex < 0 ||
    sourceIndex >= queue.length ||
    targetIndex < 0 ||
    targetIndex >= queue.length
  ) {
    return queue;
  }

  const nextQueue = [...queue];
  const [moved] = nextQueue.splice(sourceIndex, 1);
  nextQueue.splice(targetIndex, 0, moved);
  return nextQueue;
}

export function nextProgramGuidance(queue: ProgramInstruction[]) {
  const mismatchIndex = PROGRAM_SOLUTION.findIndex(
    (instruction, index) => queue[index] !== instruction,
  );

  if (mismatchIndex >= 0) {
    return `只看下一步：第 ${mismatchIndex + 1} 步试试“${instructionLabel(
      PROGRAM_SOLUTION[mismatchIndex],
    )}”。`;
  }

  if (queue.length > PROGRAM_SOLUTION.length) {
    return `只看下一步：先移除第 ${PROGRAM_SOLUTION.length + 1} 步。`;
  }

  return "只看下一步：让最后一块“收集”留在能量星的位置。";
}

export function getProgramHintTarget(queue: ProgramInstruction[], active: boolean) {
  if (!active) {
    return { instruction: null, queueIndex: null, run: false };
  }

  if (runProgram(queue, CHALLENGE).success) {
    return { instruction: null, queueIndex: null, run: true };
  }

  const mismatchIndex = PROGRAM_SOLUTION.findIndex(
    (instruction, index) => queue[index] !== instruction,
  );

  if (mismatchIndex >= 0 && mismatchIndex < queue.length) {
    return { instruction: null, queueIndex: mismatchIndex, run: false };
  }

  if (mismatchIndex === queue.length) {
    return {
      instruction: PROGRAM_SOLUTION[mismatchIndex],
      queueIndex: null,
      run: false,
    };
  }

  if (queue.length > PROGRAM_SOLUTION.length) {
    return { instruction: null, queueIndex: PROGRAM_SOLUTION.length, run: false };
  }

  return { instruction: null, queueIndex: null, run: true };
}

export function nextPracticeKey(position: Position): KeyDefinition["key"] {
  if (samePosition(position, CHALLENGE.star)) {
    return " ";
  }

  const queue: Array<{ firstKey: KeyDefinition["key"] | null; position: Position }> = [
    { firstKey: null, position },
  ];
  const visited = new Set([`${position.x},${position.y}`]);

  while (queue.length > 0) {
    const current = queue.shift();
    if (!current) {
      break;
    }

    for (const move of PRACTICE_MOVES) {
      const nextPosition = {
        x: current.position.x + move.delta.x,
        y: current.position.y + move.delta.y,
      };
      const key = `${nextPosition.x},${nextPosition.y}`;
      const outsideGrid =
        nextPosition.x < 0 ||
        nextPosition.x >= CHALLENGE.width ||
        nextPosition.y < 0 ||
        nextPosition.y >= CHALLENGE.height;
      const blocked = CHALLENGE.asteroids.some((asteroid) =>
        samePosition(nextPosition, asteroid),
      );

      if (outsideGrid || blocked || visited.has(key)) {
        continue;
      }

      const firstKey = current.firstKey ?? move.key;
      if (samePosition(nextPosition, CHALLENGE.star)) {
        return firstKey;
      }

      visited.add(key);
      queue.push({ firstKey, position: nextPosition });
    }
  }

  return " ";
}

export function wait(milliseconds: number) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, milliseconds);
  });
}
