export interface FutureCard { id: string; prompt: string; options: [string, string, string]; answer: string; explanation: string; }
export interface FutureMission { courseId: string; courseName: string; badgeId: string; symbol: string; stages: [string, string, string, string, string, string]; messages: [string, string, string, string, string, string]; cards: [FutureCard, FutureCard, FutureCard, FutureCard]; }
const card = (id: string, prompt: string, options: [string, string, string], answer: string, explanation: string): FutureCard => ({ id, prompt, options, answer, explanation });

export const FUTURE_MISSIONS: Record<string, FutureMission> = {
  "email-message": {
    courseId: "email-message", courseName: "电子邮件通信", badgeId: "email-captain", symbol: "收件人 → 主题 → 正文 → 检查附件 → 发送",
    stages: ["邮件像数字信封", "收件人与主题", "礼貌清楚的正文", "附件先检查", "发送前停一停", "邮件判断挑战"],
    messages: ["电子邮件把消息从一个账号送到另一个账号。", "完整核对收件人，用简短主题说明邮件目的。", "称呼、重点、需要的行动和署名让正文更清楚。", "附件可能含隐私或风险；确认文件、来源和是否真的需要。", "真实发送前检查收件人、正文、附件与隐私，并请大人帮助使用账号。", "判断四封虚拟邮件怎样处理更合适。"],
    cards: [card("e1", "给老师交作业，哪个主题最清楚？", ["二年级科学观察作业", "你好", "快看！！！"], "二年级科学观察作业", "主题应让收件人一眼知道邮件目的。"), card("e2", "陌生邮件的附件写着“立刻打开领奖”，应该？", ["不打开并告诉大人", "立刻运行", "转发所有同学"], "不打开并告诉大人", "意外附件和催促语是风险线索。"), card("e3", "发送前发现收件人名字相似，应该？", ["停下并完整核对地址", "猜一个发送", "把隐私写进正文"], "停下并完整核对地址", "发错对象可能泄露内容，真实发送要由家长或老师协助确认。"), card("e4", "正文里最有帮助的是？", ["清楚说明事情和需要的行动", "只写一串表情", "写真实密码"], "清楚说明事情和需要的行动", "清楚、礼貌、必要的信息足以完成沟通。")],
  },
  "online-collaboration": {
    courseId: "online-collaboration", courseName: "在线协作实验室", badgeId: "collaboration-builder", symbol: "共同目标 + 分工 + 评论 + 版本记录",
    stages: ["一起完成作品", "先约定分工", "评论针对作品", "版本记录能回看", "共享最小权限", "协作选择挑战"],
    messages: ["协作工具让多人对同一份作品贡献想法。", "先约定目标、任务和时间，减少互相覆盖。", "评论要具体、友善，并说明可以怎样改进。", "版本历史记录谁在什么时候改变了什么，可帮助恢复。", "只邀请需要的人并给够用的权限；真实共享由大人帮助。", "解决四个虚拟小组协作问题。"],
    cards: [card("o1", "两人同时改同一段并互相覆盖，先做什么？", ["约定分工区域", "互相删除作品", "公开链接"], "约定分工区域", "清楚分工能减少冲突。"), card("o2", "哪条评论最有帮助？", ["标题可以更具体，比如写出实验名称", "不好", "全删了"], "标题可以更具体，比如写出实验名称", "好反馈描述具体位置、原因和可行动建议。"), card("o3", "误删一段共同作品，可以先看？", ["版本历史", "陌生广告", "真实密码"], "版本历史", "版本历史让团队比较并恢复较早状态。"), card("o4", "只需要同学查看成品，应给？", ["查看权限", "管理全部账号权限", "公开给所有人编辑"], "查看权限", "最小权限原则只提供完成任务所需的能力。")],
  },
  "ai-helper": {
    courseId: "ai-helper", courseName: "AI 助手使用入门", badgeId: "ai-prompt-guide", symbol: "目标 + 背景 + 要求 + 示例 → AI 草稿",
    stages: ["AI 根据模式生成", "说清任务目标", "提供必要背景", "不输入隐私", "人来判断和修改", "提示设计挑战"],
    messages: ["生成式 AI 根据学过的模式产生回答，不是真正理解一切的人。", "清楚说明要完成什么、给谁看、希望什么格式。", "提供与任务有关的背景和例子，避免无关信息。", "不输入姓名、学校、住址、密码、私人照片或未获许可的作品。", "AI 输出是草稿；人要核对、选择、修改并对结果负责。", "为四个虚拟学习任务选择更好的 AI 使用方式。"],
    cards: [card("a1", "哪个提示更清楚？", ["用三句话向二年级学生解释循环，并举生活例子", "写点东西", "你随便"], "用三句话向二年级学生解释循环，并举生活例子", "目标、对象、长度和示例要求让任务更明确。"), card("a2", "AI 要求上传学生证照片才能答题，应该？", ["不上传并告诉大人", "立即上传", "再加家庭地址"], "不上传并告诉大人", "完成普通学习任务不需要高风险个人信息。"), card("a3", "AI 给出一段作业答案，应该？", ["理解、核对并用自己的话表达", "直接署自己的名", "不读就提交"], "理解、核对并用自己的话表达", "AI 可帮助思考，但学习者要理解并对作品负责。"), card("a4", "AI 回答听起来很肯定，意味着？", ["仍可能出错，需要核对", "一定正确", "等于老师已确认"], "仍可能出错，需要核对", "流畅语气不是正确证据。")],
  },
  "verify-ai": {
    courseId: "verify-ai", courseName: "AI 信息核验站", badgeId: "ai-fact-checker", symbol: "拆成主张 → 找来源 → 交叉核对 → 标出不确定",
    stages: ["回答可能编错", "找出可核对主张", "优先可靠来源", "至少交叉核对", "说明不确定性", "事实核验挑战"],
    messages: ["AI 可能把真实信息和看似合理的错误混在一起。", "把回答拆成日期、数字、人物和因果等可检查主张。", "重要信息优先查老师、教材、机构官网或原始资料。", "用两个独立可靠来源比较，不只搜索相同句子。", "查不到时要说还不确定，不能把猜测当事实。", "为四条虚构 AI 回答选择核验方法。"],
    cards: [card("v1", "AI 说某动物寿命是“准确的137年”，先做什么？", ["查可靠动物资料并比较来源", "因为数字具体就相信", "转发"], "查可靠动物资料并比较来源", "具体数字是可以核对的主张，具体不等于正确。"), card("v2", "哪个来源更适合核对天气预警？", ["官方气象机构", "无作者的玩笑截图", "游戏聊天"], "官方气象机构", "预警涉及安全，应优先使用负责发布信息的权威机构。"), card("v3", "两个可靠来源给出不同年份，应该？", ["说明差异并继续查原始资料", "挑喜欢的", "删掉年份假装一致"], "说明差异并继续查原始资料", "冲突是继续调查的线索，也要诚实表达不确定。"), card("v4", "完全找不到证据支持 AI 的说法，应该写？", ["目前无法确认", "绝对正确", "大家都知道"], "目前无法确认", "证据不足时明确不确定，比猜测更负责任。")],
  },
  "digital-project": {
    courseId: "digital-project", courseName: "数字项目总挑战", badgeId: "digital-project-leader", symbol: "问题 → 计划 → 创作 → 测试 → 分享 → 反思",
    stages: ["从真实问题出发", "拆成小任务", "选择合适工具", "测试并修正", "安全负责地分享", "项目领队挑战"],
    messages: ["好项目先回答一个清楚、适合自己的问题。", "把大目标拆成可完成的小任务，并安排先后顺序。", "根据内容选择文档、表格、图片、演示或程序。", "请同伴试用，记录证据，一次修改一处再测试。", "分享前检查隐私、版权、收件人、权限和作品说明。", "带领虚拟小队完成四个最终项目决定。"],
    cards: [card("g1", "要调查一周阅读时间，第一步最好？", ["写清问题和要记录的数据", "先做彩色封面", "收集密码"], "写清问题和要记录的数据", "问题决定需要的数据和合适工具。"), card("g2", "项目太大做不完，应该？", ["拆成小任务并排序", "同时乱做", "放弃所有记录"], "拆成小任务并排序", "任务分解让进度可见，也方便调整。"), card("g3", "同伴说按钮找不到，最好的反应？", ["记录证据、改一处并再请他测试", "说他不会用", "一次重做全部"], "记录证据、改一处并再请他测试", "可观察反馈支持小步改进和复测。"), card("g4", "公开作品前最终检查？", ["隐私、版权、对象和权限", "只看颜色", "加入真实住址"], "隐私、版权、对象和权限", "负责任的数字作品同时考虑内容质量和安全分享。")],
  },
};

export interface FutureState { index: number; solved: number; completed: boolean; feedback: { kind: "idle" | "retry" | "correct"; message: string }; }
export const createFutureState = (): FutureState => ({ index: 0, solved: 0, completed: false, feedback: { kind: "idle", message: "读完情境，再选择最负责任的行动。" } });
export function answerFutureCard(mission: FutureMission, state: FutureState, optionIndex: number, activationDetail = 1): FutureState {
  if (state.completed || activationDetail > 1) return state;
  const current = mission.cards[state.index];
  if (!current || current.options[optionIndex] !== current.answer) return { ...state, feedback: { kind: "retry", message: `先别急：${current?.explanation ?? "重新读题。"}` } };
  const completed = state.index === mission.cards.length - 1;
  return { index: completed ? state.index : state.index + 1, solved: state.solved + 1, completed, feedback: { kind: "correct", message: completed ? "四项未来任务全部完成！" : current.explanation } };
}
