"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { Bibi } from "@/components/Bibi";
import {
  CompleteStage,
  IntroStage,
  KeysStage,
  PracticeStage,
} from "@/components/keyboard-flight/LessonStages";
import { ProgramStage } from "@/components/keyboard-flight/ProgramStage";
import {
  LESSON_STAGES,
  STAGE_TITLES,
  normalizeKeyboardKey,
  shouldCaptureLessonKey,
} from "@/components/keyboard-flight/lesson-model";
import { useKeyboardFlightLesson } from "@/components/keyboard-flight/useKeyboardFlightLesson";

export interface KeyboardFlightLessonProps {
  initialStage: number;
  reducedMotion: boolean;
  sound: boolean;
  onStageChange: (stage: number) => void;
  onAward: (courseId: string, badgeId: string) => void;
  onComplete: () => void;
  onExit: () => void;
}

export function KeyboardFlightLesson({
  initialStage,
  reducedMotion,
  sound,
  onAward,
  onStageChange,
  onComplete,
  onExit,
}: KeyboardFlightLessonProps) {
  const lesson = useKeyboardFlightLesson({
    initialStage,
    onAward,
    onComplete,
    onStageChange,
    reducedMotion,
    sound,
  });
  const { handlePracticeKey, handleTutorialKey, stage } = lesson;
  const stageHeadingRef = useRef<HTMLHeadingElement>(null);

  useLayoutEffect(() => {
    stageHeadingRef.current?.focus();
  }, [stage]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const lessonKey = normalizeKeyboardKey(event.key, event.code);
      if (!lessonKey || (stage !== "keys" && stage !== "practice")) {
        return;
      }

      const target = event.target;
      const activatesInteractiveControl =
        lessonKey === " " &&
        target instanceof HTMLElement &&
        Boolean(target.closest("button, a, input, select, textarea"));
      if (!shouldCaptureLessonKey(lessonKey, activatesInteractiveControl)) {
        return;
      }

      event.preventDefault();
      if (stage === "keys") {
        handleTutorialKey(lessonKey);
      } else {
        handlePracticeKey(lessonKey);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handlePracticeKey, handleTutorialKey, stage]);

  const runLabel =
    lesson.runState === "running"
      ? "飞船执行中…"
      : lesson.runState === "failure"
        ? "再试一次"
        : "运行飞船";

  return (
    <main
      className={`flight-lesson ${reducedMotion ? "flight-lesson--reduced-motion" : ""}`}
    >
      <header className="lesson-topbar">
        <button className="back-action" onClick={onExit} type="button">
          <span aria-hidden="true">←</span>
          返回课程地图
        </button>
        <div>
          <span className="lesson-course-name">键盘驾驶飞船</span>
          <span className="lesson-stage-count">第 {lesson.stageIndex + 1} / 5 段</span>
        </div>
      </header>

      <ol className="lesson-progress" aria-label="课程进度">
        {LESSON_STAGES.map((item, index) => (
          <li
            aria-label={`第 ${index + 1} 段：${STAGE_TITLES[item]}`}
            aria-current={item === stage ? "step" : undefined}
            className={`${index < lesson.stageIndex ? "is-complete" : ""} ${
              item === stage ? "is-current" : ""
            }`}
            key={item}
          >
            <span>{index + 1}</span>
            <strong>{STAGE_TITLES[item]}</strong>
          </li>
        ))}
      </ol>

      <div className="lesson-shell">
        <div className="lesson-guide" aria-live="polite" aria-atomic="true">
          <Bibi
            className="bibi--lesson"
            mood={stage === "complete" ? "celebrating" : "thinking"}
            message={lesson.guideMessage}
          />
        </div>

        {stage === "intro" ? (
          <IntroStage headingRef={stageHeadingRef} onSkip={lesson.moveFromIntro} />
        ) : null}

        {stage === "keys" ? (
          <KeysStage
            activeKey={lesson.activeKey}
            headingRef={stageHeadingRef}
            highlightContinue={lesson.hintLevel > 0}
            highlightedKey={lesson.nextTutorialKey}
            onContinue={lesson.moveFromKeys}
            onKey={lesson.handleTutorialKey}
            pressedKeys={lesson.pressedKeys}
            title="方向键热身"
          />
        ) : null}

        {stage === "practice" ? (
          <PracticeStage
            activeKey={lesson.activeKey}
            collected={lesson.practiceCollected}
            direction={lesson.practiceDirection}
            headingRef={stageHeadingRef}
            highlightContinue={lesson.hintLevel > 0}
            highlightedKey={lesson.practiceHintKey}
            onContinue={lesson.moveFromPractice}
            onKey={lesson.handlePracticeKey}
            position={lesson.practicePosition}
            title="飞船训练场"
          />
        ) : null}

        {stage === "program" ? (
          <ProgramStage
            collected={lesson.programCollected}
            currentInstruction={lesson.currentInstruction}
            direction={lesson.programDirection}
            guidance={lesson.programGuidance}
            headingRef={stageHeadingRef}
            highlightedInstruction={lesson.highlightedInstruction}
            highlightedQueueIndex={lesson.highlightedQueueIndex}
            highlightRunButton={lesson.highlightRunButton}
            onAdd={lesson.addInstruction}
            onDragStart={lesson.beginInstructionDrag}
            onDrop={lesson.dropInstruction}
            onMove={lesson.moveInstruction}
            onRemove={lesson.removeInstruction}
            onRun={lesson.runFlightProgram}
            position={lesson.programPosition}
            queue={lesson.programQueue}
            runLabel={runLabel}
            runState={lesson.runState}
            title="指令积木"
          />
        ) : null}

        {stage === "complete" ? (
          <CompleteStage
            badgeName="键盘领航员"
            headingRef={stageHeadingRef}
            onExit={onExit}
          />
        ) : null}
      </div>
    </main>
  );
}
