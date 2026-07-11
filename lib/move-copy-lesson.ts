export interface MovableFile { id: string; name: string; folder: string; icon: string; }
export interface MoveCopyState { files: MovableFile[]; clipboard: { mode: "copy" | "cut"; fileId: string } | null; previousFiles: MovableFile[] | null; }
export type MoveCopyAction = { type: "copy" | "cut"; fileId: string } | { type: "paste"; folder: string } | { type: "move"; fileId: string; folder: string } | { type: "undo" };
export const INITIAL_MOVE_COPY_STATE: MoveCopyState = { files: [
  { id: "worksheet", name: "数学练习.txt", folder: "收件箱", icon: "📄" },
  { id: "photo", name: "春游照片.png", folder: "收件箱", icon: "🖼️" },
  { id: "note", name: "科学笔记.txt", folder: "收件箱", icon: "📝" },
], clipboard: null, previousFiles: null };
const cloneFiles = (files: readonly MovableFile[]) => files.map((file) => ({ ...file }));

export function updateMoveCopy(state: MoveCopyState, action: MoveCopyAction): MoveCopyState {
  if (action.type === "copy" || action.type === "cut") return state.files.some((file) => file.id === action.fileId) ? { ...state, clipboard: { mode: action.type, fileId: action.fileId } } : state;
  if (action.type === "move") return state.files.some((file) => file.id === action.fileId) ? { files: state.files.map((file) => file.id === action.fileId ? { ...file, folder: action.folder } : file), clipboard: null, previousFiles: cloneFiles(state.files) } : state;
  if (action.type === "paste" && state.clipboard) {
    const source = state.files.find((file) => file.id === state.clipboard?.fileId); if (!source) return state;
    const files = state.clipboard.mode === "copy" ? [...state.files, { ...source, id: `${source.id}-copy-${state.files.length}`, folder: action.folder }] : state.files.map((file) => file.id === source.id ? { ...file, folder: action.folder } : file);
    return { files, clipboard: state.clipboard.mode === "copy" ? state.clipboard : null, previousFiles: cloneFiles(state.files) };
  }
  if (action.type === "undo" && state.previousFiles) return { files: cloneFiles(state.previousFiles), clipboard: null, previousFiles: null };
  return state;
}
