"use client";

import { useEffect, useState } from "react";
import { Bibi } from "@/components/Bibi";
import { IslandMap } from "@/components/IslandMap";
import { getCourse } from "@/lib/course-data";
import {
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

  if (screen === "lesson" && currentCourse) {
    return (
      <main className="lesson-preview">
        <button className="back-action" onClick={() => setScreen("map")} type="button">
          <span aria-hidden="true">←</span>
          返回课程地图
        </button>
        <section className="lesson-preview-card" aria-labelledby="lesson-preview-title">
          <div>
            <p className="hero-kicker">启航港任务</p>
            <h1 id="lesson-preview-title">{currentCourse.title}</h1>
            <p>{currentCourse.summary}</p>
          </div>
          <Bibi mood="thinking" message="飞船控制台已经亮起。我们先认识方向键和空格键。" />
        </section>
      </main>
    );
  }

  if (screen === "complete") {
    return (
      <main className="lesson-preview">
        <section className="lesson-preview-card" aria-labelledby="complete-title">
          <div>
            <p className="hero-kicker">任务完成</p>
            <h1 id="complete-title">你已点亮第一段航线</h1>
            <button className="primary-action" onClick={() => setScreen("map")} type="button">
              回到岛屿地图
            </button>
          </div>
          <Bibi mood="celebrating" message="做得很好！休息一会儿，我们下次再出发。" />
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
