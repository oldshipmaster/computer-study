export interface VirtualEntry { name: string; kind: "folder" | "file"; icon: string; }
const TREE: Record<string, VirtualEntry[]> = {
  "": [
    { name: "学习资料", kind: "folder", icon: "📁" },
    { name: "我的作品", kind: "folder", icon: "📁" },
    { name: "欢迎卡.txt", kind: "file", icon: "📄" },
  ],
  "学习资料": [
    { name: "科学", kind: "folder", icon: "📁" },
    { name: "语文", kind: "folder", icon: "📁" },
    { name: "课程表.txt", kind: "file", icon: "📄" },
  ],
  "学习资料/科学": [
    { name: "太阳系.png", kind: "file", icon: "🖼️" },
    { name: "观察记录.txt", kind: "file", icon: "📄" },
  ],
  "学习资料/语文": [{ name: "古诗.txt", kind: "file", icon: "📄" }],
  "我的作品": [{ name: "小岛画.png", kind: "file", icon: "🖼️" }],
};

export interface FileHomeState { path: string[]; address: string; selectedName: string | null; openedFile: string | null; }
export type FileHomeAction =
  | { type: "select"; name: string }
  | { type: "openFolder"; name: string }
  | { type: "openFile"; name: string }
  | { type: "goBack" }
  | { type: "goRoot" };
export const INITIAL_FILE_HOME_STATE: FileHomeState = { path: [], address: "比特岛", selectedName: null, openedFile: null };

export function getVisibleEntries(path: readonly string[]): VirtualEntry[] { return TREE[path.join("/")] ?? []; }
function withPath(path: string[]): FileHomeState { return { path, address: ["比特岛", ...path].join("/"), selectedName: null, openedFile: null }; }

export function updateFileHome(state: FileHomeState, action: FileHomeAction): FileHomeState {
  if (action.type === "goRoot") return withPath([]);
  if (action.type === "goBack") return withPath(state.path.slice(0, -1));
  const entry = getVisibleEntries(state.path).find((item) => item.name === action.name);
  if (action.type === "select") return entry ? { ...state, selectedName: entry.name } : state;
  if (action.type === "openFolder") return entry?.kind === "folder" ? withPath([...state.path, entry.name]) : state;
  if (action.type === "openFile") return entry?.kind === "file" ? { ...state, selectedName: entry.name, openedFile: entry.name } : state;
  return state;
}
