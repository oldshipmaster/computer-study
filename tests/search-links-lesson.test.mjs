import assert from "node:assert/strict";
import test from "node:test";
import { normalizeSearchTerms, rankSearchResults, INITIAL_TABS, updateTabs } from "../lib/search-links-lesson.ts";
import { readFileSync } from "node:fs";

test("turns a question into focused search terms", () => {
  assert.deepEqual(normalizeSearchTerms("我想知道 月亮 为什么 会变化？"), ["月亮", "为什么", "变化"]);
});

test("ranks fictional results by matching terms without claiming truth", () => {
  const results = rankSearchResults(["月亮", "变化"], [
    { id: "a", title: "月亮月相为什么变化", source: "science.example" },
    { id: "b", title: "最好玩的月亮游戏", source: "games.example" },
  ]);
  assert.equal(results[0].id, "a");
  assert.equal(results[0].matchCount, 2);
});

test("opens only fictional example links in virtual tabs", () => {
  const opened = updateTabs(INITIAL_TABS, { type: "open", url: "https://science.example/moon" });
  assert.equal(opened.tabs.length, 2);
  assert.equal(updateTabs(INITIAL_TABS, { type: "open", url: "https://real-site.com" }), INITIAL_TABS);
  const closed = updateTabs(opened, { type: "close", tabId: opened.activeTabId });
  assert.equal(closed.tabs.length, 1);
});

test("search lab requires evidence checks before finishing the best preview", () => {
  const source = readFileSync(new URL("../components/lessons/network/SearchLab.tsx", import.meta.url), "utf8");
  assert.match(source, /preview-evidence/);
  assert.match(source, /标题相关/);
  assert.match(source, /作者信息/);
  assert.match(source, /发布日期/);
  assert.match(source, /来源地址/);
  assert.match(source, /evidence\.length < 3/);
  assert.match(source, /只在虚拟标签页中练习/);
});
