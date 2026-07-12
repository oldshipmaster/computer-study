"use client";

import { useState } from "react";
import { accessMemoryHierarchy } from "@/lib/advanced-foundations/systems-network";
import { isRepeatedPointerActivation } from "@/lib/interaction-guard";

const REQUESTS = [{ key: "地图", answer: "cache" }, { key: "音乐", answer: "memory" }, { key: "图书", answer: "storage" }] as const;
const LEVELS = [{ id: "cache", label: "缓存", wait: 1, capacity: "很小", note: "离 CPU 最近" }, { id: "memory", label: "内存", wait: 4, capacity: "中等", note: "正在使用的数据" }, { id: "storage", label: "存储", wait: 12, capacity: "很大", note: "离 CPU 最远" }] as const;

export function CacheStationLab({ onComplete }: { onComplete: () => void }) {
  const [index, setIndex] = useState(0);
  const [feedback, setFeedback] = useState("先预测数据会在哪一层命中。" );
  const [lastHit, setLastHit] = useState<string | null>(null);
  const [probedLevels, setProbedLevels] = useState<string[]>([]);
  const [history, setHistory] = useState<Array<{ key: string; level: string; wait: number; trail: string }>>([]);
  const [finished, setFinished] = useState(false);
  const request = REQUESTS[index];
  const totalWait = history.reduce((sum, item) => sum + item.wait, 0);
  function choose(level: string, detail: number) {
    if (finished || isRepeatedPointerActivation(detail)) return;
    const result = accessMemoryHierarchy(["地图"], ["地图", "音乐"], ["地图", "音乐", "图书"], request.key);
    if (level !== request.answer || level !== result.level) { setFeedback("预测不对。CPU 总会从最近的缓存开始逐层探查，不会跳过前面的层。" ); return; }
    const hitIndex = LEVELS.findIndex((item) => item.id === level);
    const checked = LEVELS.slice(0, hitIndex + 1);
    const trail = checked.map((item, itemIndex) => itemIndex === checked.length - 1 ? `${item.label}命中` : `${item.label}未命中`).join(" → ");
    setProbedLevels(checked.map((item) => item.id));
    setLastHit(level);
    setHistory((current) => [...current, { key: request.key, level, wait: result.wait, trail }]);
    setFeedback(`${request.key}：${trail}，等待 ${result.wait} 单位。`);
    if (index < REQUESTS.length - 1) setIndex((value) => value + 1); else setFinished(true);
  }
  return (
    <div className="advanced-lab cache-station-lab">
      <h2>缓存快递站挑战</h2>
      <p className="cache-request">🧠 CPU 现在需要：<strong>{request.key}</strong></p>
      <p className="cache-probe-rule"><strong>逐层探查：</strong>CPU → 缓存 → 内存 → 存储，找到就停止。</p>
      <ol aria-label="从 CPU 向外的存储层级" className="memory-hierarchy">{LEVELS.map((level) => <li aria-current={lastHit === level.id ? "step" : undefined} className={`hierarchy-level hierarchy-level--${level.id} ${probedLevels.includes(level.id) ? "is-probed" : ""}`} key={level.id}><strong>{level.label}</strong><span>{level.note}</span><small>容量：{level.capacity} · 等待 {level.wait} 单位</small>{probedLevels.includes(level.id) && <em>{lastHit === level.id ? "✓ 命中" : "缓存未命中"}</em>}</li>)}</ol>
      <div aria-label="预测数据所在层级" role="group">{LEVELS.map((level) => <button disabled={finished} key={level.id} onClick={(event) => choose(level.id, event.detail)} type="button">从{level.label}取 · 等待 {level.wait}</button>)}</div>
      <p aria-live="polite" role="status">{feedback} 任务 {Math.min(history.length + 1, REQUESTS.length)}/{REQUESTS.length}</p>
      <aside className="cache-history"><header><strong>取数记录</strong><span>累计等待：{totalWait} 单位</span></header>{history.length ? <ol>{history.map((item) => <li key={item.key}><b>{item.key}</b><span>{item.trail}</span><small>+{item.wait} 单位</small></li>)}</ol> : <p>答对后会记录每次探查路线。</p>}</aside>
      {finished && <button onClick={onComplete} type="button">完成缓存实验</button>}
    </div>
  );
}
