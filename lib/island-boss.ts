import { COURSES, ISLANDS } from "./course-data.ts";

export type IslandBossPhase = "scan" | "sequence" | "core" | "complete";
export type IslandBossStatus = "working" | "retry" | "success";

export interface IslandBossChoice { id: string; text: string }
export interface IslandBossAction { id: string; text: string }

export interface IslandBoss {
  id: string;
  islandId: string;
  islandName: string;
  title: string;
  icon: string;
  briefing: string;
  requiredCourseIds: string[];
  evidence: IslandBossChoice[];
  correctEvidenceIds: string[];
  evidenceRule: string;
  actions: IslandBossAction[];
  correctActionOrder: string[];
  actionRule: string;
  explanations: IslandBossChoice[];
  correctExplanationId: string;
  transferRule: string;
}

export interface IslandBossState {
  phase: IslandBossPhase;
  status: IslandBossStatus;
  completedPhases: number;
  selectedEvidenceIds: string[];
  actionQueue: string[];
  selectedExplanationId: string | null;
  feedback: string;
}

interface BossSeed {
  islandId: string;
  title: string;
  icon: string;
  briefing: string;
  evidence: [string, string, string, string];
  evidenceRule: string;
  actions: [string, string, string, string];
  actionRule: string;
  explanations: [string, string, string];
  transferRule: string;
}

