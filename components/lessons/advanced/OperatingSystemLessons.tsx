"use client";

import { useEffect, useLayoutEffect, useRef, useState, type ComponentType } from "react";
import { LessonChrome } from "@/components/lessons/LessonChrome";
import type { LessonProps } from "@/components/lessons/types";
import { DeviceCoordinationLab } from "@/components/lessons/advanced/os/DeviceCoordinationLab";
import { FileSystemLab } from "@/components/lessons/advanced/os/FileSystemLab";
import { MemoryRoomsLab } from "@/components/lessons/advanced/os/MemoryRoomsLab";
import { ProcessLab } from "@/components/lessons/advanced/os/ProcessLab";
import { SchedulingLab } from "@/components/lessons/advanced/os/SchedulingLab";
import { ConceptJourney } from "@/components/lessons/advanced/ConceptJourney";
import { ConceptReflectionGate, type ConceptReflection } from "@/components/lessons/advanced/ConceptReflectionGate";

interface Config { courseId: string; badgeId: string; courseName: string; stages: readonly [string, string, string, string, string, string]; messages: readonly [string, string, string, string, string, string]; Lab: ComponentType<{ onComplete: () => void }>; reflection: ConceptReflection; }

function OperatingSystemLesson({ config, initialStage, onAward, onComplete, onExit, onStageChange }: LessonProps & { config: Config }) {
  const [stage, setStage] = useState(() => Math.max(0, Math.min(5, Math.floor(initialStage || 0))));
  const [labSolved, setLabSolved] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const awardedRef = useRef(false);
  const Lab = config.Lab;
  useLayoutEffect(() => headingRef.current?.focus(), [stage]);
  useEffect(() => onStageChange(stage), [onStageChange, stage]);
  function finish() { if (awardedRef.current) return; awardedRef.current = true; onAward(config.courseId, config.badgeId); onComplete(); }
  return <LessonChrome courseName={config.courseName} currentStage={stage} heading={config.stages[stage]} headingRef={headingRef} message={config.messages[stage]} onExit={onExit} stageNames={config.stages}><div className="advanced-foundation-lesson">{stage < 5 ? <div className="advanced-concept-demo"><ConceptJourney icon={["🖥️", "⏱️", "🧠", "📁", "⌨️"][stage]} label={`${config.courseName}：${config.stages[stage]}`} labels={config.stages.slice(0, 5)} stage={stage} /><p role="status">第 {stage + 1} 步：{config.messages[stage]}</p><button className="primary-action" onClick={() => setStage(stage + 1)} type="button">继续观察操作系统</button></div> : labSolved ? <ConceptReflectionGate onComplete={finish} reflection={config.reflection} /> : <Lab onComplete={() => setLabSolved(true)} />}</div></LessonChrome>;
}

