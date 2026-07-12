export type SystemItemType = "hardware" | "software" | "unknown";
const HARDWARE = ["mouse", "screen", "keyboard", "printer", "speaker", "microphone"];
const SOFTWARE = ["paint-app", "music-app", "print-app", "operating-system"];
const REQUIREMENTS: Record<string, string[]> = { draw: ["mouse", "screen", "paint-app"], print: ["printer", "print-app"], record: ["microphone", "music-app"] };
export function classifySystemItem(item: string): SystemItemType { return HARDWARE.includes(item) ? "hardware" : SOFTWARE.includes(item) ? "software" : "unknown"; }
export function canCompleteTask(task: string, selectedItems: readonly string[]): boolean { const needed = REQUIREMENTS[task]; return Boolean(needed?.every((item) => selectedItems.includes(item))); }

export interface SystemSignalStop { kind: "app" | "os" | "hardware" | "output"; label: string; }
const SIGNAL_ROUTES: Record<string, SystemSignalStop[]> = {
  draw: [{ kind: "app", label: "画图程序发出请求" }, { kind: "os", label: "操作系统协调资源" }, { kind: "hardware", label: "鼠标与屏幕执行动作" }, { kind: "output", label: "屏幕出现图画" }],
  print: [{ kind: "app", label: "打印程序发出请求" }, { kind: "os", label: "操作系统协调资源" }, { kind: "hardware", label: "打印机执行动作" }, { kind: "output", label: "纸上出现作品" }],
  record: [{ kind: "app", label: "录音程序发出请求" }, { kind: "os", label: "操作系统协调资源" }, { kind: "hardware", label: "麦克风采集声音" }, { kind: "output", label: "生成声音记录" }],
};
export function getSystemSignalRoute(task: string): SystemSignalStop[] { return SIGNAL_ROUTES[task]?.map((stop) => ({ ...stop })) ?? []; }
