"use client";

import { useState } from "react";
import { accessMemoryHierarchy } from "@/lib/advanced-foundations/systems-network";
import { isRepeatedPointerActivation } from "@/lib/interaction-guard";

const REQUESTS = [{ key: "地图", answer: "cache" }, { key: "音乐", answer: "memory" }, { key: "图书", answer: "storage" }] as const;
const LEVELS = [{ id: "cache", label: "缓存", wait: 1 }, { id: "memory", label: "内存", wait: 4 }, { id: "storage", label: "存储", wait: 12 }] as const;

export function CacheStationLab({ onComplete }: { onComplete: () => void }) {
  const [index, setIndex] = useState(0);
  const [feedback, setFeedback] = useState("先预测数据会在哪一层命中。" );
  const request = REQUESTS[index];
  function choose(level: string, detail: number) { if (isRepeatedPointerActivation(detail)) return; const result = accessMemoryHierarchy(["地图"], ["地图", "音乐"], ["地图", "音乐", "图书"], request.key); if (level !== result.level) { setFeedback("再看距离：常用数据更可能在更近的一层。" ); return; } setFeedback(`${request.key} 在${LEVELS.find((item) => item.id === level)?.label}命中，等待 ${result.wait} 单位。`); if (index < REQUESTS.length - 1) setIndex((value) => value + 1); else onComplete(); }
  return <div className="advanced-lab cache-station-lab"><h2>缓存快递站挑战</h2><p>CPU 现在需要：<strong>{request.key}</strong></p><div role="group">{LEVELS.map((level) => <button key={level.id} onClick={(event) => choose(level.id, event.detail)} type="button">从{level.label}取 · 等待 {level.wait}</button>)}</div><p role="status">{feedback} 任务 {index + 1}/{REQUESTS.length}</p></div>;
}