const CONFIGS = {
  process: { courseId: "program-process", badgeId: "process-controller", courseName: "程序变成进程", Lab: ProcessLab, stages: ["程序文件等待启动", "进程进入就绪", "获得 CPU 运行", "等待与唤醒", "结束并回收", "进程生命周期挑战"], messages: ["程序是存储中的指令，启动后才成为运行中的进程。", "就绪进程已经准备好，正在等待 CPU。", "调度器选择进程后，它进入运行状态。", "等待输入的进程先让出 CPU，输入到达后回到就绪。", "进程结束后不再运行，系统回收它使用的资源。", "让虚拟进程正确经历运行、等待、唤醒和结束。"], reflection: { prompt: "进程等待键盘输入时，为什么要让出 CPU？", options: ["让其他就绪任务运行", "让电脑永远暂停", "把程序文件删除"], answer: "让其他就绪任务运行", reason: "等待中的进程暂时不能前进，让出 CPU 能避免浪费处理时间。" } },
  scheduling: { courseId: "cpu-scheduling", badgeId: "schedule-controller", courseName: "CPU 调度转盘", Lab: SchedulingLab, stages: ["多个任务都想运行", "CPU 一次执行一个", "时间片轮流分配", "未完成任务回到队尾", "公平也要有效率", "调度转盘挑战"], messages: ["多个进程可能同时处于就绪状态。", "一个 CPU 核心在一个瞬间只执行一个任务。", "时间片让每个就绪任务运行一小段时间。", "时间片结束而任务未完成，它回到队列等待下一轮。", "轮流调度避免一个任务长期独占 CPU。", "让画图、音乐和打印任务轮流完成。"], reflection: { prompt: "时间片轮转怎样避免一个任务独占 CPU？", options: ["每次只运行一小段就换下一个", "让第一个任务永远运行", "把所有任务同时塞进一个核心"], answer: "每次只运行一小段就换下一个", reason: "时间片到期后未完成任务回到队尾，其他任务得到运行机会。" } },
  memory: { courseId: "memory-allocation", badgeId: "memory-room-manager", courseName: "内存房间管理", Lab: MemoryRoomsLab, stages: ["内存空间有限", "进程申请房间", "记录每份分配", "空间不足要等待", "结束后释放空间", "内存分配挑战"], messages: ["内存像有限的工作房间，不能无限放入运行中的内容。", "进程启动或加载数据时向操作系统申请内存。", "操作系统记录每个进程占用了多少空间。", "剩余空间不够时，新申请不能强行超过容量。", "进程结束后，操作系统回收空间供其他任务使用。", "先遇到空间不足，再回收并成功分配。"], reflection: { prompt: "任务结束后为什么要释放它占用的内存？", options: ["让空间能被其他任务使用", "让内存永久变小", "把内存变成文件名"], answer: "让空间能被其他任务使用", reason: "内存容量有限，回收空间后新任务才能获得工作区域。" } },
  fileSystem: { courseId: "file-system-tree", badgeId: "file-system-guide", courseName: "文件系统目录树", Lab: FileSystemLab, stages: ["根目录是起点", "目录形成树", "路径记录位置", "文件保存在叶端", "权限限制操作", "目录树挑战"], messages: ["文件系统用根目录作为整棵目录树的起点。", "目录可以包含子目录和文件，形成层级。", "从根开始经过的名称组成文件路径。", "文件保存内容，通常位于某条目录路径末端。", "权限决定能否读取或修改，系统文件不要独自更改。", "沿虚拟路径找到星空笔记，并避开只读系统目录。"], reflection: { prompt: "文件路径为什么像一串地址？", options: ["它逐层记录从根到目标的位置", "它只表示文件颜色", "每个文件路径都完全相同"], answer: "它逐层记录从根到目标的位置", reason: "路径中的每一段都是一层目录，按顺序就能定位目标。" } },
  device: { courseId: "device-coordination", badgeId: "device-coordinator", courseName: "设备协调中心", Lab: DeviceCoordinationLab, stages: ["程序提出设备请求", "操作系统接收请求", "驱动翻译命令", "设备完成工作", "结果返回程序", "设备协调挑战"], messages: ["程序通过操作系统请求屏幕、键盘或打印机服务。", "操作系统安排请求，不让多个程序混乱地争抢设备。", "设备驱动把通用请求翻译成设备理解的命令。", "设备完成显示、输入或打印等具体工作。", "完成结果通过操作系统返回等待的程序。", "按队列服务三个虚拟设备请求。"], reflection: { prompt: "设备驱动在程序和设备之间做什么？", options: ["把通用请求翻译成设备命令", "替代所有硬件", "把每个请求随机删除"], answer: "把通用请求翻译成设备命令", reason: "驱动让操作系统的通用请求变成具体设备能理解的操作。" } },
} satisfies Record<string, Config>;

export function ProgramProcessLesson(props: LessonProps) { return <OperatingSystemLesson config={CONFIGS.process} {...props} />; }
export function CpuSchedulingLesson(props: LessonProps) { return <OperatingSystemLesson config={CONFIGS.scheduling} {...props} />; }
export function MemoryAllocationLesson(props: LessonProps) { return <OperatingSystemLesson config={CONFIGS.memory} {...props} />; }
export function FileSystemTreeLesson(props: LessonProps) { return <OperatingSystemLesson config={CONFIGS.fileSystem} {...props} />; }
export function DeviceCoordinationLesson(props: LessonProps) { return <OperatingSystemLesson config={CONFIGS.device} {...props} />; }
