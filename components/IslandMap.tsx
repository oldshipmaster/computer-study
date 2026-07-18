"use client";

import { lazy, Suspense, useCallback, useEffect, useRef, useState, type Ref } from "react";
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
import { TermMatchChallenge } from "@/components/TermMatchChallenge";
import { AdventureMissionBoard } from "@/components/AdventureMissionBoard";
import { KnowledgeSprint } from "@/components/KnowledgeSprint";
import { IslandBossArena } from "@/components/IslandBossArena";
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
import { preloadLesson } from "@/components/lessons/lesson-registry";

const FoundationPractice = lazy(() => import("@/components/FoundationPractice").then((module) => ({ default: module.FoundationPractice })));
const FoundationRoadmap = lazy(() => import("@/components/FoundationRoadmap").then((module) => ({ default: module.FoundationRoadmap })));
const FoundationCapstone = lazy(() => import("@/components/FoundationCapstone").then((module) => ({ default: module.FoundationCapstone })));
const LogicCircuitLab = lazy(() => import("@/components/LogicCircuitLab").then((module) => ({ default: module.LogicCircuitLab })));
const RobotCodeExpedition = lazy(() => import("@/components/RobotCodeExpedition").then((module) => ({ default: module.RobotCodeExpedition })));
const PacketEscort = lazy(() => import("@/components/PacketEscort").then((module) => ({ default: module.PacketEscort })));
const CpuSchedulerGame = lazy(() => import("@/components/CpuSchedulerGame").then((module) => ({ default: module.CpuSchedulerGame })));
const AlgorithmArenaGame = lazy(() => import("@/components/AlgorithmArenaGame").then((module) => ({ default: module.AlgorithmArenaGame })));
const DataStructureHarbor = lazy(() => import("@/components/DataStructureHarbor").then((module) => ({ default: module.DataStructureHarbor })));
const SafetyDetectiveGame = lazy(() => import("@/components/SafetyDetectiveGame").then((module) => ({ default: module.SafetyDetectiveGame })));
const VirtualComputerFactory = lazy(() => import("@/components/VirtualComputerFactory").then((module) => ({ default: module.VirtualComputerFactory })));
const FileForestRescue = lazy(() => import("@/components/FileForestRescue").then((module) => ({ default: module.FileForestRescue })));
const CreativeStudioChallenge = lazy(() => import("@/components/CreativeStudioChallenge").then((module) => ({ default: module.CreativeStudioChallenge })));
const AiVerificationLab = lazy(() => import("@/components/AiVerificationLab").then((module) => ({ default: module.AiVerificationLab })));
const GameMakerRelay = lazy(() => import("@/components/GameMakerRelay").then((module) => ({ default: module.GameMakerRelay })));
const ComputerPilotRelay = lazy(() => import("@/components/ComputerPilotRelay").then((module) => ({ default: module.ComputerPilotRelay })));
const NetworkVoyageRelay = lazy(() => import("@/components/NetworkVoyageRelay").then((module) => ({ default: module.NetworkVoyageRelay })));
const OsCommandRelay = lazy(() => import("@/components/OsCommandRelay").then((module) => ({ default: module.OsCommandRelay })));
const GameArcade = lazy(() => import("@/components/GameArcade").then((module) => ({ default: module.GameArcade })));

interface IslandMapProps {
  completedCourseIds: string[];
  coursePlayCounts: Record<string, number>;
  knowledgeSprint: { bestScore: number; runsPlayed: number };
  completedBossIds: string[];
  headingRef: Ref<HTMLHeadingElement>;
  onStartCourse: (courseId: string) => void;
  onRecordSprint: (score: number) => void;
  onCompleteBoss: (bossId: string) => void;
  resume: { courseId: string; stage: number } | null;
  confidenceByCourse: Record<string, CourseConfidence>;
  soundEnabled: boolean;
  storageUnavailable: boolean;
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
  confidence?: CourseConfidence;
}

