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
const HISTORY_LABELS: Record<MachineAction["type"], string> = { load: "存储 → RAM：载入副本", process: "RAM ⇄ CPU：读取并修改", save: "RAM → 存储：保存新版", restart: "重启：RAM 清空，存储保留" };

export function MemoryLab({ onComplete }: Props) {
  const [state, setState] = useState(INITIAL_MACHINE_STATE);
  const [phase, setPhase] = useState(0);
  const [lastAction, setLastAction] = useState<MachineAction["type"] | "start">("start");
  const [history, setHistory] = useState<string[]>([]);

  function act(action: MachineAction) {
    const next = updateMachine(state, action);
    setState(next);
    setLastAction(action.type);
    setHistory((items) => [...items, action.type === "load" && phase === 4 ? "存储 → RAM：重新载入已保存版本" : HISTORY_LABELS[action.type]]);
    setPhase((value) => value + 1);
  }

  const storageFlowClass = lastAction === "load" ? "data-flow--active data-flow--load" : lastAction === "save" ? "data-flow--active data-flow--save" : "";
  return (
    <div className="memory-lab">
      <div aria-label="CPU、RAM 和存储之间的数据流" className="machine-data-flow" role="img">
        <section><span>🗄️</span><h2>长期存储</h2><p>{state.storage}</p><small>关机后仍保留</small></section>
        <b className={storageFlowClass}>⇄<small>{lastAction === "save" ? "保存 →" : "载入 →"}</small>{lastAction === "load" || lastAction === "save" ? <i aria-hidden="true" className="data-pulse">◆</i> : null}</b>
        <section className={lastAction === "restart" ? "machine-part--cleared" : ""}><span>📝</span><h2>内存 RAM</h2><p>{state.memory ?? "现在是空的"}</p><small>重启后会清空</small></section>
        <b className={lastAction === "process" ? "data-flow--active data-flow--process" : ""}>⇄<small>读取与修改</small>{lastAction === "process" ? <i aria-hidden="true" className="data-pulse">◆</i> : null}</b>
        <section><span>🧠</span><h2>处理器 CPU</h2><p>已计算 {state.cpuSteps} 步</p><small>执行指令</small></section>
      </div>
      <ol className="machine-journey" aria-label="数据旅程五步">{["载入", "处理", "保存", "重启", "验证"].map((label, index) => <li className={index < phase ? "is-done" : index === phase ? "is-current" : ""} key={label}>{index + 1}. {label}</li>)}</ol>
      <div className="machine-actions"><button disabled={phase !== 0} onClick={() => act({ type: "load" })} type="button">1. 从存储载入内存</button><button disabled={phase !== 1} onClick={() => act({ type: "process", value: "岛屿草图 + 灯塔" })} type="button">2. CPU 添加灯塔</button><button disabled={phase !== 2} onClick={() => act({ type: "save" })} type="button">3. 保存到长期存储</button><button disabled={phase !== 3} onClick={() => act({ type: "restart" })} type="button">4. 模拟重新启动</button><button disabled={phase !== 4} onClick={() => act({ type: "load" })} type="button">5. 再次载入检查</button></div>
      <p aria-live="polite" role="status">{ACTION_FEEDBACK[lastAction]} 目标：保存后重启，再载入确认作品还在。</p>
      <aside className="machine-history"><strong>数据操作轨迹</strong>{history.length ? <ol>{history.map((item, index) => <li key={`${item}-${index}`}>{item}</li>)}</ol> : <p>完成第一步后，数据方向会记录在这里。</p>}</aside>
      {phase === 5 ? <button className="primary-action" onClick={onComplete} type="button">完成数据旅程</button> : null}
    </div>
  );
}
