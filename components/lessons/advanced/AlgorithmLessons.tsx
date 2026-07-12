"use client";

import { useEffect, useLayoutEffect, useRef, useState, type ComponentType } from "react";
import { LessonChrome } from "@/components/lessons/LessonChrome";
import type { LessonProps } from "@/components/lessons/types";
import { EfficiencyRaceLab } from "@/components/lessons/advanced/algorithms/EfficiencyRaceLab";
import { SearchLab } from "@/components/lessons/advanced/algorithms/SearchLab";
import { SortLab } from "@/components/lessons/advanced/algorithms/SortLab";
import { TaskDecompositionLab } from "@/components/lessons/advanced/algorithms/TaskDecompositionLab";
import { ConceptJourney } from "@/components/lessons/advanced/ConceptJourney";
import { ConceptReflectionGate, type ConceptReflection } from "@/components/lessons/advanced/ConceptReflectionGate";

interface Config {
  courseId: string;
  badgeId: string;
  courseName: string;
  stages: readonly [string, string, string, string, string, string];
  messages: readonly [string, string, string, string, string, string];
  Lab: ComponentType<{ onComplete: () => void }>;
  reflection: ConceptReflection;
}

function AlgorithmLesson({ config, initialStage, onAward, onComplete, onExit, onStageChange }: LessonProps & { config: Config }) {
  const [stage, setStage] = useState(() => Math.max(0, Math.min(5, Math.floor(initialStage || 0))));
  const [labSolved, setLabSolved] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const awardedRef = useRef(false);
  const Lab = config.Lab;
  useLayoutEffect(() => headingRef.current?.focus(), [stage]);
  useEffect(() => onStageChange(stage), [onStageChange, stage]);
  function finish() { if (awardedRef.current) return; awardedRef.current = true; onAward(config.courseId, config.badgeId); onComplete(); }
  return <LessonChrome courseName={config.courseName} currentStage={stage} heading={config.stages[stage]} headingRef={headingRef} message={config.messages[stage]} onExit={onExit} stageNames={config.stages}><div className="advanced-foundation-lesson">{stage < 5 ? <div className="advanced-concept-demo"><ConceptJourney icon={["🔍", "🧠", "⚙️", "📏", "🏁"][stage]} label={`${config.courseName}：${config.stages[stage]}`} labels={config.stages.slice(0, 5)} stage={stage} /><p role="status">第 {stage + 1} 步：{config.messages[stage]}</p><button className="primary-action" onClick={() => setStage(stage + 1)} type="button">继续研究算法</button></div> : labSolved ? <ConceptReflectionGate onComplete={finish} reflection={config.reflection} /> : <Lab onComplete={() => setLabSolved(true)} />}</div></LessonChrome>;
}

