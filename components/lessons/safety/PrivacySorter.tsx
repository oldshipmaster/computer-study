import { useState } from "react";
import { INITIAL_PRIVACY_STATE, sortPrivacyCard, type PrivacyAction } from "@/lib/private-information-lesson";
const CARDS = [
  { id: "favorite-color", label: "最喜欢的颜色", requester: "teacher" }, { id: "hobby", label: "课堂活动中的兴趣", requester: "class-activity" },
  { id: "photo", label: "应用请求上传照片", requester: "app" }, { id: "school-name", label: "网站询问学校名称", requester: "website" },
  { id: "real-name", label: "游戏询问真实姓名", requester: "website" }, { id: "phone", label: "网友询问电话号码", requester: "online-friend" },
  { id: "address", label: "陌生人询问家庭住址", requester: "online-friend" }, { id: "password", label: "弹窗询问账号密码", requester: "website" },
];
const ACTIONS: Array<{ id: PrivacyAction; label: string }> = [{ id: "share", label: "可以分享" }, { id: "ask", label: "先问大人" }, { id: "stop", label: "停止并关闭" }];
interface Props { onComplete: () => void; }
export function PrivacySorter({ onComplete }: Props) { const [state, setState] = useState(INITIAL_PRIVACY_STATE); const [selected, setSelected] = useState<string | null>(null); function place(action: PrivacyAction) { const card = CARDS.find((item) => item.id === selected); if (!card) return; const next = sortPrivacyCard(state, card.id, action, card.requester); setState(next); if (Object.keys(next.sorted).length === CARDS.length) onComplete(); } return <div className="privacy-sorter"><div className="privacy-cards">{CARDS.map((card) => <button aria-pressed={selected === card.id} disabled={Boolean(state.sorted[card.id])} key={card.id} onClick={() => setSelected(card.id)} type="button">{state.sorted[card.id] ? "✓ " : ""}{card.label}</button>)}</div><div className="privacy-actions">{ACTIONS.map((action) => <button key={action.id} onClick={() => place(action.id)} type="button">{action.label}</button>)}</div><p role="status">{state.feedback}</p><aside>遇到让你不舒服、催促保密或索要信息的请求：不回复、不发送，关闭页面，告诉家长或老师。</aside></div>; }
