"use client";

import { useLayoutEffect, useMemo, useRef, useState, type MouseEvent } from "react";
import { getCourse } from "@/lib/course-data";
import {
  CPU_SCHEDULER_MISSIONS,
  advanceCpuSchedulerMission,
  buildCpuSchedulerDeck,
  createCpuSchedulerState,
  getUsedMemory,
  loadCpuTask,
  runCpuTimeSlice,
} from "@/lib/cpu-scheduler-game";
import "./CpuSchedulerGame.css";

interface CpuSchedulerGameProps {
  completedCourseIds: string[];
  onStartCourse: (courseId: string) => void;
}

const REQUIRED_COURSE_IDS = ["program-process", "cpu-scheduling", "memory-allocation"] as const;

export function CpuSchedulerGame({ completedCourseIds, onStartCourse }: CpuSchedulerGameProps) {
  const completedRequired = REQUIRED_COURSE_IDS.filter((id) => completedCourseIds.includes(id));
  const unlocked = completedRequired.length === REQUIRED_COURSE_IDS.length;
  const nextCourse = getCourse(REQUIRED_COURSE_IDS.find((id) => !completedCourseIds.includes(id)) ?? "");
  const [started, setStarted] = useState(false);
  const [rotation, setRotation] = useState(0);
  const deck = useMemo(() => buildCpuSchedulerDeck(rotation), [rotation]);
  const [game, setGame] = useState(() => createCpuSchedulerState(CPU_SCHEDULER_MISSIONS[0], CPU_SCHEDULER_MISSIONS.length));
  const headingRef = useRef<HTMLHeadingElement>(null);
  const shouldFocusRef = useRef(false);

  useLayoutEffect(() => {
    if (!shouldFocusRef.current) return;
    headingRef.current?.focus();
    shouldFocusRef.current = false;
  }, [game.missionIndex, game.phase, started]);

  function focusHeading() {
    shouldFocusRef.current = true;
    window.setTimeout(() => headingRef.current?.focus(), 0);
  }

  function startGame() {
    setGame(createCpuSchedulerState(deck[0], deck.length));
    setStarted(true);
    focusHeading();
  }

  function replayGame() {
    const nextRotation = rotation + 1;
    const nextDeck = buildCpuSchedulerDeck(nextRotation);
    setRotation(nextRotation);
    setGame(createCpuSchedulerState(nextDeck[0], nextDeck.length));
    setStarted(true);
    focusHeading();
  }

  if (!unlocked) {
    return (
      <section className="cpu-scheduler-shell cpu-scheduler-locked" id="cpu-scheduler-game" aria-labelledby="cpu-scheduler-heading">
        <span className="cpu-scheduler-badge" aria-hidden="true">CPU</span>
        <div><p className="section-kicker">操作系统资源游戏</p><h2 id="cpu-scheduler-heading">CPU 时间片调度台</h2><p>先学会进程、CPU 调度和内存分配，再来管理有限资源。</p><strong>已完成 {completedRequired.length} / {REQUIRED_COURSE_IDS.length} 门必修课</strong></div>
        {nextCourse ? <button onClick={() => onStartCourse(nextCourse.id)} type="button">下一门：{nextCourse.title}</button> : null}
      </section>
    );
  }

  if (!started) {
    return (
      <section className="cpu-scheduler-shell cpu-scheduler-menu" id="cpu-scheduler-game" aria-labelledby="cpu-scheduler-heading">
        <div><p className="section-kicker">六个班次 · 有限内存 · 公平轮转</p><h2 id="cpu-scheduler-heading">CPU 时间片调度台</h2><p>装入虚构任务、观察内存占用，让 CPU 每次只运行一个时间片。</p></div>
        <button onClick={startGame} type="button">开始调度班次</button>
      </section>
    );
  }

  if (game.phase === "complete") {
    return (
      <section className="cpu-scheduler-shell cpu-scheduler-complete" id="cpu-scheduler-game" aria-labelledby="cpu-scheduler-complete-heading">
        <span aria-hidden="true">⚙</span>
        <div><p>六个调度班次全部完成</p><h2 id="cpu-scheduler-complete-heading" ref={headingRef} tabIndex={-1}>操作系统小调度员！</h2><strong>你让 CPU、就绪队列和有限内存一起完成了所有任务。</strong></div>
        <button onClick={replayGame} type="button">重玩六个调度班次</button>
      </section>
    );
  }

  const mission = deck[game.missionIndex];
  const usedMemory = getUsedMemory(game, mission);
  const memoryOwners = mission.tasks.flatMap((task) => game.ready.some((process) => process.taskId === task.id) ? Array.from({ length: task.memory }, () => task.id) : []);
  const lastTask = mission.tasks.find((task) => task.id === game.lastTaskId);

  function nextMission(event: MouseEvent<HTMLButtonElement>) {
    focusHeading();
    const nextMissionIndex = Math.min(game.missionIndex + 1, deck.length - 1);
    setGame((current) => advanceCpuSchedulerMission(current, deck[nextMissionIndex], event.detail));
  }

  return (
    <section className="cpu-scheduler-shell cpu-scheduler-game" id="cpu-scheduler-game" aria-labelledby="cpu-scheduler-game-heading">
      <header className="cpu-scheduler-heading"><p>调度班次 {game.missionIndex + 1} / {game.missionCount}</p><h2 id="cpu-scheduler-game-heading" ref={headingRef} tabIndex={-1}>{mission.title}</h2><span>{mission.story}</span><progress aria-label="CPU 调度班次进度" max={game.missionCount} value={game.solved} /></header>

      <div className="cpu-scheduler-layout">
        <section className="cpu-waiting-panel" aria-labelledby="cpu-waiting-heading">
          <header><h3 id="cpu-waiting-heading">任务等待区</h3><span>{game.waitingTaskIds.length} 个等待</span></header>
          <div className="cpu-task-grid">{mission.tasks.map((task) => {
            const waiting = game.waitingTaskIds.includes(task.id);
            const completed = game.completedTaskIds.includes(task.id);
            const process = game.ready.find((item) => item.taskId === task.id);
            return <article className={`cpu-task-card ${completed ? "is-complete" : process ? "is-ready" : ""}`} key={task.id}><span aria-hidden="true">{task.icon}</span><div><strong>{task.name}</strong><small>{task.memory} 格内存 · {task.work} 个时间片</small>{process ? <b>剩余 {process.remainingWork} 片</b> : completed ? <b>已完成 · 内存已释放</b> : <b>等待装入</b>}</div>{waiting ? <button className="cpu-scheduler-action" onClick={(event) => setGame((current) => loadCpuTask(current, mission, task.id, event.detail))} type="button">装入内存</button> : null}</article>;
          })}</div>
        </section>

        <section className="cpu-memory-panel" aria-labelledby="cpu-memory-heading">
          <header><h3 id="cpu-memory-heading">内存占用</h3><span>已用 {usedMemory} / {mission.capacity} 格</span></header>
          <div className="cpu-memory-slots" aria-label={`内存共 ${mission.capacity} 格，已用 ${usedMemory} 格`} role="list">{Array.from({ length: mission.capacity }, (_, index) => {
            const ownerId = memoryOwners[index];
            const owner = mission.tasks.find((task) => task.id === ownerId);
            return <span aria-label={`内存第 ${index + 1} 格，${owner ? `由${owner.name}占用` : "空闲"}`} className={owner ? "is-used" : ""} key={index} role="listitem">{owner ? <><b aria-hidden="true">{owner.icon}</b><small>{owner.name}</small></> : <small>空闲</small>}</span>;
          })}</div>
          <p>任务完成才会释放它占用的内存；仅仅轮转到队尾不会释放。</p>
        </section>

        <section className="cpu-ready-panel" aria-labelledby="cpu-ready-heading">
          <header><h3 id="cpu-ready-heading">就绪队列</h3><span>先进队列，轮流用 CPU</span></header>
          {game.ready.length === 0 ? <p className="cpu-ready-empty">队列为空，CPU 正在等待任务。</p> : <ol>{game.ready.map((process, index) => { const task = mission.tasks.find((item) => item.id === process.taskId)!; return <li aria-current={index === 0 ? "step" : undefined} key={process.taskId}><b>{index === 0 ? "队首" : index === game.ready.length - 1 ? "队尾" : index + 1}</b><span aria-hidden="true">{task.icon}</span><div><strong>{task.name}</strong><small>剩余 {process.remainingWork} 片</small></div></li>; })}</ol>}
        </section>

        <section className="cpu-core-panel" aria-labelledby="cpu-core-heading">
          <header><h3 id="cpu-core-heading">CPU 核心</h3><span>一次只执行一个时间片</span></header>
          <div className={`cpu-core ${lastTask ? "has-run" : ""}`} role="status"><span aria-hidden="true">{lastTask?.icon ?? "CPU"}</span><strong>{lastTask ? `刚运行：${lastTask.name}` : "等待第一个时间片"}</strong></div>
          <button className="cpu-scheduler-action cpu-run-slice" disabled={game.phase !== "playing"} onClick={(event) => setGame((current) => runCpuTimeSlice(current, mission, event.detail))} type="button">运行一个时间片</button>
        </section>
      </div>

      <section className="cpu-history-panel" aria-labelledby="cpu-history-heading"><header><h3 id="cpu-history-heading">时间片历史</h3><span>共执行 {game.timeSlices} 片</span></header>{game.history.length === 0 ? <p>还没有执行记录。</p> : <ol>{game.history.map((entry) => { const task = mission.tasks.find((item) => item.id === entry.taskId)!; return <li key={entry.slice}><b>第 {entry.slice} 片</b><span>{task.name}</span><strong>{entry.event === "completed" ? "完成并释放内存" : `剩 ${entry.remainingWork} 片，转到队尾`}</strong></li>; })}</ol>}</section>
      <p className={`cpu-scheduler-feedback is-${game.phase}`} role="status">{game.feedback}</p>
      {game.phase === "solved" ? <button className="cpu-scheduler-action cpu-next-shift" onClick={nextMission} type="button">{game.missionIndex === game.missionCount - 1 ? "查看调度报告" : "接入下一班任务"} →</button> : null}
    </section>
  );
}
