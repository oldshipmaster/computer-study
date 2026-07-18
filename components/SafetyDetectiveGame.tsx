"use client";

import { useLayoutEffect, useMemo, useRef, useState, type KeyboardEvent, type MouseEvent } from "react";
import { getCourse } from "@/lib/course-data";
import { numberShortcutIndex } from "@/lib/keyboard-shortcuts";
import {
  SAFETY_DETECTIVE_CASES,
  advanceSafetyCase,
  advanceSafetyStep,
  buildSafetyCaseDeck,
  chooseSafetyAction,
  createSafetyDetectiveState,
} from "@/lib/safety-detective-game";
import "./SafetyDetectiveGame.css";

interface SafetyDetectiveGameProps {
  completedCourseIds: string[];
  onStartCourse: (courseId: string) => void;
}

const REQUIRED_COURSE_IDS = ["password-guardian", "private-information", "popup-fog", "healthy-computer-habits", "light-bit-island"] as const;
const MODE_ICONS = { privacy: "▣", password: "✦", popup: "!", health: "♥", shared: "↪", response: "◆" } as const;

export function SafetyDetectiveGame({ completedCourseIds, onStartCourse }: SafetyDetectiveGameProps) {
  const completedRequired = REQUIRED_COURSE_IDS.filter((id) => completedCourseIds.includes(id));
  const unlocked = completedRequired.length === REQUIRED_COURSE_IDS.length;
  const nextCourse = getCourse(REQUIRED_COURSE_IDS.find((id) => !completedCourseIds.includes(id)) ?? "");
  const [mode, setMode] = useState<"menu" | "case">("menu");
  const [rotation, setRotation] = useState(0);
  const deck = useMemo(() => buildSafetyCaseDeck(rotation), [rotation]);
  const [game, setGame] = useState(() => createSafetyDetectiveState(SAFETY_DETECTIVE_CASES.length));
  const headingRef = useRef<HTMLHeadingElement>(null);
  const shouldFocusRef = useRef(false);

  useLayoutEffect(() => {
    if (!shouldFocusRef.current) return;
    headingRef.current?.focus();
    shouldFocusRef.current = false;
  }, [game.index, game.stepIndex, game.phase, mode]);

  function focusNext() { shouldFocusRef.current = true; }
  function startGame() { focusNext(); setGame(createSafetyDetectiveState(deck.length)); setMode("case"); }
  function replayGame() {
    const nextRotation = rotation + 1;
    focusNext();
    setRotation(nextRotation);
    setGame(createSafetyDetectiveState(buildSafetyCaseDeck(nextRotation).length));
  }

  if (!unlocked) {
    return (
      <section className="safety-detective-shell safety-detective-locked" id="safety-detective-game" aria-labelledby="safety-detective-heading">
        <span className="safety-detective-badge" aria-hidden="true">🔎</span>
        <div><p className="section-kicker">虚构案例 · 无真实资料</p><h2 id="safety-detective-heading">数字安全侦探局</h2><p>先完成安全灯塔五课，再来侦破隐私、口令、弹窗、健康与共享设备案件。</p><strong>已完成 {completedRequired.length} / {REQUIRED_COURSE_IDS.length} 门必修课</strong></div>
        {nextCourse ? <button onClick={() => onStartCourse(nextCourse.id)} type="button">下一门：{nextCourse.title}</button> : null}
      </section>
    );
  }

  if (mode === "menu") {
    return (
      <section className="safety-detective-shell safety-detective-menu" id="safety-detective-game" aria-labelledby="safety-detective-heading">
        <div><p className="section-kicker">停一下 · 看证据 · 找大人</p><h2 id="safety-detective-heading" ref={headingRef} tabIndex={-1}>数字安全侦探局</h2><p>六件案件全部使用虚构线索；不输入资料、不打开链接，也不需要孩子独自处理风险。</p></div>
        <div className="safety-case-files" aria-label="六件数字安全案件" role="list">{SAFETY_DETECTIVE_CASES.map((caseFile) => <span key={caseFile.id} role="listitem"><b aria-hidden="true">{MODE_ICONS[caseFile.mode]}</b><i>{caseFile.title}</i><small>{caseFile.skill}</small></span>)}</div>
        <button className="safety-action" onClick={startGame} type="button">打开第一件案件 <span aria-hidden="true">→</span></button>
      </section>
    );
  }

  if (game.phase === "complete") {
    return (
      <section className="safety-detective-shell safety-detective-complete" id="safety-detective-game" aria-labelledby="safety-detective-complete-heading">
        <span aria-hidden="true">🛡️</span>
        <div><p>六件案件的安全理由全部成立</p><h2 id="safety-detective-complete-heading" ref={headingRef} tabIndex={-1}>安全侦探通关！</h2><small>真正的安全不是“什么都不怕”，而是遇到不确定时会停止、保护信息并找可信大人。</small></div>
        <ul aria-label="已经掌握的安全能力">{["保护个人信息", "长且独特的口令", "识别可疑弹窗", "健康使用电脑", "共享设备收尾", "停止并求助"].map((skill) => <li key={skill}>✓ {skill}</li>)}</ul>
        <div><button className="safety-action" onClick={replayGame} type="button">重查六件案件</button><button className="safety-action safety-action--quiet" onClick={() => { focusNext(); setMode("menu"); }} type="button">返回侦探局入口</button></div>
      </section>
    );
  }

  const caseFile = deck[game.index];
  const step = caseFile.steps[game.stepIndex];
  function choose(event: MouseEvent<HTMLButtonElement>, actionId: string) { setGame((current) => chooseSafetyAction(current, caseFile, actionId, event.detail)); }
  function nextStep(event: MouseEvent<HTMLButtonElement>) { focusNext(); setGame((current) => advanceSafetyStep(current, caseFile, event.detail)); }
  function nextCase(event: MouseEvent<HTMLButtonElement>) { focusNext(); setGame((current) => advanceSafetyCase(current, event.detail)); }

  function handleDetectiveKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (event.nativeEvent.isComposing || event.repeat || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    const optionIndex = numberShortcutIndex(event.key, step.options.length);
    if (optionIndex !== null && game.phase === "investigating") {
      event.preventDefault();
      setGame((current) => chooseSafetyAction(current, caseFile, step.options[optionIndex].id, 0));
      return;
    }
    if (event.key !== "Enter" || event.target instanceof HTMLButtonElement) return;
    if (game.phase === "step-solved") { focusNext(); setGame((current) => advanceSafetyStep(current, caseFile, 0)); }
    else if (game.phase === "case-solved") { focusNext(); setGame((current) => advanceSafetyCase(current, 0)); }
    else return;
    event.preventDefault();
  }

  return (
    <section className={`safety-detective-shell safety-detective-case case-${caseFile.mode}`} id="safety-detective-game" aria-labelledby="safety-case-heading" onKeyDown={handleDetectiveKeyDown}>
      <button className="safety-detective-back" onClick={() => { focusNext(); setMode("menu"); }} type="button">← 返回侦探局入口</button>
      <header className="safety-detective-heading">
        <span aria-hidden="true">{MODE_ICONS[caseFile.mode]}</span>
        <div><p>案件 {game.index + 1} / {deck.length} · {caseFile.skill}</p><h2 id="safety-case-heading" ref={headingRef} tabIndex={-1}>{caseFile.title}</h2><small>{caseFile.story}</small></div>
        <progress aria-label="数字安全六件案件进度" max={deck.length} value={game.solved} />
      </header>
      <div className="safety-detective-layout">
        <section className="safety-clue-workbench" aria-labelledby="safety-step-heading">
          <span className="safety-step-count">线索组 {game.stepIndex + 1} / {caseFile.steps.length}</span>
          <h3 id="safety-step-heading">{step.prompt}</h3>
          <div className="safety-clue-grid" aria-label="当前案件线索" role="list">
            {step.clues.map((clue) => <span aria-current={clue.level === "risk" ? "true" : undefined} className={`safety-clue is-${clue.level}`} key={clue.id} role="listitem"><b>{clue.label}</b><small>{clue.detail}</small><i>{clue.level === "risk" ? "风险线索" : clue.level === "warning" ? "要留意" : "可用线索"}</i></span>)}
          </div>
          <div className="safety-actions" aria-label="选择安全行动" role="group">{step.options.map((candidate, index) => <button aria-keyshortcuts={String(index + 1)} aria-pressed={game.phase !== "investigating" && candidate.id === step.answerId} className="safety-action" disabled={game.phase !== "investigating"} key={candidate.id} onClick={(event) => choose(event, candidate.id)} type="button"><kbd>{index + 1}</kbd><span>{candidate.label}</span></button>)}</div>
          <p className="safety-keyboard-hint">{game.phase === "investigating" ? <>也可以按键盘数字 <kbd>1</kbd>、<kbd>2</kbd>、<kbd>3</kbd> 选择安全行动</> : <>按 <kbd>Enter</kbd> {game.phase === "step-solved" ? "收好证据并继续" : "打开下一件案件"}</>}</p>
          <p className={`safety-feedback phase-${game.phase}`} role="status">{game.feedback}</p>
          {game.phase === "step-solved" ? <button className="safety-action safety-next" onClick={nextStep} type="button">收好证据，继续调查 →</button> : null}
          {game.phase === "case-solved" ? <button className="safety-action safety-next" onClick={nextCase} type="button">{game.index === deck.length - 1 ? "查看安全侦探报告" : "打开下一件案件"} →</button> : null}
        </section>
        <aside className="safety-evidence-board" aria-labelledby="safety-evidence-heading">
          <div><span aria-hidden="true">◎</span><h3 id="safety-evidence-heading">侦探证据板</h3></div>
          {game.evidence.length > 0 ? <ol>{game.evidence.map((evidence, index) => <li key={`${caseFile.id}-${index}`}><span>{index + 1}</span>{evidence}</li>)}</ol> : <p>完成第一项安全行动后，这里会记录“为什么”。</p>}
          <small>风险选择不会执行，也不会清空已找到的证据。</small>
        </aside>
      </div>
    </section>
  );
}
