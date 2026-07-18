"use client";

import { useMemo, useState } from "react";
import { getCourse } from "@/lib/course-data";
import { buildGameArcadeEntries, buildGameArcadeRecommendations, type GameArcadeCategory } from "@/lib/game-arcade";
import "./GameArcade.css";

interface GameArcadeProps {
  completedCourseIds: string[];
  onStartCourse: (courseId: string) => void;
}

type DiscoveryCategory = "all" | GameArcadeCategory;
const CATEGORY_OPTIONS: Array<{ id: DiscoveryCategory; label: string }> = [
  { id: "all", label: "全部玩法" },
  { id: "quest", label: "综合挑战" },
  { id: "code", label: "编程与逻辑" },
  { id: "systems", label: "电脑与网络" },
  { id: "life", label: "安全与文件" },
];

export function GameArcade({ completedCourseIds, onStartCourse }: GameArcadeProps) {
  const entries = useMemo(() => buildGameArcadeEntries(completedCourseIds), [completedCourseIds]);
  const unlockedCount = entries.filter((entry) => entry.unlocked).length;
  const [recommendationRotation, setRecommendationRotation] = useState(0);
  const [category, setCategory] = useState<DiscoveryCategory>("all");
  const [unlockedOnly, setUnlockedOnly] = useState(false);
  const recommendations = useMemo(() => buildGameArcadeRecommendations(entries, recommendationRotation), [entries, recommendationRotation]);
  const visibleEntries = entries.filter((entry) => (category === "all" || entry.category === category) && (!unlockedOnly || entry.unlocked));
  const filtersActive = category !== "all" || unlockedOnly;

  function clearFilters() { setCategory("all"); setUnlockedOnly(false); }

  return (
    <section className="game-arcade" id="game-arcade" aria-labelledby="game-arcade-heading">
      <header className="game-arcade-heading">
        <div><p className="section-kicker">一个入口，找到所有玩法</p><h2 id="game-arcade-heading">比特岛游戏中心</h2><span>先看已经解锁的玩法；锁着的卡片会告诉你下一门要学什么。</span></div>
        <div className="game-arcade-summary"><strong>{unlockedCount} / {entries.length}</strong><span>种玩法已解锁</span><progress aria-label="游戏中心玩法解锁进度" max={entries.length} value={unlockedCount} /></div>
      </header>

      <section className="game-arcade-picks" aria-labelledby="game-arcade-picks-heading">
        <div className="game-arcade-picks-heading"><div><span aria-hidden="true">✦</span><h3 id="game-arcade-picks-heading">今天想玩这几局</h3></div>{recommendations.length > 1 ? <button onClick={() => setRecommendationRotation((current) => current + 1)} type="button">换一组推荐 ↻</button> : null}</div>
        <div className="game-arcade-recommendations" role="list">{recommendations.map((entry, index) => <a aria-label={`推荐第${index + 1}局：前往${entry.title}`} className="game-arcade-recommendation" href={`#${entry.targetId}`} key={entry.id} role="listitem"><span>{index + 1}</span><b>{entry.icon} {entry.title}</b><small>{entry.duration}</small><i aria-hidden="true">→</i></a>)}</div>
        {recommendations.length === 1 ? <p>先从这一局开始；学完更多课程后，推荐路线会一起长大。</p> : <p>推荐只从已经解锁的玩法中轮换，不会记录你的选择。</p>}
      </section>

      <div className="game-arcade-discovery">
        <div className="game-arcade-filters" aria-label="按主题筛选游戏" role="group">{CATEGORY_OPTIONS.map((option) => <button aria-pressed={category === option.id} className="game-arcade-filter" key={option.id} onClick={() => setCategory(option.id)} type="button">{option.label}</button>)}</div>
        <button aria-pressed={unlockedOnly} className="game-arcade-filter game-arcade-filter--unlocked" onClick={() => setUnlockedOnly((current) => !current)} type="button">✓ 只看已解锁</button>
      </div>
      <p className="game-arcade-results" role="status">现在显示 {visibleEntries.length} 种玩法{filtersActive ? " · 已应用筛选" : ""}</p>

      <div className="game-arcade-grid">
        {visibleEntries.map((entry) => {
          const nextCourse = entry.nextCourseId ? getCourse(entry.nextCourseId) : undefined;
          return (
            <article className={`game-arcade-card ${entry.unlocked ? "is-unlocked" : "is-locked"}`} key={entry.id}>
              <span className="game-arcade-icon" aria-hidden="true">{entry.icon}</span>
              <div className="game-arcade-card-copy"><span className="game-arcade-state">{entry.unlocked ? "已解锁" : "学习中"}</span><h3>{entry.title}</h3><p>{entry.mechanic}</p><small>{entry.duration}</small></div>
              <div className="game-arcade-progress"><span>解锁进度 {entry.progress.value} / {entry.progress.maximum}</span><progress aria-label={`${entry.title}解锁进度`} max={entry.progress.maximum} value={entry.progress.value} /></div>
              {entry.unlocked ? <a aria-label={`前往${entry.title}`} className="game-arcade-action" href={`#${entry.targetId}`}>去玩这个 <span aria-hidden="true">→</span></a> : entry.nextCourseId ? <button className="game-arcade-action" onClick={() => onStartCourse(entry.nextCourseId!)} type="button">下一课：{nextCourse?.title ?? "继续学习"}</button> : null}
            </article>
          );
        })}
      </div>
      {visibleEntries.length === 0 ? <div className="game-arcade-empty"><span aria-hidden="true">🗺️</span><h3>这个筛选里还没有玩法</h3><p>清除筛选就能重新看到全部游戏和解锁路线。</p><button className="game-arcade-action" onClick={clearFilters} type="button">清除筛选</button></div> : null}
    </section>
  );
}
