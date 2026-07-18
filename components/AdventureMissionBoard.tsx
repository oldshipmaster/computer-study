"use client";

import { useMemo, useState } from "react";
import { COURSES } from "@/lib/course-data";
import {
  EXPLORER_RANKS,
  buildAdventureMissions,
  getAdventureEnergy,
  getExplorerRank,
  getRankProgress,
  type CourseConfidence,
} from "@/lib/adventure-missions";

interface AdventureMissionBoardProps {
  completedCourseIds: string[];
  coursePlayCounts: Record<string, number>;
  confidenceByCourse: Record<string, CourseConfidence>;
  onStartCourse: (courseId: string) => void;
}

export function AdventureMissionBoard({
  completedCourseIds,
  coursePlayCounts,
  confidenceByCourse,
  onStartCourse,
}: AdventureMissionBoardProps) {
  const [rotation, setRotation] = useState(0);
  const [rotationStatus, setRotationStatus] = useState("第 1 批任务已准备好");
  const missions = useMemo(() => buildAdventureMissions({
    courses: COURSES,
    completedCourseIds,
    coursePlayCounts,
    confidenceByCourse,
    rotation,
  }), [completedCourseIds, confidenceByCourse, coursePlayCounts, rotation]);
  const energy = getAdventureEnergy(coursePlayCounts);
  const rank = getExplorerRank(energy);
  const rankProgress = getRankProgress(energy);

  function rotateMissions() {
    const nextRotation = rotation + 1;
    setRotation(nextRotation);
    setRotationStatus(`任务已更新，第 ${nextRotation + 1} 批`);
  }

  return (
    <section className="adventure-mission-board" id="adventure-missions" aria-labelledby="adventure-missions-heading">
      <div className="adventure-mission-heading">
        <div>
          <p className="section-kicker">想玩什么，由你选</p>
          <h2 id="adventure-missions-heading">比比的探险任务牌</h2>
          <p>一次选一张，完成整节课才会点亮能量。累了就休息，不用连续完成。</p>
        </div>
        <button className="mission-rotate-button" onClick={rotateMissions} type="button">
          <span aria-hidden="true">↻</span>
          换一批任务
        </button>
      </div>

      <p className="mission-rotation-status" aria-live="polite">{rotationStatus}</p>

      <div className="adventure-mission-grid">
        {missions.map((mission) => (
          <button
            className={`adventure-mission-card adventure-mission-card--${mission.kind}`}
            key={mission.id}
            onClick={() => onStartCourse(mission.course.id)}
            type="button"
          >
            <span className="adventure-mission-card-topline">
              <span>{mission.eyebrow}</span>
              <strong>{mission.rewardLabel}</strong>
            </span>
            <span className="adventure-mission-card-copy">
              <strong>{mission.title}</strong>
              <span>{mission.description}</span>
            </span>
            <span className="adventure-mission-card-footer">
              <span>{mission.course.skill} · {mission.course.minutes} 分钟</span>
              <strong>开始这张任务牌 <span aria-hidden="true">→</span></strong>
            </span>
          </button>
        ))}
      </div>

      <div className="explorer-energy-panel">
        <div className="explorer-equipment" aria-label={`比比已装备${rank.name}`} role="img">
          <span aria-hidden="true">{rank.icon}</span>
          <div>
            <small>当前装备</small>
            <strong>{rank.name}</strong>
            <span>{rank.message}</span>
          </div>
        </div>
        <div className="explorer-energy-meter">
          <div>
            <strong>{energy} 探险能量</strong>
            <span>{rankProgress.nextRank ? `再得 ${rankProgress.remaining} 点，解锁${rankProgress.nextRank.name}` : "五件装备全部点亮"}</span>
          </div>
          <progress aria-label="探险能量等级进度" max={rankProgress.max} value={rankProgress.value} />
          <small>每课首次完成 +10；第 2、3 次完整重玩各 +3。</small>
        </div>
        <ol className="explorer-rank-track" aria-label="比比装备等级">
          {EXPLORER_RANKS.map((item) => {
            const unlocked = energy >= item.threshold;
            return (
              <li className={unlocked ? "is-unlocked" : ""} key={item.name}>
                <span aria-hidden="true">{unlocked ? item.icon : "·"}</span>
                <strong>{item.name}</strong>
                <small>{unlocked ? "已点亮" : `${item.threshold} 点`}</small>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
