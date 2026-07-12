"use client";

import { useEffect, useLayoutEffect, useRef, useState, type ComponentType } from "react";
import { LessonChrome } from "@/components/lessons/LessonChrome";
import type { LessonProps } from "@/components/lessons/types";
import { ArrayLockerLab } from "@/components/lessons/advanced/data-structures/ArrayLockerLab";
import { GraphRoutesLab } from "@/components/lessons/advanced/data-structures/GraphRoutesLab";
import { LinkedTreasureLab } from "@/components/lessons/advanced/data-structures/LinkedTreasureLab";
import { StackQueueLab } from "@/components/lessons/advanced/data-structures/StackQueueLab";
import { TreeLibraryLab } from "@/components/lessons/advanced/data-structures/TreeLibraryLab";
import { ConceptJourney } from "@/components/lessons/advanced/ConceptJourney";
import { ConceptReflectionGate, type ConceptReflection } from "@/components/lessons/advanced/ConceptReflectionGate";

interface DataStructureLessonConfig {
  courseId: string;
  badgeId: string;
  courseName: string;
  stages: readonly [string, string, string, string, string, string];
  messages: readonly [string, string, string, string, string, string];
  Lab: ComponentType<{ onComplete: () => void }>;
  reflection: ConceptReflection;
}

function DataStructureLesson({ config, initialStage, onAward, onComplete, onExit, onStageChange }: LessonProps & { config: DataStructureLessonConfig }) {
  const [stage, setStage] = useState(() => Math.max(0, Math.min(5, Math.floor(initialStage || 0))));
  const [labSolved, setLabSolved] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const awardedRef = useRef(false);
  const Lab = config.Lab;

  useLayoutEffect(() => headingRef.current?.focus(), [stage]);
  useEffect(() => onStageChange(stage), [onStageChange, stage]);

  function finish() {
    if (awardedRef.current) return;
    awardedRef.current = true;
    onAward(config.courseId, config.badgeId);
    onComplete();
  }

  return (
    <LessonChrome courseName={config.courseName} currentStage={stage} heading={config.stages[stage]} headingRef={headingRef} message={config.messages[stage]} onExit={onExit} stageNames={config.stages}>
      <div className="advanced-foundation-lesson">
        {stage < 5 ? <div className="advanced-concept-demo"><ConceptJourney icon={["🧭", "🔎", "🧩", "💡", "🛠️"][stage]} label={`${config.courseName}：${config.stages[stage]}`} labels={config.stages.slice(0, 5)} stage={stage} /><p role="status">第 {stage + 1} 步：{config.messages[stage]}</p><button className="primary-action" onClick={() => setStage(stage + 1)} type="button">继续探索这个结构</button></div> : labSolved ? <ConceptReflectionGate onComplete={finish} reflection={config.reflection} /> : <Lab onComplete={() => setLabSolved(true)} />}
      </div>
    </LessonChrome>
  );
}

