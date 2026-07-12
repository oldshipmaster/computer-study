"use client";

import { useState, type Ref } from "react";
import { Bibi } from "@/components/Bibi";
import { KnowledgeAtlas } from "@/components/KnowledgeAtlas";
import { ReviewChallenge } from "@/components/ReviewChallenge";
import { LearningPlan } from "@/components/LearningPlan";
import { CompletionCertificate } from "@/components/CompletionCertificate";
import { IslandSealCollection } from "@/components/IslandSealCollection";
import { PrivacyPromise } from "@/components/PrivacyPromise";
import { OfflineStatus } from "@/components/OfflineStatus";
import { ComputerDictionary } from "@/components/ComputerDictionary";
import { ChildReviewQueue } from "@/components/ChildReviewQueue";
import type { CourseConfidence } from "@/lib/review-queue";
import {
  ISLANDS,
  COURSES,
  CURRICULUM_FACTS,
  getCourse,
  getCourseCardState,
  getMapMission,
  type Course,
  type CourseCardState,
} from "@/lib/course-data";
import { filterCourses } from "@/lib/course-filter";

interface IslandMapProps {
  completedCourseIds: string[];
  headingRef: Ref<HTMLHeadingElement>;
  onStartCourse: (courseId: string) => void;
  resume: { courseId: string; stage: number } | null;
  confidenceByCourse: Record<string, CourseConfidence>;
}

const DIFFICULTY_LABELS: Record<Course["difficulty"], string> = {
  1: "轻松",
  2: "进阶",
  3: "挑战",
};

interface CourseCardProps {
  course: Course;
  state: CourseCardState;
  onStartCourse: (courseId: string) => void;
}

function CourseCard({ course, state, onStartCourse }: CourseCardProps) {
  const available = course.playable;
  const completed = state === "completed";
  const status = completed ? "已完成" : state === "available" ? "开始任务" : "即将开放";

  return (
    <li className="course-card-wrap">
      <button
        className={`course-card ${completed ? "course-card--complete" : ""} ${
          available ? "course-card--available" : "course-card--locked"
        }`}
        data-course-card
        data-course-id={course.id}
        disabled={!available}
        onClick={available ? () => onStartCourse(course.id) : undefined}
        type="button"
      >
        <span className="course-card-topline">
          <span className="course-number">第 {String(course.order).padStart(2, "0")} 课</span>
          <span className="course-status">{status}</span>
        </span>
        <span className="course-card-copy">
          <strong>{course.title}</strong>
          <span>{course.summary}</span>
        </span>
        <span className="course-card-meta">
          <span>{course.skill}</span>
          <span>{course.minutes} 分钟</span>
          <span>{DIFFICULTY_LABELS[course.difficulty]}</span>
        </span>
      </button>
    </li>
  );
}

