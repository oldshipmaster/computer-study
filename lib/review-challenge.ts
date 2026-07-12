export interface ReviewQuestion {
  id: string;
  islandId: string;
  islandName: string;
  prompt: string;
  options: [string, string, string];
  answer: string;
  explanation: string;
}

export const REVIEW_QUESTIONS: ReviewQuestion[] = [
  { id: "launch-1", islandId: "launch-harbor", islandName: "启航港", prompt: "画画程序里按下鼠标后，电脑先得到的是什么？", options: ["输入", "输出", "文件夹"], answer: "输入", explanation: "鼠标动作先成为输入，程序处理后才在屏幕输出图画。" },
  { id: "launch-2", islandId: "launch-harbor", islandName: "启航港", prompt: "作品改了一半就要关窗口，最稳妥的做法是什么？", options: ["先保存再关闭", "直接拔电源", "随便点一个弹窗"], answer: "先保存再关闭", explanation: "保存会把工作从临时状态写入长期存储。" },
  { id: "files-1", islandId: "file-forest", islandName: "文件森林", prompt: "复制一张图片到新文件夹后，通常会有几份？", options: ["两份", "一份", "零份"], answer: "两份", explanation: "复制保留原件并建立副本；移动才是改变原件的位置。" },
  { id: "files-2", islandId: "file-forest", islandName: "文件森林", prompt: "哪一个文件名最容易以后找到？", options: ["2026春游照片.jpg", "新建文件(9).jpg", "aaa.jpg"], answer: "2026春游照片.jpg", explanation: "包含主题和时间的名称更清楚，同时保留扩展名。" },
  { id: "code-1", islandId: "robot-workshop", islandName: "机器人工坊", prompt: "机器人要走四条相同边，什么程序更清楚？", options: ["重复4次：前进、转弯", "写很多无关指令", "每次随机走"], answer: "重复4次：前进、转弯", explanation: "循环能表达重复模式，让程序更短也更容易修改。" },
  { id: "code-2", islandId: "robot-workshop", islandName: "机器人工坊", prompt: "程序结果不对，第一步应该是什么？", options: ["比较预期和实际", "一次改十处", "把错误藏起来"], answer: "比较预期和实际", explanation: "先找到第一次不同，再做一个小修改并重新测试。" },
  { id: "safe-1", islandId: "safety-lighthouse", islandName: "安全灯塔", prompt: "陌生弹窗催你立刻下载并填写电话，应该怎么做？", options: ["关闭并告诉大人", "照做", "转发给同学"], answer: "关闭并告诉大人", explanation: "催促下载和索取隐私都是风险线索，不确定就停止并求助。" },
  { id: "safe-2", islandId: "safety-lighthouse", islandName: "安全灯塔", prompt: "朋友问你的游戏密码，正确做法是什么？", options: ["不分享密码", "只告诉一次", "发到群里"], answer: "不分享密码", explanation: "密码属于私密信息，即使熟人询问也不分享。" },
  { id: "hardware-1", islandId: "hardware-lab", islandName: "硬件实验岛", prompt: "重启后未保存的文字消失，最可能因为它只在哪儿？", options: ["工作内存", "打印机", "鼠标垫"], answer: "工作内存", explanation: "工作内存帮助正在运行的任务，长期保留需要保存到存储设备。" },
  { id: "hardware-2", islandId: "hardware-lab", islandName: "硬件实验岛", prompt: "电脑发出焦味并很烫，孩子应该怎么做？", options: ["停止使用并告诉大人", "自己拆开", "继续玩"], answer: "停止使用并告诉大人", explanation: "涉及异常发热、电源或设备内部时要停止并由大人处理。" },
  { id: "network-1", islandId: "network-bay", islandName: "网络海湾", prompt: "浏览器地址里，判断网站身份最重要的是哪一段？", options: ["网站主机名", "页面颜色", "最后一个图标"], answer: "网站主机名", explanation: "要完整核对主机名，熟悉的词出现在其他位置不能证明网站身份。" },
  { id: "network-2", islandId: "network-bay", islandName: "网络海湾", prompt: "全家设备都无法联网，安全的第一项检查是什么？", options: ["看看设备是否连上家庭网络", "拆开路由器", "下载陌生修复工具"], answer: "看看设备是否连上家庭网络", explanation: "先做简单、可逆的观察；更改设备或电源设置要请大人帮助。" },
  { id: "creative-1", islandId: "creative-workshop", islandName: "创作工坊", prompt: "网上找到的图片要放进班级展示，第一步是什么？", options: ["查看作者与使用许可", "擦掉来源", "说成自己画的"], answer: "查看作者与使用许可", explanation: "能看到作品不等于可以随意使用，要尊重创作者和许可规则。" },
  { id: "creative-2", islandId: "creative-workshop", islandName: "创作工坊", prompt: "表格里同一列的长度有厘米也有米，应该怎么做？", options: ["统一单位后再比较", "直接画图", "把标题删掉"], answer: "统一单位后再比较", explanation: "同一属性使用一致单位，比较和图表才有意义。" },
  { id: "future-1", islandId: "future-station", islandName: "未来协作站", prompt: "AI 给出一个很肯定的日期，应该怎么做？", options: ["查可靠来源并交叉核对", "因为语气肯定就相信", "直接转发"], answer: "查可靠来源并交叉核对", explanation: "AI 可能生成看似合理的错误，流畅和肯定都不是证据。" },
  { id: "future-2", islandId: "future-station", islandName: "未来协作站", prompt: "给只需查看作品的同学共享时，选什么权限？", options: ["查看权限", "管理所有账号", "公开编辑"], answer: "查看权限", explanation: "最小权限只提供完成任务所需的能力，降低误改和泄露风险。" },
  { id: "spaceport-1", islandId: "code-spaceport", islandName: "代码星港", prompt: "分数从0开始，连续收到三次“碰到星星”事件，每次加1，最后是多少？", options: ["3", "1", "0"], answer: "3", explanation: "每次事件都运行处理器，变量基于当前值连续更新。" },
  { id: "spaceport-2", islandId: "code-spaceport", islandName: "代码星港", prompt: "三处都要执行相同的画星步骤，怎样更容易维护？", options: ["定义画星函数并复用", "复制后分别乱改", "删除两处"], answer: "定义画星函数并复用", explanation: "函数把共同逻辑集中在一处，调用时可以重复使用。" },
  { id: "structures-1", islandId: "data-structures", islandName: "数据结构群岛", prompt: "排队登船时，哪一种结构最符合先来先上？", options: ["队列", "栈", "随机选择"], answer: "队列", explanation: "队列遵守先进先出，先加入的人会先离开队列。" },
  { id: "structures-2", islandId: "data-structures", islandName: "数据结构群岛", prompt: "要表示城市和道路组成的复杂连接，最适合什么结构？", options: ["图", "一个数字", "一张空卡"], answer: "图", explanation: "图用节点表示城市、用边表示道路，适合描述多对多连接。" },
  { id: "algorithms-1", islandId: "algorithm-arena", islandName: "算法竞技场", prompt: "在已经排好序的100张卡片中寻找数字，哪种方法通常比较更少？", options: ["二分搜索", "每次从头逐个找", "随机猜"], answer: "二分搜索", explanation: "二分搜索每次舍弃一半不可能的范围，资料越多优势越明显。" },
  { id: "algorithms-2", islandId: "algorithm-arena", islandName: "算法竞技场", prompt: "比较两个算法是否高效，可以先记录什么？", options: ["完成需要的步骤数", "按钮颜色", "名字长短"], answer: "完成需要的步骤数", explanation: "步骤数能帮助我们用证据比较不同方法的工作量。" },
  { id: "os-1", islandId: "os-control-tower", islandName: "操作系统控制塔", prompt: "任务等待键盘输入时，进程最合适的状态是什么？", options: ["等待", "运行", "已经删除"], answer: "等待", explanation: "任务暂时缺少输入，操作系统让它等待，把处理器交给其他任务。" },
  { id: "os-2", islandId: "os-control-tower", islandName: "操作系统控制塔", prompt: "一个任务结束后，分给它的内存应该怎样处理？", options: ["释放给其他任务", "永远占着", "变成打印纸"], answer: "释放给其他任务", explanation: "内存空间有限，任务结束后释放才能被后续任务重新使用。" },
  { id: "depths-1", islandId: "systems-network-depths", islandName: "系统与网络深海站", prompt: "CPU 完成一条指令时，正确顺序是什么？", options: ["取指、译码、执行、写回", "写回、关机、取指", "只执行不取指"], answer: "取指、译码、执行、写回", explanation: "处理器先取得指令并理解它，再执行操作并保存结果。" },
  { id: "depths-2", islandId: "systems-network-depths", islandName: "系统与网络深海站", prompt: "发送方一直没收到某个数据包的确认，可靠传输会怎么做？", options: ["超时后重传", "假装已经收到", "删除所有网络"], answer: "超时后重传", explanation: "序号、确认和超时重传共同帮助数据完整到达。" },
];

