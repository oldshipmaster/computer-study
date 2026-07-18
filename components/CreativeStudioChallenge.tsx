"use client";

import { useLayoutEffect, useMemo, useRef, useState, type KeyboardEvent, type MouseEvent } from "react";
import { getCourse } from "@/lib/course-data";
import { numberShortcutIndex } from "@/lib/keyboard-shortcuts";
import {
  CREATIVE_STUDIO_PROJECTS,
  advanceCreativeProject,
  advanceCreativeStep,
  buildCreativeProjectDeck,
  chooseCreativeDecision,
  createCreativeStudioState,
} from "@/lib/creative-studio-challenge";
import "./CreativeStudioChallenge.css";

interface CreativeStudioChallengeProps { completedCourseIds: string[]; onStartCourse: (courseId: string) => void }
const REQUIRED_COURSE_IDS = ["pixel-art", "document-design", "slide-story", "media-copyright", "data-table"] as const;
const MODE_ICONS = { pixel: "▦", document: "¶", slides: "▣", copyright: "©", table: "Σ", showcase: "★" } as const;

export function CreativeStudioChallenge({ completedCourseIds, onStartCourse }: CreativeStudioChallengeProps) {
  const completedRequired = REQUIRED_COURSE_IDS.filter((id) => completedCourseIds.includes(id));
  const unlocked = completedRequired.length === REQUIRED_COURSE_IDS.length;
  const nextCourse = getCourse(REQUIRED_COURSE_IDS.find((id) => !completedCourseIds.includes(id)) ?? "");
  const [mode, setMode] = useState<"menu" | "studio">("menu");
  const [rotation, setRotation] = useState(0);
  const deck = useMemo(() => buildCreativeProjectDeck(rotation), [rotation]);
  const [game, setGame] = useState(() => createCreativeStudioState(CREATIVE_STUDIO_PROJECTS.length));
  const headingRef = useRef<HTMLHeadingElement>(null);
  const shouldFocusRef = useRef(false);

  useLayoutEffect(() => { if (!shouldFocusRef.current) return; headingRef.current?.focus(); shouldFocusRef.current = false; }, [game.index, game.stepIndex, game.phase, mode]);
  function focusNext() { shouldFocusRef.current = true; }
  function startStudio() { focusNext(); setGame(createCreativeStudioState(deck.length)); setMode("studio"); }
  function replayStudio() { const nextRotation = rotation + 1; focusNext(); setRotation(nextRotation); setGame(createCreativeStudioState(buildCreativeProjectDeck(nextRotation).length)); }

  if (!unlocked) return <section className="creative-studio-shell creative-studio-locked" id="creative-studio-challenge" aria-labelledby="creative-studio-heading"><span className="creative-studio-mascot" aria-hidden="true">🎨</span><div><p className="section-kicker">固定虚构素材 · 不上传作品</p><h2 id="creative-studio-heading">创作工坊项目赛</h2><p>先完成创作工坊五课，再来完成像素画、文档、幻灯片、版权和表格项目。</p><strong>已完成 {completedRequired.length} / {REQUIRED_COURSE_IDS.length} 门必修课</strong></div>{nextCourse ? <button onClick={() => onStartCourse(nextCourse.id)} type="button">下一门：{nextCourse.title}</button> : null}</section>;

  if (mode === "menu") return <section className="creative-studio-shell creative-studio-menu" id="creative-studio-challenge" aria-labelledby="creative-studio-heading"><div><p className="section-kicker">看作品 · 做决定 · 讲理由</p><h2 id="creative-studio-heading" ref={headingRef} tabIndex={-1}>创作工坊项目赛</h2><p>从一格像素到一场班级展览，用六个小项目练习真正的数字创作流程。</p></div><div className="creative-studio-projects" aria-label="六个创作项目" role="list">{CREATIVE_STUDIO_PROJECTS.map((project) => <span key={project.id} role="listitem"><b aria-hidden="true">{MODE_ICONS[project.mode]}</b><i>{project.title}</i><small>{project.skill}</small></span>)}</div><button className="creative-studio-action" onClick={startStudio} type="button">打开六张项目画布 <span aria-hidden="true">→</span></button></section>;

  if (game.phase === "complete") return <section className="creative-studio-shell creative-studio-complete" id="creative-studio-challenge" aria-labelledby="creative-studio-complete-heading"><span aria-hidden="true">🏆</span><div><p>六份虚拟作品全部通过</p><h2 id="creative-studio-complete-heading" ref={headingRef} tabIndex={-1}>创作工坊展览开幕！</h2><small>你会从观众目标出发，检查画面、结构、素材许可和数据证据。</small></div><ul aria-label="已经掌握的数字创作能力">{["网格与有限色板", "标题、正文与留白", "故事顺序与单页重点", "许可、来源与再创作", "表头、数据类型与合计", "项目检查与观众视角"].map((skill) => <li key={skill}>✓ {skill}</li>)}</ul><div><button className="creative-studio-action" onClick={replayStudio} type="button">重做六个项目</button><button className="creative-studio-action creative-studio-action--quiet" onClick={() => { focusNext(); setMode("menu"); }} type="button">返回项目大厅</button></div></section>;

  const project = deck[game.index]; const step = project.steps[game.stepIndex];
  function choose(event: MouseEvent<HTMLButtonElement>, decisionId: string) { setGame((current) => chooseCreativeDecision(current, project, decisionId, event.detail)); }
  function nextStep(event: MouseEvent<HTMLButtonElement>) { focusNext(); setGame((current) => advanceCreativeStep(current, project, event.detail)); }
  function nextProject(event: MouseEvent<HTMLButtonElement>) { focusNext(); setGame((current) => advanceCreativeProject(current, event.detail)); }

  function handleStudioKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (event.nativeEvent.isComposing || event.repeat || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    const optionIndex = numberShortcutIndex(event.key, step.options.length);
    if (optionIndex !== null && game.phase === "drafting") { event.preventDefault(); setGame((current) => chooseCreativeDecision(current, project, step.options[optionIndex].id, 0)); return; }
    if (event.key !== "Enter" || event.target instanceof HTMLButtonElement) return;
    if (game.phase === "step-solved") { focusNext(); setGame((current) => advanceCreativeStep(current, project, 0)); }
    else if (game.phase === "project-solved") { focusNext(); setGame((current) => advanceCreativeProject(current, 0)); }
    else return;
    event.preventDefault();
  }

  return <section className={`creative-studio-shell creative-studio-game studio-${project.mode}`} id="creative-studio-challenge" aria-labelledby="creative-project-heading" onKeyDown={handleStudioKeyDown}>
    <button className="creative-studio-back" onClick={() => { focusNext(); setMode("menu"); }} type="button">← 返回项目大厅</button>
    <header className="creative-studio-heading"><span aria-hidden="true">{MODE_ICONS[project.mode]}</span><div><p>项目 {game.index + 1} / {deck.length} · {project.skill}</p><h2 id="creative-project-heading" ref={headingRef} tabIndex={-1}>{project.title}</h2><small>{project.story}</small></div><progress aria-label="创作工坊六项目进度" max={deck.length} value={game.solved} /></header>
    <div className="creative-studio-layout"><section className="creative-studio-workbench" aria-labelledby="creative-step-heading"><span className="creative-studio-step-count">设计决定 {game.stepIndex + 1} / {project.steps.length}</span><h3 id="creative-step-heading">{step.prompt}</h3><div className={`creative-studio-canvas canvas-${project.mode}`} aria-label="当前虚拟作品画布" role="list">{step.canvas.map((canvasCard) => <article aria-current={canvasCard.state === "active" ? "step" : undefined} className={`creative-canvas-card is-${canvasCard.state ?? "normal"}`} key={canvasCard.id} role="listitem"><span aria-hidden="true">{MODE_ICONS[project.mode]}</span><b>{canvasCard.label}</b><small>{canvasCard.detail}</small></article>)}</div><div className="creative-studio-actions" aria-label="选择设计决定" role="group">{step.options.map((candidate, index) => <button aria-keyshortcuts={String(index + 1)} aria-pressed={game.phase !== "drafting" && candidate.id === step.answerId} className="creative-studio-action" disabled={game.phase !== "drafting"} key={candidate.id} onClick={(event) => choose(event, candidate.id)} type="button"><kbd>{index + 1}</kbd><span>{candidate.label}</span></button>)}</div><p className="creative-studio-keyboard-hint">{game.phase === "drafting" ? <>也可以按键盘数字 <kbd>1</kbd>、<kbd>2</kbd>、<kbd>3</kbd> 选择设计决定</> : <>按 <kbd>Enter</kbd> {game.phase === "step-solved" ? "把理由放入作品集" : "打开下一个项目"}</>}</p><p className={`creative-studio-feedback phase-${game.phase}`} role="status">{game.feedback}</p>{game.phase === "step-solved" ? <button className="creative-studio-action creative-studio-next" onClick={nextStep} type="button">把理由放入作品集 →</button> : null}{game.phase === "project-solved" ? <button className="creative-studio-action creative-studio-next" onClick={nextProject} type="button">{game.index === deck.length - 1 ? "参观最终展览" : "打开下一个项目"} <span aria-hidden="true">→</span></button> : null}</section>
      <aside className="creative-studio-portfolio" aria-labelledby="creative-portfolio-heading"><div><span aria-hidden="true">✦</span><h3 id="creative-portfolio-heading">项目作品集</h3></div>{game.portfolio.length > 0 ? <ol>{game.portfolio.map((evidence, index) => <li key={`${project.id}-${index}`}><span>{index + 1}</span>{evidence}</li>)}</ol> : <p>完成第一个设计决定后，这里会记录“为什么这样做”。</p>}<small>画布和素材均为虚构内容，选择不会上传或保存。</small></aside></div>
  </section>;
}
