import { useState } from "react";
import { inspectWebAddress } from "@/lib/web-address-lesson";
const CASES = [
  { address: "https://library.example/books/space", trusted: "library.example", safe: true },
  { address: "https://library.example.bad.example/books", trusted: "library.example", safe: false },
  { address: "https://museum.example/exhibits/dinosaurs", trusted: "museum.example", safe: true },
  { address: "https://museum-example.example/prize", trusted: "museum.example", safe: false },
  { address: "https://classroom.example/week/3", trusted: "classroom.example", safe: true },
];
interface Props { onComplete: () => void; }
export function AddressInspector({ onComplete }: Props) { const [index, setIndex] = useState(0); const [feedback, setFeedback] = useState("读完整网站身份，不要只找熟悉的单词。" ); const current = CASES[index]; const parts = inspectWebAddress(current.address, current.trusted); function answer(safe: boolean) { if (safe !== current.safe) { setFeedback("再看网站身份 host：它必须和可信地址完全相同。" ); return; } if (index === CASES.length - 1) onComplete(); else { setIndex((value) => value + 1); setFeedback("判断正确，继续下一张地址卡。" ); } } return <div className="address-inspector"><div className="fake-address-bar"><span className="scheme-part">{parts.scheme}://</span><strong className={parts.trustedHost ? "trusted-host" : "untrusted-host"}>{parts.host}</strong><span>{parts.path}</span></div><dl><div><dt>连接方式</dt><dd>{parts.scheme}</dd></div><div><dt>网站身份</dt><dd>{parts.host}</dd></div><div><dt>站内路径</dt><dd>{parts.path}</dd></div></dl><p>可信网站身份：<code>{current.trusted}</code></p><div className="address-actions"><button onClick={() => answer(true)} type="button">网站身份完全相同</button><button onClick={() => answer(false)} type="button">不相同，停止并检查</button></div><p role="status">{feedback} 案例 {index + 1}/5</p><aside>锁形图标或 https 表示连接方式，不代表网站内容一定可信；仍要核对网站身份。</aside></div>; }