const CONFIGS = {
  linear: { courseId: "linear-search", badgeId: "linear-search-scout", courseName: "顺序查找侦察", Lab: (props: { onComplete: () => void }) => <SearchLab strategy="linear" {...props} />, stages: ["从第一项开始", "逐个进行比较", "找到就停止", "找不到要查完", "记录操作次数", "顺序查找挑战"], messages: ["顺序查找从第一项开始检查。", "每次把一个项目和目标比较。", "遇到目标后就能停止并报告位置。", "目标不存在时，需要检查所有项目。", "比较次数能说明算法做了多少工作。", "逐步找到数字 11，并数出比较次数。"], reflection: { prompt: "目标不存在时，顺序查找为什么要检查全部项目？", options: ["不检查完就不能确定没有", "因为数据必须有序", "因为每次会删掉一半"], answer: "不检查完就不能确定没有", reason: "无序资料里目标可能在任何位置，检查完才能确认不存在。" } },
  binary: { courseId: "binary-search", badgeId: "binary-search-scout", courseName: "二分查找猜数", Lab: (props: { onComplete: () => void }) => <SearchLab strategy="binary" {...props} />, stages: ["先把数据排好序", "检查中间位置", "排除不可能一半", "更新左右边界", "重复直到找到", "二分查找挑战"], messages: ["二分查找只适用于已经排好顺序的数据。", "先比较当前范围的中间项目。", "目标更大就排除左半，更小就排除右半。", "保留下来的左右边界组成新范围。", "范围每次变小，直到找到目标或变空。", "逐步找到数字 11，观察范围怎样减半。"], reflection: { prompt: "二分查找开始前，资料必须满足什么条件？", options: ["已经排好顺序", "全部颜色相同", "只能有两个项目"], answer: "已经排好顺序", reason: "只有资料有序，比较中间值后才能安全排除一半。" } },
  sort: { courseId: "bubble-sort", badgeId: "sort-robot", courseName: "排序机器人", Lab: SortLab, stages: ["相邻数字见面", "比较大小", "顺序错误就交换", "一轮走到末尾", "重复直到不再交换", "冒泡排序挑战"], messages: ["冒泡排序一次比较两个相邻项目。", "较小的数字应该在左边。", "左右顺序错误时交换两个位置。", "一轮结束后，最大的数字移动到右端。", "继续运行多轮，直到所有数字有序。", "把 4、1、3、2 从小到大排好。"], reflection: { prompt: "冒泡排序的一轮结束后，哪个项目会移动到右端？", options: ["这一轮遇到的最大值", "随机项目", "永远是最小值"], answer: "这一轮遇到的最大值", reason: "相邻比较不断把较大值向右交换，所以最大值会冒到末端。" } },
  decomposition: { courseId: "task-decomposition", badgeId: "task-planner", courseName: "拆分任务工坊", Lab: TaskDecompositionLab, stages: ["先说清总目标", "拆成小任务", "找到任务依赖", "安排可执行顺序", "组合并检查", "任务分解挑战"], messages: ["复杂问题先要有清楚的完成目标。", "把大任务拆成能单独完成的小任务。", "有些任务必须等待前一步提供结果。", "没有未完成依赖的任务才可以开始。", "组合结果后还要检查是否满足总目标。", "按依赖安排四个任务。"], reflection: { prompt: "安排小任务顺序时，为什么要先看依赖？", options: ["前一步可能为后一步准备结果", "标题短的一定先做", "所有任务都能同时完成"], answer: "前一步可能为后一步准备结果", reason: "依赖表示后一步需要前一步的结果，颠倒就无法开始。" } },
  efficiency: { courseId: "algorithm-efficiency", badgeId: "efficiency-referee", courseName: "算法效率赛", Lab: EfficiencyRaceLab, stages: ["同一问题两种方法", "用操作次数比较", "数据量逐渐增加", "观察增长速度", "选择适合的方法", "效率比较挑战"], messages: ["不同算法可以解决同一个查找问题。", "操作次数是一种直观的效率线索。", "数据更多时，顺序查找最多要检查更多项。", "二分查找每次排除一半，次数增长较慢。", "没有一种方法永远最好，要看数据是否有序和规模。", "比较四种数据量下两种查找方法。"], reflection: { prompt: "比较算法效率时，哪一种证据最有用？", options: ["相同输入下的操作次数", "按钮颜色", "算法名字长短"], answer: "相同输入下的操作次数", reason: "控制相同输入再数操作步骤，才能公平比较工作量。" } },
} satisfies Record<string, Config>;

export function LinearSearchLesson(props: LessonProps) { return <AlgorithmLesson config={CONFIGS.linear} {...props} />; }
export function BinarySearchLesson(props: LessonProps) { return <AlgorithmLesson config={CONFIGS.binary} {...props} />; }
export function BubbleSortLesson(props: LessonProps) { return <AlgorithmLesson config={CONFIGS.sort} {...props} />; }
export function TaskDecompositionLesson(props: LessonProps) { return <AlgorithmLesson config={CONFIGS.decomposition} {...props} />; }
export function AlgorithmEfficiencyLesson(props: LessonProps) { return <AlgorithmLesson config={CONFIGS.efficiency} {...props} />; }
