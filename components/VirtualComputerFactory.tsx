"use client";

import { useLayoutEffect, useMemo, useRef, useState, type KeyboardEvent, type MouseEvent } from "react";
import { getCourse } from "@/lib/course-data";
import { numberShortcutIndex } from "@/lib/keyboard-shortcuts";
import {
  VIRTUAL_FACTORY_STATIONS,
  advanceFactoryStation,
  advanceFactoryStep,
  buildFactoryDeck,
  chooseFactoryAction,
  createFactoryState,
} from "@/lib/virtual-computer-factory";
import "./VirtualComputerFactory.css";

interface VirtualComputerFactoryProps {
  completedCourseIds: string[];
  onStartCourse: (courseId: string) => void;
}

const REQUIRED_COURSE_IDS = ["input-process-output", "cpu-memory-storage", "bits-and-data", "hardware-software", "troubleshoot-machine"] as const;
const MODE_ICONS = { pipeline: "⇢", memory: "▤", bits: "01", pairing: "⚙", diagnosis: "+", system: "⌘" } as const;

export function VirtualComputerFactory({ completedCourseIds, onStartCourse }: VirtualComputerFactoryProps) {
  const completedRequired = REQUIRED_COURSE_IDS.filter((id) => completedCourseIds.includes(id));
  const unlocked = completedRequired.length === REQUIRED_COURSE_IDS.length;
  const nextCourse = getCourse(REQUIRED_COURSE_IDS.find((id) => !completedCourseIds.includes(id)) ?? "");
  const [mode, setMode] = useState<"menu" | "factory">("menu");
  const [rotation, setRotation] = useState(0);
  const deck = useMemo(() => buildFactoryDeck(rotation), [rotation]);
  const [game, setGame] = useState(() => createFactoryState(VIRTUAL_FACTORY_STATIONS.length));
  const headingRef = useRef<HTMLHeadingElement>(null);
  const shouldFocusRef = useRef(false);

  useLayoutEffect(() => {
    if (!shouldFocusRef.current) return;
    headingRef.current?.focus();
    shouldFocusRef.current = false;
  }, [game.index, game.stepIndex, game.phase, mode]);

  function focusNext() { shouldFocusRef.current = true; }
  function startFactory() { focusNext(); setGame(createFactoryState(deck.length)); setMode("factory"); }
  function replayFactory() {
    const nextRotation = rotation + 1;
    focusNext();
    setRotation(nextRotation);
    setGame(createFactoryState(buildFactoryDeck(nextRotation).length));
  }

  if (!unlocked) {
    return (
      <section className="computer-factory-shell computer-factory-locked" id="virtual-computer-factory" aria-labelledby="computer-factory-heading">
        <span className="factory-robot" aria-hidden="true">🦾</span>
        <div><p className="section-kicker">只在屏幕内虚拟装配</p><h2 id="computer-factory-heading">虚拟电脑装配厂</h2><p>先完成硬件实验岛五课，再来连接信息、部件、比特和安全诊断工位。</p><strong>已完成 {completedRequired.length} / {REQUIRED_COURSE_IDS.length} 门必修课</strong></div>
        {nextCourse ? <button onClick={() => onStartCourse(nextCourse.id)} type="button">下一门：{nextCourse.title}</button> : null}
      </section>
    );
  }

  if (mode === "menu") {
    return (
      <section className="computer-factory-shell computer-factory-menu" id="virtual-computer-factory" aria-labelledby="computer-factory-heading">
        <div><p className="section-kicker">虚拟部件 · 真实原理</p><h2 id="computer-factory-heading" ref={headingRef} tabIndex={-1}>虚拟电脑装配厂</h2><p>从按下一个键到保存一幅画，亲手连接电脑内部每个角色的职责。</p></div>
        <div className="factory-stations" aria-label="六个虚拟电脑工位" role="list">{VIRTUAL_FACTORY_STATIONS.map((station) => <span key={station.id} role="listitem"><b aria-hidden="true">{MODE_ICONS[station.mode]}</b><i>{station.title}</i><small>{station.skill}</small></span>)}</div>
        <button className="factory-action" onClick={startFactory} type="button">启动六工位装配 <span aria-hidden="true">→</span></button>
      </section>
    );
  }

  if (game.phase === "complete") {
    return (
      <section className="computer-factory-shell computer-factory-complete" id="virtual-computer-factory" aria-labelledby="computer-factory-complete-heading">
        <span aria-hidden="true">🖥️</span>
        <div><p>六份工位检测全部通过</p><h2 id="computer-factory-complete-heading" ref={headingRef} tabIndex={-1}>虚拟电脑装配完成！</h2><small>你能从输入一路解释到处理、工作内存、长期存储和输出，也知道哪些故障必须交给大人。</small></div>
        <ul aria-label="已经掌握的计算机组成能力">{["输入—处理—输出", "CPU、内存与存储", "比特与字节", "硬件与软件", "安全排错", "计算机组成综合"].map((skill) => <li key={skill}>✓ {skill}</li>)}</ul>
        <div><button className="factory-action" onClick={replayFactory} type="button">重装六个工位</button><button className="factory-action factory-action--quiet" onClick={() => { focusNext(); setMode("menu"); }} type="button">返回装配厂入口</button></div>
      </section>
    );
  }

  const station = deck[game.index];
  const step = station.steps[game.stepIndex];
  function choose(event: MouseEvent<HTMLButtonElement>, actionId: string) { setGame((current) => chooseFactoryAction(current, station, actionId, event.detail)); }
  function nextStep(event: MouseEvent<HTMLButtonElement>) { focusNext(); setGame((current) => advanceFactoryStep(current, station, event.detail)); }
  function nextStation(event: MouseEvent<HTMLButtonElement>) { focusNext(); setGame((current) => advanceFactoryStation(current, event.detail)); }

  function handleFactoryKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (event.nativeEvent.isComposing || event.repeat || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    const optionIndex = numberShortcutIndex(event.key, step.options.length);
    if (optionIndex !== null && game.phase === "building") {
      event.preventDefault();
      setGame((current) => chooseFactoryAction(current, station, step.options[optionIndex].id, 0));
      return;
    }
    if (event.key !== "Enter" || event.target instanceof HTMLButtonElement) return;
    if (game.phase === "step-solved") { focusNext(); setGame((current) => advanceFactoryStep(current, station, 0)); }
    else if (game.phase === "station-solved") { focusNext(); setGame((current) => advanceFactoryStation(current, 0)); }
    else return;
    event.preventDefault();
  }

  return (
    <section className={`computer-factory-shell computer-factory-game station-${station.mode}`} id="virtual-computer-factory" aria-labelledby="factory-station-heading" onKeyDown={handleFactoryKeyDown}>
      <button className="computer-factory-back" onClick={() => { focusNext(); setMode("menu"); }} type="button">← 返回装配厂入口</button>
      <header className="computer-factory-heading">
        <span aria-hidden="true">{MODE_ICONS[station.mode]}</span>
        <div><p>工位 {game.index + 1} / {deck.length} · {station.skill}</p><h2 id="factory-station-heading" ref={headingRef} tabIndex={-1}>{station.title}</h2><small>{station.story}</small></div>
        <progress aria-label="虚拟电脑六工位进度" max={deck.length} value={game.solved} />
      </header>
      <div className="computer-factory-layout">
        <section className="factory-workbench" aria-labelledby="factory-step-heading">
          <span className="factory-step-count">装配 {game.stepIndex + 1} / {station.steps.length}</span>
          <h3 id="factory-step-heading">{step.prompt}</h3>
          <div className={`factory-parts parts-${station.mode}`} aria-label="当前虚拟部件与数据状态" role="list">
            {step.parts.map((machinePart) => <span aria-current={machinePart.state === "active" ? "step" : undefined} className={`factory-part is-${machinePart.state ?? "normal"}`} key={machinePart.id} role="listitem"><b>{machinePart.label}</b><small>{machinePart.role}</small></span>)}
          </div>
          <div className="factory-actions" aria-label="选择虚拟装配动作" role="group">{step.options.map((candidate, index) => <button aria-keyshortcuts={String(index + 1)} aria-pressed={game.phase !== "building" && candidate.id === step.answerId} className="factory-action" disabled={game.phase !== "building"} key={candidate.id} onClick={(event) => choose(event, candidate.id)} type="button"><kbd>{index + 1}</kbd><span>{candidate.label}</span></button>)}</div>
          <p className="factory-keyboard-hint">{game.phase === "building" ? <>也可以按键盘数字 <kbd>1</kbd>、<kbd>2</kbd>、<kbd>3</kbd> 选择装配动作</> : <>按 <kbd>Enter</kbd> {game.phase === "step-solved" ? "记录检测并继续" : "启动下一工位"}</>}</p>
          <p className={`factory-feedback phase-${game.phase}`} role="status">{game.feedback}</p>
          {game.phase === "step-solved" ? <button className="factory-action factory-next" onClick={nextStep} type="button">记录检测，继续装配 →</button> : null}
          {game.phase === "station-solved" ? <button className="factory-action factory-next" onClick={nextStation} type="button">{game.index === deck.length - 1 ? "查看整机报告" : "启动下一工位"} →</button> : null}
        </section>
        <aside className="factory-inspection" aria-labelledby="factory-inspection-heading">
          <div><span aria-hidden="true">✓</span><h3 id="factory-inspection-heading">工位检测单</h3></div>
          {game.evidence.length > 0 ? <ol>{game.evidence.map((evidence, index) => <li key={`${station.id}-${index}`}><span>{index + 1}</span>{evidence}</li>)}</ol> : <p>完成第一段正确数据流后，这里会记录部件为什么这样连接。</p>}
          <small>错误选择不会改变虚拟机器，也不会接触真实设备。</small>
        </aside>
      </div>
    </section>
  );
}
