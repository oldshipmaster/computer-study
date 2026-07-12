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
];

export interface ReviewState {
  index: number;
  score: number;
  completed: boolean;
  feedback: { kind: "idle" | "retry" | "correct"; message: string };
}

export function createReviewState(): ReviewState {
  return { index: 0, score: 0, completed: false, feedback: { kind: "idle", message: "选择你认为最有道理的答案。" } };
}

export function answerReviewQuestion(state: ReviewState, optionIndex: number): ReviewState {
  if (state.completed) return state;
  const question = REVIEW_QUESTIONS[state.index];
  const selected = question?.options[optionIndex];
  if (!question || selected !== question.answer) {
    return { ...state, feedback: { kind: "retry", message: `再想一想：${question?.explanation ?? "先读清题目。"}` } };
  }
  const isLast = state.index === REVIEW_QUESTIONS.length - 1;
  return {
    index: isLast ? state.index : state.index + 1,
    score: state.score + 1,
    completed: isLast,
    feedback: { kind: "correct", message: isLast ? "所有思考星全部点亮！" : question.explanation },
  };
}
