export type ComputerPartRole = "input" | "process" | "output" | "unknown";
const PARTS: Record<string, ComputerPartRole> = { keyboard: "input", mouse: "input", microphone: "input", camera: "input", cpu: "process", screen: "output", speaker: "output", printer: "output" };
export function classifyComputerPart(part: string): ComputerPartRole { return PARTS[part] ?? "unknown"; }
export function runInformationPipeline(event: string): string[] { const pipelines: Record<string, string[]> = { "press-A": ["键盘把按键 A 变成输入信号", "处理器判断这个信号代表字母 A", "屏幕显示字母 A"], "record-voice": ["麦克风接收声音输入", "处理器把声音转换成数字数据", "扬声器播放处理后的声音"], "click-print": ["鼠标发送单击输入", "处理器执行打印指令", "打印机输出纸面作品"] }; return pipelines[event] ? [...pipelines[event]] : []; }
