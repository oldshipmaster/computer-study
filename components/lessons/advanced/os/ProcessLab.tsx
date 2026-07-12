"use client";

import { useState } from "react";
import { transitionProcess, type ProcessAction, type ProcessState } from "@/lib/advanced-foundations/operating-system";

const TARGET: ProcessState[] = ["running", "waiting", "ready", "running", "terminated"];

export function ProcessLab({ onComplete }: { onComplete: () => void }) {
  const [state, setState] = useState<ProcessState>("ready");
  const [step, setStep] = useState(0);
  const [feedback, setFeedback] = useState("程序文件已启动，进程现在处于就绪状态。" );

  function act(action: ProcessAction) {
    const result = transitionProcess(state, action);
    if (!result.changed || result.state !== TARGET[step]) {
      setFeedback("这个状态现在不能执行该动作，观察进程正在等待什么。" );
      return;
    }
    setState(result.state);
    setStep((value) => value + 1);
    setFeedback(`状态变化成功：${state} → ${result.state}`);
  }

  return <div className="advanced-lab process-lab"><h2>程序变成进程挑战</h2><p className="process-state">当前状态：<strong>{state}</strong></p><div role="group"><button onClick={() => act("run")} type="button">获得 CPU</button><button onClick={() => act("wait")} type="button">等待输入</button><button onClick={() => act("wake")} type="button">输入到达</button><button onClick={() => act("terminate")} type="button">结束进程</button></div><p role="status">{feedback} 步骤 {step}/{TARGET.length}</p>{step === TARGET.length ? <button onClick={onComplete} type="button">完成进程生命周期</button> : null}</div>;
}
