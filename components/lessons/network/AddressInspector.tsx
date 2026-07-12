import { useState } from "react";
import { inspectWebAddress } from "@/lib/web-address-lesson";
import { isRepeatedPointerActivation } from "@/lib/interaction-guard";
import "./AddressInspector.css";

const CASES = [
  { address: "https://library.example/books/space", trusted: "library.example", safe: true },
  { address: "https://library.example.bad.example/books", trusted: "library.example", safe: false },
  { address: "https://museum.example/exhibits/dinosaurs", trusted: "museum.example", safe: true },
  { address: "https://museum-example.example/prize", trusted: "museum.example", safe: false },
  { address: "https://classroom.example/week/3", trusted: "classroom.example", safe: true },
];
interface Props { onComplete: () => void; }

export function AddressInspector({ onComplete }: Props) {
  const [index, setIndex] = useState(0);
  const [finished, setFinished] = useState(false);
  const [feedback, setFeedback] = useState("读完整网站身份，不要只找熟悉的单词。" );
  const current = CASES[index];
  const parts = inspectWebAddress(current.address, current.trusted);
  const hostLabels = parts.host.split(".");
  const identity = hostLabels.slice(-2).join(".");
  const prefix = hostLabels.slice(0, -2).join(".");
  function answer(safe: boolean, detail: number) {
    if (finished || isRepeatedPointerActivation(detail)) return;
    if (safe !== current.safe) { setFeedback("再看网站身份 host：它必须和可信地址完全相同。" ); return; }
    if (index === CASES.length - 1) { setFinished(true); setFeedback("五张地址卡全部判断正确。" ); }
    else { setIndex((value) => value + 1); setFeedback("判断正确，继续下一张地址卡。" ); }
  }
  return (
    <div className="address-inspector">
      <div aria-live="polite" className="fake-address-bar"><span className="scheme-part">{parts.scheme}://</span><strong className={parts.trustedHost ? "trusted-host" : "untrusted-host"}>{parts.host}</strong><span>{parts.path}</span></div>
      <p className="host-reading-rule"><strong>从右向左读：</strong>先确认网站身份核心，再看左边是否有可能迷惑人的前缀。</p>
      <div className="host-labels" aria-label="主机名标签拆解" role="group">{hostLabels.map((label, labelIndex) => <span className={labelIndex >= hostLabels.length - 2 ? "is-core" : "is-prefix"} key={`${label}-${labelIndex}`}><small>{labelIndex >= hostLabels.length - 2 ? "身份核心" : "前缀"}</small>{label}</span>)}</div>
      <div className="identity-comparison"><section><small>当前网站身份核心</small><strong>{identity}</strong><em>{prefix ? `可能迷惑人的前缀：${prefix}` : "没有额外前缀"}</em></section><b aria-hidden="true">{parts.trustedHost ? "=" : "≠"}</b><section><small>可信完整网站身份</small><strong>{current.trusted}</strong><em>必须完整相同</em></section></div>
      <dl><div><dt>连接方式</dt><dd>{parts.scheme}</dd></div><div><dt>网站身份</dt><dd>{parts.host}</dd></div><div><dt>站内路径</dt><dd>{parts.path}</dd></div></dl>
      {!finished ? <div className="address-actions"><button onClick={(event) => answer(true, event.detail)} type="button">网站身份完全相同</button><button onClick={(event) => answer(false, event.detail)} type="button">不相同，停止并检查</button></div> : <section className="address-finish"><span aria-hidden="true">🛡️🌐</span><h2>网址防伪训练完成</h2><p>你判断了 5 个地址，并学会区分连接方式、网站身份和站内路径。</p><button className="primary-action" onClick={onComplete} type="button">完成网址防伪训练</button></section>}
      <p role="status">{feedback} 案例 {Math.min(index + 1, 5)}/5</p>
      <aside>锁形图标或 https 表示连接方式，不代表网站内容一定可信；仍要核对网站身份。</aside>
    </div>
  );
}
