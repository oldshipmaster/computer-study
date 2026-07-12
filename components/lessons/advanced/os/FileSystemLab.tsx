"use client";

import { useState } from "react";
import { resolveVirtualPath, type VirtualEntry } from "@/lib/advanced-foundations/operating-system";

const ENTRIES: Record<string, VirtualEntry> = { "/": { kind: "directory", children: ["学习资料", "系统"] }, "/学习资料": { kind: "directory", children: ["科学"] }, "/学习资料/科学": { kind: "directory", children: ["星空.txt"] }, "/学习资料/科学/星空.txt": { kind: "file", content: "虚构星空笔记" }, "/系统": { kind: "directory", children: ["设置.dat"] }, "/系统/设置.dat": { kind: "file", content: "只读的虚拟系统设置" } };

export function FileSystemLab({ onComplete }: { onComplete: () => void }) {
  const [path, setPath] = useState("/");
  const [feedback, setFeedback] = useState("从根目录开始，找到学习资料中的星空笔记。" );
  const entry = resolveVirtualPath(ENTRIES, path)!;
  const found = path === "/学习资料/科学/星空.txt";
  const breadcrumbs = path === "/" ? [] : path.slice(1).split("/");
  function goTo(nextPath: string) { setPath(nextPath); setFeedback(nextPath === "/" ? "已回到根目录。" : `回到 ${nextPath}`); }
  function open(name: string) { const nextPath = path === "/" ? `/${name}` : `${path}/${name}`; const next = resolveVirtualPath(ENTRIES, nextPath); if (!next) return; if (nextPath.startsWith("/系统")) { setFeedback("系统目录标记为只读；返回并寻找学习资料。" ); return; } setPath(nextPath); setFeedback(next.kind === "directory" ? `进入目录 ${nextPath}` : `打开文件 ${nextPath}`); }
  return <div className="advanced-lab file-system-lab"><h2>文件系统目录树挑战</h2><nav aria-label="当前文件路径" className="path-breadcrumbs"><button aria-current={path === "/" ? "page" : undefined} onClick={() => goTo("/")} type="button">🏠 根目录</button>{breadcrumbs.map((part, index) => { const target = `/${breadcrumbs.slice(0, index + 1).join("/")}`; return <span key={target}><b aria-hidden="true">›</b><button aria-current={target === path ? "page" : undefined} onClick={() => goTo(target)} type="button">{part}</button></span>; })}</nav><div className="file-explorer"><aside aria-label="目录树" className="file-tree"><strong>📁 根目录</strong><span className={path.startsWith("/学习资料") ? "is-current" : ""}>└─ 📁 学习资料</span><span className={path.startsWith("/学习资料/科学") ? "is-current" : ""}>　└─ 📁 科学</span><span className={found ? "is-current" : ""}>　　└─ 📄 星空.txt</span><span className="is-locked">└─ 🔒 系统（只读）</span></aside><section><p className="file-address">路径：{path}</p>{entry.kind === "directory" ? <div role="group">{entry.children.map((name) => <button key={name} onClick={() => open(name)} type="button">{name === "系统" ? "🔒" : "📁"} {name}</button>)}</div> : <p className="file-preview">📄 {entry.content}</p>}</section></div><p aria-live="polite" role="status">{feedback}</p>{found ? <button onClick={onComplete} type="button">完成路径查找</button> : null}</div>;
}
