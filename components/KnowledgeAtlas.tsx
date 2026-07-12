import { buildKnowledgeAtlas } from "@/lib/knowledge-atlas";

interface KnowledgeAtlasProps {
  completedCourseIds: string[];
}

export function KnowledgeAtlas({ completedCourseIds }: KnowledgeAtlasProps) {
  const chapters = buildKnowledgeAtlas(completedCourseIds);
  const unlockedTotal = chapters.reduce((total, chapter) => total + chapter.unlockedCount, 0);

  return (
    <section className="knowledge-atlas" aria-labelledby="knowledge-atlas-heading">
      <div className="knowledge-atlas-heading">
        <div>
          <p className="section-kicker">你的知识图鉴</p>
          <h2 id="knowledge-atlas-heading">把学会的电脑知识收进口袋</h2>
        </div>
        <strong aria-label={`已经解锁 ${unlockedTotal} 个知识卡`}>{unlockedTotal} / 35</strong>
      </div>
      <p className="knowledge-atlas-intro">完成一课会解锁一张复习卡。打开岛屿章节，试着不看答案先讲给家长听。</p>
      <div className="knowledge-chapters">
        {chapters.map((chapter) => (
          <details className="knowledge-chapter" key={chapter.islandId}>
            <summary>
              <span aria-hidden="true">{chapter.icon}</span>
              <strong>{chapter.name}</strong>
              <small>{chapter.unlockedCount} / {chapter.courseCount} 已解锁</small>
            </summary>
            <ol>
              {chapter.entries.map((entry) => (
                <li className={entry.unlocked ? "is-unlocked" : "is-locked"} key={entry.courseId}>
                  <span className="knowledge-card-number">{String(entry.order).padStart(2, "0")}</span>
                  <div>
                    <strong>{entry.unlocked ? entry.title : "神秘知识卡"}</strong>
                    {entry.unlocked ? (
                      <ul>{entry.concepts.map((concept) => <li key={concept}>{concept}</li>)}</ul>
                    ) : <p>完成第 {entry.order} 课后解锁</p>}
                  </div>
                </li>
              ))}
            </ol>
          </details>
        ))}
      </div>
    </section>
  );
}
