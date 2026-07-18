export type SafetyCaseMode = "privacy" | "password" | "popup" | "health" | "shared" | "response";
export type SafetyPhase = "investigating" | "step-solved" | "case-solved" | "complete";
export type ClueLevel = "safe" | "warning" | "risk";

export interface SafetyClue {
  id: string;
  label: string;
  detail: string;
  level: ClueLevel;
}

export interface SafetyStep {
  prompt: string;
  clues: SafetyClue[];
  options: Array<{ id: string; label: string }>;
  answerId: string;
  explanation: string;
  evidence: string;
  wrongFeedback: string;
}

export interface SafetyCaseFile {
  id: string;
  title: string;
  story: string;
  skill: string;
  courseId: string;
  mode: SafetyCaseMode;
  steps: SafetyStep[];
}

export interface SafetyDetectiveState {
  index: number;
  caseCount: number;
  stepIndex: number;
  solved: number;
  phase: SafetyPhase;
  evidence: string[];
  feedback: string;
}

const option = (id: string, label: string) => ({ id, label });
const clue = (id: string, label: string, detail: string, level: ClueLevel): SafetyClue => ({ id, label, detail, level });

export const SAFETY_DETECTIVE_CASES: SafetyCaseFile[] = [
  {
    id: "privacy-parcel", title: "隐私包裹案", story: "虚构角色小洛准备在作品广场介绍自己的火箭图。先检查哪些信息不该装进公开包裹。", skill: "保护个人信息", courseId: "private-information", mode: "privacy",
    steps: [
      { prompt: "三张资料卡里，哪张应该留在私人抽屉？", clues: [clue("nickname", "星河猫", "作品昵称", "safe"), clue("address", "8 栋 203", "住处门牌", "risk"), clue("hobby", "喜欢画火箭", "兴趣", "safe")], options: [option("keep-address", "不发送住处门牌"), option("send-all", "三张全部公开"), option("hide-hobby", "只隐藏兴趣")], answerId: "keep-address", explanation: "住处门牌能指向现实位置，应该保密；兴趣和不含身份的作品昵称风险更低。", evidence: "门牌属于可定位信息，不公开", wrongFeedback: "先停一下，观察哪张线索能让陌生人找到现实中的位置。" },
      { prompt: "怎样安全地介绍这幅作品？", clues: [clue("art", "火箭图", "非个人作品", "safe"), clue("school", "彩虹小学二年级", "学校与年级", "risk"), clue("interest", "我喜欢太空", "一般兴趣", "safe")], options: [option("share-interest", "只说喜欢太空并展示作品"), option("share-school", "同时说学校和年级"), option("share-door", "再补上门牌方便联系")], answerId: "share-interest", explanation: "分享作品和一般兴趣即可，不需要附上学校、年级或住处。", evidence: "最少分享：作品 + 一般兴趣", wrongFeedback: "公开介绍不需要学校或住处，观察哪些信息与作品本身无关。" },
    ],
  },
  {
    id: "password-vault", title: "口令保险箱案", story: "三个候选口令都只是课堂道具，不会保存。侦探要找出更长、更独特的方案。", skill: "长且独特的口令", courseId: "password-guardian", mode: "password",
    steps: [
      { prompt: "哪枚虚构口令钥匙更难被猜到？", clues: [clue("short", "cat123", "短且常见", "risk"), clue("long", "蓝鲸-火箭-松果-27", "较长的随机词组", "safe"), clue("name", "星河猫2026", "包含公开昵称", "warning")], options: [option("choose-long", "选择长随机词组"), option("choose-short", "选择 cat123"), option("choose-name", "选择公开昵称组合")], answerId: "choose-long", explanation: "较长、由不相关词组成的口令通常更难猜，也不依赖公开昵称。", evidence: "选择更长且不含公开身份线索的口令", wrongFeedback: "观察长度、常见程度和是否包含已经公开的昵称。" },
      { prompt: "朋友说‘把口令发给我，我帮你领奖’，怎样处理？", clues: [clue("request", "索要口令", "任何人都不该索要", "risk"), clue("prize", "立即领奖", "催促行动", "warning"), clue("adult", "可信大人", "可请求帮助", "safe")], options: [option("refuse-tell", "不分享，并告诉可信大人"), option("send-once", "只发一次"), option("trade", "交换彼此口令")], answerId: "refuse-tell", explanation: "口令不能与朋友交换；遇到催促或领奖理由，要停止并找可信大人。", evidence: "口令不共享，异常请求交给可信大人", wrongFeedback: "任何理由都不能让共享口令变安全，先停止并请求大人帮助。" },
    ],
  },
  {
    id: "popup-fog-case", title: "弹窗迷雾案", story: "一张虚构弹窗突然挡住画布，声称‘中了大奖，马上下载领奖’。", skill: "识别可疑弹窗", courseId: "popup-fog", mode: "popup",
    steps: [
      { prompt: "看到弹窗的第一步是什么？", clues: [clue("prize", "你中了大奖", "没有参加活动", "risk"), clue("urgent", "只剩 10 秒", "制造紧迫感", "risk"), clue("download", "立即下载", "要求安装未知内容", "risk")], options: [option("stop-close", "不点内容，关闭弹窗或页面"), option("download", "立即下载"), option("enter", "继续看看要什么资料")], answerId: "stop-close", explanation: "陌生弹窗同时使用中奖、倒计时和下载催促，应该停止互动并关闭。", evidence: "三项风险同时出现：中奖 + 催促 + 下载", wrongFeedback: "风险还没有确认，不能继续点；先停止操作并观察三条红色线索。" },
      { prompt: "弹窗关闭后，下一步怎样做？", clues: [clue("closed", "页面已关闭", "风险互动停止", "safe"), clue("memory", "还记得弹窗内容", "可向大人说明", "warning"), clue("adult", "可信大人在附近", "可以求助", "safe")], options: [option("tell-adult", "告诉可信大人刚才发生了什么"), option("reopen", "重新打开再试一次"), option("hide", "什么都不说")], answerId: "tell-adult", explanation: "孩子不需要独自判断或排查，向可信大人说明可见线索更安全。", evidence: "关闭后报告可见线索，不重新尝试", wrongFeedback: "风险弹窗不该由孩子独自处理，也不能重新尝试；告诉可信大人。" },
    ],
  },
  {
    id: "healthy-watch", title: "健康值守案", story: "比比准备完成一节十分钟小课，侦探要先把身体安全也加入任务清单。", skill: "健康使用电脑", courseId: "healthy-computer-habits", mode: "health",
    steps: [
      { prompt: "哪套开始姿势更合适？", clues: [clue("distance", "屏幕约一臂远", "眼睛不贴近", "safe"), clue("feet", "双脚有支撑", "坐姿稳定", "safe"), clue("dark", "黑暗房间贴近屏幕", "眼睛负担大", "risk")], options: [option("supported", "一臂距离、坐稳、双脚有支撑"), option("close", "脸贴近屏幕"), option("bed", "趴着持续操作")], answerId: "supported", explanation: "合适距离与稳定坐姿能减少眼睛、脖子和手腕负担。", evidence: "开始前：一臂距离 + 稳定坐姿", wrongFeedback: "观察身体是否有支撑、眼睛是否离屏幕太近。" },
      { prompt: "十分钟到了，或者眼睛已经不舒服，怎样做？", clues: [clue("timer", "10 分钟", "本节课边界", "warning"), clue("eyes", "眼睛发酸", "身体发出停止信号", "risk"), clue("break", "看远处并离开屏幕", "恢复方式", "safe")], options: [option("take-break", "立即停下，离屏休息并告诉大人不舒服"), option("finish-more", "再玩二十分钟"), option("ignore", "揉眼睛继续")], answerId: "take-break", explanation: "时间到要离屏休息；身体不舒服时更应立即停止并告诉大人。", evidence: "十分钟离屏休息，不舒服立即停止", wrongFeedback: "身体信号不能忽略，停止操作并让可信大人知道。" },
    ],
  },
  {
    id: "shared-device", title: "共享设备收尾案", story: "小洛在一台虚构的家庭共享电脑上完成了不含个人信息的像素画。", skill: "共享设备收尾", courseId: "light-bit-island", mode: "shared",
    steps: [
      { prompt: "作品完成后，先做哪项安全收尾？", clues: [clue("project", "像素火箭.png", "非敏感作品", "safe"), clue("account", "虚构作品账号仍登录", "需要退出", "warning"), clue("remember", "记住口令", "共享设备不合适", "risk")], options: [option("save-logout", "保存作品后退出虚构账号"), option("leave-open", "保持登录直接离开"), option("remember", "让共享电脑记住口令")], answerId: "save-logout", explanation: "保存自己的作品后退出账号，避免下一位使用者进入同一会话。", evidence: "保存非敏感作品 → 退出账号", wrongFeedback: "观察这是不是共享设备，以及虚构账号是否仍保持登录。" },
      { prompt: "离开电脑前再检查什么？", clues: [clue("logout", "账号已退出", "会话结束", "safe"), clue("password", "没有保存口令", "共享设备更安全", "safe"), clue("popup", "浏览器询问是否记住", "应选择不记住", "warning")], options: [option("decline-check", "选择不记住，并确认账号已退出"), option("accept", "让浏览器记住"), option("share", "把口令写在屏幕旁")], answerId: "decline-check", explanation: "共享设备上不保存口令，最后确认退出状态再离开。", evidence: "不记住口令 + 确认退出", wrongFeedback: "共享设备会被别人继续使用，不能留下可直接进入账号的线索。" },
    ],
  },
  {
    id: "lighthouse-response", title: "灯塔总案", story: "虚构作品站突然弹出索要住处和口令的提示。侦探要排列安全响应。", skill: "停止并求助", courseId: "light-bit-island", mode: "response",
    steps: [
      { prompt: "风险刚出现，第一行动是什么？", clues: [clue("private", "索要住处", "个人信息风险", "risk"), clue("password", "索要口令", "账号风险", "risk"), clue("urgent", "立即提交", "催促风险", "risk")], options: [option("stop", "停止点击，不填写也不下载"), option("submit", "先提交看看"), option("guess", "随便填一份")], answerId: "stop", explanation: "风险未确认前不继续互动；停止能防止更多信息或文件被交出去。", evidence: "第一步：停止操作，不提交任何内容", wrongFeedback: "多个风险同时出现时不能试一试，先停止所有互动。" },
      { prompt: "停止之后，怎样完成安全响应？", clues: [clue("visible", "提示仍可描述", "只说明看见的内容", "warning"), clue("adult", "可信大人", "负责后续判断", "safe"), clue("retry", "重新尝试", "会再次接触风险", "risk")], options: [option("report", "把可见线索告诉可信大人，不再重试"), option("retry", "换个按钮继续试"), option("solve-alone", "自己寻找绕过方法")], answerId: "report", explanation: "孩子只需说明看见的线索，把后续判断交给可信大人。", evidence: "第二步：报告可见线索，不重试、不独自处理", wrongFeedback: "风险处置不需要孩子独自完成；保留可见信息并告诉可信大人。" },
    ],
  },
];

