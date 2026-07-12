import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const outputRoot = new URL("../out-pages/", import.meta.url);

test("emits a GitHub Pages artifact under the repository base path", async () => {
  const html = await readFile(new URL("index.html", outputRoot), "utf8");

  assert.match(html, /\/computer-study\/assets\//);
  assert.match(html, /\/computer-study\/favicon\.svg/);
  assert.match(html, /九岛四十五课互动计算机课程/);
  assert.match(html, /rel="canonical" href="https:\/\/oldshipmaster\.github\.io\/computer-study\/"/);
  assert.match(html, /需要开启 JavaScript/);
  assert.doesNotMatch(html, /(?:src|href)="\/assets\//);
  await access(new URL("favicon.svg", outputRoot));
});
