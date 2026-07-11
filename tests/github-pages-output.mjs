import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const outputRoot = new URL("../out-pages/", import.meta.url);

test("emits a GitHub Pages artifact under the repository base path", async () => {
  const html = await readFile(new URL("index.html", outputRoot), "utf8");

  assert.match(html, /\/computer-study\/assets\//);
  assert.match(html, /\/computer-study\/favicon\.svg/);
  assert.doesNotMatch(html, /(?:src|href)="\/assets\//);
  await access(new URL("favicon.svg", outputRoot));
});
