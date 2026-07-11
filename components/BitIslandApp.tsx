"use client";

import { useCallback, useEffect, useState } from "react";
import { Bibi } from "@/components/Bibi";
import { IslandMap } from "@/components/IslandMap";
import { KeyboardFlightLesson } from "@/components/KeyboardFlightLesson";
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

export function BitIslandApp() {
  const [screen, setScreen] = useState<Screen>("map");
  const [progress, setProgress] = useState(DEFAULT_PROGRESS);
  const [progressLoaded, setProgressLoaded] = useState(false);
  const [storageUnavailable, setStorageUnavailable] = useState(false);
  const currentCourse = getCourse(PLAYABLE_COURSE_ID);

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

  function startCourse(courseId: string) {
    const course = getCourse(courseId);

    if (course?.playable && course.id === PLAYABLE_COURSE_ID) {
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

  if (screen === "lesson" && currentCourse) {
    return (
      <KeyboardFlightLesson
        initialStage={
          progress.resume?.courseId === PLAYABLE_COURSE_ID ? progress.resume.stage : 0
        }
        onComplete={finishCourse}
        onExit={() => setScreen("map")}
        onStageChange={saveLessonStage}
        reducedMotion={progress.settings.reducedMotion}
        sound={progress.settings.sound}
      />
    );
  }

  if (screen === "complete") {
    return (
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
  }

  return (
    <IslandMap
      completedCourseIds={progress.completedCourseIds}
      onStartCourse={startCourse}
    />
  );
}
