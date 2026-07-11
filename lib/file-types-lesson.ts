export type FileCategory = "image" | "text" | "audio" | "unknown";
export interface FileSortState { sorted: Record<string, FileCategory>; wrongAttempts: number; }
export const INITIAL_SORT_STATE: FileSortState = { sorted: {}, wrongAttempts: 0 };
export function classifyFile(name: string): FileCategory {
  const extension = name.toLowerCase().split(".").pop() ?? "";
  if (["png", "jpg", "jpeg", "gif"].includes(extension)) return "image";
  if (["txt", "md", "docx"].includes(extension)) return "text";
  if (["mp3", "wav", "m4a"].includes(extension)) return "audio";
  return "unknown";
}
export function sortFile(state: FileSortState, name: string, category: FileCategory): FileSortState {
  if (state.sorted[name]) return state;
  if (classifyFile(name) !== category) return { ...state, wrongAttempts: state.wrongAttempts + 1 };
  return { ...state, sorted: { ...state.sorted, [name]: category } };
}
