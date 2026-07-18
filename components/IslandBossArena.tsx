"use client";

import { useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent, type MouseEvent } from "react";
import { getCourse } from "@/lib/course-data";
import { numberShortcutIndex } from "@/lib/keyboard-shortcuts";
import {
  ISLAND_BOSSES,
  advanceBossPhase,
  createIslandBossState,
  getIslandBossUnlock,
  queueBossAction,
  removeBossAction,
  selectBossExplanation,
  submitBossPhase,
  toggleBossEvidence,
  type IslandBoss,
} from "@/lib/island-boss";

interface IslandBossArenaProps {
  completedCourseIds: string[];
  completedBossIds: string[];
  onCompleteBoss: (bossId: string) => void;
  onStartCourse: (courseId: string) => void;
}

const PHASE_LABELS = ["证据扫描", "行动编队", "原理核心"];

export function IslandBossArena({ completedCourseIds, completedBossIds, onCompleteBoss, onStartCourse }: IslandBossArenaProps) {
  const [activeBossId, setActiveBossId] = useState<string | null>(null);
  const [state, setState] = useState(createIslandBossState);
  const stageHeadingRef = useRef<HTMLHeadingElement>(null);
  const shouldFocusStageRef = useRef(false);
  const reportedBossRef = useRef<string | null>(null);
  const activeBoss = ISLAND_BOSSES.find((boss) => boss.id === activeBossId);

  useEffect(() => {
    if (activeBoss && state.phase === "complete" && reportedBossRef.current !== activeBoss.id) {
      reportedBossRef.current = activeBoss.id;
      onCompleteBoss(activeBoss.id);
    }
  }, [activeBoss, onCompleteBoss, state.phase]);

  useLayoutEffect(() => {
    if (!shouldFocusStageRef.current) return;
    stageHeadingRef.current?.focus();
    shouldFocusStageRef.current = false;
  }, [activeBossId, state.phase]);

  function openBoss(boss: IslandBoss) {
    if (!getIslandBossUnlock(boss, completedCourseIds).unlocked) return;
    reportedBossRef.current = null;
    shouldFocusStageRef.current = true;
    setState(createIslandBossState());
    setActiveBossId(boss.id);
    window.setTimeout(() => stageHeadingRef.current?.focus(), 0);
  }

  function submit(event: MouseEvent<HTMLButtonElement>) {
    if (!activeBoss) return;
    setState((current) => submitBossPhase(current, activeBoss, event.detail));
  }

  function nextPhase(event: MouseEvent<HTMLButtonElement>) {
    if (event.detail > 1) return;
    shouldFocusStageRef.current = true;
    setState((current) => advanceBossPhase(current));
  }

  function chooseBossByKeyboard(event: KeyboardEvent<HTMLElement>) {
    if (
      !activeBoss
      || state.phase === "complete"
      || state.status === "success"
      || event.repeat
      || event.altKey
      || event.ctrlKey
      || event.metaKey
      || event.nativeEvent.isComposing
    ) return;
    const choices = state.phase === "scan" ? activeBoss.evidence : state.phase === "sequence" ? activeBoss.actions : activeBoss.explanations;
    const optionIndex = numberShortcutIndex(event.key, choices.length);
    if (optionIndex === null) return;
    const choice = choices[optionIndex];
    event.preventDefault();
    setState((current) => {
      if (current.phase === "scan") return toggleBossEvidence(current, choice.id);
      if (current.phase === "sequence") {
        return current.actionQueue.includes(choice.id)
          ? removeBossAction(current, choice.id)
          : queueBossAction(current, choice.id);
      }
      return selectBossExplanation(current, choice.id);
    });
  }

  function renderStage(boss: IslandBoss) {
    if (state.phase === "scan") {
      return (
        <div className="boss-stage-work">
          <p>选择 2 条能直接帮助判断的证据。</p>
          <div className="boss-choice-grid" role="group" aria-label="选择两条证据">
            {boss.evidence.map((item, index) => <button aria-keyshortcuts={`${index + 1}`} aria-pressed={state.selectedEvidenceIds.includes(item.id)} className="boss-evidence" disabled={state.status === "success"} key={item.id} onClick={() => setState((current) => toggleBossEvidence(current, item.id))} type="button"><kbd aria-hidden="true">{index + 1}</kbd>{item.text}</button>)}
          </div>
        </div>
      );
    }

    if (state.phase === "sequence") {
      return (
        <div className="boss-stage-work">
          <p>选择 3 个行动，按真正执行的先后顺序加入编队。</p>
          <div className="boss-action-bank" role="group" aria-label="候选行动">
            {boss.actions.map((item, index) => {
              const queued = state.actionQueue.includes(item.id);
              return <button aria-keyshortcuts={`${index + 1}`} aria-pressed={queued} className="boss-action" disabled={state.status === "success" || (!queued && state.actionQueue.length >= 3)} key={item.id} onClick={() => setState((current) => current.actionQueue.includes(item.id) ? removeBossAction(current, item.id) : queueBossAction(current, item.id))} type="button"><kbd aria-hidden="true">{index + 1}</kbd><span>{queued ? "−" : "+"} {item.text}</span></button>;
            })}
          </div>
          <ol className="boss-action-queue" aria-label="行动编队顺序">
            {[0, 1, 2].map((index) => {
              const actionId = state.actionQueue[index];
              const action = boss.actions.find((item) => item.id === actionId);
              return <li className={action ? "is-filled" : ""} key={index}><span>{index + 1}</span>{action ? <><strong>{action.text}</strong><button disabled={state.status === "success"} onClick={() => setState((current) => removeBossAction(current, action.id))} type="button">撤回</button></> : <em>等待行动</em>}</li>;
            })}
          </ol>
        </div>
      );
    }

    return (
      <div className="boss-stage-work">
        <p>选择一个能同时解释证据与行动的核心原理。</p>
        <div className="boss-explanation-list" role="group" aria-label="选择核心原理">
          {boss.explanations.map((item, index) => <button aria-keyshortcuts={`${index + 1}`} aria-pressed={state.selectedExplanationId === item.id} className="boss-explanation" disabled={state.status === "success"} key={item.id} onClick={() => setState((current) => selectBossExplanation(current, item.id))} type="button"><kbd aria-hidden="true">{index + 1}</kbd><span>{item.text}</span></button>)}
        </div>
      </div>
    );
  }

  if (activeBoss) {
    const phaseIndex = state.phase === "scan" ? 0 : state.phase === "sequence" ? 1 : state.phase === "core" ? 2 : 3;
    const canSubmit = state.phase === "scan" ? state.selectedEvidenceIds.length === 2 : state.phase === "sequence" ? state.actionQueue.length === 3 : Boolean(state.selectedExplanationId);
    return (
      <section className="island-boss-arena boss-battle" id="island-boss-arena" aria-labelledby="boss-stage-heading" onKeyDown={chooseBossByKeyboard}>
        <button className="boss-back" onClick={() => setActiveBossId(null)} type="button">← 返回 Boss 雷达</button>
        <header className="boss-battle-header">
          <span className="boss-core-icon" aria-hidden="true">{activeBoss.icon}</span>
          <div><p>{activeBoss.islandName} · 综合任务</p><h2 id="boss-stage-heading" ref={stageHeadingRef} tabIndex={-1}>{state.phase === "complete" ? `${activeBoss.title}已解决` : activeBoss.title}</h2><span>{activeBoss.briefing}</span></div>
        </header>
        <ol className="boss-stage-track" aria-label="Boss 战三个阶段">
          {PHASE_LABELS.map((label, index) => <li className={`boss-stage ${index < phaseIndex ? "boss-stage--complete" : index === phaseIndex ? "boss-stage--current" : ""}`} key={label}><span>{index < phaseIndex ? "✓" : index + 1}</span>{label}</li>)}
        </ol>

        {state.phase === "complete" ? (
          <div className="boss-victory">
            <span className="boss-core-icon" aria-hidden="true">◆</span>
            <h3>Boss 核心点亮！</h3>
            <p>{activeBoss.transferRule}</p>
            <div><button className="boss-primary" onClick={() => openBoss(activeBoss)} type="button">重玩这场 Boss 战</button><button className="boss-secondary" onClick={() => setActiveBossId(null)} type="button">选择另一座岛</button></div>
          </div>
        ) : (
          <div className="boss-console">
            <div className="boss-console-heading"><span>阶段 {phaseIndex + 1} / 3</span><h3>{PHASE_LABELS[phaseIndex]}</h3></div>
            <p className="boss-keyboard-hint">按数字键 1–{state.phase === "core" ? 3 : 4} 选择{state.phase === "sequence" ? "；再按一次可撤回" : ""}</p>
            {renderStage(activeBoss)}
            <p className={`boss-feedback boss-feedback--${state.status}`} role="status">{state.feedback}</p>
            {state.status === "success" ? <button className="boss-primary" onClick={nextPhase} type="button">{state.phase === "core" ? "点亮 Boss 核心" : "进入下一阶段"} →</button> : <button className="boss-primary" disabled={!canSubmit} onClick={submit} type="button">提交本阶段</button>}
          </div>
        )}
      </section>
    );
  }

  return (
    <section className="island-boss-arena" id="island-boss-arena" aria-labelledby="island-boss-heading">
      <div className="boss-arena-intro">
        <div><p className="section-kicker">4–6 分钟 · 岛屿综合任务</p><h2 id="island-boss-heading">十三岛 Boss 战</h2></div>
        <p>完成一整座岛的 5 节课后解锁。每场都要找证据、排行动、讲原理；没有倒计时，答错可以继续调整。</p>
        <strong>{completedBossIds.length} / {ISLAND_BOSSES.length} 个核心已点亮</strong>
      </div>
      <div className="boss-radar">
        {ISLAND_BOSSES.map((boss) => {
          const unlock = getIslandBossUnlock(boss, completedCourseIds);
          const completed = completedBossIds.includes(boss.id);
          const stateName = completed ? "complete" : unlock.unlocked ? "ready" : "locked";
          const nextCourse = unlock.nextCourseId ? getCourse(unlock.nextCourseId) : undefined;
          return (
            <article className={`boss-card boss-card--${stateName}`} key={boss.id}>
              <span className="boss-card-icon" aria-hidden="true">{boss.icon}</span>
              <div><small>{boss.islandName}</small><h3>{boss.title}</h3><span>{completed ? "已点亮" : unlock.unlocked ? "可挑战" : "未解锁"}</span></div>
              <p>已完成 {unlock.completedCount} / {unlock.requiredCount} 课</p>
              {unlock.unlocked ? <button onClick={() => openBoss(boss)} type="button">{completed ? "重玩 Boss 战" : "开始 Boss 战"}</button> : nextCourse ? <button onClick={() => onStartCourse(nextCourse.id)} type="button">下一课：{nextCourse.title}</button> : null}
            </article>
          );
        })}
      </div>
    </section>
  );
}
