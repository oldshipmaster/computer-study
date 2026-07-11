export interface DocumentState {
  open: boolean;
  content: string;
  savedContent: string;
  saveLocation: string | null;
  closePrompt: boolean;
  dirty: boolean;
}
export type DocumentAction =
  | { type: "open" }
  | { type: "edit"; content: string }
  | { type: "save"; location: string }
  | { type: "requestClose" }
  | { type: "cancelClose" }
  | { type: "discardAndClose" }
  | { type: "saveAndClose"; location: string };

export const INITIAL_DOCUMENT_STATE: DocumentState = { open: false, content: "", savedContent: "", saveLocation: null, closePrompt: false, dirty: false };

export function updateDocument(state: DocumentState, action: DocumentAction): DocumentState {
  if (action.type === "open") return { ...state, open: true, closePrompt: false };
  if (action.type === "edit" && state.open) return { ...state, content: action.content, dirty: action.content !== state.savedContent };
  if (action.type === "save" && state.open) return { ...state, savedContent: state.content, saveLocation: action.location, dirty: false, closePrompt: false };
  if (action.type === "requestClose" && state.open) return state.dirty ? { ...state, closePrompt: true } : { ...state, open: false, closePrompt: false };
  if (action.type === "cancelClose") return { ...state, closePrompt: false };
  if (action.type === "discardAndClose") return { ...state, open: false, content: state.savedContent, dirty: false, closePrompt: false };
  if (action.type === "saveAndClose") return { ...state, open: false, savedContent: state.content, saveLocation: action.location, dirty: false, closePrompt: false };
  return state;
}