export function buildSafetyCaseDeck(rotation: number): SafetyCaseFile[] {
  const safeRotation = Number.isFinite(rotation) ? Math.max(0, Math.floor(rotation)) : 0;
  const offset = SAFETY_DETECTIVE_CASES.length === 0 ? 0 : safeRotation % SAFETY_DETECTIVE_CASES.length;
  return [...SAFETY_DETECTIVE_CASES.slice(offset), ...SAFETY_DETECTIVE_CASES.slice(0, offset)];
}

export function createSafetyDetectiveState(caseCount: number): SafetyDetectiveState {
  const safeCount = Number.isFinite(caseCount) ? Math.max(0, Math.floor(caseCount)) : 0;
  return { index: 0, caseCount: safeCount, stepIndex: 0, solved: 0, phase: safeCount === 0 ? "complete" : "investigating", evidence: [], feedback: "先停一下，观察所有线索再行动。" };
}

export function chooseSafetyAction(state: SafetyDetectiveState, caseFile: SafetyCaseFile, actionId: string, activationDetail = 1): SafetyDetectiveState {
  if (activationDetail > 1 || state.phase !== "investigating") return state;
  const step = caseFile.steps[state.stepIndex];
  if (!step || !step.options.some((candidate) => candidate.id === actionId)) return state;
  if (actionId !== step.answerId) return { ...state, feedback: step.wrongFeedback };
  return { ...state, phase: state.stepIndex === caseFile.steps.length - 1 ? "case-solved" : "step-solved", evidence: [...state.evidence, step.evidence], feedback: step.explanation };
}

export function advanceSafetyStep(state: SafetyDetectiveState, caseFile: SafetyCaseFile, activationDetail = 1): SafetyDetectiveState {
  if (activationDetail > 1 || state.phase !== "step-solved" || state.stepIndex >= caseFile.steps.length - 1) return state;
  return { ...state, stepIndex: state.stepIndex + 1, phase: "investigating", feedback: "证据已收好，继续检查下一组线索。" };
}

export function advanceSafetyCase(state: SafetyDetectiveState, activationDetail = 1): SafetyDetectiveState {
  if (activationDetail > 1 || state.phase !== "case-solved") return state;
  const solved = Math.min(state.caseCount, state.solved + 1);
  if (state.index >= state.caseCount - 1) return { ...state, solved, phase: "complete", feedback: "六件安全案件全部完成。" };
  return { ...state, index: state.index + 1, stepIndex: 0, solved, phase: "investigating", evidence: [], feedback: "新案件已打开，先停一下观察线索。" };
}
