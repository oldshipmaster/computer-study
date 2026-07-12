import { buildIslandSeals } from "@/lib/island-seals";
export function IslandSealCollection({ completedCourseIds }: { completedCourseIds: string[] }) {
  const seals = buildIslandSeals(completedCourseIds);
  const unlocked = seals.filter((seal) => seal.unlocked).length;
  return <section className="island-seals" aria-labelledby="island-seals-heading">
    <div><p className="section-kicker">岛屿印章册</p><h2 id="island-seals-heading">每完成一座岛，收藏一枚印章</h2><strong>{unlocked} / {seals.length} 已点亮</strong></div>
    <ul>{seals.map((seal) => <li className={seal.unlocked ? "is-unlocked" : ""} key={seal.id}><span aria-hidden="true">{seal.unlocked ? seal.icon : "◇"}</span><strong>{seal.name}</strong><small>{seal.unlocked ? "岛屿印章已获得" : `还差 ${seal.remainingCount} 课`}</small></li>)}</ul>
  </section>;
}
