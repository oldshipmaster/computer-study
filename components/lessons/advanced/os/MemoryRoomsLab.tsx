"use client";

import { useState } from "react";
import { allocateMemory, releaseMemory, type MemoryState } from "@/lib/advanced-foundations/operating-system";

const START: MemoryState = { capacity: 8, allocations: { system: 2 } };
const PROCESS_LABELS: Record<string, string> = { system: "系统", paint: "画图", game: "游戏" };

export function MemoryRoomsLab({ onComplete }: { onComplete: () => void }) {
  const [memory, setMemory] = useState(START);
  const [provedFull, setProvedFull] = useState(false);
  const [releasedPaint, setReleasedPaint] = useState(false);
  const [feedback, setFeedback] = useState("系统已使用 2 格，还剩 6 格。" );
  const [history, setHistory] = useState<string[]>([]);
  const hasGame = memory.allocations.game === 4;
  const occupiedRooms = Object.entries(memory.allocations).flatMap(([id, size]) => Array.from({ length: size }, () => id));
  const used = occupiedRooms.length;
  const free = memory.capacity - used;
  const requestedPaint = memory.allocations.paint !== undefined || releasedPaint;
  function allocate(id: string, size: number) {
    const result = allocateMemory(memory, id, size);
    setMemory(result.state);
    if (!result.ok) setProvedFull(true);
    const label = PROCESS_LABELS[id] ?? id;
    setHistory((current) => [...current, result.ok ? `申请成功：${label}占用 ${size} 格` : `申请失败：${label}需要 ${size} 格，但只剩 ${result.free} 格`]);
    setFeedback(result.ok ? `${label} 获得 ${size} 格，还剩 ${result.free} 格。` : `空间不足：只剩 ${result.free} 格，先结束不用的程序。`);
  }
  function release(id: string) {
    const size = memory.allocations[id] ?? 0;
    setMemory((current) => releaseMemory(current, id));
    if (id === "paint") setReleasedPaint(true);
    setHistory((current) => [...current, `回收成功：${PROCESS_LABELS[id] ?? id}归还 ${size} 格`]);
    setFeedback(`${PROCESS_LABELS[id] ?? id}结束，操作系统回收了 ${size} 格内存。`);
  }
  return (
    <div className="advanced-lab memory-rooms-lab">
      <h2>内存房间挑战</h2>
      <p className="memory-lifecycle"><strong>程序的内存旅程：</strong>申请 → 使用 → 回收 → 再利用</p>
      <div className="memory-meter" aria-label={`内存已使用 ${used} 格，空闲 ${free} 格`} aria-valuemax={memory.capacity} aria-valuemin={0} aria-valuenow={used} role="progressbar"><span style={{ width: `${used / memory.capacity * 100}%` }} /></div>
      <p className="memory-count"><span>已用 <strong>{used}</strong> 格</span><span>空闲 <strong>{free}</strong> 格</span></p>
      <div className="memory-grid" aria-label={`八格虚拟内存，已使用 ${occupiedRooms.length}/8`} role="img">{Array.from({ length: 8 }, (_, index) => { const owner = occupiedRooms[index]; return <span className={owner ? `memory-room--occupied memory-room--${owner}` : ""} key={index}><small>地址 {index + 1}</small>{owner ? PROCESS_LABELS[owner] : "空闲"}</span>; })}</div>
      <ul className="memory-owner-list">{Object.entries(memory.allocations).map(([id, size]) => <li key={id}><span className={`memory-owner-dot memory-owner-dot--${id}`} />{PROCESS_LABELS[id] ?? id}：{size} 格</li>)}</ul>
      <ol className="memory-challenge-steps" aria-label="挑战步骤"><li className={requestedPaint ? "is-done" : ""}>给画图申请空间</li><li className={provedFull ? "is-done" : ""}>发现游戏空间不足</li><li className={releasedPaint ? "is-done" : ""}>结束画图并回收</li><li className={hasGame ? "is-done" : ""}>让游戏再利用空间</li></ol>
      <div role="group"><button disabled={requestedPaint} onClick={() => allocate("paint", 4)} type="button">给画图分配 4 格</button><button disabled={hasGame || (!memory.allocations.paint && !releasedPaint)} onClick={() => allocate("game", 4)} type="button">给游戏分配 4 格</button><button disabled={!provedFull || memory.allocations.paint === undefined} onClick={() => release("paint")} type="button">结束画图并回收</button></div>
      <p role="status">{feedback}</p>
      <aside className="memory-history"><strong>内存操作记录</strong>{history.length ? <ol>{history.map((item, index) => <li key={`${item}-${index}`}>{item}</li>)}</ol> : <p>完成操作后，这里会记录申请和回收。</p>}</aside>
      {provedFull && releasedPaint && hasGame ? <button onClick={onComplete} type="button">完成内存管理</button> : null}
    </div>
  );
}
