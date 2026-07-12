"use client";

import { useState } from "react";
import { serviceDeviceRequest, type DeviceRequest } from "@/lib/advanced-foundations/operating-system";
import { isRepeatedPointerActivation } from "@/lib/interaction-guard";

const START: DeviceRequest[] = [{ id: "screen", device: "屏幕驱动", task: "显示地图" }, { id: "keyboard", device: "键盘驱动", task: "读取按键" }, { id: "printer", device: "打印机驱动", task: "打印奖状" }];
const HARDWARE: Record<string, string> = { screen: "🖥️ 屏幕", keyboard: "⌨️ 键盘", printer: "🖨️ 打印机" };

export function DeviceCoordinationLab({ onComplete }: { onComplete: () => void }) {
  const [pending, setPending] = useState(START);
  const [serviced, setServiced] = useState<DeviceRequest[]>([]);
  const [feedback, setFeedback] = useState("选择设备队首请求，按先进先出的顺序服务。" );
  function service(request: DeviceRequest, detail: number) { if (isRepeatedPointerActivation(detail)) return; if (request.id !== pending[0].id) { setFeedback("队列要按顺序服务：先处理最早到达的请求。" ); return; } const next = serviceDeviceRequest(pending); setPending(next.pending); if (next.serviced) { setServiced((items) => [...items, next.serviced!]); setFeedback(`${next.serviced.task} 已由${next.serviced.device}处理。`); } }
  const head = pending[0];
  return <div className="advanced-lab device-coordination-lab"><h2>设备协调中心挑战</h2><p>应用程序不会直接操控硬件；操作系统让对应驱动程序翻译并执行请求。</p><div aria-label="设备请求处理流程" className="device-request-flow" role="list"><span role="listitem"><b>1 · 应用程序</b><small>{head?.task ?? "请求已完成"}</small></span><i aria-hidden="true">→</i><span role="listitem"><b>2 · 操作系统队列</b><small>{head ? `队首：${head.task}` : "队列为空"}</small></span><i aria-hidden="true">→</i><span role="listitem"><b>3 · 驱动程序</b><small>{head?.device ?? "等待请求"}</small></span><i aria-hidden="true">→</i><span role="listitem"><b>4 · 硬件设备</b><small>{head ? HARDWARE[head.id] : "全部完成"}</small></span></div><div aria-label="选择设备队首请求" role="group">{pending.map((request, index) => <button aria-label={`${index === 0 ? "队首" : `队列第 ${index + 1} 位`}：${request.task}`} key={request.id} onClick={(event) => service(request, event.detail)} type="button"><small>{index === 0 ? "队首 · 现在处理" : `队列第 ${index + 1} 位`}</small>{request.task} → {request.device}</button>)}</div><p aria-live="polite" role="status">{feedback} 已服务：{serviced.length ? serviced.map((request) => request.task).join("、") : "还没有"}；等待：{pending.length} 项</p>{pending.length ? null : <button onClick={onComplete} type="button">完成设备协调</button>}</div>;
}
