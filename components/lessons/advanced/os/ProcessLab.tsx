"use client";

import { useState } from "react";
import { transitionProcess, type ProcessAction, type ProcessState } from "@/lib/advanced-foundations/operating-system";
import { isRepeatedPointerActivation } from "@/lib/interaction-guard";

const TARGET: ProcessState[] = ["running", "waiting", "ready", "running", "terminated"];
const PROCESS_LABELS: Record<ProcessState, string> = { ready: "就绪", running: "运行", waiting: "等待", paused: "暂停", terminated: "结束" };

export function ProcessLab({ onComplete }: { onComplete: () => void }) {
  const [state, setState] = useState<ProcessState>("ready");
  const [step, setStep] = useState(0);
  const [feedback, setFeedback] = useState("程序文件已启动，进程现在处于就绪状态。" );

  function act(action: ProcessAction, detail: number) {
    if (isRepeatedPointerActivation(detail)) return;
    const result = transitionProcess(state, action);
    if (!result.changed || result.state !== TARGET[step]) {
      setFeedback("这个状态现在不能执行该动作，观察进程正在等待什么。" );
      return;
    }
    setState(result.state);
    setStep((value) => value + 1);
    setFeedback(`状态变化成功：${state} → ${result.state}`);
  }

  return <div className="advanced-lab process-lab"><h2>程序变成进程挑战</h2><div className="process-state-machine" aria-label="进程生命周期状态图" role="img">{(["ready", "running", "waiting", "terminated"] as ProcessState[]).map((item, index) => <span className={item === state ? "process-node--current" : ""} key={item}><b>{PROCESS_LABELS[item]}</b><small>{index < 3 ? "状态可转换 →" : "资源已回收"}</small></span>)}</div><p className="process-state">当前状态：<strong>{PROCESS_LABELS[state]}</strong></p><div role="group"><button onClick={(event) => act("run", event.detail)} type="button">获得 CPU</button><button onClick={(event) => act("wait", event.detail)} type="button">等待输入</button><button onClick={(event) => act("wake", event.detail)} type="button">输入到达</button><button onClick={(event) => act("terminate", event.detail)} type="button">结束进程</button></div><p role="status">{feedback} 步骤 {step}/{TARGET.length}</p>{step === TARGET.length ? <button onClick={onComplete} type="button">完成进程生命周期</button> : null}</div>;
}
