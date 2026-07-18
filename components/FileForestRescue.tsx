"use client";

import { useLayoutEffect, useMemo, useRef, useState, type MouseEvent } from "react";
import { getCourse } from "@/lib/course-data";
import {
  FILE_RESCUE_MISSIONS,
  advanceFileMission,
  advanceFileStep,
  buildFileRescueDeck,
  chooseFileAction,
  createFileRescueState,
} from "@/lib/file-forest-rescue";
import "./FileForestRescue.css";

interface FileForestRescueProps {
  completedCourseIds: string[];
  onStartCourse: (courseId: string) => void;
}

const REQUIRED_COURSE_IDS = ["file-home", "name-your-work", "move-and-copy", "file-types", "learning-backpack"] as const;
const MODE_ICONS = { path: "⌁", name: "Aa", move: "→", copy: "⧉", type: ".?", restore: "↶" } as const;

export function FileForestRescue({ completedCourseIds, onStartCourse }: FileForestRescueProps) {
  const completedRequired = REQUIRED_COURSE_IDS.filter((id) => completedCourseIds.includes(id));
  const unlocked = completedRequired.length === REQUIRED_COURSE_IDS.length;
  const nextCourse = getCourse(REQUIRED_COURSE_IDS.find((id) => !completedCourseIds.includes(id)) ?? "");
  const [mode, setMode] = useState<"menu" | "rescue">("menu");
  const [rotation, setRotation] = useState(0);
  const deck = useMemo(() => buildFileRescueDeck(rotation), [rotation]);
  const [game, setGame] = useState(() => createFileRescueState(FILE_RESCUE_MISSIONS.length));
  const headingRef = useRef<HTMLHeadingElement>(null);
  const shouldFocusRef = useRef(false);

  useLayoutEffect(() => {
    if (!shouldFocusRef.current) return;
    headingRef.current?.focus();
    shouldFocusRef.current = false;
  }, [game.index, game.stepIndex, game.phase, mode]);

  function focusNext() { shouldFocusRef.current = true; }
  function startRescue() { focusNext(); setGame(createFileRescueState(deck.length)); setMode("rescue"); }
  function replayRescue() {
    const nextRotation = rotation + 1;
    focusNext();
    setRotation(nextRotation);
    setGame(createFileRescueState(buildFileRescueDeck(nextRotation).length));
  }

  if (!unlocked) {
    return (
      <section className="file-rescue-shell file-rescue-locked" id="file-forest-rescue" aria-labelledby="file-rescue-heading">
        <span className="file-rescue-mascot" aria-hidden="true">🦉</span>
        <div><p className="section-kicker">纯虚拟文件 · 可逆操作</p><h2 id="file-rescue-heading">文件森林救援队</h2><p>先完成文件森林五课，再来处理路径、命名、移动、复制、分类和恢复任务。</p><strong>已完成 {completedRequired.length} / {REQUIRED_COURSE_IDS.length} 门必修课</strong></div>
        {nextCourse ? <button onClick={() => onStartCourse(nextCourse.id)} type="button">下一门：{nextCourse.title}</button> : null}
      </section>
    );
  }

  if (mode === "menu") {
    return (
      <section className="file-rescue-shell file-rescue-menu" id="file-forest-rescue" aria-labelledby="file-rescue-heading">
        <div><p className="section-kicker">看路径 · 数份数 · 留证据</p><h2 id="file-rescue-heading" ref={headingRef} tabIndex={-1}>文件森林救援队</h2><p>跟着猫头鹰队长完成六次屏幕内救援，学会让学习资料各回各家。</p></div>
        <div className="file-rescue-missions" aria-label="六次文件救援" role="list">{FILE_RESCUE_MISSIONS.map((mission) => <span key={mission.id} role="listitem"><b aria-hidden="true">{MODE_ICONS[mission.mode]}</b><i>{mission.title}</i><small>{mission.skill}</small></span>)}</div>
        <button className="file-rescue-action" onClick={startRescue} type="button">领取六次救援任务 <span aria-hidden="true">→</span></button>
      </section>
    );
  }

  if (game.phase === "complete") {
    return (
      <section className="file-rescue-shell file-rescue-complete" id="file-forest-rescue" aria-labelledby="file-rescue-complete-heading">
        <span aria-hidden="true">🌳</span>
        <div><p>六次虚拟文件救援全部完成</p><h2 id="file-rescue-complete-heading" ref={headingRef} tabIndex={-1}>文件森林恢复秩序！</h2><small>你会先观察名称、路径、类型和数量，再做可逆操作并核对证据。</small></div>
        <ul aria-label="已经掌握的文件管理能力">{["文件与文件夹路径", "文件命名与扩展名", "移动原件", "复制与数量", "文件类型", "恢复与搜索"].map((skill) => <li key={skill}>✓ {skill}</li>)}</ul>
        <div><button className="file-rescue-action" onClick={replayRescue} type="button">重玩六次救援</button><button className="file-rescue-action file-rescue-action--quiet" onClick={() => { focusNext(); setMode("menu"); }} type="button">返回救援队营地</button></div>
      </section>
    );
  }

  const mission = deck[game.index];
  const step = mission.steps[game.stepIndex];
  function choose(event: MouseEvent<HTMLButtonElement>, actionId: string) { setGame((current) => chooseFileAction(current, mission, actionId, event.detail)); }
  function nextStep(event: MouseEvent<HTMLButtonElement>) { focusNext(); setGame((current) => advanceFileStep(current, mission, event.detail)); }
  function nextMission(event: MouseEvent<HTMLButtonElement>) { focusNext(); setGame((current) => advanceFileMission(current, event.detail)); }

  return (
    <section className={`file-rescue-shell file-rescue-game rescue-${mission.mode}`} id="file-forest-rescue" aria-labelledby="file-rescue-mission-heading">
      <button className="file-rescue-back" onClick={() => { focusNext(); setMode("menu"); }} type="button">← 返回救援队营地</button>
      <header className="file-rescue-heading">
        <span aria-hidden="true">{MODE_ICONS[mission.mode]}</span>
        <div><p>救援 {game.index + 1} / {deck.length} · {mission.skill}</p><h2 id="file-rescue-mission-heading" ref={headingRef} tabIndex={-1}>{mission.title}</h2><small>{mission.story}</small></div>
        <progress aria-label="文件森林六次救援进度" max={deck.length} value={game.solved} />
      </header>
      <div className="file-rescue-layout">
        <section className="file-rescue-workbench" aria-labelledby="file-rescue-step-heading">
          <span className="file-rescue-step-count">步骤 {game.stepIndex + 1} / {mission.steps.length}</span>
          <h3 id="file-rescue-step-heading">{step.prompt}</h3>
          <div className="file-rescue-files" aria-label="当前虚拟文件和文件夹" role="list">
            {step.files.map((virtualFile) => <article aria-current={virtualFile.state === "active" ? "step" : undefined} className={`file-rescue-file is-${virtualFile.state ?? "normal"}`} key={virtualFile.id} role="listitem"><span aria-hidden="true">{virtualFile.kind === "folder" ? "📁" : "📄"}</span><b>{virtualFile.name}</b><small>{virtualFile.location}</small></article>)}
          </div>
          <div className="file-rescue-actions" aria-label="选择虚拟文件操作" role="group">{step.options.map((candidate) => <button aria-pressed={game.phase !== "rescuing" && candidate.id === step.answerId} className="file-rescue-action" disabled={game.phase !== "rescuing"} key={candidate.id} onClick={(event) => choose(event, candidate.id)} type="button">{candidate.label}</button>)}</div>
          <p className={`file-rescue-feedback phase-${game.phase}`} role="status">{game.feedback}</p>
          {game.phase === "step-solved" ? <button className="file-rescue-action file-rescue-next" onClick={nextStep} type="button">保存记录，继续检查 →</button> : null}
          {game.phase === "mission-solved" ? <button className="file-rescue-action file-rescue-next" onClick={nextMission} type="button">{game.index === deck.length - 1 ? "查看救援总结" : "接收下一次救援"} <span aria-hidden="true">→</span></button> : null}
        </section>
        <aside className="file-rescue-log" aria-labelledby="file-rescue-log-heading">
          <div><span aria-hidden="true">⌕</span><h3 id="file-rescue-log-heading">文件救援记录</h3></div>
          {game.evidence.length > 0 ? <ol>{game.evidence.map((evidence, index) => <li key={`${mission.id}-${index}`}><span>{index + 1}</span>{evidence}</li>)}</ol> : <p>正确完成第一步后，这里会记录文件名、路径或数量证据。</p>}
          <small>所有文件都是虚构卡片；错误选择不会改动真实设备。</small>
        </aside>
      </div>
    </section>
  );
}
