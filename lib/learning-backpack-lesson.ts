export interface BackpackItem { id: string; name: string; folder: string; trashed: boolean; }
export interface BackpackState { items: BackpackItem[]; feedback: string; }
export type BackpackAction = { type: "move"; itemId: string; folder: string } | { type: "rename"; itemId: string; name: string } | { type: "trash" | "restore"; itemId: string };
export const INITIAL_BACKPACK_STATE: BackpackState = { items: [
  { id: "math", name: "数学练习.txt", folder: "收件箱", trashed: false },
  { id: "science", name: "植物观察.txt", folder: "收件箱", trashed: false },
  { id: "photo", name: "春游照片.png", folder: "收件箱", trashed: false },
  { id: "poem", name: "古诗朗读.mp3", folder: "收件箱", trashed: false },
  { id: "drawing", name: "海岛画.png", folder: "收件箱", trashed: false },
  { id: "duplicate", name: "数学练习-副本.txt", folder: "收件箱", trashed: false },
], feedback: "选择一个文件开始整理。" };
export function searchItems(items: readonly BackpackItem[], query: string) { const value = query.trim().toLocaleLowerCase("zh-CN"); return items.filter((item) => !item.trashed && item.name.toLocaleLowerCase("zh-CN").includes(value)); }
export function sortItems(items: readonly BackpackItem[], by: "name" | "folder") { return [...items].sort((a, b) => a[by].localeCompare(b[by], "zh-CN")); }
export function updateBackpack(state: BackpackState, action: BackpackAction): BackpackState {
  const item = state.items.find((candidate) => candidate.id === action.itemId); if (!item) return state;
  if (action.type === "rename") { const name = action.name.trim(); if (!name) return { ...state, feedback: "名称不能为空。" }; if (state.items.some((candidate) => candidate.id !== item.id && candidate.name === name)) return { ...state, feedback: "这个名称已经存在。" }; return { items: state.items.map((candidate) => candidate.id === item.id ? { ...candidate, name } : candidate), feedback: "重命名成功。" }; }
  if (action.type === "move") return { items: state.items.map((candidate) => candidate.id === item.id ? { ...candidate, folder: action.folder } : candidate), feedback: `已移动到${action.folder}。` };
  if (action.type === "trash") return { items: state.items.map((candidate) => candidate.id === item.id ? { ...candidate, trashed: true } : candidate), feedback: "已放入虚拟回收站，可以恢复。" };
  return { items: state.items.map((candidate) => candidate.id === item.id ? { ...candidate, trashed: false, folder: "收件箱" } : candidate), feedback: "已从回收站恢复。" };
}
