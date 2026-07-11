import { useCallback, useEffect, useRef, useState } from "react";
import { CHALLENGE, runProgram } from "@/lib/flight-engine.mjs";
import {
  FAILURE_MESSAGE,
  START_DIRECTION,
  START_POSITION,
  getProgramHintTarget,
  instructionLabel,
  nextProgramGuidance,
  wait,
  type Direction,
  type Position,
  type ProgramInstruction,
  type RunState,
} from "@/components/keyboard-flight/lesson-model";

interface FlightProgramOptions {
  announce: (caption: string, withSpeech?: boolean) => void;
  hintLevel: number;
  markUserGesture: () => void;
  onSuccess: () => void;
  reducedMotion: boolean;
  registerUsefulInput: () => void;
}

export function useFlightProgram({
  announce,
  hintLevel,
  markUserGesture,
  onSuccess,
  reducedMotion,
  registerUsefulInput,
}: FlightProgramOptions) {
  const [programQueue, setProgramQueue] = useState<ProgramInstruction[]>([]);
  const [programPosition, setProgramPosition] = useState<Position>(START_POSITION);
  const [programDirection, setProgramDirection] = useState<Direction>(START_DIRECTION);
  const [programCollected, setProgramCollected] = useState(false);
  const [currentInstruction, setCurrentInstruction] = useState<number | null>(null);
  const [runState, setRunState] = useState<RunState>("idle");
  const [failedRuns, setFailedRuns] = useState(0);
  const [programGuidance, setProgramGuidance] = useState<string | null>(null);
  const runSequenceRef = useRef(0);
  const draggedInstructionRef = useRef<number | null>(null);

  useEffect(
    () => () => {
      runSequenceRef.current += 1;
    },
    [],
  );

  const editProgram = useCallback(
    (nextQueue: ProgramInstruction[], message: string) => {
      setProgramQueue(nextQueue);
      setCurrentInstruction(null);
      registerUsefulInput();
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

      editProgram(
        [...programQueue, instruction],
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

      const nextQueue = [...programQueue];
      [nextQueue[index], nextQueue[targetIndex]] = [nextQueue[targetIndex], nextQueue[index]];
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
        `已移除“${instructionLabel(removed)}”。`,
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

      const nextQueue = [...programQueue];
      const [moved] = nextQueue.splice(sourceIndex, 1);
      nextQueue.splice(targetIndex, 0, moved);
      editProgram(nextQueue, `已把“${instructionLabel(moved)}”拖到第 ${targetIndex + 1} 步。`);
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
    const result = runProgram(programQueue, CHALLENGE);
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
      announce("成功收集能量星！这就是按顺序执行指令。", true);
      await wait(reducedMotion ? 0 : 650);
      if (runSequenceRef.current === sequence) {
        onSuccess();
      }
      return;
    }

    const nextFailureCount = failedRuns + 1;
    setFailedRuns(nextFailureCount);
    setProgramPosition(START_POSITION);
    setProgramDirection(START_DIRECTION);
    setProgramCollected(false);
    if (nextFailureCount >= 2) {
      const guidance = nextProgramGuidance(programQueue);
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
    programQueue,
    reducedMotion,
    registerUsefulInput,
    runState,
  ]);

  const hintTarget = getProgramHintTarget(programQueue, hintLevel > 0);

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