const CONFIGS = {
  array: {
    courseId: "array-lockers", badgeId: "array-navigator", courseName: "数组储物柜", Lab: ArrayLockerLab,
    stages: ["连续的储物柜", "索引从零开始", "按编号读取", "更新一个位置", "预测访问结果", "数组独立挑战"],
    messages: ["数组把一组同类数据按顺序放在连续位置。", "第一个位置的索引是 0，第二个是 1。", "知道索引就能直接找到对应位置。", "更新只改变指定索引，其他位置保持原样。", "越过数组范围的索引找不到数据。", "读取索引 2，再准确更新索引 1。"],
    reflection: { prompt: "为什么数组能按编号快速找到一个位置？", options: ["位置按连续索引排列", "每项都藏在随机地方", "只能从最后一项开始"], answer: "位置按连续索引排列", reason: "数组位置按连续索引排列，知道索引就能定位。" },
  },
  linked: {
    courseId: "linked-treasure", badgeId: "link-pathfinder", courseName: "链表寻宝线", Lab: LinkedTreasureLab,
    stages: ["节点与线索", "沿下一站前进", "在中间插入", "删除再连接", "发现断链", "链表独立挑战"],
    messages: ["链表由一个个节点组成，每个节点保存内容和下一站。", "从头节点开始，必须沿连接才能到达后面。", "插入节点要改前一站的连接，新节点再连向后一站。", "删除中间节点后，前后节点需要重新连接。", "连接指向不存在的节点时，寻宝路线会中断。", "插入码头，再删除并恢复完整路线。"],
    reflection: { prompt: "删除链表中间节点时，最重要的动作是什么？", options: ["重新连接前后节点", "把所有内容排序", "改变数组索引"], answer: "重新连接前后节点", reason: "链表依靠下一站线索，删除后必须让前一节点改指向后一节点。" },
  },
  stackQueue: {
    courseId: "stack-queue-dock", badgeId: "stack-queue-captain", courseName: "栈与队列码头", Lab: StackQueueLab,
    stages: ["两种排队规则", "栈的顶部", "后进先出", "队列的队首", "先进先出", "规则比较挑战"],
    messages: ["栈和队列都能保存一组项目，但取出规则不同。", "栈只能从顶部放入和取出。", "最后放进栈的项目会最先取出。", "队列从末尾加入，从队首离开。", "最早进入队列的项目会最先离开。", "分别操作盘子栈和候船队列。"],
    reflection: { prompt: "排队上船为什么更适合使用队列？", options: ["先来的人先离开队伍", "后来的人永远先上", "所有人同时上船"], answer: "先来的人先离开队伍", reason: "队列遵守先进先出，符合公平排队的顺序。" },
  },
  tree: {
    courseId: "tree-library", badgeId: "tree-librarian", courseName: "树形图书馆", Lab: TreeLibraryLab,
    stages: ["从根开始", "父节点与子节点", "沿分支分类", "叶节点在末端", "读取完整路径", "树形查找挑战"],
    messages: ["树结构从一个根节点开始向下分支。", "一个节点可以有多个子节点，子节点只有一个直接父节点。", "每次选择一个分支，就缩小查找范围。", "没有子节点的末端叫叶节点。", "从根到目标经过的节点组成一条路径。", "从图书馆根节点找到太空叶节点。"],
    reflection: { prompt: "树结构为什么适合表示文件夹分类？", options: ["它能从根向下分层", "它只有一个位置", "它不允许任何分支"], answer: "它能从根向下分层", reason: "文件夹会包含子文件夹，正好形成从根向下的层级。" },
  },
  graph: {
    courseId: "graph-routes", badgeId: "graph-navigator", courseName: "图结构航线网", Lab: GraphRoutesLab,
    stages: ["节点与边", "相邻才能移动", "一处多条连接", "寻找可达路线", "避免绕进环", "图航线挑战"],
    messages: ["图由节点和连接节点的边组成。", "只有两个节点之间存在边时才能直接移动。", "图中的节点可以连接多个不同方向。", "可达表示至少存在一条从起点到终点的路径。", "环会回到走过的节点，寻找路线时要记录访问过的位置。", "从港口选择相邻节点，抵达山洞。"],
    reflection: { prompt: "寻找图中的路线时，为什么要记录去过的节点？", options: ["避免在环里重复绕路", "让节点全部消失", "保证只走最长路线"], answer: "避免在环里重复绕路", reason: "图可能有环，记录访问过的位置能避免无限重复。" },
  },
} satisfies Record<string, DataStructureLessonConfig>;

export function ArrayLockersLesson(props: LessonProps) { return <DataStructureLesson config={CONFIGS.array} {...props} />; }
export function LinkedTreasureLesson(props: LessonProps) { return <DataStructureLesson config={CONFIGS.linked} {...props} />; }
export function StackQueueDockLesson(props: LessonProps) { return <DataStructureLesson config={CONFIGS.stackQueue} {...props} />; }
export function TreeLibraryLesson(props: LessonProps) { return <DataStructureLesson config={CONFIGS.tree} {...props} />; }
export function GraphRoutesLesson(props: LessonProps) { return <DataStructureLesson config={CONFIGS.graph} {...props} />; }