const CONFIDENCE_LABELS: Record<CourseConfidence, string> = { confident: "🙂 会讲", practice: "↻ 再练", help: "🙋 需帮助" };

function CourseCard({ course, state, onStartCourse, confidence }: CourseCardProps) {
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
        onFocus={available ? () => preloadLesson(course.id) : undefined}
        onPointerEnter={available ? () => preloadLesson(course.id) : undefined}
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
          {completed && confidence ? <span className={`course-confidence course-confidence--${confidence}`}>{CONFIDENCE_LABELS[confidence]}</span> : null}
        </span>
      </button>
    </li>
  );
}

export function IslandMap({
  completedCourseIds,
  coursePlayCounts,
  knowledgeSprint,
  completedBossIds,
  headingRef,
  onStartCourse,
  onRecordSprint,
  onCompleteBoss,
  resume,
  confidenceByCourse,
  soundEnabled,
  storageUnavailable,
}: IslandMapProps) {
  const [courseQuery, setCourseQuery] = useState("");
  const [selectedIslandId, setSelectedIslandId] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<Course["difficulty"] | "all">("all");
  const [selectedCompletion, setSelectedCompletion] = useState<"all" | "completed" | "unfinished">("all");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const mission = getMapMission(completedCourseIds, resume);
  const currentCourse = mission.course;
  const resuming = Boolean(resume && currentCourse?.id === resume.courseId);
  const visibleCourseIds = new Set(filterCourses(COURSES, { islandId: selectedIslandId, query: courseQuery, difficulty: selectedDifficulty, completion: selectedCompletion, completedCourseIds }).map((course) => course.id));
  const filtersActive = Boolean(courseQuery.trim()) || selectedIslandId !== "all" || selectedDifficulty !== "all" || selectedCompletion !== "all";

  const clearCourseFilters = useCallback(() => {
    setCourseQuery("");
    setSelectedIslandId("all");
    setSelectedDifficulty("all");
    setSelectedCompletion("all");
  }, []);

  useEffect(() => {
    function handleMapShortcut(event: KeyboardEvent) {
      if (event.isComposing) return;
      const target = event.target;
      const typing = target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || (target instanceof HTMLElement && target.isContentEditable);
      if (event.key === "/" && !typing && !event.metaKey && !event.ctrlKey && !event.altKey) {
        event.preventDefault();
        searchInputRef.current?.focus();
      } else if (event.key === "Escape" && filtersActive) {
        clearCourseFilters();
        searchInputRef.current?.focus();
      }
    }
    window.addEventListener("keydown", handleMapShortcut);
    return () => window.removeEventListener("keydown", handleMapShortcut);
  }, [clearCourseFilters, filtersActive]);

  return (
    <main className="island-app-shell">
      <a className="skip-link" href="#map-heading">跳到今天任务</a>
      <header className="site-header" id="site-top">
        <a className="brand-mark" href="#adventure-map" aria-label="比特岛大冒险课程地图">
          <span className="brand-orbit" aria-hidden="true">
            B
          </span>
          <span>比特岛大冒险</span>
        </a>
        <nav className="section-jump-nav" aria-label="学习区域快捷航线">
          <a href="#game-arcade">游戏中心</a>
          <a href="#learning-plan">今日计划</a>
          <a href="#adventure-map">课程地图</a>
          <a href="#foundation-roadmap">深度路线</a>
          <a href="#foundation-practice">脑力加练</a>
          <a href="#foundation-capstone">系统总挑战</a>
          <a href="#knowledge-atlas">知识图鉴</a>
          <a href="#computer-dictionary">电脑词典</a>
          <a href="#term-match">概念配对</a>
          <a href="#review-station">情境问答</a>
        </nav>
        <div className="header-progress"><span>{CURRICULUM_FACTS.islandCount} 岛 · 已完成 {completedCourseIds.length} / {CURRICULUM_FACTS.courseCount} 课</span><progress aria-label="全部课程完成进度" max={CURRICULUM_FACTS.courseCount} value={completedCourseIds.length} /></div>
      </header>

      {storageUnavailable ? <div className="map-storage-notice" role="status"><span aria-hidden="true">!</span><p><strong>本次学习进度暂时不能保存</strong><span>课程仍能继续，请告诉大人检查浏览器存储设置。</span></p></div> : null}

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
            <div className="current-mission" aria-label="当前任务" role="group">
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
                {mission.complete ? "重玩第一课" : resuming ? `继续第 ${(resume?.stage ?? 0) + 1} 段` : "继续冒险"}
                <span aria-hidden="true">→</span>
              </button>
            </div>
          ) : null}
        </div>

        <div className="hero-world" aria-label="比比在启航港等你" role="img">
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

      <Suspense fallback={<section className="game-arcade" id="game-arcade" role="status"><h2>比特岛游戏中心</h2><p>正在整理比特岛游戏中心…</p></section>}><GameArcade completedCourseIds={completedCourseIds} onStartCourse={onStartCourse} /></Suspense>
      <AdventureMissionBoard completedCourseIds={completedCourseIds} confidenceByCourse={confidenceByCourse} coursePlayCounts={coursePlayCounts} onStartCourse={onStartCourse} />
      <KnowledgeSprint bestScore={knowledgeSprint.bestScore} completedCourseIds={completedCourseIds} key={`sprint-${completedCourseIds.join("|")}`} onRecordSprint={onRecordSprint} onStartCourse={onStartCourse} runsPlayed={knowledgeSprint.runsPlayed} />
      <IslandBossArena completedBossIds={completedBossIds} completedCourseIds={completedCourseIds} onCompleteBoss={onCompleteBoss} onStartCourse={onStartCourse} />
      <Suspense fallback={<section className="logic-circuit-shell logic-circuit-loading" id="logic-circuit-lab" role="status"><h2>逻辑电路实验台</h2><p>正在接通逻辑电路实验台…</p></section>}><LogicCircuitLab completedCourseIds={completedCourseIds} onStartCourse={onStartCourse} /></Suspense>
      <Suspense fallback={<section className="robot-expedition-shell robot-expedition-loading" id="robot-code-expedition" role="status"><h2>机器人代码远征</h2><p>正在装载机器人代码远征…</p></section>}><RobotCodeExpedition completedCourseIds={completedCourseIds} onStartCourse={onStartCourse} /></Suspense>
      <Suspense fallback={<section className="packet-escort-shell packet-escort-loading" id="packet-escort" role="status"><h2>网络数据包护航</h2><p>正在连接网络数据包护航…</p></section>}><PacketEscort completedCourseIds={completedCourseIds} onStartCourse={onStartCourse} /></Suspense>
      <Suspense fallback={<section className="cpu-scheduler-shell cpu-scheduler-loading" id="cpu-scheduler-game" role="status"><h2>CPU 时间片调度台</h2><p>正在启动 CPU 时间片调度台…</p></section>}><CpuSchedulerGame completedCourseIds={completedCourseIds} onStartCourse={onStartCourse} /></Suspense>
      <Suspense fallback={<section className="algorithm-arena-shell algorithm-arena-loading" id="algorithm-arena-game" role="status"><h2>算法竞技场</h2><p>正在开启算法竞技场…</p></section>}><AlgorithmArenaGame completedCourseIds={completedCourseIds} onStartCourse={onStartCourse} /></Suspense>
      <Suspense fallback={<section className="data-harbor-shell data-harbor-loading" id="data-structure-harbor" role="status"><h2>数据结构装卸港</h2><p>正在开放数据结构装卸港…</p></section>}><DataStructureHarbor completedCourseIds={completedCourseIds} onStartCourse={onStartCourse} /></Suspense>
      <Suspense fallback={<section className="safety-detective-shell safety-detective-loading" id="safety-detective-game" role="status"><h2>数字安全侦探局</h2><p>正在整理数字安全案件…</p></section>}><SafetyDetectiveGame completedCourseIds={completedCourseIds} onStartCourse={onStartCourse} /></Suspense>
      <Suspense fallback={<section className="computer-factory-shell computer-factory-loading" id="virtual-computer-factory" role="status"><h2>虚拟电脑装配厂</h2><p>正在启动虚拟电脑装配厂…</p></section>}><VirtualComputerFactory completedCourseIds={completedCourseIds} onStartCourse={onStartCourse} /></Suspense>
      <Suspense fallback={<section className="file-rescue-shell file-rescue-loading" id="file-forest-rescue" role="status"><h2>文件森林救援队</h2><p>正在召集文件森林救援队…</p></section>}><FileForestRescue completedCourseIds={completedCourseIds} onStartCourse={onStartCourse} /></Suspense>
      <Suspense fallback={<section className="creative-studio-shell creative-studio-loading" id="creative-studio-challenge" role="status"><h2>创作工坊项目赛</h2><p>正在布置创作工坊项目赛…</p></section>}><CreativeStudioChallenge completedCourseIds={completedCourseIds} onStartCourse={onStartCourse} /></Suspense>
      <Suspense fallback={<section className="ai-lab-shell ai-lab-loading" id="ai-verification-lab" role="status"><h2>AI 核验研究站</h2><p>正在启动 AI 核验研究站…</p></section>}><AiVerificationLab completedCourseIds={completedCourseIds} onStartCourse={onStartCourse} /></Suspense>
      <Suspense fallback={<section className="decision-relay-shell relay-theme-code" id="game-maker-relay" role="status"><h2>迷你游戏导演</h2><p>正在启动迷你游戏导演…</p></section>}><GameMakerRelay completedCourseIds={completedCourseIds} onStartCourse={onStartCourse} /></Suspense>
      <Suspense fallback={<section className="decision-relay-shell relay-theme-launch" id="computer-pilot-relay" role="status"><h2>电脑驾驶执照</h2><p>正在准备电脑驾驶执照考试…</p></section>}><ComputerPilotRelay completedCourseIds={completedCourseIds} onStartCourse={onStartCourse} /></Suspense>
      <Suspense fallback={<section className="decision-relay-shell relay-theme-network" id="network-voyage-relay" role="status"><h2>网络航海训练营</h2><p>正在绘制网络航海训练图…</p></section>}><NetworkVoyageRelay completedCourseIds={completedCourseIds} onStartCourse={onStartCourse} /></Suspense>
      <Suspense fallback={<section className="decision-relay-shell relay-theme-os" id="os-command-relay" role="status"><h2>操作系统任务指挥部</h2><p>正在接通操作系统任务指挥部…</p></section>}><OsCommandRelay completedCourseIds={completedCourseIds} onStartCourse={onStartCourse} /></Suspense>
      <LearningPlan completedCourseIds={completedCourseIds} onStartCourse={onStartCourse} resume={resume} />
      <ChildReviewQueue confidenceByCourse={confidenceByCourse} onStartCourse={onStartCourse} />
      <IslandSealCollection completedCourseIds={completedCourseIds} />
      {mission.complete ? <CompletionCertificate /> : null}

      <Suspense fallback={<section className="foundation-roadmap" id="foundation-roadmap" role="status">正在绘制深度知识连接图…</section>}><FoundationRoadmap completedCourseIds={completedCourseIds} onStartCourse={onStartCourse} /></Suspense>
      <Suspense fallback={<section className="foundation-practice-loading" id="foundation-practice" role="status">正在准备底层脑力加练…</section>}><FoundationPractice onStartCourse={onStartCourse} /></Suspense>
      <Suspense fallback={<section className="foundation-capstone" id="foundation-capstone" role="status">正在连接系统总控台…</section>}><FoundationCapstone completedCourseIds={completedCourseIds} /></Suspense>
      <KnowledgeAtlas completedCourseIds={completedCourseIds} onStartCourse={onStartCourse} />
      <ComputerDictionary onStartCourse={onStartCourse} soundEnabled={soundEnabled} />
      <TermMatchChallenge completedCourseIds={completedCourseIds} key={`terms-${completedCourseIds.join("|")}`} />
      <ReviewChallenge completedCourseIds={completedCourseIds} key={completedCourseIds.join("|")} />

      <section className="adventure-map" id="adventure-map" aria-labelledby="islands-heading">
        <div className="map-intro">
          <div>
            <p className="section-kicker">你的学习航线</p>
            <h2 id="islands-heading">{CURRICULUM_FACTS.islandCount} 座岛，{CURRICULUM_FACTS.courseCount} 次真本领练习</h2>
          </div>
          <p>推荐路线会在 {CURRICULUM_FACTS.islandCount} 座岛之间轮换；也可以从课程罗盘自由选择已开放的任意一课。</p>
        </div>

        <div className="course-compass" aria-labelledby="course-compass-heading" role="region">
          <div>
            <p className="section-kicker">课程罗盘</p>
            <h3 id="course-compass-heading">快速找到想练的本领</h3>
          </div>
          <label>
            <span>搜索课程 <kbd>/</kbd></span>
            <input onChange={(event) => setCourseQuery(event.target.value)} placeholder="例如：光标、循环、AI" ref={searchInputRef} type="search" value={courseQuery} />
          </label>
          <div className="course-compass-islands" aria-label="按岛屿筛选" role="group">
            <button aria-pressed={selectedIslandId === "all"} onClick={() => setSelectedIslandId("all")} type="button">全部</button>
            {ISLANDS.map((island) => <button aria-pressed={selectedIslandId === island.id} key={island.id} onClick={() => setSelectedIslandId(island.id)} type="button"><span aria-hidden="true">{island.icon}</span>{island.name}</button>)}
          </div>
          <div className="course-compass-difficulty" aria-label="按难度筛选" role="group">
            <span>难度</span>
            {(["all", 1, 2, 3] as const).map((difficulty) => <button aria-pressed={selectedDifficulty === difficulty} key={difficulty} onClick={() => setSelectedDifficulty(difficulty)} type="button">{difficulty === "all" ? "全部" : DIFFICULTY_LABELS[difficulty]}</button>)}
          </div>
          <div className="course-compass-completion" aria-label="按完成状态筛选" role="group">
            <span>进度</span>
            {(["all", "unfinished", "completed"] as const).map((completion) => <button aria-pressed={selectedCompletion === completion} key={completion} onClick={() => setSelectedCompletion(completion)} type="button">{{ all: "全部", unfinished: "未完成", completed: "已完成" }[completion]}</button>)}
          </div>
          <div className="course-compass-status"><p role="status">找到 {visibleCourseIds.size} 节课程{filtersActive ? "，下面只显示匹配结果" : "，按完整航线排列"}。</p>{filtersActive ? <button onClick={clearCourseFilters} type="button">清除全部筛选</button> : null}</div>
        </div>

        {visibleCourseIds.size === 0 ? (
          <div className="course-empty-state" role="status">
            <span aria-hidden="true">🧭</span>
            <h3>罗盘暂时没找到这门课</h3>
            <p>试试“文件”“循环”“安全”“AI”，或者清除筛选查看完整航线。</p>
            <button className="primary-action" onClick={clearCourseFilters} type="button">清除筛选，显示 {CURRICULUM_FACTS.courseCount} 课</button>
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
                        confidence={confidenceByCourse[course.id]}
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
        <a className="back-to-top" href="#site-top">↑ 回到顶部与快捷航线</a>
      </footer>
    </main>
  );
}
