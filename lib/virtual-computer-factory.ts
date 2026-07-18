export type FactoryMode = "pipeline" | "memory" | "bits" | "pairing" | "diagnosis" | "system";
export type FactoryPhase = "building" | "step-solved" | "station-solved" | "complete";
export type FactoryPartState = "normal" | "active" | "done" | "offline";

export interface FactoryPart {
  id: string;
  label: string;
  role: string;
  state?: FactoryPartState;
}

export interface FactoryStep {
  prompt: string;
  parts: FactoryPart[];
  options: Array<{ id: string; label: string }>;
  answerId: string;
  explanation: string;
  evidence: string;
  wrongFeedback: string;
}

export interface FactoryStation {
  id: string;
  title: string;
  story: string;
  skill: string;
  courseId: string;
  mode: FactoryMode;
  steps: FactoryStep[];
}

export interface FactoryState {
  index: number;
  stationCount: number;
  stepIndex: number;
  solved: number;
  phase: FactoryPhase;
  evidence: string[];
  feedback: string;
}

const option = (id: string, label: string) => ({ id, label });
const part = (id: string, label: string, role: string, state: FactoryPartState = "normal"): FactoryPart => ({ id, label, role, state });

export const VIRTUAL_FACTORY_STATIONS: FactoryStation[] = [
  {
    id: "information-pipeline", title: "信息流水线", story: "比比按下字母 B，虚拟工厂要把动作变成屏幕上的结果。", skill: "输入—处理—输出", courseId: "input-process-output", mode: "pipeline",
    steps: [
      { prompt: "数据旅行的第一站是哪种部件？", parts: [part("keyboard", "键盘", "输入设备", "active"), part("cpu", "CPU", "处理部件"), part("screen", "屏幕", "输出设备")], options: [option("input", "键盘把按键送入电脑"), option("output", "屏幕先显示结果"), option("storage", "存储先保存未知结果")], answerId: "input", explanation: "按键动作先由键盘转换为输入信息。", evidence: "输入：键盘送出字母 B", wrongFeedback: "观察数据还没有进入电脑，第一站应承担输入职责。" },
      { prompt: "输入到达后，谁执行程序指令并决定结果？", parts: [part("keyboard", "键盘", "输入已完成", "done"), part("cpu", "CPU", "执行指令", "active"), part("screen", "屏幕", "等待结果")], options: [option("process", "CPU 处理输入"), option("keyboard-again", "键盘自己画出字母"), option("screen-think", "屏幕执行程序")], answerId: "process", explanation: "CPU 按软件指令处理输入，形成要输出的数据。", evidence: "处理：CPU 按指令生成字母图像", wrongFeedback: "观察各部件职责，处理需要执行程序指令的部件。" },
      { prompt: "处理完成，最后由谁把结果呈现给人？", parts: [part("keyboard", "键盘", "输入完成", "done"), part("cpu", "CPU", "处理完成", "done"), part("screen", "屏幕", "显示 B", "active")], options: [option("display", "屏幕输出字母 B"), option("cpu-only", "结果只留在 CPU"), option("input-again", "再按一次键才算输出")], answerId: "display", explanation: "屏幕把处理结果变成人能看到的输出。", evidence: "输出：屏幕显示字母 B", wrongFeedback: "数据已经处理完，观察哪个部件负责把结果呈现出来。" },
    ],
  },
  {
    id: "working-memory", title: "工作记忆站", story: "一幅火箭图正在编辑，还没有保存。区分正在工作的内存和长期存储。", skill: "CPU、内存与存储", courseId: "cpu-memory-storage", mode: "memory",
    steps: [
      { prompt: "正在编辑、尚未保存的火箭图主要放在哪里？", parts: [part("cpu", "CPU", "正在计算"), part("memory", "内存", "工作区", "active"), part("storage", "存储", "尚无保存副本")], options: [option("memory", "放在内存工作区"), option("storage", "已经自动长期保存"), option("screen", "只存在屏幕玻璃里")], answerId: "memory", explanation: "内存保存当前正在使用的数据，速度快但不是长期仓库。", evidence: "编辑中：火箭图位于内存", wrongFeedback: "观察“正在使用”和“尚未保存”两条数据状态。" },
      { prompt: "点击虚拟“保存”后，数据应该怎样流动？", parts: [part("memory", "内存", "当前火箭图", "done"), part("save", "保存指令", "复制数据", "active"), part("storage", "存储", "接收长期副本", "active")], options: [option("save-copy", "从内存复制到存储"), option("erase", "清空内存且不保存"), option("display", "只让屏幕更亮")], answerId: "save-copy", explanation: "保存会把当前作品的副本写入长期存储。", evidence: "保存：内存 → 长期存储", wrongFeedback: "观察保存的目标：让关机后仍能找到作品，需要长期存储。" },
      { prompt: "虚拟重启后，哪项描述正确？", parts: [part("memory", "内存", "工作区已清空", "offline"), part("storage", "存储", "火箭图仍在", "active"), part("cpu", "CPU", "可重新载入")], options: [option("persistent", "内存清空，已保存文件仍在存储"), option("all-gone", "所有保存内容都消失"), option("memory-keeps", "未保存内存永远保留")], answerId: "persistent", explanation: "重启会清理工作内存，但长期存储中的已保存文件仍然存在。", evidence: "重启：内存清空，存储副本保留", wrongFeedback: "观察内存和存储的不同职责：工作区与长期仓库。" },
    ],
  },
  {
    id: "bit-light-board", title: "比特灯板站", story: "四盏位值灯 8、4、2、1 只能是 0 或 1，把它们组合成目标数字 5。", skill: "比特与字节", courseId: "bits-and-data", mode: "bits",
    steps: [
      { prompt: "要组成 5，应该点亮哪两个位值？", parts: [part("8", "0", "位值 8"), part("4", "1", "位值 4", "active"), part("2", "0", "位值 2"), part("1", "1", "位值 1", "active")], options: [option("four-one", "点亮 4 和 1：0101"), option("four-two", "点亮 4 和 2：0110"), option("eight", "只点亮 8：1000")], answerId: "four-one", explanation: "4 + 1 = 5，所以对应比特是 0、1、0、1。", evidence: "0101 = 4 + 1 = 5", wrongFeedback: "观察每盏灯的位值，用点亮位值之和组成目标数字。" },
      { prompt: "如果灯板扩展为 8 个比特，这一组通常叫什么？", parts: [part("b1", "0", "第1比特"), part("b2", "1", "第2比特"), part("b3", "0", "第3比特"), part("b4", "1", "第4比特"), part("b5", "0", "第5比特"), part("b6", "0", "第6比特"), part("b7", "1", "第7比特"), part("b8", "1", "第8比特", "active")], options: [option("byte", "1 字节"), option("pixel", "1 像素"), option("folder", "1 文件夹")], answerId: "byte", explanation: "连续 8 个比特组成 1 个字节，可以表示 256 种组合。", evidence: "8 比特 = 1 字节", wrongFeedback: "观察灯板中比特的数量，回忆八个一组的名称。" },
    ],
  },
  {
    id: "hardware-software-pair", title: "软硬件搭档站", story: "虚拟装配线要完成一幅画，既需要能触摸的部件，也需要程序指令。", skill: "硬件与软件", courseId: "hardware-software", mode: "pairing",
    steps: [
      { prompt: "哪组搭档能让孩子画图并看见结果？", parts: [part("mouse", "鼠标", "硬件输入", "active"), part("paint", "画图程序", "软件指令", "active"), part("screen", "屏幕", "硬件输出", "active")], options: [option("full-pair", "鼠标 + 画图程序 + 屏幕"), option("hardware-only", "只有鼠标和屏幕"), option("software-only", "只有画图程序")], answerId: "full-pair", explanation: "硬件负责输入输出，软件提供画图规则，两者缺一不可。", evidence: "画图系统 = 输入硬件 + 软件 + 输出硬件", wrongFeedback: "观察任务需要操作、规则和可见结果，软硬件职责要配齐。" },
      { prompt: "谁负责让画图程序使用鼠标和屏幕？", parts: [part("app", "画图程序", "提出请求"), part("os", "操作系统", "协调部件", "active"), part("hardware", "鼠标与屏幕", "执行输入输出")], options: [option("os-route", "操作系统协调程序与硬件"), option("mouse-route", "鼠标管理所有程序"), option("screen-route", "屏幕分配内存")], answerId: "os-route", explanation: "操作系统在软件请求与硬件能力之间协调资源。", evidence: "画图程序 → 操作系统 → 鼠标/屏幕", wrongFeedback: "观察哪个系统角色负责协调程序请求与物理部件。" },
    ],
  },
  {
    id: "safe-diagnosis", title: "安全诊断站", story: "虚构电脑没有声音。只检查屏幕上简单、可逆的原因，一次改变一项再复测。", skill: "安全排错", courseId: "troubleshoot-machine", mode: "diagnosis",
    steps: [
      { prompt: "第一项最简单安全的检查是什么？", parts: [part("mute", "静音图标", "当前开启", "active"), part("volume", "音量 40%", "有音量"), part("speaker", "扬声器", "虚拟状态正常")], options: [option("unmute", "关闭静音并播放测试音"), option("change-many", "同时改变所有设置"), option("ignore", "反复点播放不观察")], answerId: "unmute", explanation: "先检查明显的静音状态，只改变一处，再播放测试音观察结果。", evidence: "观察静音 → 关闭静音 → 复测", wrongFeedback: "安全排错先观察明显、简单、可逆的原因，并且一次只改一处。" },
      { prompt: "如果出现电源或设备内部的异常提示，孩子应该怎么做？", parts: [part("warning", "内部异常", "停止操作", "active"), part("adult", "可信大人", "负责后续处理", "active"), part("test", "屏幕测试", "不再继续", "offline")], options: [option("tell-adult", "停止操作并告诉可信大人"), option("keep-testing", "继续反复测试"), option("press-random", "随机按更多按钮")], answerId: "tell-adult", explanation: "涉及电源或设备内部时，孩子停止操作，把后续检查交给大人。", evidence: "内部或电源异常：停止并求助大人", wrongFeedback: "这已经超出简单屏幕设置检查，安全做法是停止并告诉大人。" },
    ],
  },
  {
    id: "whole-machine-journey", title: "整机数据旅行", story: "把画一颗星并保存的全过程串成一条完整机器证据链。", skill: "计算机组成综合", courseId: "troubleshoot-machine", mode: "system",
    steps: [
      { prompt: "孩子移动鼠标画星星，第一段数据流是什么？", parts: [part("mouse", "鼠标", "输入动作", "active"), part("app", "画图程序", "解释动作"), part("cpu", "CPU", "执行指令")], options: [option("input-chain", "鼠标输入 → 程序/CPU 处理"), option("storage-first", "存储先猜出星星"), option("screen-input", "屏幕把动作送给鼠标")], answerId: "input-chain", explanation: "鼠标提供输入，程序规则由 CPU 执行处理。", evidence: "鼠标输入 → 软件规则 → CPU 处理", wrongFeedback: "观察动作从哪里产生，以及谁负责执行软件指令。" },
      { prompt: "星星正在编辑并显示时，内存和屏幕分别做什么？", parts: [part("memory", "内存", "保存当前工作", "active"), part("screen", "屏幕", "输出画面", "active"), part("storage", "存储", "等待保存")], options: [option("work-display", "内存放当前数据，屏幕显示结果"), option("screen-save", "屏幕长期保存文件"), option("memory-output", "内存直接发光显示")], answerId: "work-display", explanation: "内存保留当前工作数据，屏幕负责把结果呈现给人。", evidence: "内存暂放当前星星 + 屏幕输出画面", wrongFeedback: "观察工作区和输出设备的不同职责。" },
      { prompt: "点击保存后，完整旅行怎样收尾？", parts: [part("memory", "内存", "当前作品", "done"), part("storage", "存储", "长期副本", "active"), part("screen", "屏幕", "显示保存完成", "active")], options: [option("save-finish", "写入存储，并在屏幕确认"), option("erase", "删除内存且不写入"), option("cpu-store", "让 CPU 永远记住文件")], answerId: "save-finish", explanation: "保存把作品写入长期存储，屏幕输出完成状态。", evidence: "保存：内存 → 存储；屏幕输出确认", wrongFeedback: "观察要让重启后仍能找到作品，数据必须到达长期存储。" },
    ],
  },
];

