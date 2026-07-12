import { useState } from "react";
import { INITIAL_PRIVACY_STATE, sortPrivacyCard, type PrivacyAction } from "@/lib/private-information-lesson";
import "./PrivacySorter.css";

type Risk = "identify" | "contact" | "locate" | "login";
const CARDS: Array<{ id: string; label: string; requester: string; risks: Risk[] }> = [
  { id: "favorite-color", label: "最喜欢的颜色", requester: "teacher", risks: [] }, { id: "hobby", label: "课堂活动中的兴趣", requester: "class-activity", risks: [] },
  { id: "photo", label: "应用请求上传照片", requester: "app", risks: ["identify"] }, { id: "school-name", label: "网站询问学校名称", requester: "website", risks: ["identify", "locate"] },
  { id: "real-name", label: "游戏询问真实姓名", requester: "website", risks: ["identify"] }, { id: "phone", label: "网友询问电话号码", requester: "online-friend", risks: ["contact"] },
  { id: "address", label: "陌生人询问家庭住址", requester: "online-friend", risks: ["locate"] }, { id: "password", label: "弹窗询问账号密码", requester: "website", risks: ["login"] },
];
const RISK_LABELS: Record<Risk, { label: string; icon: string }> = { identify: { label: "识别我", icon: "👤" }, contact: { label: "联系我", icon: "☎️" }, locate: { label: "找到我", icon: "📍" }, login: { label: "登录账号", icon: "🔑" } };
const ACTIONS: Array<{ id: PrivacyAction; label: string; icon: string }> = [{ id: "share", label: "可以分享", icon: "🟢" }, { id: "ask", label: "先问大人", icon: "🟡" }, { id: "stop", label: "停止并关闭", icon: "🔴" }];
interface Props { onComplete: () => void; }

export function PrivacySorter({ onComplete }: Props) {
  const [state, setState] = useState(INITIAL_PRIVACY_STATE);
  const [selected, setSelected] = useState<string | null>(null);
  const selectedCard = CARDS.find((item) => item.id === selected) ?? null;
  const finished = Object.keys(state.sorted).length === CARDS.length;
  function place(action: PrivacyAction) {
    if (!selectedCard) return;
    const next = sortPrivacyCard(state, selectedCard.id, action, selectedCard.requester);
    setState(next);
    if (next.sorted[selectedCard.id]) setSelected(null);
  }
  return (
    <div className="privacy-sorter">
      <p className="privacy-lens-rule">先问四个问题：它能不能<strong>识别我、联系我、找到我、登录我的账号</strong>？再结合“谁在什么场景询问”决定。</p>
      {!finished ? <>
        <div className="privacy-cards">{CARDS.map((card) => <button aria-pressed={selected === card.id} disabled={Boolean(state.sorted[card.id])} key={card.id} onClick={() => setSelected(card.id)} type="button">{state.sorted[card.id] ? "✓ " : ""}{card.label}</button>)}</div>
        <div className="privacy-risk-lenses" aria-label="当前信息的四种隐私风险" role="group">{(Object.keys(RISK_LABELS) as Risk[]).map((risk) => { const active = selectedCard?.risks.includes(risk) ?? false; return <span className={active ? "is-risk" : ""} key={risk}><b>{RISK_LABELS[risk].icon}</b><small>{RISK_LABELS[risk].label}</small><em>{selectedCard ? active ? "有风险" : "未发现" : "待选卡"}</em></span>; })}</div>
        <div className="privacy-actions">{ACTIONS.map((action) => <button disabled={!selectedCard} key={action.id} onClick={() => place(action.id)} type="button">{action.icon} {action.label}</button>)}</div>
      </> : <section className="privacy-summary"><span aria-hidden="true">🛡️✨</span><h2>分类总结</h2>{ACTIONS.map((action) => { const cards = CARDS.filter((card) => state.sorted[card.id] === action.id); return <div className={`privacy-summary-row privacy-summary-row--${action.id}`} key={action.id}><strong>{action.icon} {action.label}</strong><ul>{cards.map((card) => <li key={card.id}>{card.label}</li>)}</ul></div>; })}<button className="primary-action" onClick={onComplete} type="button">完成隐私判断</button></section>}
      <p role="status">{state.feedback} 已完成 {Object.keys(state.sorted).length}/{CARDS.length}</p>
      <aside>遇到让你不舒服、催促保密或索要信息的请求：不回复、不发送，关闭页面，告诉家长或老师。</aside>
    </div>
  );
}
