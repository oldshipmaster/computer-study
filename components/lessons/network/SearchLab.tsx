import { useState } from "react";
import { INITIAL_TABS, normalizeSearchTerms, rankSearchResults, updateTabs } from "@/lib/search-links-lesson";

const RESULTS = [
  { id: "moon-science", title: "月亮月相为什么变化", source: "science.example", author: "虚构科学馆编辑部", date: "2026-06-01", summary: "用手电筒和球解释月相变化。" },
  { id: "moon-game", title: "最好玩的月亮游戏", source: "games.example", author: "虚构游戏推荐员", date: "2023-08-12", summary: "介绍三款以月亮为背景的游戏。" },
  { id: "sky", title: "夜空中的星星", source: "sky.example", author: "虚构观星小组", date: "2025-11-03", summary: "认识夜空中的恒星。" },
];
const EVIDENCE = ["标题相关", "作者信息", "发布日期"] as const;
interface Props { onComplete: () => void; }

export function SearchLab({ onComplete }: Props) {
  const [query, setQuery] = useState("");
  const [tabs, setTabs] = useState(INITIAL_TABS);
  const [previewId, setPreviewId] = useState<string | null>(null);
  const [openedBest, setOpenedBest] = useState(false);
  const [evidence, setEvidence] = useState<string[]>([]);
  const [feedback, setFeedback] = useState("先输入两个关键概念，让最相关的标题排到前面。" );
  const terms = normalizeSearchTerms(query);
  const results = rankSearchResults(terms, RESULTS);
  const preview = RESULTS.find((item) => item.id === previewId) ?? null;

  function open(resultId: string, source: string) {
    const next = updateTabs(tabs, { type: "open", url: `https://${source}/${resultId}` });
    setTabs(next);
    setPreviewId(resultId);
    setEvidence([]);
    const qualified = resultId === "moon-science" && terms.includes("月亮") && terms.includes("变化");
    setOpenedBest(qualified);
    setFeedback(qualified ? "标题与两个关键词都匹配。继续核查三项来源证据。" : "可以预览，但它还不是同时匹配“月亮”和“变化”的最佳结果。" );
  }
  function toggleEvidence(item: string) {
    setEvidence((current) => current.includes(item) ? current.filter((value) => value !== item) : [...current, item]);
  }
  function closePreview() {
    const next = updateTabs(tabs, { type: "close", tabId: tabs.activeTabId });
    setTabs(next);
    setPreviewId(null);
    setEvidence([]);
    if (openedBest && evidence.length === 3 && next.tabs.length === 1) onComplete();
  }
  return (
    <div className="search-lab">
      <p className="virtual-only-note">🔒 只在虚拟标签页中练习，不连接真实搜索网站。</p>
      <label>虚拟搜索框<input onChange={(event) => setQuery(event.target.value)} placeholder="试试：月亮 变化" value={query}/></label>
      <p>关键词：{terms.length ? terms.join(" · ") : "还没有"}</p>
      <div className="virtual-tabs">{tabs.tabs.map((tab) => <span className={tab.id === tabs.activeTabId ? "is-active" : ""} key={tab.id}>{tab.id === "search" ? "搜索结果" : "结果预览"}</span>)}</div>
      {!preview ? <ol className="search-results">{results.map((result, index) => <li key={result.id}><span className="search-rank">{index + 1}</span><div><strong>{result.title}</strong><small>来源地址：{result.source} · 匹配 {result.matchCount} 个关键词</small><meter max={Math.max(terms.length, 1)} min={0} value={result.matchCount}>{result.matchCount}</meter></div><button onClick={() => open(result.id, result.source)} type="button">在虚拟新标签页预览</button></li>)}</ol> : (
        <article className="search-preview"><header><span>虚构预览</span><h2>{preview.title}</h2><code>https://{preview.source}/{preview.id}</code></header><p>{preview.summary}</p><dl><div><dt>作者信息</dt><dd>{preview.author}</dd></div><div><dt>发布日期</dt><dd>{preview.date}</dd></div><div><dt>来源地址</dt><dd>{preview.source}</dd></div></dl><h3>我已经核查</h3><div className="preview-evidence" role="group" aria-label="来源证据核查">{EVIDENCE.map((item) => <button aria-pressed={evidence.includes(item)} key={item} onClick={() => toggleEvidence(item)} type="button">{evidence.includes(item) ? "✓" : "○"} {item}</button>)}</div></article>
      )}
      <p aria-live="polite" role="status">{feedback}</p>
      {preview ? <button className="primary-action" disabled={openedBest && evidence.length < 3} onClick={closePreview} type="button">{openedBest ? evidence.length < 3 ? `还需核查 ${3 - evidence.length} 项` : "关闭预览并完成核查" : "关闭预览标签页并返回结果"}</button> : null}
      <aside>关键词匹配多只说明“更相关”，不代表内容一定正确；重要信息还要比较来源、作者、日期，并向老师或家长核实。</aside>
    </div>
  );
}
