import { useState } from "react";
import { executeSequence, moveInstruction, type RepairInstruction } from "@/lib/instruction-order-lesson";

const LABELS: Record<RepairInstruction, string> = { wake: "1. 唤醒机器人", collect: "2. 拿维修工具", repair: "3. 修好小桥", return: "4. 返回基地" };
const PRECONDITIONS: Record<RepairInstruction, string> = { wake: "前置条件：无", collect: "前置条件：机器人已经唤醒", repair: "前置条件：已经拿到工具", return: "前置条件：小桥已经修好" };
interface Props { queue: RepairInstruction[]; setQueue: (queue: RepairInstruction[]) => void; onSuccess: () => void; }

export function SequenceBuilder({ queue, setQueue, onSuccess }: Props) {
  const [ran, setRan] = useState(false);
  const result = executeSequence(queue);
  function reorder(from: number, to: number) { setQueue(moveInstruction(queue, from, to)); setRan(false); }
  function run() { setRan(true); if (result.success) onSuccess(); }

  return <div className="sequence-builder"><div aria-label={`维修机器人执行到第 ${ran ? result.completed.length : 0} 步`} className="repair-scene" role="img"><span>🏠 基地</span><span className={ran && result.completed.includes("wake") ? "scene-item--active" : ""}>🤖 机器人</span><span className={ran && result.completed.includes("collect") ? "scene-item--active" : ""}>🧰 工具</span><span className={ran && result.completed.includes("repair") ? "scene-item--active" : ""}>🌉 小桥</span></div><ol aria-label="可调整的指令队列">{queue.map((instruction, index) => <li key={instruction}><strong>{LABELS[instruction]}</strong><span><button aria-label={`上移${LABELS[instruction]}`} disabled={index === 0} onClick={() => reorder(index, index - 1)} type="button">↑</button><button aria-label={`下移${LABELS[instruction]}`} disabled={index === queue.length - 1} onClick={() => reorder(index, index + 1)} type="button">↓</button></span></li>)}</ol><ol aria-label="程序执行轨迹" className="execution-track">{queue.map((instruction, index) => { const complete = ran && result.completed.includes(instruction); const blocked = ran && index === result.firstMismatch; return <li className={complete ? "execution-step--complete" : blocked ? "execution-step--blocked" : ""} key={instruction}><small>执行 {index + 1}</small><strong>{LABELS[instruction].replace(/^\d+\. /, "")}</strong><em>{PRECONDITIONS[instruction]}</em><span>{complete ? "✓ 已执行" : blocked ? "⛔ 条件未满足，程序停在这里" : ran ? "尚未执行" : "等待运行"}</span></li>; })}</ol><p aria-live="polite" role="status">{!ran ? "调整顺序后运行，观察机器人在哪一步停下。" : result.success ? "顺序正确，机器人完成了全部维修任务。" : `第 ${Number(result.firstMismatch) + 1} 步还不合适，检查它的前置条件。`}</p><button className="primary-action" onClick={run} type="button">运行指令</button></div>;
}
