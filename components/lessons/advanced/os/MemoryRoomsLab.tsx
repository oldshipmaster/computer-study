"use client";

import { useState } from "react";
import { allocateMemory, releaseMemory, type MemoryState } from "@/lib/advanced-foundations/operating-system";

const START: MemoryState = { capacity: 8, allocations: { system: 2 } };

export function MemoryRoomsLab({ onComplete }: { onComplete: () => void }) {
  const [memory, setMemory] = useState(START);
  const [provedFull, setProvedFull] = useState(false);
  const [feedback, setFeedback] = useState("系统已使用 2 格，还剩 6 格。" );
  const hasGame = memory.allocations.game === 4;
  function allocate(id: string, size: number) { const result = allocateMemory(memory, id, size); setMemory(result.state); if (!result.ok) setProvedFull(true); setFeedback(result.ok ? `${id} 获得 ${size} 格，还剩 ${result.free} 格。` : `空间不足：只剩 ${result.free} 格。`); }
  function release(id: string) { setMemory((current) => releaseMemory(current, id)); setFeedback(`${id} 结束，操作系统回收了它的内存。`); }
  return <div className="advanced-lab memory-rooms-lab"><h2>内存房间挑战</h2><div className="memory-grid" aria-label="八格虚拟内存">{Array.from({ length: 8 }, (_, index) => <span key={index}>{index + 1}</span>)}</div><ul>{Object.entries(memory.allocations).map(([id, size]) => <li key={id}>{id}：{size} 格</li>)}</ul><div role="group"><button disabled={memory.allocations.paint !== undefined} onClick={() => allocate("paint", 4)} type="button">给画图分配 4 格</button><button disabled={hasGame} onClick={() => allocate("game", 4)} type="button">给游戏分配 4 格</button><button disabled={memory.allocations.paint === undefined} onClick={() => release("paint")} type="button">结束画图并回收</button></div><p role="status">{feedback}</p>{provedFull && hasGame ? <button onClick={onComplete} type="button">完成内存管理</button> : null}</div>;
}
