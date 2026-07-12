import { useState } from "react";
import { evaluatePassphrase } from "@/lib/password-guardian-lesson";
import "./PassphraseBuilder.css";

const TOKENS = ["blue", "river", "robot", "planet", "47", "cloud", "panda"];
interface Props { onSuccess: () => void; }

export function PassphraseBuilder({ onSuccess }: Props) {
  const [parts, setParts] = useState<string[]>([]);
  const value = parts.join("-");
  const result = evaluatePassphrase(value);
  const strengthChecks = [
    { label: "至少 20 个字符", pass: result.checks.longEnough, value: `${value.length}/20` },
    { label: "至少 4 个部分", pass: result.checks.enoughParts, value: `${parts.length}/4` },
    { label: "包含字母", pass: result.checks.hasLetters, value: result.checks.hasLetters ? "有" : "没有" },
    { label: "包含数字", pass: result.checks.hasNumber, value: result.checks.hasNumber ? "有" : "没有" },
  ];
  function removePart(token: string) {
    setParts((items) => items.filter((item) => item !== token));
  }
  return (
    <div className="passphrase-builder">
      <p className="fictional-warning">只组合虚构词，不要输入或告诉网站任何真实密码。</p>
      <div className="token-bank">{TOKENS.map((token) => <button disabled={parts.includes(token)} key={token} onClick={() => setParts((items) => [...items, token])} type="button">添加 {token}</button>)}</div>
      <div className="practice-passphrase" aria-label="虚构练习口令" role="group">{parts.length ? parts.map((token) => <button aria-label={`删除虚构词 ${token}`} key={token} onClick={() => removePart(token)} type="button">{token}<span aria-hidden="true"> ×</span></button>) : "选择词语开始组合"}</div>
      <ul className="passphrase-strength-grid" aria-label="虚构口令强度检查">{strengthChecks.map((check) => <li className={check.pass ? "is-passed" : ""} key={check.label}><span aria-hidden="true">{check.pass ? "✓" : "○"}</span><strong>{check.label}</strong><small>{check.value}</small></li>)}</ul>
      <p role="status">{result.feedback}</p>
      <div className="passphrase-actions"><button onClick={() => setParts([])} type="button">重新组合</button><button className="primary-action" disabled={!result.strong} onClick={onSuccess} type="button">完成虚构口令</button></div>
      <aside>真实账号：每个账号用不同密码，不告诉同学；需要保存时请家长帮助使用可信的密码管理工具。</aside>
    </div>
  );
}