const BOSS_SEEDS: BossSeed[] = [
  {
    islandId: "launch-harbor", title: "失控的启航控制台", icon: "⌨️", briefing: "飞船控制台没有照预期响应，需要先分清输入、窗口和程序状态。",
    evidence: ["键盘输入框里能正常出现字母", "目标程序窗口现在是最前面的窗口", "桌面背景换成了蓝色", "鼠标垫在桌子右边"], evidenceRule: "有效证据要直接说明输入设备是否工作，以及指令送到了哪个程序。",
    actions: ["确认目标窗口处于前台", "在虚构测试框输入一个字符", "观察程序是否给出对应反馈", "连续乱按所有按键"], actionRule: "先确定接收者，再做一个小测试，最后根据可见结果判断。",
    explanations: ["输入会先到当前获得焦点的程序，再由程序决定怎样响应", "电脑总会把按键送给桌面背景", "只要多按几次，任何程序都会自动修好"], transferRule: "操作电脑时，要同时确认输入设备、当前焦点和程序反馈。",
  },
  {
    islandId: "file-forest", title: "迷路的作品文件", icon: "📁", briefing: "一幅虚构海报找不到了，必须根据位置、名称和文件类型安全找回。",
    evidence: ["作品最后保存在“学习作品/海报”文件夹", "文件名包含“海洋海报”并以 .png 结尾", "屏幕亮度是 70%", "回收站图标在桌面右下角"], evidenceRule: "路径和完整文件名能缩小查找范围，界面装饰不能证明文件位置。",
    actions: ["打开记录中的目标文件夹", "按名称和扩展名核对文件", "打开预览确认内容后再操作", "把所有相似文件一起删除"], actionRule: "先到正确位置，再核对身份，确认内容后才进行下一步。",
    explanations: ["文件的位置由路径表示，名称和扩展名帮助识别它的身份与类型", "所有图片都会自动住在桌面", "修改文件名就会把文件变成另一种内容"], transferRule: "管理文件要联合使用路径、名称、类型和预览证据。",
  },
  {
    islandId: "robot-workshop", title: "卡住的巡逻机器人", icon: "🤖", briefing: "机器人在方格城重复撞墙，需要检查指令顺序、循环条件和观察结果。",
    evidence: ["机器人每到第三格都会面对同一堵墙", "程序在撞墙前重复执行“前进”三次", "机器人外壳是橙色", "地图标题使用粗体字"], evidenceRule: "重复出现的位置和对应指令能定位程序规则中的错误。",
    actions: ["先预测现有指令会走到哪里", "只修改撞墙前的一个指令或条件", "重新运行并比较新旧路径", "一次改动整段程序的所有指令"], actionRule: "调试要先预测，再做最小改动，最后用新证据验证。",
    explanations: ["程序按顺序执行，循环和条件会决定哪些指令重复或跳过", "机器人会自动猜出编程者真正想走的路", "只要程序很长，指令顺序就不重要"], transferRule: "编程问题可以用预测、最小修改和重新测试逐步解决。",
  },
  {
    islandId: "safety-lighthouse", title: "伪装的奖励弹窗", icon: "🛡️", briefing: "灯塔收到一个催促领取奖励的虚构弹窗，需要识别隐私与风险信号。",
    evidence: ["弹窗要求立刻填写真实密码和家庭地址", "来源名称与正在使用的学习程序不一致", "按钮使用了闪亮的黄色", "页面上有一张卡通礼物图"], evidenceRule: "索要秘密、制造紧迫感和来源不符才是风险证据，颜色与图片不是。",
    actions: ["停止填写并关闭虚构弹窗", "把看到的风险信号告诉可信任的大人", "由大人从原应用入口核实是否真的需要操作", "为了不错过奖励先提交一次密码"], actionRule: "先停止暴露信息，再求助，最后从可信入口独立核实。",
    explanations: ["密码和家庭信息属于敏感信息，陌生催促应停止并请大人核实", "有礼物图片的页面一定由学校制作", "只提交一次秘密就不会产生风险"], transferRule: "遇到索要秘密或催促点击的内容，停下、求助、独立核实。",
  },
  {
    islandId: "hardware-lab", title: "沉默的绘图机器", icon: "🧩", briefing: "虚构绘图机有电却没有输出，需要沿输入、处理、输出和存储查找证据。",
    evidence: ["触控笔输入指示灯会随点击变化", "处理程序显示任务仍停在等待队列", "机箱贴纸有一点翘起", "桌面旁放着一本绿色笔记本"], evidenceRule: "状态灯和任务队列直接反映信息流在哪一段停止。",
    actions: ["确认输入信号已经进入系统", "检查处理任务是否被执行", "再观察屏幕或打印输出是否出现", "打开真实机箱触摸内部零件"], actionRule: "按信息流从输入到处理再到输出检查，儿童不拆开真实硬件。",
    explanations: ["完整任务需要硬件传递信号、软件给出指令并由处理部件执行", "设备通电就表示所有软件都已正常运行", "输出设备可以跳过处理器自己理解输入"], transferRule: "排查电脑要沿输入、处理、存储和输出的信息流逐段观察。",
  },
  {
    islandId: "network-bay", title: "失联的虚构气象站", icon: "🌐", briefing: "浏览器打不开 example.test 气象站，需要分清本机、信号、地址和服务器。",
    evidence: ["同一设备能打开另一个保留示例站点", "地址栏把 example.test 拼成了 examp1e.test", "浏览器主题是深色", "设备电量还有 82%"], evidenceRule: "对照站点和主机名拼写能区分连接问题与地址问题。",
    actions: ["先核对地址栏中的主机名", "改回记录中的保留示例地址", "重新请求并观察服务器响应", "独自重置真实路由器和网络设置"], actionRule: "从最小、可逆的地址检查开始，再重新请求观察结果。",
    explanations: ["网络请求必须到达正确主机；相似字符也可能指向完全不同的地址", "网页颜色决定服务器能否收到请求", "任何打不开的网页都说明设备没有联网"], transferRule: "网络侦察要分开检查设备、连接、地址、服务器和内容本身。",
  },
  {
    islandId: "creative-workshop", title: "混乱的故事展板", icon: "🎨", briefing: "故事展板信息很多却看不懂，需要用层级、对齐和版权线索重建设计。",
    evidence: ["标题、正文和说明文字大小几乎相同", "图片来源栏为空且无法说明授权", "画布背景是米白色", "工具栏停在左侧"], evidenceRule: "信息层级和素材来源会影响理解与安全使用，工具位置不是作品质量证据。",
    actions: ["先确定作品要让观众理解的核心信息", "用标题层级和对齐重新组织内容", "替换或标注有授权来源的素材后检查整体", "随机添加更多颜色和动画"], actionRule: "先明确目标，再组织信息，最后核对素材与整体效果。",
    explanations: ["设计通过层级、对齐和合适素材帮助观众按顺序理解信息", "元素越多，作品传达的信息一定越清楚", "图片出现在网上就可以不看来源直接使用"], transferRule: "数字创作要兼顾表达目标、视觉层级、可读性和素材责任。",
  },
  {
    islandId: "future-station", title: "AI 协作迷航", icon: "✨", briefing: "AI 助手给出了自信却矛盾的项目建议，团队必须分工核验再决定。",
    evidence: ["AI 的两个回答对同一事实给出不同日期", "回答没有提供可以核对的可靠来源", "聊天气泡是紫色", "队友头像排成一行"], evidenceRule: "自相矛盾和缺少来源说明需要核验，界面外观不代表内容可靠。",
    actions: ["把需要确认的事实拆成清楚的小问题", "分工查找可信来源并记录证据", "比较证据后由团队决定采用或修改建议", "直接复制最像答案的一段提交"], actionRule: "先拆问题，再多人核验，最后依据证据作共同决定。",
    explanations: ["AI 可以协助生成想法，但事实仍要由人用可靠证据核验并负责决定", "AI 使用完整句子就表示内容已经被专家确认", "团队协作就是所有人复制同一份答案"], transferRule: "使用 AI 时，人要明确目标、保护隐私、核验事实并承担最终责任。",
  },
  {
    islandId: "code-spaceport", title: "失灵的能量计分器", icon: "🧠", briefing: "小游戏点击按钮后分数忽高忽低，需要追踪事件、变量、函数和真假条件。",
    evidence: ["每次点击都触发了两次加分函数", "得分变量在函数内先加 1 又被旧值覆盖", "按钮边框是圆角", "背景音乐有四个音符"], evidenceRule: "事件次数和变量变化记录能解释分数异常，装饰效果不能。",
    actions: ["记录一次点击实际触发了哪些事件", "让一个函数只负责一次明确的分数更新", "用不同真假条件测试并观察变量", "同时新增更多事件处理器"], actionRule: "先追踪事件，再收紧函数职责，最后用多种条件验证状态。",
    explanations: ["事件启动函数，函数读写变量，布尔条件决定某段逻辑是否执行", "变量会自动知道玩家期望的最终分数", "函数名称好听就能防止重复执行"], transferRule: "理解小游戏要沿事件、函数、变量和条件的因果链追踪。",
  },
  {
    islandId: "data-structures", title: "堵塞的宝藏仓库", icon: "🗂️", briefing: "不同宝藏查找和取出方式混在一起，需要为任务选择合适的数据结构。",
    evidence: ["任务要求按编号快速访问第 4 个固定储物柜", "紧急消息必须按到达先后依次处理", "仓库门是拱形", "宝箱标签使用绿色字体"], evidenceRule: "访问方式和取出规则决定数据结构，外观不能决定组织方式。",
    actions: ["先说清任务需要怎样访问或取出数据", "比较数组、队列等结构的规则", "选择结构并用一个小例子模拟操作", "把所有数据都改成同一种结构"], actionRule: "从操作需求出发比较结构，再用小例子验证选择。",
    explanations: ["数据结构用不同连接和访问规则组织数据，应按任务需要选择", "数组、链表、栈、队列、树和图的操作完全一样", "数据数量少时永远不需要考虑组织方式"], transferRule: "先问数据怎样被访问、添加、删除和连接，再选择结构。",
  },
  {
    islandId: "algorithm-arena", title: "超时的搜索擂台", icon: "🏁", briefing: "选手逐个检查一千张已排序卡片，必须拆解任务并比较更有效的方法。",
    evidence: ["卡片已经按编号从小到大排序", "逐个搜索最坏要检查接近一千次", "计分牌使用电子数字", "观众席有三面旗子"], evidenceRule: "数据是否有序和操作次数能支持算法效率判断。",
    actions: ["明确输入、目标和完成条件", "利用有序特点选择对半缩小范围", "记录每步检查次数并与逐个搜索比较", "只看一次运行很快就宣布永远最快"], actionRule: "先定义任务，再利用数据特点选择算法，最后用可比较的工作量验证。",
    explanations: ["算法是清楚的解题步骤；数据特点和规模会影响不同算法的工作量", "算法名字越短，运行时一定越快", "只要答案正确，就不需要比较步骤数量"], transferRule: "评价算法既看结果是否正确，也看规模增大时需要多少工作。",
  },
  {
    islandId: "os-control-tower", title: "拥挤的系统控制塔", icon: "🖥️", briefing: "三个程序争用处理器、内存和设备，需要操作系统公平协调并保护资源。",
    evidence: ["一个进程长期占用 CPU，另外两个一直处于就绪状态", "内存表显示新任务请求超过剩余空间", "窗口标题使用白色字体", "鼠标指针停在屏幕中央"], evidenceRule: "进程状态和资源表能说明调度与分配问题，界面样式不能。",
    actions: ["读取进程状态与当前资源占用", "按调度规则给就绪任务分配时间片", "只在容量足够时分配内存并记录变化", "让每个程序直接控制所有硬件"], actionRule: "先掌握状态，再按规则调度与分配，并保持资源记录一致。",
    explanations: ["操作系统在程序与硬件之间管理进程、内存、文件和设备请求", "每个程序同时独占处理器会让系统更公平", "关闭窗口装饰就能释放所有系统资源"], transferRule: "操作系统用统一规则协调多个程序，让有限资源安全而公平地工作。",
  },
  {
    islandId: "systems-network-depths", title: "丢失的深海数据包", icon: "🌊", briefing: "深海站收到乱序且缺一块的数据，需要追踪分层、路由、确认与重传。",
    evidence: ["接收端有第 1、3 包，却没有第 2 包", "发送端一直没有收到第 2 包的确认", "潜水艇图标朝向左边", "控制台背景有气泡图案"], evidenceRule: "序号缺口和确认记录能证明传输不完整，装饰图案不能。",
    actions: ["根据序号找出缺失的数据块", "只请求重传未被确认的第 2 包", "去重并按序号重新组装完整消息", "把已经收到的所有包无限重复发送"], actionRule: "先检测缺口，再精确重传，最后去重并按顺序组装。",
    explanations: ["可靠传输依靠编号、确认、超时重传和去重，让分块数据最终完整有序", "数据包走同一条路线就绝不会丢失", "接收顺序混乱时只需删除所有数据重新开始"], transferRule: "复杂系统靠分层职责与可见状态处理丢失、乱序和重复。",
  },
];

