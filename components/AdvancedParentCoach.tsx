import { ADVANCED_PARENT_COACH } from "@/lib/advanced-foundations/parent-coach";

export function AdvancedParentCoach() {
  return <section className="advanced-parent-coach" aria-labelledby="advanced-parent-coach-heading">
    <header><p className="section-kicker">高级基础陪学卡</p><h2 id="advanced-parent-coach-heading">家长偶尔怎么帮</h2><p>先让孩子自己试。只有标记“请大人帮忙”时，再用问题引导，不直接给答案。</p></header>
    <div>{ADVANCED_PARENT_COACH.map((card) => <details key={card.islandId}><summary><strong>{card.title}</strong><span>查看陪学提示</span></summary><section><p>{card.bigIdea}</p><h3>常见误解</h3><p>{card.misconception}</p><h3>可以这样问</h3><ul>{card.questions.map((question) => <li key={question}>{question}</li>)}</ul><h3>离屏小游戏</h3><p>{card.offlineActivity}</p></section></details>)}</div>
  </section>;
}