export function buildFactoryDeck(rotation: number): FactoryStation[] {
  const safeRotation = Number.isFinite(rotation) ? Math.max(0, Math.floor(rotation)) : 0;
  const offset = VIRTUAL_FACTORY_STATIONS.length === 0 ? 0 : safeRotation % VIRTUAL_FACTORY_STATIONS.length;
  return [...VIRTUAL_FACTORY_STATIONS.slice(offset), ...VIRTUAL_FACTORY_STATIONS.slice(0, offset)];
}

export function createFactoryState(stationCount: number): FactoryState {
  const safeCount = Number.isFinite(stationCount) ? Math.max(0, Math.floor(stationCount)) : 0;
  return { index: 0, stationCount: safeCount, stepIndex: 0, solved: 0, phase: safeCount === 0 ? "complete" : "building", evidence: [], feedback: "观察部件职责和数据流，再选择下一步。" };
}

export function chooseFactoryAction(state: FactoryState, station: FactoryStation, actionId: string, activationDetail = 1): FactoryState {
  if (activationDetail > 1 || state.phase !== "building") return state;
  const step = station.steps[state.stepIndex];
  if (!step || !step.options.some((candidate) => candidate.id === actionId)) return state;
  if (actionId !== step.answerId) return { ...state, feedback: step.wrongFeedback };
  return { ...state, phase: state.stepIndex === station.steps.length - 1 ? "station-solved" : "step-solved", evidence: [...state.evidence, step.evidence], feedback: step.explanation };
}

export function advanceFactoryStep(state: FactoryState, station: FactoryStation, activationDetail = 1): FactoryState {
  if (activationDetail > 1 || state.phase !== "step-solved" || state.stepIndex >= station.steps.length - 1) return state;
  return { ...state, stepIndex: state.stepIndex + 1, phase: "building", feedback: "检测结果已记录，继续装配下一段。" };
}

export function advanceFactoryStation(state: FactoryState, activationDetail = 1): FactoryState {
  if (activationDetail > 1 || state.phase !== "station-solved") return state;
  const solved = Math.min(state.stationCount, state.solved + 1);
  if (state.index >= state.stationCount - 1) return { ...state, solved, phase: "complete", feedback: "六个虚拟工位全部检测通过。" };
  return { ...state, index: state.index + 1, stepIndex: 0, solved, phase: "building", evidence: [], feedback: "新工位已启动，先观察虚拟部件。" };
}