function makeBoss(seed: BossSeed): IslandBoss {
  const island = ISLANDS.find((item) => item.id === seed.islandId);
  if (!island) throw new Error(`Unknown island ${seed.islandId}`);
  const bossId = `${seed.islandId}-boss`;
  const evidence = seed.evidence.map((text, index) => ({ id: `${bossId}-e${index + 1}`, text }));
  const actions = seed.actions.map((text, index) => ({ id: `${bossId}-a${index + 1}`, text }));
  const explanations = seed.explanations.map((text, index) => ({ id: `${bossId}-x${index + 1}`, text }));
  return {
    id: bossId,
    islandId: seed.islandId,
    islandName: island.name,
    title: seed.title,
    icon: seed.icon,
    briefing: seed.briefing,
    requiredCourseIds: COURSES.filter((course) => course.islandId === seed.islandId).map((course) => course.id),
    evidence,
    correctEvidenceIds: evidence.slice(0, 2).map((item) => item.id),
    evidenceRule: seed.evidenceRule,
    actions,
    correctActionOrder: actions.slice(0, 3).map((item) => item.id),
    actionRule: seed.actionRule,
    explanations,
    correctExplanationId: explanations[0].id,
    transferRule: seed.transferRule,
  };
}

export const ISLAND_BOSSES: IslandBoss[] = BOSS_SEEDS.map(makeBoss);
const VALID_EVIDENCE_IDS = new Set(ISLAND_BOSSES.flatMap((boss) => boss.evidence.map((item) => item.id)));
const VALID_ACTION_IDS = new Set(ISLAND_BOSSES.flatMap((boss) => boss.actions.map((item) => item.id)));
const VALID_EXPLANATION_IDS = new Set(ISLAND_BOSSES.flatMap((boss) => boss.explanations.map((item) => item.id)));

