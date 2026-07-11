"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { Bibi } from "@/components/Bibi";
import { IslandMap } from "@/components/IslandMap";
import { KeyboardFlightLesson } from "@/components/KeyboardFlightLesson";
import { ParentPanel, type ParentProgress } from "@/components/ParentPanel";
import { getCourse } from "@/lib/course-data";
import {
  completeCourse,
  DEFAULT_PROGRESS,
  parseProgress,
  serializeProgress,
} from "@/lib/progress.mjs";

type Screen = "map" | "lesson" | "complete";

const PLAYABLE_COURSE_ID = "keyboard-flight";
const PROGRESS_STORAGE_KEY = "bit-island-progress-v1";
const PARENT_HOLD_DURATION_MS = 1_500;

export function BitIslandApp() {
  const [screen, setScreen] = useState<Screen>("map");
  const [progress, setProgress] = useState(DEFAULT_PROGRESS);
  const [progressLoaded, setProgressLoaded] = useState(false);
  const [storageUnavailable, setStorageUnavailable] = useState(false);
  const [parentPanelOpen, setParentPanelOpen] = useState(false);
  const [parentGateHolding, setParentGateHolding] = useState(false);
  const [keyboardConfirmationVisible, setKeyboardConfirmationVisible] = useState(false);
  const [systemPrefersReducedMotion, setSystemPrefersReducedMotion] = useState(false);
  const parentGateButtonRef = useRef<HTMLButtonElement>(null);
  const keyboardConfirmationButtonRef = useRef<HTMLButtonElement>(null);
  const parentHoldTimerRef = useRef<number | null>(null);
  const currentCourse = getCourse(PLAYABLE_COURSE_ID);
  const effectiveReducedMotion =
    progress.settings.reducedMotion || systemPrefersReducedMotion;

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
      window.localStorage.setItem(PROGRESS_STORAGE_KEY, serializeProgress(progress));
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

  useEffect(() => {
    if (!keyboardConfirmationVisible) {
      return;
    }

    queueMicrotask(() => keyboardConfirmationButtonRef.current?.focus());
  }, [keyboardConfirmationVisible]);

  useEffect(() => {
    return () => {
      if (parentHoldTimerRef.current !== null) {
        window.clearTimeout(parentHoldTimerRef.current);
      }
    };
  }, []);

  const cancelParentHold = useCallback(() => {
    if (parentHoldTimerRef.current !== null) {
      window.clearTimeout(parentHoldTimerRef.current);
      parentHoldTimerRef.current = null;
    }
    setParentGateHolding(false);
  }, []);

  function startCourse(courseId: string) {
    const course = getCourse(courseId);

    if (course?.playable && course.id === PLAYABLE_COURSE_ID) {
      cancelParentHold();
      setKeyboardConfirmationVisible(false);
      setParentPanelOpen(false);
      setScreen("lesson");
    }
  }

  const saveLessonStage = useCallback((stage: number) => {
    setProgress((currentProgress) => ({
      ...currentProgress,
      resume: {
        courseId: PLAYABLE_COURSE_ID,
        stage,
      },
    }));
  }, []);

  const finishCourse = useCallback((courseId: string, badgeId: string) => {
    setProgress((currentProgress) => completeCourse(currentProgress, courseId, badgeId));
    setScreen("complete");
  }, []);

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
    setProgress((currentProgress) => ({
      ...DEFAULT_PROGRESS,
      settings: currentProgress.settings,
    }));
    setScreen("map");
  }, []);

  let productScreen;

  if (screen === "lesson" && currentCourse) {
    productScreen = (
      <KeyboardFlightLesson
        initialStage={
          progress.resume?.courseId === PLAYABLE_COURSE_ID ? progress.resume.stage : 0
        }
        onComplete={finishCourse}
        onExit={() => setScreen("map")}
        onStageChange={saveLessonStage}
        reducedMotion={effectiveReducedMotion}
        sound={progress.settings.sound}
      />
    );
  } else if (screen === "complete") {
    productScreen = (
      <main className="lesson-preview">
        <section className="lesson-preview-card" aria-labelledby="complete-title">
          <div>
            <p className="hero-kicker">任务完成</p>
            <h1 id="complete-title">你已点亮第一段航线</h1>
            <p>方向键负责移动，空格键负责行动，指令会按顺序执行。</p>
            <button className="primary-action" onClick={() => setScreen("map")} type="button">
              回到岛屿地图
            </button>
          </div>
          <div className="completion-summary">
            <div className="completion-badge" aria-label="获得键盘领航员徽章">
              <span aria-hidden="true">★</span>
              <strong>键盘领航员</strong>
              <small>新徽章</small>
            </div>
            <Bibi mood="celebrating" message="做得很好！现在离开屏幕看看远处，让眼睛休息一会儿。" />
          </div>
        </section>
      </main>
    );
  } else {
    productScreen = (
      <IslandMap
        completedCourseIds={progress.completedCourseIds}
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
                    ref={keyboardConfirmationButtonRef}
                    type="button"
                  >
                    进入家长区
                  </button>
                  <button
                    className="parent-cancel-action"
                    onClick={closeKeyboardConfirmation}
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
          onSettingsChange={updateSettings}
          progress={progress}
          storageUnavailable={storageUnavailable}
        />
      ) : null}
    </div>
  );
}
