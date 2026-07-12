import { useState } from "react";
import { advancePacket, createPacketJourney } from "@/lib/network-journey-lesson";
import { isRepeatedPointerActivation } from "@/lib/interaction-guard";
import "./PacketJourneyLab.css";

const TASKS = [{ id: "weather-request", label: "查询虚构天气", response: "虚构天气结果" }, { id: "library-request", label: "查询虚构图书", response: "虚构图书结果" }, { id: "map-request", label: "查询虚构地图", response: "虚构地图结果" }];
const STOP_LABELS = { device: "💻 你的设备", router: "📡 路由器", internet: "🌐 网络", server: "🗄️ 服务器" };
const STATION_EXPLANATIONS = ["设备创建请求数据", "路由器把请求转发出去", "请求跨过网络", "服务器读取请求并生成响应", "响应跨网络返回", "路由器把响应送回设备", "设备显示收到的结果"];
interface Props { onComplete: () => void; }

export function PacketJourneyLab({ onComplete }: Props) {
  const [taskIndex, setTaskIndex] = useState(0);
  const [journey, setJourney] = useState(() => createPacketJourney(TASKS[0].id));
  const [finished, setFinished] = useState(false);
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  const task = TASKS[taskIndex];
  function next(detail: number) {
    if (isRepeatedPointerActivation(detail)) return;
    if (!journey.complete) { setJourney(advancePacket(journey)); return; }
    const done = [...completedTasks, task.id];
    setCompletedTasks(done);
    if (taskIndex === TASKS.length - 1) { setFinished(true); return; }
    const nextIndex = taskIndex + 1;
    setTaskIndex(nextIndex);
    setJourney(createPacketJourney(TASKS[nextIndex].id));
  }
  const direction = journey.index <= 3 ? "请求去程" : "响应回程";
  return (
    <div className="packet-journey">
      {!finished ? <>
        <header><small>网络往返 {taskIndex + 1}/3</small><h2 aria-live="polite">{task.label}</h2><span className={journey.index <= 3 ? "journey-direction journey-direction--request" : "journey-direction journey-direction--response"}>{direction}</span></header>
        <div className="network-route" aria-label="请求和响应的七站路线" role="group">{journey.route.map((stop, index) => <span className={`${index === journey.index ? "is-current" : index < journey.index ? "is-visited" : ""} ${index <= 3 ? "is-request" : "is-response"}`} key={`${stop}-${index}`}>{index === journey.index ? <b aria-hidden="true" className="journey-packet">📦</b> : null}{STOP_LABELS[stop]}<small>{index <= 3 ? "请求" : "响应"}</small></span>)}</div>
        <section className="station-explanation"><small>第 {journey.index + 1} 站 · {direction}</small><strong>{STATION_EXPLANATIONS[journey.index]}</strong><p>当前位置：{journey.current ? STOP_LABELS[journey.current] : "没有发送"}</p></section>
        <p role="status">{journey.complete ? `设备已收到：${task.response}` : `数据包正在 ${STOP_LABELS[journey.current!]}。`}</p>
        <button className="primary-action" onClick={(event) => next(event.detail)} type="button">{journey.complete ? taskIndex === TASKS.length - 1 ? "查看往返总结" : "确认收到，下一任务" : "发送到下一站"}</button>
      </> : <section className="journey-finish"><span aria-hidden="true">📦🌐✨</span><h2>三次网络往返完成</h2><ul>{TASKS.map((item) => <li key={item.id}>✓ {item.label}：请求送达，响应返回</li>)}</ul><button className="primary-action" onClick={onComplete} type="button">完成网络往返实验</button></section>}
      <aside>真实网络会把数据分成许多小包，并可能经过不同路线；这里用一条简化路线学习设备、路由器、网络和服务器的基本角色。</aside>
    </div>
  );
}
