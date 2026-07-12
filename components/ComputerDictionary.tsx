"use client";

import { useEffect, useState } from "react";
import { ISLANDS } from "@/lib/course-data";
import { searchDictionary } from "@/lib/computer-dictionary";
import { safelyRunSpeech } from "@/lib/lesson-audio";

export function ComputerDictionary({ soundEnabled, onStartCourse }: { soundEnabled: boolean; onStartCourse: (courseId: string) => void }) {
  const [query, setQuery] = useState("");
  const [canSpeak, setCanSpeak] = useState(false);
  const entries = searchDictionary(query);

  useEffect(() => {
    let cancelled = false;
    queueMicrotask(() => {
      if (!cancelled) setCanSpeak("speechSynthesis" in window && typeof window.SpeechSynthesisUtterance === "function");
    });
    return () => {
      cancelled = true;
      if ("speechSynthesis" in window) safelyRunSpeech(() => window.speechSynthesis.cancel());
    };
  }, []);

  useEffect(() => {
    if (!canSpeak) return;

    const stopWhenHidden = () => {
      if (document.visibilityState !== "visible") safelyRunSpeech(() => window.speechSynthesis.cancel());
    };

    if (!soundEnabled) safelyRunSpeech(() => window.speechSynthesis.cancel());
    document.addEventListener("visibilitychange", stopWhenHidden);
    return () => document.removeEventListener("visibilitychange", stopWhenHidden);
  }, [canSpeak, soundEnabled]);

  function speak(term: string, explanation: string, example: string) {
    if (!soundEnabled || !canSpeak || document.visibilityState !== "visible") return;
    const utterance = new window.SpeechSynthesisUtterance(`${term}。${explanation}。举个例子：${example}`);
    utterance.lang = "zh-CN";
    utterance.rate = 0.9;
    safelyRunSpeech(() => {
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    });
  }

  return (
    <section className="computer-dictionary" id="computer-dictionary" aria-labelledby="computer-dictionary-heading">
      <div className="dictionary-heading">
        <div><p className="section-kicker">比比电脑词典</p><h2 id="computer-dictionary-heading">会操作，也能把原理讲清楚</h2></div>
        <label>查一个词<input onChange={(event) => setQuery(event.target.value)} placeholder="例如：循环、CPU、AI" type="search" value={query} /></label>
      </div>
      <p className="dictionary-intro">每学完一课，找出相关词语，用自己的话向家长解释，再举一个新例子。</p>
      <p className="dictionary-result" role="status">找到 {entries.length} 个电脑词语</p>
      {entries.length ? <div className="dictionary-groups">
        {ISLANDS.map((island) => {
          const islandEntries = entries.filter((entry) => entry.islandId === island.id);
          if (!islandEntries.length) return null;
          return <details className="dictionary-group" key={`${island.id}-${query ? "search" : "browse"}`} open={query ? true : undefined}>
            <summary><span aria-hidden="true">{island.icon}</span><strong>{island.name}</strong><small>{islandEntries.length} 个词</small><span aria-hidden="true">＋</span></summary>
            <dl>{islandEntries.map((entry) => <div key={entry.id}>
              <dt>{entry.term}<small>{entry.english}</small></dt>
              <dd><p>{entry.explanation}</p><span><strong>举个例子：</strong>{entry.example}</span><div className="dictionary-actions"><button disabled={!soundEnabled || !canSpeak} onClick={() => speak(entry.term, entry.explanation, entry.example)} type="button">{!soundEnabled ? "声音已关闭" : canSpeak ? "🔊 听解释" : "浏览器不支持朗读"}</button><button onClick={() => onStartCourse(entry.courseId)} type="button">去学这节课 →</button></div></dd>
            </div>)}</dl>
          </details>;
        })}
      </div> : <div className="dictionary-empty"><span aria-hidden="true">🔎</span><p>还没有找到这个词。试试“文件”“网络”“函数”或 “AI”。</p><button onClick={() => setQuery("")} type="button">查看全部词语</button></div>}
    </section>
  );
}
