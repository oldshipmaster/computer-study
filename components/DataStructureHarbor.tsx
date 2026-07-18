"use client";

import { useLayoutEffect, useMemo, useRef, useState, type MouseEvent } from "react";
import { getCourse } from "@/lib/course-data";
import {
  DATA_STRUCTURE_HARBOR_MISSIONS,
  advanceHarborMission,
  advanceHarborStep,
  buildHarborDeck,
  chooseHarborAction,
  createHarborState,
} from "@/lib/data-structure-harbor";
import "./DataStructureHarbor.css";

interface DataStructureHarborProps {
  completedCourseIds: string[];
  onStartCourse: (courseId: string) => void;
}

const REQUIRED_COURSE_IDS = ["array-lockers", "linked-treasure", "stack-queue-dock", "tree-library", "graph-routes"] as const;
const MODE_ICONS = { array: "▦", linked: "⛓", stack: "▤", queue: "⇥", tree: "♧", graph: "⌘" } as const;

export function DataStructureHarbor({ completedCourseIds, onStartCourse }: DataStructureHarborProps) {
  const completedRequired = REQUIRED_COURSE_IDS.filter((id) => completedCourseIds.includes(id));
  const unlocked = completedRequired.length === REQUIRED_COURSE_IDS.length;
  const nextCourse = getCourse(REQUIRED_COURSE_IDS.find((id) => !completedCourseIds.includes(id)) ?? "");
  const [mode, setMode] = useState<"menu" | "game">("menu");
  const [rotation, setRotation] = useState(0);
  const deck = useMemo(() => buildHarborDeck(rotation), [rotation]);
  const [game, setGame] = useState(() => createHarborState(DATA_STRUCTURE_HARBOR_MISSIONS.length));
  const headingRef = useRef<HTMLHeadingElement>(null);
  const shouldFocusRef = useRef(false);

  useLayoutEffect(() => {
    if (!shouldFocusRef.current) return;
    headingRef.current?.focus();
    shouldFocusRef.current = false;
  }, [game.index, game.stepIndex, game.phase, mode]);

  function focusNext() { shouldFocusRef.current = true; }
  function startGame() { focusNext(); setGame(createHarborState(deck.length)); setMode("game"); }
  function replayGame() {
    const nextRotation = rotation + 1;
    focusNext();
    setRotation(nextRotation);
    setGame(createHarborState(buildHarborDeck(nextRotation).length));
  }

  if (!unlocked) {
    return (
      <section className="data-harbor-shell data-harbor-locked" id="data-structure-harbor" aria-labelledby="data-harbor-heading">
        <span className="data-harbor-crane" aria-hidden="true">⚓</span>
        <div><p className="section-kicker">数据结构综合游戏</p><h2 id="data-harbor-heading">数据结构装卸港</h2><p>先学完数组、链表、栈队列、树和图，再来调度六座结构码头。</p><strong>已完成 {completedRequired.length} / {REQUIRED_COURSE_IDS.length} 门必修课</strong></div>
        {nextCourse ? <button onClick={() => onStartCourse(nextCourse.id)} type="button">下一门：{nextCourse.title}</button> : null}
      </section>
    );
  }

  if (mode === "menu") {
    return (
      <section className="data-harbor-shell data-harbor-menu" id="data-structure-harbor" aria-labelledby="data-harbor-heading">
        <div><p className="section-kicker">看关系 · 做操作 · 留证据</p><h2 id="data-harbor-heading" ref={headingRef} tabIndex={-1}>数据结构装卸港</h2><p>同样是“取出一个东西”，数组、链表、栈、队列、树和图会用完全不同的规则。</p></div>
        <div className="data-harbor-docks" aria-label="六座数据结构码头" role="list">{DATA_STRUCTURE_HARBOR_MISSIONS.map((mission) => <span key={mission.id} role="listitem"><b aria-hidden="true">{MODE_ICONS[mission.mode]}</b><i>{mission.title}</i><small>{mission.skill}</small></span>)}</div>
        <button className="harbor-action" onClick={startGame} type="button">开始六座码头调度 <span aria-hidden="true">→</span></button>
      </section>
    );
  }

  if (game.phase === "complete") {
    return (
      <section className="data-harbor-shell data-harbor-complete" id="data-structure-harbor" aria-labelledby="data-harbor-complete-heading">
        <span aria-hidden="true">🚢</span>
        <div><p>六张结构证据单全部装船</p><h2 id="data-harbor-complete-heading" ref={headingRef} tabIndex={-1}>数据结构港通关！</h2><span>你会根据关系选择结构，而不是只记住六个名字。</span></div>
        <ul aria-label="已经掌握的数据结构能力">{["直接索引", "指针遍历", "后进先出", "先进先出", "层级路径", "图最短路"].map((skill) => <li key={skill}>✓ {skill}</li>)}</ul>
        <div><button className="harbor-action" onClick={replayGame} type="button">重玩六座码头</button><button className="harbor-action harbor-action--quiet" onClick={() => { focusNext(); setMode("menu"); }} type="button">返回港口入口</button></div>
      </section>
    );
  }

  const mission = deck[game.index];
  const step = mission.steps[game.stepIndex];
  function choose(event: MouseEvent<HTMLButtonElement>, actionId: string) { setGame((current) => chooseHarborAction(current, mission, actionId, event.detail)); }
  function nextStep(event: MouseEvent<HTMLButtonElement>) { focusNext(); setGame((current) => advanceHarborStep(current, mission, event.detail)); }
  function nextMission(event: MouseEvent<HTMLButtonElement>) { focusNext(); setGame((current) => advanceHarborMission(current, event.detail)); }

  return (
    <section className={`data-harbor-shell data-harbor-game dock-${mission.mode}`} id="data-structure-harbor" aria-labelledby="data-harbor-round-heading">
      <button className="data-harbor-back" onClick={() => { focusNext(); setMode("menu"); }} type="button">← 返回港口入口</button>
      <header className="data-harbor-heading">
        <span aria-hidden="true">{MODE_ICONS[mission.mode]}</span>
        <div><p>码头 {game.index + 1} / {deck.length} · {mission.skill}</p><h2 id="data-harbor-round-heading" ref={headingRef} tabIndex={-1}>{mission.title}</h2><small>{mission.story}</small></div>
        <progress aria-label="数据结构六座码头进度" max={deck.length} value={game.solved} />
      </header>
      <div className="data-harbor-layout">
        <section className="data-harbor-workbench" aria-labelledby="data-harbor-step-heading">
          <span className="data-harbor-step">操作 {game.stepIndex + 1} / {mission.steps.length}</span>
          <h3 id="data-harbor-step-heading">{step.prompt}</h3>
          <div className={`data-harbor-visual visual-${mission.mode}`} aria-label={step.visual.label} role="list">
            {step.visual.items.map((visualItem) => <span aria-current={visualItem.state === "active" ? "step" : undefined} className={`data-harbor-item is-${visualItem.state ?? "normal"}`} key={visualItem.id} role="listitem"><b>{visualItem.label}</b><small>{visualItem.meta}</small></span>)}
          </div>
          <p className="data-harbor-note">{step.visual.note}</p>
          <div className="data-harbor-options" aria-label="选择数据结构操作" role="group">{step.options.map((candidate) => <button aria-pressed={game.phase !== "playing" && candidate.id === step.answerId} className="harbor-action" disabled={game.phase !== "playing"} key={candidate.id} onClick={(event) => choose(event, candidate.id)} type="button">{candidate.label}</button>)}</div>
          <p className={`data-harbor-feedback phase-${game.phase}`} role="status">{game.feedback}</p>
          {game.phase === "step-solved" ? <button className="harbor-action data-harbor-next" onClick={nextStep} type="button">装好证据，继续操作 →</button> : null}
          {game.phase === "mission-solved" ? <button className="harbor-action data-harbor-next" onClick={nextMission} type="button">{game.index === deck.length - 1 ? "查看港口通关单" : "驶向下一座码头"} →</button> : null}
        </section>
        <aside className="data-harbor-manifest" aria-labelledby="data-harbor-manifest-heading">
          <div><span aria-hidden="true">▣</span><h3 id="data-harbor-manifest-heading">结构证据单</h3></div>
          {game.evidence.length > 0 ? <ol>{game.evidence.map((evidence, index) => <li key={`${mission.id}-${index}`}><span>{index + 1}</span>{evidence}</li>)}</ol> : <p>完成第一项正确操作后，这里会记录结构发生了什么。</p>}
          <small>答错不会移动节点或清空证据，可以继续观察关系。</small>
        </aside>
      </div>
    </section>
  );
}
