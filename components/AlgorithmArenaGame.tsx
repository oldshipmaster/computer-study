"use client";

import { useLayoutEffect, useMemo, useRef, useState, type KeyboardEvent, type MouseEvent } from "react";
import { getCourse } from "@/lib/course-data";
import { numberShortcutIndex } from "@/lib/keyboard-shortcuts";
import {
  ALGORITHM_ARENA_MISSIONS,
  advanceAlgorithmMission,
  advanceAlgorithmStep,
  buildAlgorithmArenaDeck,
  chooseAlgorithmAction,
  createAlgorithmArenaState,
} from "@/lib/algorithm-arena-game";
import "./AlgorithmArenaGame.css";

interface AlgorithmArenaGameProps {
  completedCourseIds: string[];
  onStartCourse: (courseId: string) => void;
}

const REQUIRED_COURSE_IDS = ["linear-search", "binary-search", "bubble-sort", "task-decomposition", "algorithm-efficiency"] as const;
const MODE_ICONS = { linear: "→", binary: "½", sort: "⇄", dependency: "◇", efficiency: "⚖", relay: "↻" } as const;

export function AlgorithmArenaGame({ completedCourseIds, onStartCourse }: AlgorithmArenaGameProps) {
  const completedRequired = REQUIRED_COURSE_IDS.filter((id) => completedCourseIds.includes(id));
  const unlocked = completedRequired.length === REQUIRED_COURSE_IDS.length;
  const nextCourse = getCourse(REQUIRED_COURSE_IDS.find((id) => !completedCourseIds.includes(id)) ?? "");
  const [mode, setMode] = useState<"menu" | "game">("menu");
  const [rotation, setRotation] = useState(0);
  const deck = useMemo(() => buildAlgorithmArenaDeck(rotation), [rotation]);
  const [game, setGame] = useState(() => createAlgorithmArenaState(ALGORITHM_ARENA_MISSIONS.length));
  const headingRef = useRef<HTMLHeadingElement>(null);
  const shouldFocusRef = useRef(false);

  useLayoutEffect(() => {
    if (!shouldFocusRef.current) return;
    headingRef.current?.focus();
    shouldFocusRef.current = false;
  }, [game.index, game.stepIndex, game.phase, mode]);

  function focusNext() {
    shouldFocusRef.current = true;
  }

  function startGame() {
    focusNext();
    setGame(createAlgorithmArenaState(deck.length));
    setMode("game");
  }

  function replayGame() {
    const nextRotation = rotation + 1;
    focusNext();
    setRotation(nextRotation);
    setGame(createAlgorithmArenaState(buildAlgorithmArenaDeck(nextRotation).length));
  }

  if (!unlocked) {
    return (
      <section className="algorithm-arena-shell algorithm-arena-locked" id="algorithm-arena-game" aria-labelledby="algorithm-arena-heading">
        <span className="algorithm-arena-emblem" aria-hidden="true">Σ</span>
        <div><p className="section-kicker">算法岛综合游戏</p><h2 id="algorithm-arena-heading">算法竞技场</h2><p>先学会搜索、排序、任务依赖和效率比较，再来完成六场证据挑战。</p><strong>已完成 {completedRequired.length} / {REQUIRED_COURSE_IDS.length} 门必修课</strong></div>
        {nextCourse ? <button onClick={() => onStartCourse(nextCourse.id)} type="button">下一门：{nextCourse.title}</button> : null}
      </section>
    );
  }

  if (mode === "menu") {
    return (
      <section className="algorithm-arena-shell algorithm-arena-menu" id="algorithm-arena-game" aria-labelledby="algorithm-arena-heading">
        <div><p className="section-kicker">不拼手速 · 拼证据</p><h2 id="algorithm-arena-heading" ref={headingRef} tabIndex={-1}>算法竞技场</h2><p>亲手走过搜索、排序、依赖和效率决策，把每一步为什么正确留在证据轨迹里。</p></div>
        <div className="algorithm-arena-preview" aria-label="六场算法赛" role="list">{ALGORITHM_ARENA_MISSIONS.map((mission) => <span key={mission.id} role="listitem"><b aria-hidden="true">{MODE_ICONS[mission.mode]}</b>{mission.title}</span>)}</div>
        <button className="algorithm-arena-action" onClick={startGame} type="button">开始六场算法赛 <span aria-hidden="true">→</span></button>
      </section>
    );
  }

  if (game.phase === "complete") {
    return (
      <section className="algorithm-arena-shell algorithm-arena-complete" id="algorithm-arena-game" aria-labelledby="algorithm-arena-complete-heading">
        <span className="algorithm-arena-trophy" aria-hidden="true">🏁</span>
        <div><p>六场算法证据全部成立</p><h2 id="algorithm-arena-complete-heading" ref={headingRef} tabIndex={-1}>算法竞技场通关！</h2><span>你会用线性搜索、二分搜索、冒泡排序、任务分解和算法效率解释一套完整方案。</span></div>
        <ul aria-label="已经掌握的算法能力">{["线性搜索", "二分搜索", "冒泡排序", "任务分解", "算法效率"].map((skill) => <li key={skill}>✓ {skill}</li>)}</ul>
        <div><button className="algorithm-arena-action" onClick={replayGame} type="button">重玩六场算法赛</button><button className="algorithm-arena-action algorithm-arena-action--quiet" onClick={() => { focusNext(); setMode("menu"); }} type="button">返回竞技场入口</button></div>
      </section>
    );
  }

  const mission = deck[game.index];
  const step = mission.steps[game.stepIndex];

  function choose(event: MouseEvent<HTMLButtonElement>, actionId: string) {
    setGame((current) => chooseAlgorithmAction(current, mission, actionId, event.detail));
  }

  function nextStep(event: MouseEvent<HTMLButtonElement>) {
    focusNext();
    setGame((current) => advanceAlgorithmStep(current, mission, event.detail));
  }

  function nextMission(event: MouseEvent<HTMLButtonElement>) {
    focusNext();
    setGame((current) => advanceAlgorithmMission(current, event.detail));
  }

  function handleArenaKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (event.nativeEvent.isComposing || event.repeat || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    const optionIndex = numberShortcutIndex(event.key, step.options.length);
    if (optionIndex !== null && game.phase === "playing") {
      event.preventDefault();
      setGame((current) => chooseAlgorithmAction(current, mission, step.options[optionIndex].id, 0));
      return;
    }
    if (event.key !== "Enter" || event.target instanceof HTMLButtonElement) return;
    if (game.phase === "step-solved") {
      focusNext();
      setGame((current) => advanceAlgorithmStep(current, mission, 0));
    } else if (game.phase === "mission-solved") {
      focusNext();
      setGame((current) => advanceAlgorithmMission(current, 0));
    } else return;
    event.preventDefault();
  }

  return (
    <section className={`algorithm-arena-shell algorithm-arena-game mode-${mission.mode}`} id="algorithm-arena-game" aria-labelledby="algorithm-arena-round-heading" onKeyDown={handleArenaKeyDown}>
      <button className="algorithm-arena-back" onClick={() => { focusNext(); setMode("menu"); }} type="button">← 返回竞技场入口</button>
      <header className="algorithm-arena-heading">
        <span className="algorithm-arena-round-icon" aria-hidden="true">{MODE_ICONS[mission.mode]}</span>
        <div><p>第 {game.index + 1} / {deck.length} 场 · {mission.skill}</p><h2 id="algorithm-arena-round-heading" ref={headingRef} tabIndex={-1}>{mission.title}</h2><span>{mission.story}</span></div>
        <progress aria-label="算法竞技场六关进度" max={deck.length} value={game.solved} />
      </header>

      <div className="algorithm-arena-layout">
        <section className="algorithm-arena-workbench" aria-labelledby="algorithm-step-heading">
          <div className="algorithm-step-count">步骤 {game.stepIndex + 1} / {mission.steps.length}</div>
          <h3 id="algorithm-step-heading">{step.prompt}</h3>
          <div className="algorithm-visual" aria-label={step.visual.label} role="list">
            {step.visual.items.map((visualItem) => <span aria-current={visualItem.state === "active" ? "step" : undefined} className={`algorithm-visual-item is-${visualItem.state ?? "normal"}`} key={visualItem.id} role="listitem">{visualItem.label}</span>)}
          </div>
          <p className="algorithm-visual-note">{step.visual.note}</p>
          <div className="algorithm-arena-options" aria-label="选择下一步算法动作" role="group">
            {step.options.map((candidate, index) => <button aria-keyshortcuts={String(index + 1)} aria-pressed={game.phase !== "playing" && candidate.id === step.answerId} className="algorithm-arena-action" disabled={game.phase !== "playing"} key={candidate.id} onClick={(event) => choose(event, candidate.id)} type="button"><kbd>{index + 1}</kbd><span>{candidate.label}</span></button>)}
          </div>
          <p className="algorithm-keyboard-hint">{game.phase === "playing" ? <>也可以按键盘数字 <kbd>1</kbd>、<kbd>2</kbd>、<kbd>3</kbd> 作答</> : <>按 <kbd>Enter</kbd> {game.phase === "step-solved" ? "记录证据并继续" : "接入下一场算法赛"}</>}</p>
          <p className={`algorithm-arena-feedback phase-${game.phase}`} role="status">{game.feedback}</p>
          {game.phase === "step-solved" ? <button className="algorithm-arena-action algorithm-arena-next" onClick={nextStep} type="button">记录证据，继续下一步 →</button> : null}
          {game.phase === "mission-solved" ? <button className="algorithm-arena-action algorithm-arena-next" onClick={nextMission} type="button">{game.index === deck.length - 1 ? "查看通关报告" : "接入下一场算法赛"} →</button> : null}
        </section>

        <aside className="algorithm-evidence" aria-labelledby="algorithm-evidence-heading">
          <div><span aria-hidden="true">⌁</span><h3 id="algorithm-evidence-heading">算法证据轨迹</h3></div>
          {game.evidence.length > 0 ? <ol>{game.evidence.map((evidence, index) => <li key={`${mission.id}-${index}`}><span>{index + 1}</span>{evidence}</li>)}</ol> : <p>完成第一步后，证据会按顺序留在这里。</p>}
          <small>答错不会清空轨迹；回到可见证据继续判断。</small>
        </aside>
      </div>
    </section>
  );
}
