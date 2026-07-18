"use client";

import { useMemo, useState } from "react";
import { getCourse } from "@/lib/course-data";
import { buildClosestGameUnlocks, buildGameArcadeEntries, buildGameArcadeRecommendations, filterGameArcadeEntries, gameArcadePlaylistLimit, type GameArcadeCategory, type GameArcadeLevel } from "@/lib/game-arcade";
import "./GameArcade.css";

interface GameArcadeProps {
  completedCourseIds: string[];
  onStartCourse: (courseId: string) => void;
}

type DiscoveryCategory = "all" | GameArcadeCategory;
type DiscoveryLevel = "all" | GameArcadeLevel;
const CATEGORY_OPTIONS: Array<{ id: DiscoveryCategory; label: string }> = [
  { id: "all", label: "全部玩法" },
  { id: "quest", label: "综合挑战" },
  { id: "code", label: "编程与逻辑" },
  { id: "systems", label: "电脑与网络" },
  { id: "life", label: "安全与文件" },
];
const LEVEL_OPTIONS: Array<{ id: DiscoveryLevel; label: string }> = [
  { id: "all", label: "全部阶段" },
  { id: "starter", label: "入门探险" },
  { id: "adventure", label: "进阶挑战" },
  { id: "mastery", label: "大师联赛" },
];
const LEVEL_LABELS: Record<GameArcadeLevel, string> = { starter: "入门", adventure: "进阶", mastery: "大师" };

