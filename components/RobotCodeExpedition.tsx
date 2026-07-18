"use client";

import { useLayoutEffect, useMemo, useRef, useState, type MouseEvent } from "react";
import { getCourse } from "@/lib/course-data";
import {
  ROBOT_CODE_MISSIONS,
  addRobotCommand,
  advanceRobotMission,
  advanceRobotTrace,
  buildRobotMissionDeck,
  clearRobotProgram,
  createRobotCodeState,
  moveRobotCommand,
  prepareRobotRun,
  removeRobotCommand,
  robotPointKey,
  type RobotCommand,
  type RobotDirection,
} from "@/lib/robot-code-expedition";
import "./RobotCodeExpedition.css";

interface RobotCodeExpeditionProps {
  completedCourseIds: string[];
  onStartCourse: (courseId: string) => void;
}

const REQUIRED_COURSE_IDS = ["instruction-order", "grid-city-navigation", "repeat-power", "rainy-condition"] as const;
const COMMAND_COPY: Record<RobotCommand, { icon: string; label: string; short: string }> = {
  forward: { icon: "↑", label: "前进一格", short: "前进" },
  turnLeft: { icon: "↶", label: "向左转", short: "左转" },
  turnRight: { icon: "↷", label: "向右转", short: "右转" },
  repeatForward2: { icon: "×2", label: "重复前进 2 格", short: "前进×2" },
  ifBlockedTurnRight: { icon: "?↷", label: "如果前方挡住就右转", short: "遇墙右转" },
};
const DIRECTION_COPY: Record<RobotDirection, { arrow: string; label: string }> = {
  north: { arrow: "▲", label: "朝北" }, east: { arrow: "▶", label: "朝东" },
  south: { arrow: "▼", label: "朝南" }, west: { arrow: "◀", label: "朝西" },
};

