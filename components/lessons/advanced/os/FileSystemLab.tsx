"use client";

import { useState } from "react";
import { resolveVirtualPath, type VirtualEntry } from "@/lib/advanced-foundations/operating-system";

const TARGET_PATH = "/学习资料/科学/星空.txt";
const DECOY_PATH = "/照片/星空.txt";
const ENTRIES: Record<string, VirtualEntry> = {
  "/": { kind: "directory", children: ["学习资料", "照片", "系统"] },
  "/学习资料": { kind: "directory", children: ["科学"] },
  "/学习资料/科学": { kind: "directory", children: ["星空.txt"] },
  [TARGET_PATH]: { kind: "file", content: "虚构星空学习笔记：今晚观察月亮。" },
  "/照片": { kind: "directory", children: ["星空.txt"] },
  [DECOY_PATH]: { kind: "file", content: "同名文件，但它是照片文件夹里的说明文字。" },
  "/系统": { kind: "directory", children: ["设置.dat"] },
  "/系统/设置.dat": { kind: "file", content: "只读的虚拟系统设置" },
};

export function FileSystemLab({ onComplete }: { onComplete: () => void }) {
  const [path, setPath] = useState("/");
  const [feedback, setFeedback] = useState("目录里有两个同名文件“星空.txt”，请根据完整路径找到学习资料里的那一个。" );
  const entry = resolveVirtualPath(ENTRIES, path)!;
  const found = path === TARGET_PATH;
  const breadcrumbs = path === "/" ? [] : path.slice(1).split("/");
  function goTo(nextPath: string) {
    setPath(nextPath);
    setFeedback(nextPath === "/" ? "已回到根目录。完整路径从根开始。" : `回到 ${nextPath}`);
  }
  function open(name: string) {
    const nextPath = path === "/" ? `/${name}` : `${path}/${name}`;
    const next = resolveVirtualPath(ENTRIES, nextPath);
    if (!next) return;
    if (nextPath.startsWith("/系统")) { setFeedback("系统目录标记为只读；返回并寻找学习资料。" ); return; }
    setPath(nextPath);
    if (nextPath === DECOY_PATH) setFeedback("文件名相同，但完整路径是 /照片/星空.txt，不是任务要求的位置。" );
    else setFeedback(next.kind === "directory" ? `进入目录 ${nextPath}` : `打开正确文件 ${nextPath}`);
  }
  return (
    <div className="advanced-lab file-system-lab">
      <h2>文件系统目录树挑战</h2>
      <p><strong>任务：</strong>找到 <code>{TARGET_PATH}</code>。只看文件名不够，要核对它住在哪些文件夹里。</p>
      <nav aria-label="当前文件路径" className="path-breadcrumbs"><button aria-current={path === "/" ? "page" : undefined} onClick={() => goTo("/")} type="button">🏠 根目录</button>{breadcrumbs.map((part, index) => { const target = `/${breadcrumbs.slice(0, index + 1).join("/")}`; return <span key={target}><b aria-hidden="true">›</b><button aria-current={target === path ? "page" : undefined} onClick={() => goTo(target)} type="button">{part}</button></span>; })}</nav>
      <div className="path-anatomy" aria-label="路径结构" role="group"><span><small>根</small>/</span>{breadcrumbs.length ? breadcrumbs.map((part, index) => <span className={index === breadcrumbs.length - 1 && entry.kind === "file" ? "is-file" : ""} key={`${part}-${index}`}><small>{index === breadcrumbs.length - 1 && entry.kind === "file" ? "文件名" : index === 0 ? "文件夹" : "子文件夹"}</small>{part}</span>) : <em>根/文件夹/子文件夹/文件名</em>}</div>
      <div className="file-explorer">
        <aside aria-label="目录树" className="file-tree"><strong>📁 根目录</strong><span className={path.startsWith("/学习资料") ? "is-current" : ""}>├─ 📁 学习资料</span><span className={path.startsWith("/学习资料/科学") ? "is-current" : ""}>│　└─ 📁 科学</span><span className={found ? "is-current" : ""}>│　　└─ 📄 星空.txt</span><span className={path.startsWith("/照片") ? "is-current" : ""}>├─ 📁 照片</span><span className={path === DECOY_PATH ? "is-current" : ""}>│　└─ 📄 星空.txt</span><span className="is-locked">└─ 🔒 系统（只读）</span></aside>
        <section><p className="file-address">完整路径：{path}</p>{entry.kind === "directory" ? <div role="group">{entry.children.map((name) => { const childPath = path === "/" ? `/${name}` : `${path}/${name}`; const child = resolveVirtualPath(ENTRIES, childPath); return <button key={name} onClick={() => open(name)} type="button">{name === "系统" ? "🔒" : child?.kind === "directory" ? "📁" : "📄"} {name}</button>; })}</div> : <p className="file-preview">📄 {entry.content}</p>}</section>
      </div>
      <p aria-live="polite" role="status">{feedback}</p>
      {found ? <button onClick={onComplete} type="button">完成路径查找</button> : null}
    </div>
  );
}
