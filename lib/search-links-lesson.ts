export interface SearchResult { id: string; title: string; source: string; }
const STOP_TERMS = new Set(["我", "想", "知道", "我想知道", "会", "的", "是", "吗"]);
export function normalizeSearchTerms(value: string): string[] { return value.replace(/[？?！!，,。]/g, " ").split(/\s+/).map((term) => term.trim()).filter((term) => term && !STOP_TERMS.has(term)).map((term) => term.startsWith("会") && term.length > 1 ? term.slice(1) : term); }
export function rankSearchResults(terms: readonly string[], results: readonly SearchResult[]) { return results.map((result) => ({ ...result, matchCount: terms.filter((term) => result.title.includes(term)).length })).sort((a, b) => b.matchCount - a.matchCount); }
export interface TabState { tabs: Array<{ id: string; url: string }>; activeTabId: string; }
export type TabAction = { type: "open"; url: string } | { type: "close"; tabId: string };
export const INITIAL_TABS: TabState = { tabs: [{ id: "search", url: "https://search.example" }], activeTabId: "search" };
export function updateTabs(state: TabState, action: TabAction): TabState { if (action.type === "open") { try { const url = new URL(action.url); if (!url.hostname.endsWith(".example")) return state; const id = `tab-${state.tabs.length + 1}`; return { tabs: [...state.tabs, { id, url: action.url }], activeTabId: id }; } catch { return state; } } const tabs = state.tabs.filter((tab) => tab.id !== action.tabId); if (tabs.length === 0) return state; return { tabs, activeTabId: state.activeTabId === action.tabId ? tabs[tabs.length - 1].id : state.activeTabId }; }