export function RobotCodeExpedition({ completedCourseIds, onStartCourse }: RobotCodeExpeditionProps) {
  const completedRequired = REQUIRED_COURSE_IDS.filter((id) => completedCourseIds.includes(id));
  const unlocked = completedRequired.length === REQUIRED_COURSE_IDS.length;
  const nextCourse = getCourse(REQUIRED_COURSE_IDS.find((id) => !completedCourseIds.includes(id)) ?? "");
  const [started, setStarted] = useState(false);
  const [rotation, setRotation] = useState(0);
  const deck = useMemo(() => buildRobotMissionDeck(rotation), [rotation]);
  const [game, setGame] = useState(() => createRobotCodeState(ROBOT_CODE_MISSIONS.length));
  const headingRef = useRef<HTMLHeadingElement>(null);
  const shouldFocusRef = useRef(false);

  useLayoutEffect(() => {
    if (!shouldFocusRef.current) return;
    headingRef.current?.focus();
    shouldFocusRef.current = false;
  }, [game.missionIndex, game.phase, started]);

  function focusNextHeading() {
    shouldFocusRef.current = true;
    window.setTimeout(() => headingRef.current?.focus(), 0);
  }

  function startExpedition() {
    setGame(createRobotCodeState(deck.length));
    setStarted(true);
    focusNextHeading();
  }

  function replayExpedition() {
    const nextRotation = rotation + 1;
    setRotation(nextRotation);
    setGame(createRobotCodeState(buildRobotMissionDeck(nextRotation).length));
    setStarted(true);
    focusNextHeading();
  }

  if (!unlocked) {
    return (
      <section className="robot-expedition-shell robot-expedition-locked" id="robot-code-expedition" aria-labelledby="robot-expedition-heading">
        <span className="robot-expedition-badge" aria-hidden="true">⌘</span>
        <div><p className="section-kicker">编程后再执行</p><h2 id="robot-expedition-heading">机器人代码远征</h2><p>先学会顺序、坐标、循环和条件，再来编排真正会移动的程序。</p><strong>已完成 {completedRequired.length} / {REQUIRED_COURSE_IDS.length} 门必修课</strong></div>
        {nextCourse ? <button onClick={() => onStartCourse(nextCourse.id)} type="button">下一门：{nextCourse.title}</button> : null}
      </section>
    );
  }

  if (!started) {
    return (
      <section className="robot-expedition-shell robot-expedition-menu" id="robot-code-expedition" aria-labelledby="robot-expedition-heading">
        <div><p className="section-kicker">六张地图 · 逐步执行 · 可反复调试</p><h2 id="robot-expedition-heading">机器人代码远征</h2><p>把指令排成程序，再一条一条运行。后面的地图要用重复与条件缩短代码。</p></div>
        <button onClick={startExpedition} type="button">开始代码远征</button>
      </section>
    );
  }

  if (game.phase === "complete") {
    return (
      <section className="robot-expedition-shell robot-expedition-complete" id="robot-code-expedition" aria-labelledby="robot-expedition-complete-heading">
        <span aria-hidden="true">🤖</span>
        <div><p>六张地图全部通过</p><h2 id="robot-expedition-complete-heading" ref={headingRef} tabIndex={-1}>小小程序导航员！</h2><strong>你会先写程序、逐步观察，再根据证据调试了。</strong></div>
        <button onClick={replayExpedition} type="button">重玩六张代码地图</button>
      </section>
    );
  }

  const mission = deck[game.missionIndex];
  const visibleStep = game.run && game.traceCursor >= 0 ? game.run.trace[game.traceCursor] : null;
  const robotPosition = visibleStep?.position ?? mission.start;
  const robotDirection = visibleStep?.direction ?? mission.start.direction;
  const collectedEnergy = visibleStep?.collectedEnergy ?? [];
  const editing = game.phase === "building" || game.phase === "failed";
  const activeSourceIndex = game.phase === "tracing" ? visibleStep?.sourceIndex : undefined;

  function runProgram(event: MouseEvent<HTMLButtonElement>) {
    setGame((current) => prepareRobotRun(current, mission, event.detail));
  }

  function stepProgram(event: MouseEvent<HTMLButtonElement>) {
    setGame((current) => advanceRobotTrace(current, event.detail));
  }

  function nextMission(event: MouseEvent<HTMLButtonElement>) {
    focusNextHeading();
    setGame((current) => advanceRobotMission(current, event.detail));
  }

  return (
    <section className="robot-expedition-shell robot-expedition-game" id="robot-code-expedition" aria-labelledby="robot-expedition-game-heading">
      <header className="robot-expedition-heading">
        <p>代码地图 {game.missionIndex + 1} / {game.missionCount}</p>
        <h2 id="robot-expedition-game-heading" ref={headingRef} tabIndex={-1}>{mission.title}</h2>
        <span>{mission.story}</span>
        <progress aria-label="机器人代码远征进度" max={game.missionCount} value={game.solved} />
      </header>

      <div className="robot-expedition-layout">
        <div className="robot-map-panel">
          <div className="robot-map-legend" aria-label="地图图例" role="list"><span role="listitem">🤖 机器人</span><span role="listitem">⚡ 能量</span><span role="listitem">▣ 障碍</span><span role="listitem">◎ 终点</span></div>
          <div className="robot-code-grid" aria-label={`5 行 5 列代码地图，机器人${DIRECTION_COPY[robotDirection].label}`} role="grid">
            {Array.from({ length: 5 }, (_, row) => <span className="robot-code-row" key={row} role="row">{Array.from({ length: 5 }, (_, col) => {
              const point = { row, col };
              const key = robotPointKey(point);
              const robot = robotPointKey(robotPosition) === key;
              const energy = mission.energy.some((item) => robotPointKey(item) === key);
              const obstacle = mission.obstacles.some((item) => robotPointKey(item) === key);
              const goal = robotPointKey(mission.goal) === key;
              const energyCollected = collectedEnergy.includes(key);
              const contents = [robot ? `机器人${DIRECTION_COPY[robotDirection].label}` : "", obstacle ? "障碍" : "", energy ? (energyCollected ? "已收集能量" : "能量") : "", goal ? "终点" : ""].filter(Boolean).join("，") || "空地";
              return <span aria-label={`第 ${point.row + 1} 行第 ${point.col + 1} 列，${contents}`} className={`robot-code-cell ${obstacle ? "has-obstacle" : ""} ${goal ? "has-goal" : ""}`} key={key} role="gridcell">{goal ? <i aria-hidden="true">◎</i> : null}{energy && !energyCollected ? <b aria-hidden="true">⚡</b> : null}{robot ? <strong aria-hidden="true">{DIRECTION_COPY[robotDirection].arrow}<small>比</small></strong> : null}</span>;
            })}</span>)}
          </div>
          <p className="robot-map-status"><strong>当前位置：</strong>第 {robotPosition.row + 1} 行第 {robotPosition.col + 1} 列，{DIRECTION_COPY[robotDirection].label} · 能量 {collectedEnergy.length}/{mission.energy.length}</p>
        </div>

        <div className="robot-program-panel">
          <section className="robot-command-library" aria-labelledby="robot-command-library-heading">
            <h3 id="robot-command-library-heading">指令库</h3>
            <div role="group" aria-label="可添加的机器人指令">{mission.allowedCommands.map((command) => <button className="robot-command-button" disabled={!editing || game.queue.length >= mission.maxCommands} key={command} onClick={(event) => setGame((current) => addRobotCommand(current, mission, command, event.detail))} type="button"><b>{COMMAND_COPY[command].icon}</b><span>{COMMAND_COPY[command].label}</span></button>)}</div>
          </section>

          <section className="robot-program-queue" aria-labelledby="robot-program-heading">
            <header><h3 id="robot-program-heading">程序队列</h3><span>{game.queue.length} / {mission.maxCommands} 槽</span></header>
            {game.queue.length === 0 ? <p className="robot-program-empty">还没有指令。从上方指令库加入第一条。</p> : <ol>{game.queue.map((command, index) => <li aria-current={activeSourceIndex === index ? "step" : undefined} key={`${command}-${index}`}><span><b>{index + 1}</b><i aria-hidden="true">{COMMAND_COPY[command].icon}</i><strong>{COMMAND_COPY[command].short}</strong></span><span><button aria-label={`把第 ${index + 1} 条指令上移`} disabled={!editing || index === 0} onClick={() => setGame((current) => moveRobotCommand(current, index, index - 1))} type="button">↑</button><button aria-label={`把第 ${index + 1} 条指令下移`} disabled={!editing || index === game.queue.length - 1} onClick={() => setGame((current) => moveRobotCommand(current, index, index + 1))} type="button">↓</button><button aria-label={`删除第 ${index + 1} 条指令`} disabled={!editing} onClick={() => setGame((current) => removeRobotCommand(current, index))} type="button">×</button></span></li>)}</ol>}
            {editing && game.queue.length > 0 ? <button className="robot-clear-program" onClick={() => setGame(clearRobotProgram)} type="button">清空程序</button> : null}
          </section>
        </div>
      </div>

      <aside className="robot-concept-card"><strong>本关原理</strong><span>{mission.concept}</span></aside>
      <p className={`robot-expedition-feedback is-${game.phase}`} role="status">{game.feedback}</p>
      {game.phase === "failed" ? <p className="robot-retry-note">保留程序继续修改：移动、删除或添加一条指令，再重新运行。</p> : null}
      <div className="robot-expedition-actions">
        {editing ? <button disabled={game.queue.length === 0} onClick={runProgram} type="button">运行程序</button> : null}
        {game.phase === "tracing" ? <button onClick={stepProgram} type="button">执行下一步 <span aria-hidden="true">→</span></button> : null}
        {game.phase === "solved" ? <button onClick={nextMission} type="button">{game.missionIndex === game.missionCount - 1 ? "查看远征报告" : "接入下一张地图"} <span aria-hidden="true">→</span></button> : null}
      </div>
    </section>
  );
}