export function getIslandBossUnlock(boss: IslandBoss, completedCourseIds: readonly string[]) {
  const completed = new Set(completedCourseIds);
  const completedCount = boss.requiredCourseIds.filter((id) => completed.has(id)).length;
  return {
    completedCount,
    requiredCount: boss.requiredCourseIds.length,
    unlocked: completedCount === boss.requiredCourseIds.length,
    nextCourseId: boss.requiredCourseIds.find((id) => !completed.has(id)) ?? null,
  };
}

export function createIslandBossState(): IslandBossState {
  return {
    phase: "scan",
    status: "working",
    completedPhases: 0,
    selectedEvidenceIds: [],
    actionQueue: [],
    selectedExplanationId: null,
    feedback: "先观察任务简报，再选择两条真正有用的证据。",
  };
}

function resumeWorking(state: IslandBossState): IslandBossState {
  return state.status === "retry" ? { ...state, status: "working", feedback: "已经调整选择，可以再次提交。" } : state;
}

export function toggleBossEvidence(state: IslandBossState, evidenceId: string): IslandBossState {
  if (state.phase !== "scan" || state.status === "success" || !VALID_EVIDENCE_IDS.has(evidenceId)) return state;
  if (state.selectedEvidenceIds.includes(evidenceId)) {
    return resumeWorking({ ...state, selectedEvidenceIds: state.selectedEvidenceIds.filter((id) => id !== evidenceId) });
  }
  if (state.selectedEvidenceIds.length >= 2) return state;
  return resumeWorking({ ...state, selectedEvidenceIds: [...state.selectedEvidenceIds, evidenceId] });
}

