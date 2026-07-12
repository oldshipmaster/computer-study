"use client";

import { useEffect, useState } from "react";

const DOMAINS = ["电脑操作", "文件管理", "编程思维", "数字安全", "硬件原理", "网络知识", "数字创作", "AI 素养", "游戏编程"];

export function CompletionCertificate() {
  const [localDate, setLocalDate] = useState("完成日期：本机生成");
  useEffect(() => {
    let cancelled = false;
    queueMicrotask(() => {
      if (!cancelled) setLocalDate(new Intl.DateTimeFormat("zh-CN", { dateStyle: "long" }).format(new Date()));
    });
    return () => { cancelled = true; };
  }, []);
  return (
    <section className="completion-certificate" aria-labelledby="certificate-heading">
      <div className="certificate-stars" aria-hidden="true">★　★　★</div>
      <p>比特岛大冒险 · 计算机基础结业证明</p>
      <h2 id="certificate-heading">比特岛计算机探险家</h2>
      <p>完成九座知识岛、四十五节互动课程，并能用自己的话解释电脑怎样工作与怎样负责任地使用。</p>
      <ul>{DOMAINS.map((domain) => <li key={domain}>✓ {domain}</li>)}</ul>
      <div className="certificate-footer"><span>比比认证 · 本机学习记录</span><span>{localDate}</span></div>
      <button className="primary-action certificate-print" onClick={() => window.print()} type="button">打印结业证书</button>
      <small>证书不要求填写孩子姓名，也不会上传任何学习记录。</small>
    </section>
  );
}
