export type SystemItemType = "hardware" | "software" | "unknown";
const HARDWARE = ["mouse", "screen", "keyboard", "printer", "speaker", "microphone"];
const SOFTWARE = ["paint-app", "music-app", "print-app", "operating-system"];
const REQUIREMENTS: Record<string, string[]> = { draw: ["mouse", "screen", "paint-app"], print: ["printer", "print-app"], record: ["microphone", "music-app"] };
export function classifySystemItem(item: string): SystemItemType { return HARDWARE.includes(item) ? "hardware" : SOFTWARE.includes(item) ? "software" : "unknown"; }
export function canCompleteTask(task: string, selectedItems: readonly string[]): boolean { const needed = REQUIREMENTS[task]; return Boolean(needed?.every((item) => selectedItems.includes(item))); }
