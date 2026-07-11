import { useState } from "react";
import { saveVirtualWork, validateFileName } from "@/lib/name-your-work-lesson";
interface Props { existingNames?: readonly string[]; initialName?: string; onSaved: () => void; }

export function NamingWorkshop({ existingNames = [], initialName = "", onSaved }: Props) {
  const [name, setName] = useState(initialName); const [location, setLocation] = useState<string | null>(null); const [feedback, setFeedback] = useState("给作品一个能看懂的名字。");
  const validation = validateFileName(name, existingNames);
  function save() { const result = saveVirtualWork(name, location, existingNames); setFeedback(result.reason); if (result.saved) onSaved(); }
  return <div className="naming-workshop"><div className="art-preview" aria-label="海底世界画作预览">🐠<span>🌊</span><small>虚拟画作</small></div><label htmlFor="work-name">文件名</label><input id="work-name" onChange={(event) => setName(event.target.value)} placeholder="例如：海底世界-星期五.png" value={name} /><fieldset><legend>保存到哪里？</legend>{["我的作品/图画", "学习资料/科学"].map((place) => <button aria-pressed={location === place} key={place} onClick={() => setLocation(place)} type="button">📁 {place}</button>)}</fieldset><p className={validation.valid ? "name-feedback is-ready" : "name-feedback"} aria-live="polite">{feedback === "给作品一个能看懂的名字。" ? validation.reason : feedback}</p><button className="primary-action" onClick={save} type="button">保存虚拟作品</button><p className="privacy-reminder">文件名不写真实姓名、电话、学校和住址。</p></div>;
}
