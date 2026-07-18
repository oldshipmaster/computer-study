"use client";

import { useLayoutEffect, useMemo, useRef, useState, type MouseEvent } from "react";
import { getCourse } from "@/lib/course-data";
import {
  LOGIC_CIRCUIT_PUZZLES,
  advanceLogicPuzzle,
  buildLogicPuzzleDeck,
  createLogicLabState,
  evaluateLogicGate,
  runLogicCircuit,
  selectCircuitGate,
  testLogicCircuit,
  type LogicGate,
} from "@/lib/logic-circuit-lab";
import "./LogicCircuitLab.css";

interface LogicCircuitLabProps {
  completedCourseIds: string[];
  onStartCourse: (courseId: string) => void;
}

type LabMode = "menu" | "challenge" | "sandbox";
const REQUIRED_COURSE_IDS = ["bits-and-data", "boolean-logic"] as const;
const GATE_COPY: Record<LogicGate, { symbol: string; name: string; rule: string }> = {
  AND: { symbol: "&", name: "AND 并且", rule: "两个都为真才亮" },
  OR: { symbol: "≥1", name: "OR 或者", rule: "至少一个为真就亮" },
  XOR: { symbol: "≠", name: "XOR 不同", rule: "两个不同时才亮" },
  NOT: { symbol: "!", name: "NOT 不是", rule: "把 A 的真假翻转" },
};