export const REVIEW_REQUIREMENTS: Record<string, string> = {
  "launch-1": "keyboard-flight", "launch-2": "program-landing",
  "files-1": "file-home", "files-2": "learning-backpack",
  "code-1": "instruction-order", "code-2": "bug-catcher",
  "safe-1": "password-guardian", "safe-2": "light-bit-island",
  "hardware-1": "input-process-output", "hardware-2": "troubleshoot-machine",
  "network-1": "network-journey", "network-2": "network-troubleshooting",
  "creative-1": "pixel-art", "creative-2": "data-table",
  "future-1": "email-message", "future-2": "digital-project",
  "spaceport-1": "events-handlers", "spaceport-2": "game-design",
  "structures-1": "stack-queue-dock", "structures-2": "graph-routes",
  "algorithms-1": "binary-search", "algorithms-2": "algorithm-efficiency",
  "os-1": "program-process", "os-2": "memory-allocation",
  "depths-1": "instruction-cycle", "depths-2": "reliable-transfer",
};

export interface ReviewState {
  index: number;
  score: number;
  completed: boolean;
  feedback: { kind: "idle" | "retry" | "correct"; message: string };
}

export function createReviewState(): ReviewState {
  return { index: 0, score: 0, completed: false, feedback: { kind: "idle", message: "选择你认为最有道理的答案。" } };
}

export function getAvailableReviewQuestions(completedCourseIds: readonly string[]): ReviewQuestion[] {
  const completed = new Set(completedCourseIds);
  return REVIEW_QUESTIONS.filter((question) => completed.has(REVIEW_REQUIREMENTS[question.id]));
}

export function answerReviewQuestion(state: ReviewState, optionIndex: number, questions: readonly ReviewQuestion[] = REVIEW_QUESTIONS, activationDetail = 1): ReviewState {
  if (state.completed || activationDetail > 1) return state;
  const question = questions[state.index];
  const selected = question?.options[optionIndex];
  if (!question || selected !== question.answer) {
    return { ...state, feedback: { kind: "retry", message: `再想一想：${question?.explanation ?? "先读清题目。"}` } };
  }
  const isLast = state.index === questions.length - 1;
  return {
    index: isLast ? state.index : state.index + 1,
    score: state.score + 1,
    completed: isLast,
    feedback: { kind: "correct", message: isLast ? "所有思考星全部点亮！" : `上一题答对了：${question.explanation} 继续读下一题。` },
  };
}