export function GameArcade({ completedCourseIds, onStartCourse }: GameArcadeProps) {
  const entries = useMemo(() => buildGameArcadeEntries(completedCourseIds), [completedCourseIds]);
  const unlockedCount = entries.filter((entry) => entry.unlocked).length;
  const [recommendationRotation, setRecommendationRotation] = useState(0);
  const [sessionMinutes, setSessionMinutes] = useState<10 | 20 | 30>(10);
  const [category, setCategory] = useState<DiscoveryCategory>("all");
  const [level, setLevel] = useState<DiscoveryLevel>("all");
  const [query, setQuery] = useState("");
  const [unlockedOnly, setUnlockedOnly] = useState(false);
  const recommendations = useMemo(() => buildGameArcadeRecommendations(entries, recommendationRotation, gameArcadePlaylistLimit(sessionMinutes)), [entries, recommendationRotation, sessionMinutes]);
  const closestUnlocks = useMemo(() => buildClosestGameUnlocks(entries), [entries]);
  const visibleEntries = filterGameArcadeEntries(entries, { query, category, level, unlockedOnly });
  const filtersActive = Boolean(query.trim()) || category !== "all" || level !== "all" || unlockedOnly;

  function clearFilters() { setQuery(""); setCategory("all"); setLevel("all"); setUnlockedOnly(false); }

  return (
    <section className="game-arcade" id="game-arcade" aria-labelledby="game-arcade-heading">
      <header className="game-arcade-heading">
        <div><p className="section-kicker">一个入口，找到所有玩法</p><h2 id="game-arcade-heading">比特岛游戏中心</h2><span>先看已经解锁的玩法；锁着的卡片会告诉你下一门要学什么。</span></div>
        <div className="game-arcade-summary"><strong>{unlockedCount} / {entries.length}</strong><span>种玩法已解锁</span><progress aria-label="游戏中心玩法解锁进度" max={entries.length} value={unlockedCount} /></div>
      </header>

      <section className="game-arcade-picks" aria-labelledby="game-arcade-picks-heading">
        <div className="game-arcade-picks-heading"><div><span aria-hidden="true">✦</span><h3 id="game-arcade-picks-heading">今天想玩这几局</h3></div>{recommendations.length > 1 ? <button onClick={() => setRecommendationRotation((current) => current + 1)} type="button">换一组推荐 ↻</button> : null}</div>
        <div className="game-arcade-time-options" aria-label="选择今天游戏时间" role="group">{([10, 20, 30] as const).map((minutes) => <button aria-pressed={sessionMinutes === minutes} key={minutes} onClick={() => setSessionMinutes(minutes)} type="button">我有 {minutes} 分钟</button>)}</div>
        <div className="game-arcade-recommendations" role="list">{recommendations.map((entry, index) => <a aria-label={`推荐第${index + 1}局：前往${entry.title}`} className="game-arcade-recommendation" href={`#${entry.targetId}`} key={entry.id} role="listitem"><span>{index + 1}</span><b>{entry.icon} {entry.title}</b><small>{entry.duration}</small><i aria-hidden="true">→</i></a>)}</div>
        {recommendations.length === 1 ? <p>一局就是一节完整小课；学完更多课程后，可选路线会一起长大。</p> : <p>按每局约 8–10 分钟安排，只从已解锁玩法中轮换，不会记录选择。</p>}
      </section>

      {closestUnlocks.length ? <section className="game-arcade-unlock-route" aria-labelledby="game-arcade-unlock-heading">
        <div className="game-arcade-unlock-heading"><span aria-hidden="true">🔓</span><div><h3 id="game-arcade-unlock-heading">再学几课就能玩</h3><p>优先展示离解锁最近的路线，点一下就从下一课继续。</p></div></div>
        <div className="game-arcade-unlock-list">{closestUnlocks.map((entry) => {
          const nextCourse = entry.nextCourseId ? getCourse(entry.nextCourseId) : undefined;
          const remaining = entry.progress.maximum - entry.progress.value;
          return <article className="game-arcade-unlock-card" key={entry.id}><span aria-hidden="true">{entry.icon}</span><div><b>{entry.title}</b><small>还差 {remaining} 课</small></div><button onClick={() => onStartCourse(entry.nextCourseId!)} type="button">先学：{nextCourse?.title ?? "下一课"} <span aria-hidden="true">→</span></button></article>;
        })}</div>
      </section> : null}

      <div className="game-arcade-search"><label htmlFor="game-arcade-search">找一局想玩的</label><div><input aria-label="搜索游戏" id="game-arcade-search" onChange={(event) => setQuery(event.target.value)} placeholder="搜索游戏名称或玩法" type="search" value={query} />{query ? <button onClick={() => setQuery("")} type="button">清空搜索</button> : null}</div><small>只在当前页面匹配标题和玩法说明，不保存搜索词。</small></div>
      <div className="game-arcade-discovery">
        <div className="game-arcade-filter-stack"><div className="game-arcade-filters" aria-label="按主题筛选游戏" role="group">{CATEGORY_OPTIONS.map((option) => <button aria-pressed={category === option.id} className="game-arcade-filter" key={option.id} onClick={() => setCategory(option.id)} type="button">{option.label}</button>)}</div><div className="game-arcade-filters" aria-label="按学习阶段筛选游戏" role="group">{LEVEL_OPTIONS.map((option) => <button aria-pressed={level === option.id} className="game-arcade-filter game-arcade-filter--level" key={option.id} onClick={() => setLevel(option.id)} type="button">{option.label}</button>)}</div></div>
        <button aria-pressed={unlockedOnly} className="game-arcade-filter game-arcade-filter--unlocked" onClick={() => setUnlockedOnly((current) => !current)} type="button">✓ 只看已解锁</button>
      </div>
      <p className="game-arcade-results" role="status">现在显示 {visibleEntries.length} 种玩法{filtersActive ? " · 已应用筛选" : ""}</p>

      <div className="game-arcade-grid">
        {visibleEntries.map((entry) => {
          const nextCourse = entry.nextCourseId ? getCourse(entry.nextCourseId) : undefined;
          return (
            <article className={`game-arcade-card ${entry.unlocked ? "is-unlocked" : "is-locked"}`} key={entry.id}>
              <span className="game-arcade-icon" aria-hidden="true">{entry.icon}</span>
              <div className="game-arcade-card-copy"><div className="game-arcade-card-tags"><span className="game-arcade-state">{entry.unlocked ? "已解锁" : "学习中"}</span><span className={`game-arcade-level game-arcade-level--${entry.level}`}>{LEVEL_LABELS[entry.level]}</span></div><h3>{entry.title}</h3><p>{entry.mechanic}</p><small>{entry.duration}</small></div>
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