export function LogicCircuitLab({ completedCourseIds, onStartCourse }: LogicCircuitLabProps) {
  const completedRequired = REQUIRED_COURSE_IDS.filter((id) => completedCourseIds.includes(id));
  const unlocked = completedRequired.length === REQUIRED_COURSE_IDS.length;
  const nextCourse = getCourse(REQUIRED_COURSE_IDS.find((id) => !completedCourseIds.includes(id)) ?? "");
  const [mode, setMode] = useState<LabMode>("menu");
  const [rotation, setRotation] = useState(0);
  const deck = useMemo(() => buildLogicPuzzleDeck(rotation), [rotation]);
  const [game, setGame] = useState(() => createLogicLabState(LOGIC_CIRCUIT_PUZZLES.length));
  const [sandboxInputs, setSandboxInputs] = useState({ A: false, B: false });
  const [sandboxGate, setSandboxGate] = useState<LogicGate>("AND");
  const headingRef = useRef<HTMLHeadingElement>(null);
  const shouldFocusRef = useRef(false);

  useLayoutEffect(() => {
    if (!shouldFocusRef.current) return;
    headingRef.current?.focus();
    shouldFocusRef.current = false;
  }, [game.index, game.phase, mode]);

  function enterMode(nextMode: LabMode) {
    shouldFocusRef.current = true;
    setMode(nextMode);
    window.setTimeout(() => headingRef.current?.focus(), 0);
  }

  function startChallenge() {
    setGame(createLogicLabState(deck.length));
    enterMode("challenge");
  }

  function replayChallenge() {
    const nextRotation = rotation + 1;
    setRotation(nextRotation);
    setGame(createLogicLabState(buildLogicPuzzleDeck(nextRotation).length));
    enterMode("challenge");
  }

  if (!unlocked) {
    return (
      <section className="logic-circuit-shell logic-circuit-locked" id="logic-circuit-lab" aria-labelledby="logic-circuit-heading">
        <span className="circuit-lock-icon" aria-hidden="true">⚙</span>
        <div><p className="section-kicker">动手型逻辑游戏</p><h2 id="logic-circuit-heading">逻辑电路实验台</h2><p>先学会比特和真假逻辑，再来亲手搭门、跑真值表。</p><strong>已完成 {completedRequired.length} / {REQUIRED_COURSE_IDS.length} 门必修课</strong></div>
        {nextCourse ? <button onClick={() => onStartCourse(nextCourse.id)} type="button">下一门：{nextCourse.title}</button> : null}
      </section>
    );
  }

  if (mode === "menu") {
    return (
      <section className="logic-circuit-shell logic-circuit-menu" id="logic-circuit-lab" aria-labelledby="logic-circuit-heading">
        <div className="circuit-menu-copy"><p className="section-kicker">无倒计时 · 可反复实验</p><h2 id="logic-circuit-heading">逻辑电路实验台</h2><p>把 AND、OR、XOR、NOT 放进电路槽，让每一种输入都得到正确输出。</p></div>
        <div className="circuit-menu-actions"><button onClick={startChallenge} type="button">开始六关挑战</button><button onClick={() => enterMode("sandbox")} type="button">进入自由实验</button></div>
      </section>
    );
  }

  if (mode === "sandbox") {
    const sandboxOutput = evaluateLogicGate(sandboxGate, sandboxInputs.A, sandboxInputs.B);
    return (
      <section className="logic-circuit-shell logic-circuit-game" id="logic-circuit-lab" aria-labelledby="circuit-sandbox-heading">
        <button className="circuit-back" onClick={() => enterMode("menu")} type="button">← 返回电路台</button>
        <header className="circuit-game-heading"><p>没有目标，也没有对错</p><h2 id="circuit-sandbox-heading" ref={headingRef} tabIndex={-1}>自由实验</h2><span>切换输入与逻辑门，观察输出怎样跟着规则变化。</span></header>
        <div className="circuit-sandbox">
          <div className="sandbox-inputs" role="group" aria-label="自由实验输入开关">
            {(["A", "B"] as const).map((input) => <button aria-pressed={sandboxInputs[input]} key={input} onClick={() => setSandboxInputs((current) => ({ ...current, [input]: !current[input] }))} type="button"><strong>{input}</strong><span>{sandboxInputs[input] ? "真 · 1" : "假 · 0"}</span></button>)}
          </div>
          <div className="sandbox-gates" role="group" aria-label="自由实验逻辑门">
            {(Object.keys(GATE_COPY) as LogicGate[]).map((gate) => <button aria-pressed={sandboxGate === gate} className="circuit-gate-choice" key={gate} onClick={() => setSandboxGate(gate)} type="button"><b>{GATE_COPY[gate].symbol}</b><span>{GATE_COPY[gate].name}</span></button>)}
          </div>
          <div className={`circuit-output-light ${sandboxOutput ? "is-on" : ""}`} role="status"><span aria-hidden="true" /><strong>输出：{sandboxOutput ? "真 · 1 · 灯亮" : "假 · 0 · 灯灭"}</strong><small>{GATE_COPY[sandboxGate].rule}</small></div>
        </div>
      </section>
    );
  }

  if (game.phase === "complete") {
    return (
      <section className="logic-circuit-shell logic-circuit-game circuit-complete" id="logic-circuit-lab" aria-labelledby="circuit-complete-heading">
        <span className="circuit-output-light is-on" aria-hidden="true"><i /></span>
        <div><p>六块电路板全部通过</p><h2 id="circuit-complete-heading" ref={headingRef} tabIndex={-1}>逻辑实验员通关！</h2><span>你不是只试了一组输入，而是用完整真值表证明了电路规则。</span></div>
        <div className="circuit-complete-actions"><button onClick={replayChallenge} type="button">重玩六块电路板</button><button onClick={() => enterMode("sandbox")} type="button">去自由实验</button></div>
      </section>
    );
  }

  const puzzle = deck[game.index];
  const targetRows = runLogicCircuit(puzzle, puzzle.correctGates);
  const displayRows = game.rows.length > 0 ? game.rows : targetRows;
  const ready = puzzle.slots.every((slot) => game.selections[slot.id]);

  function runTests(event: MouseEvent<HTMLButtonElement>) {
    setGame((current) => testLogicCircuit(current, puzzle, event.detail));
  }

  function nextBoard(event: MouseEvent<HTMLButtonElement>) {
    shouldFocusRef.current = true;
    setGame((current) => advanceLogicPuzzle(current, event.detail));
  }

  return (
    <section className="logic-circuit-shell logic-circuit-game" id="logic-circuit-lab" aria-labelledby="circuit-board-heading">
      <button className="circuit-back" onClick={() => enterMode("menu")} type="button">← 返回电路台</button>
      <header className="circuit-game-heading"><p>电路板 {game.index + 1} / {game.puzzleCount}</p><h2 id="circuit-board-heading" ref={headingRef} tabIndex={-1}>{puzzle.title}</h2><span>{puzzle.story}</span><progress aria-label="逻辑电路挑战进度" max={game.puzzleCount} value={game.solved} /></header>
      <div className="circuit-workbench">
        <div className="circuit-builder">
          <div className="circuit-input-line" aria-label="电路输入端" role="group">{puzzle.inputs.map((input) => <span key={input}><b>{input}</b><small>输入</small></span>)}</div>
          {puzzle.slots.map((slot) => <section className="circuit-slot" key={slot.id}><header><span>{slot.left}{slot.right ? ` + ${slot.right}` : ""} →</span><strong>{slot.id} 门槽</strong></header><div role="group" aria-label={`${slot.id} 选择逻辑门`}>{slot.allowedGates.map((gate) => <button aria-pressed={game.selections[slot.id] === gate} className="circuit-gate-choice" disabled={game.phase === "solved"} key={gate} onClick={() => setGame((current) => selectCircuitGate(current, puzzle, slot.id, gate))} type="button"><b>{GATE_COPY[gate].symbol}</b><span>{gate}</span></button>)}</div></section>)}
          <div className={`circuit-output-light ${game.phase === "solved" ? "is-on" : ""}`}><span aria-hidden="true" /><strong>输出测试灯</strong><small>{game.phase === "solved" ? "全部输入通过" : "等待完整测试"}</small></div>
        </div>
        <div className="circuit-table-panel"><h3>目标真值表</h3><div className="circuit-table-scroll"><table><thead><tr>{puzzle.inputs.map((input) => <th key={input} scope="col">{input}</th>)}<th scope="col">目标</th><th scope="col">实际</th><th scope="col">结果</th></tr></thead><tbody>{displayRows.map((row, rowIndex) => <tr className={game.rows.length > 0 && !row.matches ? "circuit-row--fail" : game.rows.length > 0 ? "circuit-row--pass" : ""} key={rowIndex}>{puzzle.inputs.map((input) => <td key={input}>{row.inputs[input] ? "1" : "0"}</td>)}<td>{row.expected ? "1" : "0"}</td><td>{game.rows.length === 0 ? "—" : row.actual === null ? "无法运行" : row.actual ? "1" : "0"}</td><td>{game.rows.length === 0 ? "待测试" : row.matches ? "通过" : "需调整"}</td></tr>)}</tbody></table></div></div>
      </div>
      <p className={`circuit-feedback circuit-feedback--${game.phase}`} role="status">{game.feedback}</p>
      {game.phase === "solved" ? <button className="circuit-run" onClick={nextBoard} type="button">{game.index === game.puzzleCount - 1 ? "查看通关报告" : "接入下一块电路板"} →</button> : <button className="circuit-run" disabled={!ready} onClick={runTests} type="button">运行全部输入</button>}
    </section>
  );
}
