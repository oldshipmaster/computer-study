"use client";

import { useState } from "react";
import { Bibi } from "@/components/Bibi";
import { IslandMap } from "@/components/IslandMap";
import { getCourse } from "@/lib/course-data";

type Screen = "map" | "lesson" | "complete";

const PLAYABLE_COURSE_ID = "keyboard-flight";

export function BitIslandApp() {
  const [screen, setScreen] = useState<Screen>("map");
  const currentCourse = getCourse(PLAYABLE_COURSE_ID);

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

  return <IslandMap completedCourseIds={[]} onStartCourse={startCourse} />;
}
