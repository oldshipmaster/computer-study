import { executeSequence, moveInstruction, type RepairInstruction } from "@/lib/instruction-order-lesson";
const LABELS: Record<RepairInstruction, string> = { wake: "1. 唤醒机器人", collect: "2. 拿维修工具", repair: "3. 修好小桥", return: "4. 返回基地" };
interface Props { queue: RepairInstruction[]; setQueue: (queue: RepairInstruction[]) => void; onSuccess: () => void; }
export function SequenceBuilder({ queue, setQueue, onSuccess }: Props) {
  const result = executeSequence(queue);
  return <div className="sequence-builder"><div className="repair-scene" aria-label="维修机器人任务"><span>🏠</span><span>🤖</span><span>🧰</span><span>🌉</span></div><ol>{queue.map((instruction, index) => <li key={instruction}><strong>{LABELS[instruction]}</strong><span><button disabled={index === 0} onClick={() => setQueue(moveInstruction(queue, index, index - 1))} aria-label={`上移${LABELS[instruction]}`} type="button">↑</button><button disabled={index === queue.length - 1} onClick={() => setQueue(moveInstruction(queue, index, index + 1))} aria-label={`下移${LABELS[instruction]}`} type="button">↓</button></span></li>)}</ol><p role="status">{result.success ? "顺序正确，机器人已经准备出发。" : `第 ${Number(result.firstMismatch) + 1} 步还不合适，想想完成它需要什么。`}</p><button className="primary-action" onClick={() => result.success && onSuccess()} type="button">运行指令</button></div>;
}
