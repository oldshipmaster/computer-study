"use client";

import { useEffect, useLayoutEffect, useRef, useState, type ComponentType } from "react";
import { LessonChrome } from "@/components/lessons/LessonChrome";
import type { LessonProps } from "@/components/lessons/types";
import { LayerEnvelopeLab } from "@/components/lessons/advanced/network/LayerEnvelopeLab";
import { ReliableTransferLab } from "@/components/lessons/advanced/network/ReliableTransferLab";
import { RoutingMazeLab } from "@/components/lessons/advanced/network/RoutingMazeLab";
import { CacheStationLab } from "@/components/lessons/advanced/systems/CacheStationLab";
import { InstructionCycleLab } from "@/components/lessons/advanced/systems/InstructionCycleLab";

interface Config { courseId: string; badgeId: string; courseName: string; stages: readonly [string, string, string, string, string, string]; messages: readonly [string, string, string, string, string, string]; Lab: ComponentType<{ onComplete: () => void }>; }

function SystemsNetworkLesson({ config, initialStage, onAward, onComplete, onExit, onStageChange }: LessonProps & { config: Config }) {
  const [stage, setStage] = useState(() => Math.max(0, Math.min(5, Math.floor(initialStage || 0))));
  const headingRef = useRef<HTMLHeadingElement>(null);
  const awardedRef = useRef(false);
  const Lab = config.Lab;
  useLayoutEffect(() => headingRef.current?.focus(), [stage]);
  useEffect(() => onStageChange(stage), [onStageChange, stage]);
  function finish() { if (awardedRef.current) return; awardedRef.current = true; onAward(config.courseId, config.badgeId); onComplete(); }
  return <LessonChrome courseName={config.courseName} currentStage={stage} heading={config.stages[stage]} headingRef={headingRef} message={config.messages[stage]} onExit={onExit} stageNames={config.stages}><div className="advanced-foundation-lesson">{stage < 5 ? <div className="advanced-concept-demo"><span aria-hidden="true">{["⚙️", "📦", "🌐", "🧭", "📨"][stage]}</span><p role="status">第 {stage + 1} 步：{config.messages[stage]}</p><button className="primary-action" onClick={() => setStage(stage + 1)} type="button">继续深入系统</button></div> : <Lab onComplete={finish} />}</div></LessonChrome>;
}

const CONFIGS = {
  instruction: { courseId: "instruction-cycle", badgeId: "instruction-engineer", courseName: "指令执行流水线", Lab: InstructionCycleLab, stages: ["时钟推动 CPU", "取指", "译码", "执行", "写回并继续", "指令周期挑战"], messages: ["CPU 在时钟节拍推动下重复处理指令。", "取指阶段从内存中拿到下一条指令。", "译码阶段判断指令需要什么操作和数据。", "执行阶段完成计算、比较或移动。", "写回阶段保存结果，然后开始下一条指令。", "连续追踪两轮取指、译码、执行和写回。"] },
  cache: { courseId: "cache-station", badgeId: "cache-courier", courseName: "缓存快递站", Lab: CacheStationLab, stages: ["CPU 等待数据", "缓存最近最快", "内存容量更大", "存储更慢但长久", "命中减少等待", "缓存层级挑战"], messages: ["CPU 需要指令和数据才能继续工作。", "缓存很小但离 CPU 最近，命中时等待最短。", "内存能放更多运行内容，但访问比缓存慢。", "存储容量大且能长期保留，读取等待更久。", "常用数据留在较近层级，可以减少平均等待。", "预测地图、音乐和图书会在哪一层命中。"] },
  layers: { courseId: "network-layers", badgeId: "layer-packer", courseName: "网络分层信封", Lab: LayerEnvelopeLab, stages: ["分层各管一件事", "应用层描述内容", "传输层负责编号", "网络层写入地址", "链路层送到下一站", "分层收发挑战"], messages: ["网络分层让复杂通信拆成相互配合的任务。", "应用层关心消息代表什么服务或内容。", "传输层加入编号和确认等端到端规则。", "网络层加入源地址、目的地址并支持跨网络转发。", "链路层负责当前一段连接上的下一站传递。", "逐层封装消息，再在终点按相反顺序拆开。"] },
  routing: { courseId: "routing-maze", badgeId: "route-planner", courseName: "路由选择迷宫", Lab: RoutingMazeLab, stages: ["数据包需要下一跳", "路由表记录路线", "代价帮助比较", "逐跳抵达终点", "中断后重新选择", "路由迷宫挑战"], messages: ["路由器不需要知道整段旅程，只要选择合适的下一跳。", "路由表记录可以到达哪些网络和下一站。", "路线代价可以表示距离、拥塞或其他成本。", "每台路由器继续转发，数据包最终抵达目的地。", "链路中断后要排除不可达路线并重新计算。", "先选最低代价路线，再处理一条链路中断。"] },
  reliable: { courseId: "reliable-transfer", badgeId: "reliable-rescuer", courseName: "可靠传输救援", Lab: ReliableTransferLab, stages: ["消息拆成编号块", "接收后返回确认", "网络可能丢失", "超时触发重传", "按编号去重排序", "可靠传输挑战"], messages: ["大消息可以拆成带编号的小数据块。", "接收方收到数据块后返回对应确认。", "某个数据块可能在途中丢失，其他块仍可能到达。", "发送方等待确认超时后重传缺失块。", "重复块只保留一份，最后按编号恢复正确顺序。", "发送三个数据块，发现丢失并完成重传拼装。"] },
} satisfies Record<string, Config>;

export function InstructionCycleLesson(props: LessonProps) { return <SystemsNetworkLesson config={CONFIGS.instruction} {...props} />; }
export function CacheStationLesson(props: LessonProps) { return <SystemsNetworkLesson config={CONFIGS.cache} {...props} />; }
export function NetworkLayersLesson(props: LessonProps) { return <SystemsNetworkLesson config={CONFIGS.layers} {...props} />; }
export function RoutingMazeLesson(props: LessonProps) { return <SystemsNetworkLesson config={CONFIGS.routing} {...props} />; }
export function ReliableTransferLesson(props: LessonProps) { return <SystemsNetworkLesson config={CONFIGS.reliable} {...props} />; }
