"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { IslandMap } from "@/components/IslandMap";
import { LessonCompletion } from "@/components/lessons/LessonCompletion";
import { LessonAudioProvider } from "@/components/lessons/LessonAudio";
import { getLessonDefinition } from "@/components/lessons/lesson-registry";
import { ParentPanel, type ParentProgress } from "@/components/ParentPanel";
import { getCourse } from "@/lib/course-data";
import {
  completeCourse,
  DEFAULT_PROGRESS,
  parseProgress,
  resetProgress,
  storeProgress,
} from "@/lib/progress.mjs";

type Screen = "map" | "lesson" | "complete";

const PROGRESS_STORAGE_KEY = "bit-island-progress-v1";
const PARENT_HOLD_DURATION_MS = 1_500;

export function BitIslandApp() {
  const [screen, setScreen] = useState<Screen>("map");
  const [activeCourseId, setActiveCourseId] = useState<string | null>(null);
  const [progress, setProgress] = useState(DEFAULT_PROGRESS);
  const [progressLoaded, setProgressLoaded] = useState(false);
  const [storageUnavailable, setStorageUnavailable] = useState(false);
  const [parentPanelOpen, setParentPanelOpen] = useState(false);
  const [parentGateHolding, setParentGateHolding] = useState(false);
  const [keyboardConfirmationVisible, setKeyboardConfirmationVisible] = useState(false);
  const [systemPrefersReducedMotion, setSystemPrefersReducedMotion] = useState(false);
  const parentGateButtonRef = useRef<HTMLButtonElement>(null);
  const keyboardConfirmationCancelButtonRef = useRef<HTMLButtonElement>(null);
  const mapHeadingRef = useRef<HTMLHeadingElement>(null);
  const completeHeadingRef = useRef<HTMLHeadingElement>(null);
  const previousScreenRef = useRef<Screen>(screen);
  const pendingMapFocusIdRef = useRef<string | null>(null);
  const parentHoldTimerRef = useRef<number | null>(null);
  const currentCourse = activeCourseId ? getCourse(activeCourseId) : undefined;
  const lessonDefinition = activeCourseId
    ? getLessonDefinition(activeCourseId)
    : undefined;
  const effectiveReducedMotion =
    progress.settings.reducedMotion || systemPrefersReducedMotion;

  useLayoutEffect(() => {
    const previousScreen = previousScreenRef.current;
    previousScreenRef.current = screen;

    if (parentPanelOpen || previousScreen === screen) {
      return;
    }

    if (screen === "map") {
      const focusCourseId = pendingMapFocusIdRef.current;
      pendingMapFocusIdRef.current = null;
      const courseCard = focusCourseId
        ? document.querySelector<HTMLButtonElement>(
            `[data-course-id="${focusCourseId}"]`,
          )
        : null;
      (courseCard ?? mapHeadingRef.current)?.focus();
    } else if (screen === "complete") {
      completeHeadingRef.current?.focus();
    }
  }, [parentPanelOpen, screen]);

  useEffect(() => {
    let cancelled = false;

    queueMicrotask(() => {
      if (cancelled) {
        return;
      }

      try {
        setProgress(parseProgress(window.localStorage.getItem(PROGRESS_STORAGE_KEY)));
      } catch {
        setStorageUnavailable(true);
      } finally {
        setProgressLoaded(true);
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!progressLoaded || storageUnavailable) {
      return;
    }

    let cancelled = false;

    try {
      storeProgress(window.localStorage, PROGRESS_STORAGE_KEY, progress);
    } catch {
      queueMicrotask(() => {
        if (!cancelled) {
          setStorageUnavailable(true);
        }
      });
    }

    return () => {
      cancelled = true;
    };
  }, [progress, progressLoaded, storageUnavailable]);

  useEffect(() => {
    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncReducedMotionPreference = () => {
      setSystemPrefersReducedMotion(reducedMotionQuery.matches);
    };

    queueMicrotask(syncReducedMotionPreference);
    reducedMotionQuery.addEventListener("change", syncReducedMotionPreference);
    return () => {
      reducedMotionQuery.removeEventListener("change", syncReducedMotionPreference);
    };
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle(
      "bit-island-document--reduced-motion",
      progress.settings.reducedMotion,
    );

    return () => {
      document.documentElement.classList.remove("bit-island-document--reduced-motion");
    };
  }, [progress.settings.reducedMotion]);

  useLayoutEffect(() => {
    if (!keyboardConfirmationVisible) {
      return;
    }

    keyboardConfirmationCancelButtonRef.current?.focus();
  }, [keyboardConfirmationVisible]);

  const cancelParentHold = useCallback(() => {
    if (parentHoldTimerRef.current !== null) {
      window.clearTimeout(parentHoldTimerRef.current);
      parentHoldTimerRef.current = null;
    }
    setParentGateHolding(false);
  }, []);

  useEffect(() => {
    function cancelParentHoldOnVisibilityLoss() {
      if (document.visibilityState !== "visible") {
        cancelParentHold();
      }
    }

    window.addEventListener("blur", cancelParentHold);
    document.addEventListener("visibilitychange", cancelParentHoldOnVisibilityLoss);

    return () => {
      window.removeEventListener("blur", cancelParentHold);
      document.removeEventListener("visibilitychange", cancelParentHoldOnVisibilityLoss);

      if (parentHoldTimerRef.current !== null) {
        window.clearTimeout(parentHoldTimerRef.current);
        parentHoldTimerRef.current = null;
      }
    };
  }, [cancelParentHold]);

  function startCourse(courseId: string) {
    const course = getCourse(courseId);
    const lessonDefinition = getLessonDefinition(courseId);

    if (course?.playable && lessonDefinition) {
      cancelParentHold();
      setKeyboardConfirmationVisible(false);
      setParentPanelOpen(false);
      setActiveCourseId(course.id);
      setScreen("lesson");
    }
  }

  const saveLessonStage = useCallback((stage: number) => {
    if (!activeCourseId) {
      return;
    }

    setProgress((currentProgress) => ({
      ...currentProgress,
      resume: {
        courseId: activeCourseId,
        stage,
      },
    }));
  }, [activeCourseId]);

  const awardCourse = useCallback((courseId: string, badgeId: string) => {
    setProgress((currentProgress) => completeCourse(currentProgress, courseId, badgeId));
  }, []);

  const finishCourse = useCallback(() => {
    setScreen("complete");
  }, []);

  const returnToMap = useCallback(() => {
    pendingMapFocusIdRef.current = activeCourseId;
    setScreen("map");
  }, [activeCourseId]);

  const openParentPanel = useCallback(() => {
    cancelParentHold();
    setKeyboardConfirmationVisible(false);
    setParentPanelOpen(true);
  }, [cancelParentHold]);

  const closeParentPanel = useCallback(() => {
    setParentPanelOpen(false);
    window.setTimeout(() => parentGateButtonRef.current?.focus(), 0);
  }, []);

  const closeKeyboardConfirmation = useCallback(() => {
    setKeyboardConfirmationVisible(false);
    window.setTimeout(() => parentGateButtonRef.current?.focus(), 0);
  }, []);

  function beginParentHold(event: ReactPointerEvent<HTMLButtonElement>) {
    if (event.button !== 0 || parentPanelOpen) {
      return;
    }

    cancelParentHold();
    setKeyboardConfirmationVisible(false);
    setParentGateHolding(true);
    parentHoldTimerRef.current = window.setTimeout(
      openParentPanel,
      PARENT_HOLD_DURATION_MS,
    );
  }

  function requestKeyboardConfirmation(event: ReactKeyboardEvent<HTMLButtonElement>) {
    if (event.key !== "Enter" && event.key !== " ") {
      return;
    }

    event.preventDefault();
    cancelParentHold();
    setKeyboardConfirmationVisible(true);
  }

  function handleParentGateClick(event: ReactMouseEvent<HTMLButtonElement>) {
    if (event.detail === 0) {
      setKeyboardConfirmationVisible(true);
    }
  }

  const updateSettings = useCallback((settings: ParentProgress["settings"]) => {
    setProgress((currentProgress) => ({
      ...currentProgress,
      settings,
    }));
  }, []);

  const resetLearningProgress = useCallback(() => {
    const nextProgress = resetProgress(progress);
    setProgress(nextProgress);

    try {
      storeProgress(window.localStorage, PROGRESS_STORAGE_KEY, nextProgress);
      setStorageUnavailable(false);
    } catch {
      setStorageUnavailable(true);
    }

    setScreen("map");
  }, [progress]);

  const restoreLearningProgress = useCallback((restoredProgress: typeof progress) => {
    setProgress(restoredProgress);
    try {
      storeProgress(window.localStorage, PROGRESS_STORAGE_KEY, restoredProgress);
      setStorageUnavailable(false);
    } catch {
      setStorageUnavailable(true);
    }
  }, []);

  let productScreen;

  if (screen === "lesson" && currentCourse && lessonDefinition) {
    const LessonComponent = lessonDefinition.Component;
    productScreen = (
      <LessonAudioProvider enabled={progress.settings.sound}>
        <LessonComponent
          initialStage={
            progress.resume?.courseId === activeCourseId ? progress.resume.stage : 0
          }
          onAward={() => awardCourse(lessonDefinition.courseId, lessonDefinition.badgeId)}
          onComplete={finishCourse}
          onExit={returnToMap}
          onStageChange={saveLessonStage}
          reducedMotion={effectiveReducedMotion}
          sound={progress.settings.sound}
        />
      </LessonAudioProvider>
    );
  } else if (screen === "complete" && lessonDefinition) {
    productScreen = (
      <LessonCompletion
        definition={lessonDefinition}
        headingRef={completeHeadingRef}
        onReturn={returnToMap}
      />
    );
  } else {
    productScreen = (
      <IslandMap
        completedCourseIds={progress.completedCourseIds}
        headingRef={mapHeadingRef}
        onStartCourse={startCourse}
      />
    );
  }

  return (
    <div
      className={`bit-island-app ${
        effectiveReducedMotion ? "bit-island-app--reduced-motion" : ""
      }`}
    >
      <div
        aria-hidden={parentPanelOpen ? true : undefined}
        className="bit-island-product"
        inert={parentPanelOpen ? true : undefined}
      >
        {productScreen}

        {screen !== "lesson" ? (
          <div className="parent-gate-area">
            {keyboardConfirmationVisible ? (
              <div
                aria-label="确认进入家长区"
                className="parent-gate-confirmation"
                onKeyDown={(event) => {
                  if (event.key === "Escape") {
                    event.preventDefault();
                    closeKeyboardConfirmation();
                  }
                }}
                role="group"
              >
                <p>这是给大人查看学习记录和设置的地方。</p>
                <div>
                  <button
                    className="parent-confirm-action"
                    onClick={openParentPanel}
                    type="button"
                  >
                    进入家长区
                  </button>
                  <button
                    className="parent-cancel-action"
                    onClick={closeKeyboardConfirmation}
                    ref={keyboardConfirmationCancelButtonRef}
                    type="button"
                  >
                    取消
                  </button>
                </div>
              </div>
            ) : null}

            <button
              aria-label="家长区。长按进入；使用键盘时按回车键或空格键后确认。"
              className={`parent-gate ${parentGateHolding ? "is-holding" : ""}`}
              onClick={handleParentGateClick}
              onKeyDown={requestKeyboardConfirmation}
              onPointerCancel={cancelParentHold}
              onPointerDown={beginParentHold}
              onPointerLeave={cancelParentHold}
              onPointerUp={cancelParentHold}
              ref={parentGateButtonRef}
              type="button"
            >
              <span className="parent-gate-icon" aria-hidden="true">⚙</span>
              <span>
                <strong>家长区</strong>
                <small>{parentGateHolding ? "继续按住…" : "长按进入"}</small>
              </span>
              <span className="parent-gate-progress" aria-hidden="true" />
            </button>
          </div>
        ) : null}
      </div>

      {parentPanelOpen && screen !== "lesson" ? (
        <ParentPanel
          onClose={closeParentPanel}
          onReset={resetLearningProgress}
          onRestore={restoreLearningProgress}
          onSettingsChange={updateSettings}
          progress={progress}
          storageUnavailable={storageUnavailable}
        />
      ) : null}
    </div>
  );
}
