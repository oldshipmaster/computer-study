"use client";

import { useMemo } from "react";
import { getCourse } from "@/lib/course-data";
import { buildGameArcadeEntries } from "@/lib/game-arcade";
import "./GameArcade.css";

interface GameArcadeProps {
  completedCourseIds: string[];
  onStartCourse: (courseId: string) => void;
}

export function GameArcade({ completedCourseIds, onStartCourse }: GameArcadeProps) {
  const entries = useMemo(() => buildGameArcadeEntries(completedCourseIds), [completedCourseIds]);
  const unlockedCount = entries.filter((entry) => entry.unlocked).length;

  return (
    <section className="game-arcade" id="game-arcade" aria-labelledby="game-arcade-heading">
      <header className="game-arcade-heading">
        <div><p className="section-kicker">一个入口，找到所有玩法</p><h2 id="game-arcade-heading">比特岛游戏中心</h2><span>先看已经解锁的玩法；锁着的卡片会告诉你下一门要学什么。</span></div>
        <div className="game-arcade-summary"><strong>{unlockedCount} / {entries.length}</strong><span>种玩法已解锁</span><progress aria-label="游戏中心玩法解锁进度" max={entries.length} value={unlockedCount} /></div>
      </header>

      <div className="game-arcade-grid">
        {entries.map((entry) => {
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
    </section>
  );
}
