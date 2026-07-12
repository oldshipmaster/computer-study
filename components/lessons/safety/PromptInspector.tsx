import { useState } from "react";
import { inspectPrompt, type PromptAction, type PromptSignals } from "@/lib/popup-fog-lesson";
import { isRepeatedPointerActivation } from "@/lib/interaction-guard";
const CASES: Array<{ title: string; body: string; source: string; signals: PromptSignals }> = [
  { title: "恭喜中奖！马上输入密码", body: "只剩 10 秒，立刻领取。", source: "prize-now.example", signals: { trustedSource: false, urgent: true, asksSecret: true, download: false, expected: false } },
  { title: "安装超级加速器", body: "点击下载陌生程序。", source: "fast-game.example", signals: { trustedSource: false, urgent: false, asksSecret: false, download: true, expected: false } },
  { title: "课程需要打开讲义", body: "老师说今天会用这份文件，请家长确认。", source: "school.example", signals: { trustedSource: true, urgent: false, asksSecret: false, download: true, expected: true } },
  { title: "休息提醒", body: "你已经学习一会儿了，看看远处。", source: "比特岛课程", signals: { trustedSource: true, urgent: false, asksSecret: false, download: false, expected: true } },
  { title: "账号将在一分钟后消失", body: "发送验证码才能保留账号。", source: "account-help.example", signals: { trustedSource: false, urgent: true, asksSecret: true, download: false, expected: false } },
];
const ACTIONS: Array<{ id: PromptAction; label: string }> = [{ id: "close", label: "关闭，不操作" }, { id: "ask", label: "给大人看" }, { id: "continue", label: "确认后继续" }];
interface Props { onComplete: () => void; }
export function PromptInspector({ onComplete }: Props) { const [index, setIndex] = useState(0); const [feedback, setFeedback] = useState("先检查来源和请求，再选择行动。" ); const current = CASES[index]; const inspection = inspectPrompt(current.signals); function choose(action: PromptAction, detail: number) { if (isRepeatedPointerActivation(detail)) return; if (action !== inspection.action) { setFeedback("先别点弹窗里的内容。检查来源、催促、秘密和下载线索。" ); return; } if (index === CASES.length - 1) onComplete(); else { setIndex((value) => value + 1); setFeedback("判断完成，迷雾散开一层。" ); } } return <div className="prompt-inspector"><div className="fake-browser"><header><span>虚拟页面 · 不会打开链接</span><code>{current.source}</code></header><section><h2 aria-live="polite">{current.title}</h2><p>{current.body}</p><small>观察到的线索：{inspection.warningFlags.length ? inspection.warningFlags.join("、") : "来源可信、内容符合预期"}</small></section></div><div className="prompt-actions">{ACTIONS.map((action) => <button key={action.id} onClick={(event) => choose(action.id, event.detail)} type="button">{action.label}</button>)}</div><p role="status">{feedback} 案例 {index + 1}/5</p></div>; }
