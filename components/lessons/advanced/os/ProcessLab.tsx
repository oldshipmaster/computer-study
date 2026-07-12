"use client";

import { useState } from "react";
import { transitionProcess, type ProcessAction, type ProcessState } from "@/lib/advanced-foundations/operating-system";
import { isRepeatedPointerActivation } from "@/lib/interaction-guard";

const TARGET: ProcessState[] = ["running", "waiting", "ready", "running", "terminated"];
const PROCESS_LABELS: Record<ProcessState, string> = { ready: "就绪", running: "运行", waiting: "等待", paused: "暂停", terminated: "结束" };
const TRANSITIONS = [
  { from: "就绪", action: "获得 CPU", to: "运行" },
  { from: "运行", action: "等待输入", to: "等待" },
  { from: "等待", action: "输入到达", to: "就绪" },
  { from: "运行", action: "完成任务", to: "结束" },
];

export function ProcessLab({ onComplete }: { onComplete: () => void }) {
  const [state, setState] = useState<ProcessState>("ready");
  const [step, setStep] = useState(0);
  const [history, setHistory] = useState<ProcessState[]>(["ready"]);
  const [feedback, setFeedback] = useState("程序文件已启动，操作系统创建了一个处于就绪状态的进程实例。" );

  function act(action: ProcessAction, detail: number) {
    if (isRepeatedPointerActivation(detail)) return;
    const result = transitionProcess(state, action);
    if (!result.changed || result.state !== TARGET[step]) {
      setFeedback(`现在是“${PROCESS_LABELS[state]}”，这个动作还不符合转换条件。观察箭头上的原因。` );
      return;
    }
    setState(result.state);
    setHistory((current) => [...current, result.state]);
    setStep((value) => value + 1);
    setFeedback(`状态变化成功：${PROCESS_LABELS[state]} → ${PROCESS_LABELS[result.state]}`);
  }

  const finished = state === "terminated";
  return (
    <div className="advanced-lab process-lab">
      <h2>程序变成进程挑战</h2>
      <div className="program-process-compare">
        <section><span aria-hidden="true">📄</span><strong>程序文件</strong><small>画图.app · 静静存放在磁盘</small></section>
        <b aria-label="启动后变成">启动 →</b>
        <section className={finished ? "is-finished" : "is-alive"}><span aria-hidden="true">⚙️</span><strong>进程实例</strong><small>PID 2048 · {finished ? "资源已回收" : "正在被操作系统管理"}</small></section>
      </div>
      <div className="process-resources" aria-label="进程资源" role="group"><span><small>CPU</small><strong>{state === "running" ? "正在使用" : finished ? "已释放" : "未占用"}</strong></span><span><small>内存</small><strong>{finished ? "0 MB · 已回收" : "32 MB"}</strong></span><span><small>等待原因</small><strong>{state === "waiting" ? "键盘输入" : "无"}</strong></span></div>
      <div className="process-state-machine" aria-label="进程生命周期状态图" role="img">{(["ready", "running", "waiting", "terminated"] as ProcessState[]).map((item) => <span className={item === state ? "process-node--current" : ""} key={item}><b>{PROCESS_LABELS[item]}</b><small>{item === "ready" ? "等待 CPU" : item === "running" ? "执行指令" : item === "waiting" ? "等待事件" : "资源已回收"}</small></span>)}</div>
      <ul className="process-transition-map" aria-label="状态转换条件">{TRANSITIONS.map((item) => <li key={`${item.from}-${item.to}`}><b>{item.from}</b><span>— {item.action} →</span><b>{item.to}</b></li>)}</ul>
      <p className="process-loop-note">关键回路：等待 → 就绪 → 运行。等待结束后不会直接运行，要先重新排队等 CPU。</p>
      <p className="process-state">当前状态：<strong>{PROCESS_LABELS[state]}</strong></p>
      <div role="group"><button disabled={finished} onClick={(event) => act("run", event.detail)} type="button">获得 CPU</button><button disabled={finished} onClick={(event) => act("wait", event.detail)} type="button">等待输入</button><button disabled={finished} onClick={(event) => act("wake", event.detail)} type="button">输入到达</button><button disabled={finished} onClick={(event) => act("terminate", event.detail)} type="button">结束进程</button></div>
      <p role="status">{feedback} 步骤 {step}/{TARGET.length}</p>
      <aside className="process-history"><strong>状态历史</strong><ol>{history.map((item, index) => <li key={`${item}-${index}`}><span>{index}</span>{PROCESS_LABELS[item]}</li>)}</ol></aside>
      {step === TARGET.length ? <button onClick={onComplete} type="button">完成进程生命周期</button> : null}
    </div>
  );
}
