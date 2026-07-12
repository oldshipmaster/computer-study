"use client";

import { useState } from "react";
import { serviceDeviceRequest, type DeviceRequest } from "@/lib/advanced-foundations/operating-system";

const START: DeviceRequest[] = [{ id: "screen", device: "屏幕驱动", task: "显示地图" }, { id: "keyboard", device: "键盘驱动", task: "读取按键" }, { id: "printer", device: "打印机驱动", task: "打印奖状" }];

export function DeviceCoordinationLab({ onComplete }: { onComplete: () => void }) {
  const [pending, setPending] = useState(START);
  const [serviced, setServiced] = useState<DeviceRequest[]>([]);
  function service() { const next = serviceDeviceRequest(pending); setPending(next.pending); if (next.serviced) setServiced((items) => [...items, next.serviced!]); }
  return <div className="advanced-lab device-coordination-lab"><h2>设备协调中心挑战</h2><p>操作系统通过对应驱动，按顺序处理程序的设备请求。</p><ol>{pending.map((request) => <li key={request.id}>{request.task} → {request.device}</li>)}</ol><p role="status">已服务：{serviced.length ? serviced.map((request) => request.task).join("、") : "还没有"}；等待：{pending.length} 项</p>{pending.length ? <button onClick={service} type="button">服务队首请求</button> : <button onClick={onComplete} type="button">完成设备协调</button>}</div>;
}