export function queueBossAction(state: IslandBossState, actionId: string): IslandBossState {
  if (state.phase !== "sequence" || state.status === "success" || !VALID_ACTION_IDS.has(actionId) || state.actionQueue.includes(actionId) || state.actionQueue.length >= 3) return state;
  return resumeWorking({ ...state, actionQueue: [...state.actionQueue, actionId] });
}

export function removeBossAction(state: IslandBossState, actionId: string): IslandBossState {
  if (state.phase !== "sequence" || state.status === "success" || !state.actionQueue.includes(actionId)) return state;
  return resumeWorking({ ...state, actionQueue: state.actionQueue.filter((id) => id !== actionId) });
}

export function selectBossExplanation(state: IslandBossState, explanationId: string): IslandBossState {
  if (state.phase !== "core" || state.status === "success" || !VALID_EXPLANATION_IDS.has(explanationId)) return state;
  return resumeWorking({ ...state, selectedExplanationId: explanationId });
}

function sameMembers(left: readonly string[], right: readonly string[]) {
  return left.length === right.length && left.every((id) => right.includes(id));
}

export function submitBossPhase(state: IslandBossState, boss: IslandBoss, activationDetail = 1): IslandBossState {
  if (activationDetail > 1 || state.phase === "complete" || state.status === "success") return state;
  if (state.phase === "scan") {
    const correct = sameMembers(state.selectedEvidenceIds, boss.correctEvidenceIds);
    return correct
      ? { ...state, status: "success", feedback: `证据扫描完成！${boss.evidenceRule}` }
      : { ...state, status: "retry", feedback: "这两条线索还不能共同解释问题。找一找与任务状态直接相关的观察。" };
  }
  if (state.phase === "sequence") {
    const correct = state.actionQueue.length === boss.correctActionOrder.length && state.actionQueue.every((id, index) => id === boss.correctActionOrder[index]);
    return correct
      ? { ...state, status: "success", feedback: `行动编队完成！${boss.actionRule}` }
      : { ...state, status: "retry", feedback: "行动还没有形成安全有效的因果顺序。可以撤回一步，再从最小检查开始。" };
  }
  const correct = state.selectedExplanationId === boss.correctExplanationId;
  return correct
    ? { ...state, status: "success", feedback: `原理核心点亮！${boss.transferRule}` }
    : { ...state, status: "retry", feedback: "这个解释还不能说明所有证据和行动。再找能讲清楚“为什么”的规则。" };
}

export function advanceBossPhase(state: IslandBossState): IslandBossState {
  if (state.status !== "success" || state.phase === "complete") return state;
  if (state.phase === "scan") return { ...state, phase: "sequence", status: "working", completedPhases: 1, selectedEvidenceIds: [], feedback: "把三个安全行动按执行顺序加入编队。" };
  if (state.phase === "sequence") return { ...state, phase: "core", status: "working", completedPhases: 2, actionQueue: [], feedback: "最后选择一个能解释整场任务的核心原理。" };
  return { ...state, phase: "complete", status: "success", completedPhases: 3, feedback: "Boss 核心已经点亮。" };
}
