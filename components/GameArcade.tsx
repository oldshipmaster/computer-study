"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { getCourse } from "@/lib/course-data";
import { buildClosestGameUnlocks, buildGameArcadeEntries, buildGameArcadeFacetCounts, buildGameArcadeFilterSummary, buildGameArcadeRecommendations, filterGameArcadeEntries, gameArcadePlaylistBreaks, gameArcadePlaylistLimit, gameArcadeSessionRemaining, recordGameArcadeVisit, type GameArcadeCategory, type GameArcadeLevel } from "@/lib/game-arcade";
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
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [unlockedOnly, setUnlockedOnly] = useState(false);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [unvisitedOnly, setUnvisitedOnly] = useState(false);
  const [keyboardOnly, setKeyboardOnly] = useState(false);
  const [lastGameId, setLastGameId] = useState<string | null>(null);
  const [visitedGameIds, setVisitedGameIds] = useState<string[]>([]);
  const sessionGameLimit = gameArcadePlaylistLimit(sessionMinutes);
  const sessionOpenedGames = Math.min(visitedGameIds.length, sessionGameLimit);
  const remainingSessionGames = gameArcadeSessionRemaining(sessionMinutes, visitedGameIds.length);
  const sessionComplete = remainingSessionGames === 0;
  const recommendations = useMemo(() => buildGameArcadeRecommendations(entries, recommendationRotation, remainingSessionGames, favoriteIds, { category, level, query, favoritesOnly, visitedIds: visitedGameIds, keyboardOnly }), [category, entries, favoriteIds, favoritesOnly, keyboardOnly, level, query, recommendationRotation, remainingSessionGames, visitedGameIds]);
  const recommendationContext = buildGameArcadeFilterSummary({ category, level, query, favoritesOnly, keyboardOnly });
  const playlistBreaks = gameArcadePlaylistBreaks(sessionMinutes);
  const closestUnlocks = useMemo(() => buildClosestGameUnlocks(entries), [entries]);
  const lastGame = entries.find((entry) => entry.id === lastGameId && entry.unlocked);
  const visibleEntries = filterGameArcadeEntries(entries, { query, category, level, unlockedOnly, favoritesOnly, favoriteIds, unvisitedOnly, visitedIds: visitedGameIds, keyboardOnly });
  const filterCounts = useMemo(() => buildGameArcadeFacetCounts(entries, { query, category, level, unlockedOnly, favoritesOnly, favoriteIds, unvisitedOnly, visitedIds: visitedGameIds, keyboardOnly }), [category, entries, favoriteIds, favoritesOnly, keyboardOnly, level, query, unlockedOnly, unvisitedOnly, visitedGameIds]);
  const filtersActive = Boolean(query.trim()) || category !== "all" || level !== "all" || unlockedOnly || favoritesOnly || unvisitedOnly || keyboardOnly;

  useEffect(() => {
    function handleSearchShortcut(event: globalThis.KeyboardEvent) {
      if (event.repeat || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey || event.isComposing) return;
      const target = event.target;
      const isEditing = target instanceof HTMLElement && (target.isContentEditable || target.matches("input, textarea, select"));
      if (event.key === "/" && !isEditing) {
        event.preventDefault();
        searchInputRef.current?.focus();
      } else if (event.key === "Escape" && document.activeElement === searchInputRef.current) {
        event.preventDefault();
        setQuery("");
      }
    }
    window.addEventListener("keydown", handleSearchShortcut);
    return () => window.removeEventListener("keydown", handleSearchShortcut);
  }, []);

  function clearFilters() { setQuery(""); setCategory("all"); setLevel("all"); setUnlockedOnly(false); setFavoritesOnly(false); setUnvisitedOnly(false); setKeyboardOnly(false); }
  function clearFavorites() { setFavoriteIds([]); setFavoritesOnly(false); }
  function toggleFavorite(gameId: string) { setFavoriteIds((current) => current.includes(gameId) ? current.filter((id) => id !== gameId) : [...current, gameId]); }
  function openGame(gameId: string) { setLastGameId(gameId); setVisitedGameIds((current) => recordGameArcadeVisit(current, gameId)); }
  function restartGameSession() { setVisitedGameIds([]); setLastGameId(null); setRecommendationRotation((current) => current + 1); }

  return (
    <section className="game-arcade" id="game-arcade" aria-labelledby="game-arcade-heading">
      <header className="game-arcade-heading">
        <div><p className="section-kicker">一个入口，找到所有玩法</p><h2 id="game-arcade-heading">比特岛游戏中心</h2><span>先看已经解锁的玩法；锁着的卡片会告诉你下一门要学什么。</span></div>
        <div className="game-arcade-summary"><strong>{unlockedCount} / {entries.length}</strong><span>种玩法已解锁</span><progress aria-label="游戏中心玩法解锁进度" max={entries.length} value={unlockedCount} /></div>
      </header>

      <section className="game-arcade-picks" aria-labelledby="game-arcade-picks-heading">
        <div className="game-arcade-picks-heading"><div><span aria-hidden="true">✦</span><h3 id="game-arcade-picks-heading">今天想玩这几局</h3></div><div className="game-arcade-pick-actions">{recommendations.length > 1 ? <button onClick={() => setRecommendationRotation((current) => current + 1)} type="button">换一组推荐 ↻</button> : null}{recommendations[0] ? <a className="game-arcade-quick-start" href={`#${recommendations[0].targetId}`} onClick={() => openGame(recommendations[0].id)}>替我选一局，马上开始 <span aria-hidden="true">→</span></a> : null}</div></div>
        {lastGame ? <a className="game-arcade-resume" href={`#${lastGame.targetId}`}><span aria-hidden="true">↪</span><div><small>继续刚才玩的</small><b>{lastGame.icon} {lastGame.title}</b><i>只在本次打开页面内记住</i></div><strong aria-hidden="true">→</strong></a> : null}
        <div className="game-arcade-time-options" aria-label="选择今天游戏时间" role="group">{([10, 20, 30] as const).map((minutes) => <button aria-pressed={sessionMinutes === minutes} key={minutes} onClick={() => setSessionMinutes(minutes)} type="button">我有 {minutes} 分钟</button>)}</div>
        <div className="game-arcade-session-progress"><span>本轮已打开 <b>{sessionOpenedGames} / {sessionGameLimit}</b> 局</span><progress aria-label="本轮游戏进度" max={sessionGameLimit} value={sessionOpenedGames} /></div>
        <p className="game-arcade-break-plan"><span aria-hidden="true">🌿</span>{sessionComplete ? <>本轮推荐已走完；完成当前一局后离开屏幕休息。</> : playlistBreaks ? <>中间安排 {playlistBreaks} 次离屏休息，每局后看看远处、动动身体。</> : <>完成这一局就离开屏幕休息一下。</>}</p>
        <p className="game-arcade-picks-filter-note">今日推荐会跟随主题、阶段、搜索、收藏和键盘筛选；还没打开过的玩法会优先。</p>
        <div className="game-arcade-pick-context" aria-label="当前推荐范围" role="group"><b>当前推荐范围</b>{recommendationContext.map((item) => <span key={item}>{item}</span>)}</div>
        {sessionComplete ? <div className="game-arcade-session-complete" role="status"><span aria-hidden="true">🌙</span><div><b>本轮推荐已走完</b><p>你已经打开本轮安排的游戏；还没完成可用上方继续入口，完成后记得休息。</p></div><button onClick={restartGameSession} type="button">开始新一轮</button></div> : recommendations.length ? <div className="game-arcade-recommendations" role="list">{recommendations.map((entry, index) => <a aria-label={`推荐第${index + 1}局：前往${entry.title}${visitedGameIds.includes(entry.id) ? "，本次已打开" : ""}`} className="game-arcade-recommendation" href={`#${entry.targetId}`} key={entry.id} onClick={() => openGame(entry.id)} role="listitem"><span>{index + 1}</span><b>{entry.icon} {entry.title}</b><small>{entry.duration}</small>{visitedGameIds.includes(entry.id) ? <em>本次已打开</em> : null}<i aria-hidden="true">→</i></a>)}</div> : <div className="game-arcade-picks-empty"><span aria-hidden="true">🧭</span><p>当前筛选里还没有已解锁玩法。</p><button onClick={clearFilters} type="button">看全部推荐</button></div>}
        {favoriteIds.length ? <p>收藏玩法会优先进入今日推荐；未解锁的收藏会等学完再加入。</p> : recommendations.length === 1 ? <p>一局就是一节完整小课；学完更多课程后，可选路线会一起长大。</p> : recommendations.length > 1 ? <p>按每局约 8–10 分钟安排，只从已解锁玩法中轮换，不会记录选择。</p> : null}
      </section>

      {closestUnlocks.length ? <section className="game-arcade-unlock-route" aria-labelledby="game-arcade-unlock-heading">
        <div className="game-arcade-unlock-heading"><span aria-hidden="true">🔓</span><div><h3 id="game-arcade-unlock-heading">再学几课就能玩</h3><p>优先展示离解锁最近的路线，点一下就从下一课继续。</p></div></div>
        <div className="game-arcade-unlock-list">{closestUnlocks.map((entry) => {
          const nextCourse = entry.nextCourseId ? getCourse(entry.nextCourseId) : undefined;
          const remaining = entry.progress.maximum - entry.progress.value;
          return <article className="game-arcade-unlock-card" key={entry.id}><span aria-hidden="true">{entry.icon}</span><div><b>{entry.title}</b><small>还差 {remaining} 课</small></div><button onClick={() => onStartCourse(entry.nextCourseId!)} type="button">先学：{nextCourse?.title ?? "下一课"} <span aria-hidden="true">→</span></button></article>;
        })}</div>
      </section> : null}

      <div className="game-arcade-search"><label htmlFor="game-arcade-search">找一局想玩的</label><div><input aria-keyshortcuts="/" aria-label="搜索游戏" id="game-arcade-search" onChange={(event) => setQuery(event.target.value)} placeholder="搜索游戏名称或玩法" ref={searchInputRef} type="search" value={query} />{query ? <button onClick={() => setQuery("")} type="button">清空搜索</button> : null}</div><small className="game-arcade-search-shortcuts"><span>按 <kbd>/</kbd> 快速搜索</span>{query ? <span>按 <kbd>Esc</kbd> 清空</span> : null}<i>只在当前页面匹配标题和玩法说明，不保存搜索词。</i></small></div>
      <div className="game-arcade-discovery">
        <div className="game-arcade-filter-stack"><div className="game-arcade-filters" aria-label="按主题筛选游戏" role="group">{CATEGORY_OPTIONS.map((option) => <button aria-label={`${option.label}，${filterCounts.categories[option.id]}种玩法`} aria-pressed={category === option.id} className="game-arcade-filter" key={option.id} onClick={() => setCategory(option.id)} type="button"><span>{option.label}</span><small aria-hidden="true" className="game-arcade-filter-count">{filterCounts.categories[option.id]}</small></button>)}</div><div className="game-arcade-filters" aria-label="按学习阶段筛选游戏" role="group">{LEVEL_OPTIONS.map((option) => <button aria-label={`${option.label}，${filterCounts.levels[option.id]}种玩法`} aria-pressed={level === option.id} className="game-arcade-filter game-arcade-filter--level" key={option.id} onClick={() => setLevel(option.id)} type="button"><span>{option.label}</span><small aria-hidden="true" className="game-arcade-filter-count">{filterCounts.levels[option.id]}</small></button>)}</div></div>
        <div className="game-arcade-personal-filters"><button aria-pressed={unlockedOnly} className="game-arcade-filter game-arcade-filter--unlocked" onClick={() => setUnlockedOnly((current) => !current)} type="button">✓ 只看已解锁</button><button aria-pressed={favoritesOnly} className="game-arcade-filter game-arcade-filter--favorites" onClick={() => setFavoritesOnly((current) => !current)} type="button">★ 只看收藏</button><button aria-pressed={unvisitedOnly} className="game-arcade-filter game-arcade-filter--unvisited" onClick={() => setUnvisitedOnly((current) => !current)} type="button">○ 只看没打开</button><button aria-pressed={keyboardOnly} className="game-arcade-filter game-arcade-filter--keyboard" onClick={() => setKeyboardOnly((current) => !current)} type="button">⌨ 只看键盘玩法</button></div>
      </div>
      {keyboardOnly ? <aside className="game-arcade-keyboard-guide" role="note"><span aria-hidden="true">⌨</span><p><b>键盘玩法提示</b>按屏幕标出的数字键选择，按 <kbd>Enter</kbd> 继续；鼠标也能完成全部操作。</p></aside> : null}
      <div className="game-arcade-results-row"><p className="game-arcade-results" role="status">现在显示 {visibleEntries.length} 种玩法{filtersActive ? " · 已应用筛选" : ""}{favoriteIds.length ? ` · 已收藏 ${favoriteIds.length} 种` : ""}{visitedGameIds.length ? ` · 本次打开 ${visitedGameIds.length} 种` : ""}<small>收藏和打开记录只在本次打开页面内保留。</small></p><div className="game-arcade-results-actions">{visitedGameIds.length ? <button className="game-arcade-clear-visits" onClick={() => setVisitedGameIds([])} type="button">清空打开记录</button> : null}{favoriteIds.length ? <button className="game-arcade-clear-favorites" onClick={clearFavorites} type="button">清空全部收藏</button> : null}</div></div>
      {category !== "all" || level !== "all" || query.trim() || favoriteIds.length ? <a className="game-arcade-updated-picks" href="#game-arcade-picks-heading">查看更新后的今日推荐 <span aria-hidden="true">↑</span></a> : null}

      <div className="game-arcade-grid">
        {visibleEntries.map((entry) => {
          const nextCourse = entry.nextCourseId ? getCourse(entry.nextCourseId) : undefined;
          return (
            <article className={`game-arcade-card ${entry.unlocked ? "is-unlocked" : "is-locked"}`} key={entry.id}>
              <button aria-label={`${favoriteIds.includes(entry.id) ? "取消收藏" : "收藏"}${entry.title}`} aria-pressed={favoriteIds.includes(entry.id)} className="game-arcade-favorite" onClick={() => toggleFavorite(entry.id)} type="button"><span aria-hidden="true">★</span></button>
              <span className="game-arcade-icon" aria-hidden="true">{entry.icon}</span>
              <div className="game-arcade-card-copy"><div className="game-arcade-card-tags"><span className="game-arcade-state">{entry.unlocked ? "已解锁" : "学习中"}</span><span className={`game-arcade-level game-arcade-level--${entry.level}`}>{LEVEL_LABELS[entry.level]}</span>{entry.keyboardFriendly ? <span className="game-arcade-keyboard">⌨ 键鼠都能玩</span> : null}{visitedGameIds.includes(entry.id) ? <span className="game-arcade-visited">本次已打开</span> : null}</div><h3>{entry.title}</h3><p>{entry.mechanic}</p><small>{entry.duration}</small></div>
              <div className="game-arcade-progress"><span>解锁进度 {entry.progress.value} / {entry.progress.maximum}</span><progress aria-label={`${entry.title}解锁进度`} max={entry.progress.maximum} value={entry.progress.value} /></div>
              {entry.unlocked ? <a aria-label={`前往${entry.title}`} className="game-arcade-action" href={`#${entry.targetId}`} onClick={() => openGame(entry.id)}>去玩这个 <span aria-hidden="true">→</span></a> : entry.nextCourseId ? <button className="game-arcade-action" onClick={() => onStartCourse(entry.nextCourseId!)} type="button">下一课：{nextCourse?.title ?? "继续学习"}</button> : null}
            </article>
          );
        })}
      </div>
      {visibleEntries.length === 0 ? favoritesOnly && favoriteIds.length === 0 ? <div className="game-arcade-empty"><span aria-hidden="true">☆</span><h3>还没有收藏玩法</h3><p>先退出收藏筛选，再点卡片右上角的星星收集喜欢的游戏。</p><button className="game-arcade-action" onClick={() => setFavoritesOnly(false)} type="button">退出只看收藏</button></div> : unvisitedOnly && visitedGameIds.length ? <div className="game-arcade-empty"><span aria-hidden="true">✓</span><h3>这组玩法本轮都打开过了</h3><p>可以清空打开记录开始新一轮，或切换主题继续探索。</p><button className="game-arcade-action" onClick={() => setVisitedGameIds([])} type="button">清空打开记录</button></div> : <div className="game-arcade-empty"><span aria-hidden="true">🗺️</span><h3>这个筛选里还没有玩法</h3><p>清除筛选就能重新看到全部游戏和解锁路线。</p><button className="game-arcade-action" onClick={clearFilters} type="button">清除筛选</button></div> : null}
    </section>
  );
}
