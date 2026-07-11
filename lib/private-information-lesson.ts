export type PrivacyAction = "share" | "ask" | "stop";
export interface PrivacyState { sorted: Record<string, PrivacyAction>; feedback: string; }
export const INITIAL_PRIVACY_STATE: PrivacyState = { sorted: {}, feedback: "先看信息内容，再看是谁、在哪里询问。" };
export function recommendPrivacyAction(infoType: string, requester: string): PrivacyAction {
  if (["password", "phone", "address", "verification-code"].includes(infoType)) return "stop";
  if (["photo", "school-name", "real-name", "location"].includes(infoType)) return "ask";
  if (["favorite-color", "hobby"].includes(infoType) && ["teacher", "family", "class-activity"].includes(requester)) return "share";
  return "ask";
}
export function sortPrivacyCard(state: PrivacyState, infoType: string, action: PrivacyAction, requester = "website"): PrivacyState {
  if (state.sorted[infoType]) return state; const expected = recommendPrivacyAction(infoType, requester);
  if (action !== expected) return { ...state, feedback: expected === "stop" ? "这类信息很私密，先停下来、关闭请求并告诉可信的大人。" : "这个请求需要结合场景判断，先问可信的大人。" };
  return { sorted: { ...state.sorted, [infoType]: action }, feedback: "判断完成，继续下一张虚构信息卡。" };
}
