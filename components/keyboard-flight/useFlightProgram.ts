import { useCallback, useEffect, useRef, useState } from "react";
import { CHALLENGE, runProgram } from "@/lib/flight-engine.mjs";
import {
  FAILURE_MESSAGE,
  START_DIRECTION,
  START_POSITION,
  getProgramProgressScore,
  getProgramHintTarget,
  hasProgramMadeProgress,
  claimCompletionAward,
  instructionLabel,
  moveProgramQueueItem,
  nextProgramGuidance,
  wait,
  type Direction,
  type Position,
  type ProgramInstruction,
  type ProgramQueueItem,
  type RunState,
} from "@/components/keyboard-flight/lesson-model";

interface FlightProgramOptions {
  announce: (caption: string, withSpeech?: boolean) => void;
  hintLevel: number;
  markUserGesture: () => void;
  onSuccess: () => void;
  onSuccessTransition: () => void;
  reducedMotion: boolean;
  registerUsefulInput: () => void;
}

export function useFlightProgram({
  announce,
  hintLevel,
  markUserGesture,
  onSuccess,
  onSuccessTransition,
  reducedMotion,
  registerUsefulInput,
}: FlightProgramOptions) {
  const [programQueue, setProgramQueue] = useState<ProgramQueueItem[]>([]);
  const [programPosition, setProgramPosition] = useState<Position>(START_POSITION);
  const [programDirection, setProgramDirection] = useState<Direction>(START_DIRECTION);
  const [programCollected, setProgramCollected] = useState(false);
  const [currentInstruction, setCurrentInstruction] = useState<number | null>(null);
  const [runState, setRunState] = useState<RunState>("idle");
  const [failedRuns, setFailedRuns] = useState(0);
  const [programGuidance, setProgramGuidance] = useState<string | null>(null);
  const runSequenceRef = useRef(0);
  const completionAwardedRef = useRef(false);
  const draggedInstructionRef = useRef<number | null>(null);
  const nextProgramItemIdRef = useRef(1);
  const bestProgramProgressRef = useRef(getProgramProgressScore([]));

  useEffect(
    () => () => {
      runSequenceRef.current += 1;
    },
    [],
  );

  const editProgram = useCallback(
    (nextQueue: ProgramQueueItem[], message: string) => {
      const nextInstructions = nextQueue.map((item) => item.instruction);
      setProgramQueue(nextQueue);
      setCurrentInstruction(null);
      setProgramGuidance(null);
      if (hasProgramMadeProgress(nextInstructions, bestProgramProgressRef.current)) {
        bestProgramProgressRef.current = getProgramProgressScore(nextInstructions);
        registerUsefulInput();
      }
      announce(message, true);
    },
    [announce, registerUsefulInput],
  );

  const addInstruction = useCallback(
    (instruction: ProgramInstruction) => {
      markUserGesture();
      if (runState === "running") {
        return;
      }

      const item = {
        id: nextProgramItemIdRef.current,
        instruction,
      };
      nextProgramItemIdRef.current += 1;

      editProgram(
        [...programQueue, item],
        `已把“${instructionLabel(instruction)}”放到第 ${programQueue.length + 1} 步。`,
      );
    },
    [editProgram, markUserGesture, programQueue, runState],
  );

  const moveInstruction = useCallback(
    (index: number, offset: -1 | 1) => {
      markUserGesture();
      const targetIndex = index + offset;
      if (runState === "running" || targetIndex < 0 || targetIndex >= programQueue.length) {
        return;
      }

      const nextQueue = moveProgramQueueItem(programQueue, index, targetIndex);
      editProgram(nextQueue, `第 ${index + 1} 步已经向${offset < 0 ? "左" : "右"}移动。`);
    },
    [editProgram, markUserGesture, programQueue, runState],
  );

  const removeInstruction = useCallback(
    (index: number) => {
      markUserGesture();
      if (runState === "running") {
        return;
      }

      const removed = programQueue[index];
      editProgram(
        programQueue.filter((_, itemIndex) => itemIndex !== index),
        `已移除“${instructionLabel(removed.instruction)}”。`,
      );
    },
    [editProgram, markUserGesture, programQueue, runState],
  );

  const beginInstructionDrag = useCallback(
    (index: number) => {
      markUserGesture();
      draggedInstructionRef.current = index;
    },
    [markUserGesture],
  );

  const dropInstruction = useCallback(
    (targetIndex: number) => {
      const sourceIndex = draggedInstructionRef.current;
      draggedInstructionRef.current = null;
      if (
        sourceIndex === null ||
        sourceIndex === targetIndex ||
        runState === "running" ||
        sourceIndex < 0 ||
        sourceIndex >= programQueue.length
      ) {
        return;
      }

      const moved = programQueue[sourceIndex];
      const nextQueue = moveProgramQueueItem(programQueue, sourceIndex, targetIndex);
      editProgram(
        nextQueue,
        `已把“${instructionLabel(moved.instruction)}”拖到第 ${targetIndex + 1} 步。`,
      );
    },
    [editProgram, programQueue, runState],
  );

  const runFlightProgram = useCallback(async () => {
    markUserGesture();
    registerUsefulInput();

    if (runState === "running") {
      return;
    }

    if (programQueue.length === 0) {
      announce("先放一块指令积木，再运行飞船。", true);
      return;
    }

    const sequence = runSequenceRef.current + 1;
    runSequenceRef.current = sequence;
    const programInstructions = programQueue.map((item) => item.instruction);
    const result = runProgram(programInstructions, CHALLENGE);
    const stepDelay = reducedMotion ? 0 : 320;

    setRunState("running");
    setProgramGuidance(null);
    setProgramPosition(START_POSITION);
    setProgramDirection(START_DIRECTION);
    setProgramCollected(false);
    announce("飞船开始按顺序执行指令。", true);

    for (let index = 0; index < result.steps.length; index += 1) {
      setCurrentInstruction(index);
      await wait(stepDelay);
      if (runSequenceRef.current !== sequence) {
        return;
      }

      const step = result.steps[index];
      setProgramPosition(step.position);
      setProgramDirection(step.direction as Direction);
      setProgramCollected(step.collected);
      await wait(stepDelay);
      if (runSequenceRef.current !== sequence) {
        return;
      }
    }

    setCurrentInstruction(null);
    setRunState(result.success ? "success" : "failure");

    if (result.success) {
      claimCompletionAward(completionAwardedRef, onSuccess);
      announce("成功收集能量星！这就是按顺序执行指令。", true);
      await wait(reducedMotion ? 0 : 650);
      if (runSequenceRef.current === sequence) {
        onSuccessTransition();
      }
      return;
    }

    const nextFailureCount = failedRuns + 1;
    setFailedRuns(nextFailureCount);
    setProgramPosition(START_POSITION);
    setProgramDirection(START_DIRECTION);
    setProgramCollected(false);
    if (nextFailureCount >= 2) {
      const guidance = nextProgramGuidance(programInstructions);
      setProgramGuidance(guidance);
      announce(`${FAILURE_MESSAGE}。${guidance}`, true);
    } else {
      announce(FAILURE_MESSAGE, true);
    }
  }, [
    announce,
    failedRuns,
    markUserGesture,
    onSuccess,
    onSuccessTransition,
    programQueue,
    reducedMotion,
    registerUsefulInput,
    runState,
  ]);

  const hintTarget = getProgramHintTarget(
    programQueue.map((item) => item.instruction),
    hintLevel > 0,
  );

  return {
    addInstruction,
    beginInstructionDrag,
    currentInstruction,
    dropInstruction,
    highlightedInstruction: hintTarget.instruction,
    highlightedQueueIndex: hintTarget.queueIndex,
    highlightRunButton: hintTarget.run,
    moveInstruction,
    programCollected,
    programDirection,
    programGuidance,
    programPosition,
    programQueue,
    removeInstruction,
    runFlightProgram,
    runState,
  };
}
