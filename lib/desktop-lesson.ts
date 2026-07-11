export type DesktopAppId = "notes" | "paint";
export interface DesktopState {
  selectedIcon: DesktopAppId | null;
  openWindows: DesktopAppId[];
  focusedWindow: DesktopAppId | null;
  minimizedWindows: DesktopAppId[];
}
export type DesktopAction =
  | { type: "selectIcon" | "openWindow" | "focusWindow" | "minimizeWindow" | "restoreWindow" | "closeWindow"; appId: DesktopAppId };

export const INITIAL_DESKTOP_STATE: DesktopState = {
  selectedIcon: null,
  openWindows: [],
  focusedWindow: null,
  minimizedWindows: [],
};

const appendUnique = <T,>(items: readonly T[], value: T): T[] =>
  items.includes(value) ? [...items] : [...items, value];

export function updateDesktop(state: DesktopState, action: DesktopAction): DesktopState {
  const { appId } = action;
  if (action.type === "selectIcon") return { ...state, selectedIcon: appId };
  if (action.type === "openWindow") {
    return { ...state, selectedIcon: appId, openWindows: appendUnique(state.openWindows, appId), minimizedWindows: state.minimizedWindows.filter((id) => id !== appId), focusedWindow: appId };
  }
  if (action.type === "focusWindow" && state.openWindows.includes(appId) && !state.minimizedWindows.includes(appId)) {
    return { ...state, focusedWindow: appId };
  }
  if (action.type === "minimizeWindow" && state.openWindows.includes(appId)) {
    const minimizedWindows = appendUnique(state.minimizedWindows, appId);
    const focusedWindow = state.focusedWindow === appId
      ? [...state.openWindows].reverse().find((id) => id !== appId && !minimizedWindows.includes(id)) ?? null
      : state.focusedWindow;
    return { ...state, minimizedWindows, focusedWindow };
  }
  if (action.type === "restoreWindow" && state.openWindows.includes(appId)) {
    return { ...state, minimizedWindows: state.minimizedWindows.filter((id) => id !== appId), focusedWindow: appId };
  }
  if (action.type === "closeWindow") {
    const openWindows = state.openWindows.filter((id) => id !== appId);
    const minimizedWindows = state.minimizedWindows.filter((id) => id !== appId);
    const focusedWindow = state.focusedWindow === appId
      ? [...openWindows].reverse().find((id) => !minimizedWindows.includes(id)) ?? null
      : state.focusedWindow;
    return { ...state, openWindows, minimizedWindows, focusedWindow };
  }
  return state;
}
