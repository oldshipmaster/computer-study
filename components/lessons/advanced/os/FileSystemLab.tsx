"use client";

import { useState } from "react";
import { resolveVirtualPath, type VirtualEntry } from "@/lib/advanced-foundations/operating-system";

const ENTRIES: Record<string, VirtualEntry> = { "/": { kind: "directory", children: ["学习资料", "系统"] }, "/学习资料": { kind: "directory", children: ["科学"] }, "/学习资料/科学": { kind: "directory", children: ["星空.txt"] }, "/学习资料/科学/星空.txt": { kind: "file", content: "虚构星空笔记" }, "/系统": { kind: "directory", children: ["设置.dat"] }, "/系统/设置.dat": { kind: "file", content: "只读的虚拟系统设置" } };

export function FileSystemLab({ onComplete }: { onComplete: () => void }) {
  const [path, setPath] = useState("/");
  const [feedback, setFeedback] = useState("从根目录开始，找到学习资料中的星空笔记。" );
  const entry = resolveVirtualPath(ENTRIES, path)!;
  const found = path === "/学习资料/科学/星空.txt";
  function open(name: string) { const nextPath = path === "/" ? `/${name}` : `${path}/${name}`; const next = resolveVirtualPath(ENTRIES, nextPath); if (!next) return; if (nextPath.startsWith("/系统")) { setFeedback("系统目录标记为只读；返回并寻找学习资料。" ); return; } setPath(nextPath); setFeedback(next.kind === "directory" ? `进入目录 ${nextPath}` : `打开文件 ${nextPath}`); }
  return <div className="advanced-lab file-system-lab"><h2>文件系统目录树挑战</h2><p className="file-address">路径：{path}</p>{entry.kind === "directory" ? <div role="group">{entry.children.map((name) => <button key={name} onClick={() => open(name)} type="button">{name}</button>)}</div> : <p>{entry.content}</p>}<p role="status">{feedback}</p>{found ? <button onClick={onComplete} type="button">完成路径查找</button> : path !== "/" ? <button onClick={() => { setPath("/"); setFeedback("已回到根目录。" ); }} type="button">返回根目录</button> : null}</div>;
}
