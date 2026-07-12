"use client";

import { useState } from "react";
import { serviceDeviceRequest, type DeviceRequest } from "@/lib/advanced-foundations/operating-system";

const START: DeviceRequest[] = [{ id: "screen", device: "屏幕驱动", task: "显示地图" }, { id: "keyboard", device: "键盘驱动", task: "读取按键" }, { id: "printer", device: "打印机驱动", task: "打印奖状" }];

export function DeviceCoordinationLab({ onComplete }: { onComplete: () => void }) {
  const [pending, setPending] = useState(START);
  const [serviced, setServiced] = useState<DeviceRequest[]>([]);
  const [feedback, setFeedback] = useState("选择设备队首请求，按先进先出的顺序服务。" );
  function service(request: DeviceRequest) { if (request.id !== pending[0].id) { setFeedback("队列要按顺序服务：先处理最早到达的请求。" ); return; } const next = serviceDeviceRequest(pending); setPending(next.pending); if (next.serviced) { setServiced((items) => [...items, next.serviced!]); setFeedback(`${next.serviced.task} 已由${next.serviced.device}处理。`); } }
  return <div className="advanced-lab device-coordination-lab"><h2>设备协调中心挑战</h2><p>操作系统通过对应驱动，按顺序处理程序的设备请求。</p><div role="group" aria-label="选择设备队首请求">{pending.map((request, index) => <button key={request.id} onClick={() => service(request)} type="button"><small>队列第 {index + 1} 位</small>{request.task} → {request.device}</button>)}</div><p role="status">{feedback} 已服务：{serviced.length ? serviced.map((request) => request.task).join("、") : "还没有"}；等待：{pending.length} 项</p>{pending.length ? null : <button onClick={onComplete} type="button">完成设备协调</button>}</div>;
}
