import { useState } from "react";
import { INITIAL_MACHINE_STATE, updateMachine, type MachineAction } from "@/lib/cpu-memory-storage-lesson";

interface Props { onComplete: () => void; }

const ACTION_FEEDBACK: Record<MachineAction["type"] | "start", string> = {
  start: "先把作品从长期存储载入内存。",
  load: "数据从存储复制到 RAM；CPU 现在可以处理它。",
  process: "CPU 修改了 RAM 中的工作副本，存储里的旧版本还没改变。",
  save: "RAM 中的新版本已复制到长期存储。",
  restart: "重新启动后 RAM 会清空，但存储会保留已保存的作品。",
};

export function MemoryLab({ onComplete }: Props) {
  const [state, setState] = useState(INITIAL_MACHINE_STATE);
  const [restarted, setRestarted] = useState(false);
  const [lastAction, setLastAction] = useState<MachineAction["type"] | "start">("start");

  function act(action: MachineAction) {
    const next = updateMachine(state, action);
    setState(next);
    setLastAction(action.type);
    if (action.type === "restart") setRestarted(true);
    if (restarted && action.type === "load" && next.memory === "岛屿草图 + 灯塔") onComplete();
  }

  return <div className="memory-lab"><div aria-label="CPU、RAM 和存储之间的数据流" className="machine-data-flow" role="img"><section><span>🗄️</span><h2>长期存储</h2><p>{state.storage}</p><small>关机后仍保留</small></section><b className={lastAction === "load" || lastAction === "save" ? "data-flow--active" : ""}>⇄<small>{lastAction === "save" ? "保存" : "载入"}</small></b><section className={lastAction === "restart" ? "machine-part--cleared" : ""}><span>📝</span><h2>内存 RAM</h2><p>{state.memory ?? "现在是空的"}</p><small>重启后会清空</small></section><b className={lastAction === "process" ? "data-flow--active" : ""}>⇄<small>读取与修改</small></b><section><span>🧠</span><h2>处理器 CPU</h2><p>已计算 {state.cpuSteps} 步</p><small>执行指令</small></section></div><div className="machine-actions"><button onClick={() => act({ type: "load" })} type="button">1. 从存储载入内存</button><button disabled={state.memory === null} onClick={() => act({ type: "process", value: "岛屿草图 + 灯塔" })} type="button">2. CPU 添加灯塔</button><button disabled={state.memory === null} onClick={() => act({ type: "save" })} type="button">3. 保存到长期存储</button><button onClick={() => act({ type: "restart" })} type="button">4. 模拟重新启动</button><button onClick={() => act({ type: "load" })} type="button">5. 再次载入检查</button></div><p aria-live="polite" role="status">{ACTION_FEEDBACK[lastAction]} 目标：保存后重启，再载入确认作品还在。</p></div>;
}