export function IslandMap({
  completedCourseIds,
  headingRef,
  onStartCourse,
  resume,
  confidenceByCourse,
}: IslandMapProps) {
  const [courseQuery, setCourseQuery] = useState("");
  const [selectedIslandId, setSelectedIslandId] = useState("all");
  const mission = getMapMission(completedCourseIds, resume);
  const currentCourse = mission.course;
  const resuming = Boolean(resume && currentCourse?.id === resume.courseId);
  const visibleCourseIds = new Set(filterCourses(COURSES, { islandId: selectedIslandId, query: courseQuery }).map((course) => course.id));

  return (
    <main className="island-app-shell">
      <header className="site-header" aria-label="比特岛导航">
        <a className="brand-mark" href="#adventure-map" aria-label="比特岛大冒险课程地图">
          <span className="brand-orbit" aria-hidden="true">
            B
          </span>
          <span>比特岛大冒险</span>
        </a>
        <span className="island-count">{CURRICULUM_FACTS.islandCount} 座知识岛等你探索</span>
      </header>

      <section className="map-hero" aria-labelledby="map-heading">
        <div className="hero-copy">
          <p className="hero-kicker">
            {mission.complete ? "全岛已点亮" : "今天的探险任务"}
          </p>
          <h1
            className="screen-focus-heading"
            id="map-heading"
            ref={headingRef}
            tabIndex={-1}
          >
            {mission.complete
              ? `${CURRICULUM_FACTS.courseCount} 段航线全部完成，继续自由探索`
              : "跟比比一起，学会真正的电脑本领"}
          </h1>
          <p className="hero-summary">
            {mission.complete
              ? "你已经学会电脑操作、文件管理、编程思维和数字安全，可以随时重玩喜欢的课程。"
              : `每次用 ${CURRICULUM_FACTS.minutesPerCourse.minimum}–${CURRICULUM_FACTS.minutesPerCourse.maximum} 分钟完成一个小任务，${CURRICULUM_FACTS.islandCount} 座岛轮换探索，让操作、编程、安全和创作穿插进行。`}
          </p>

          {currentCourse ? (
            <div className="current-mission" aria-label="当前任务">
              <span className="mission-label">
                {mission.complete ? "自由重玩" : resuming ? "续课任务" : "当前任务"}
              </span>
              <div>
                <strong>{currentCourse.title}</strong>
                <span>{currentCourse.summary}</span>
              </div>
              <button
                className="primary-action"
                onClick={() => onStartCourse(currentCourse.id)}
                type="button"
              >
                {mission.complete ? "重玩第一课" : resuming ? `继续第 ${resume.stage + 1} 段` : "继续冒险"}
                <span aria-hidden="true">→</span>
              </button>
            </div>
          ) : null}
        </div>

        <div className="hero-world" aria-label="比比在启航港等你">
          <div className="hero-sun" aria-hidden="true" />
          <div className="hero-cloud hero-cloud--one" aria-hidden="true" />
          <div className="hero-cloud hero-cloud--two" aria-hidden="true" />
          <div className="launch-island" aria-hidden="true">
            <span className="launch-island-palm" />
            <span className="launch-island-ship">▲</span>
          </div>
          <Bibi
            mood={mission.complete ? "celebrating" : "happy"}
            message={
              mission.complete
                ? `太棒了！${CURRICULUM_FACTS.islandCount} 座岛都亮起来了。选一课重玩，看看你还能发现什么。`
                : "我是比比！今天先从启航港学会驾驶飞船。"
            }
          />
        </div>
      </section>

      <LearningPlan completedCourseIds={completedCourseIds} onStartCourse={onStartCourse} resume={resume} />
      <ChildReviewQueue confidenceByCourse={confidenceByCourse} onStartCourse={onStartCourse} />
      <IslandSealCollection completedCourseIds={completedCourseIds} />
      {mission.complete ? <CompletionCertificate /> : null}

      <KnowledgeAtlas completedCourseIds={completedCourseIds} />
      <ComputerDictionary />
      <ReviewChallenge completedCourseIds={completedCourseIds} key={completedCourseIds.join("|")} />

      <section className="adventure-map" id="adventure-map" aria-labelledby="islands-heading">
        <div className="map-intro">
          <div>
            <p className="section-kicker">你的学习航线</p>
            <h2 id="islands-heading">{CURRICULUM_FACTS.islandCount} 座岛，{CURRICULUM_FACTS.courseCount} 次真本领练习</h2>
          </div>
          <p>推荐路线会在 {CURRICULUM_FACTS.islandCount} 座岛之间轮换；也可以从课程罗盘自由选择已开放的任意一课。</p>
        </div>

        <div className="course-compass" aria-labelledby="course-compass-heading">
          <div>
            <p className="section-kicker">课程罗盘</p>
            <h3 id="course-compass-heading">快速找到想练的本领</h3>
          </div>
          <label>
            搜索课程
            <input onChange={(event) => setCourseQuery(event.target.value)} placeholder="例如：文件、循环、AI" type="search" value={courseQuery} />
          </label>
          <div className="course-compass-islands" aria-label="按岛屿筛选">
            <button aria-pressed={selectedIslandId === "all"} onClick={() => setSelectedIslandId("all")} type="button">全部</button>
            {ISLANDS.map((island) => <button aria-pressed={selectedIslandId === island.id} key={island.id} onClick={() => setSelectedIslandId(island.id)} type="button"><span aria-hidden="true">{island.icon}</span>{island.name}</button>)}
          </div>
          <p role="status">找到 {visibleCourseIds.size} 节课程{courseQuery || selectedIslandId !== "all" ? "，下面只显示匹配结果" : "，按完整航线排列"}。</p>
        </div>

        {visibleCourseIds.size === 0 ? (
          <div className="course-empty-state" role="status">
            <span aria-hidden="true">🧭</span>
            <h3>罗盘暂时没找到这门课</h3>
            <p>试试“文件”“循环”“安全”“AI”，或者清除筛选查看完整航线。</p>
            <button className="primary-action" onClick={() => { setCourseQuery(""); setSelectedIslandId("all"); }} type="button">清除筛选，显示 {CURRICULUM_FACTS.courseCount} 课</button>
          </div>
        ) : <div className="map-route">
          {ISLANDS.map((island, islandIndex) => {
            const islandCourses = island.courseIds
              .map((courseId) => getCourse(courseId))
              .filter((course): course is Course => Boolean(course));
            const completedCount = island.courseIds.filter((courseId) =>
              completedCourseIds.includes(courseId),
            ).length;
            const visibleIslandCourses = islandCourses.filter((course) => visibleCourseIds.has(course.id));

            if (visibleIslandCourses.length === 0) return null;

            return (
              <div className="map-leg" key={island.id}>
                {islandIndex > 0 ? (
                  <div className={`route-curve route-curve--${islandIndex}`} aria-hidden="true">
                    <span />
                  </div>
                ) : null}
                <section
                  className="island-section"
                  data-accent={island.accent}
                  aria-labelledby={`${island.id}-heading`}
                >
                  <div className="island-heading-row">
                    <div className="island-title-group">
                      <span className="island-icon" aria-hidden="true">
                        {island.icon}
                      </span>
                      <div>
                        <span className="island-stage">航线 {islandIndex + 1}</span>
                        <h3 id={`${island.id}-heading`}>{island.name}</h3>
                        <p>{island.subtitle}</p>
                      </div>
                    </div>
                    <span className="island-progress">
                      <strong>{completedCount}</strong> / {island.courseIds.length} 完成
                    </span>
                  </div>

                  <ol className="course-grid">
                    {visibleIslandCourses.map((course) => (
                      <CourseCard
                        course={course}
                        key={course.id}
                        onStartCourse={onStartCourse}
                        state={getCourseCardState(course, completedCourseIds)}
                      />
                    ))}
                  </ol>
                </section>
              </div>
            );
          })}
        </div>}
      </section>

      <footer className="map-footer">
        <span aria-hidden="true">★</span>
        <p>完成一课后记得离开屏幕，看看远处，让眼睛休息一会儿。</p>
        <OfflineStatus />
        <PrivacyPromise />
      </footer>
    </main>
  );
}
