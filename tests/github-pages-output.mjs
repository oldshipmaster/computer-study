import assert from "node:assert/strict";
import { access, readFile, readdir } from "node:fs/promises";
import { gzipSync } from "node:zlib";
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

test("keeps the complete curriculum inside a child-device performance budget", async () => {
  const assetNames = await readdir(new URL("assets/", outputRoot));
  const javascriptName = assetNames.find((name) => name.endsWith(".js"));
  const cssName = assetNames.find((name) => name.endsWith(".css"));
  assert.ok(javascriptName);
  assert.ok(cssName);
  const [html, javascript, css] = await Promise.all([
    readFile(new URL("index.html", outputRoot)),
    readFile(new URL(`assets/${javascriptName}`, outputRoot)),
    readFile(new URL(`assets/${cssName}`, outputRoot)),
  ]);
  assert.ok(html.byteLength <= 12 * 1024, `HTML is ${html.byteLength} bytes`);
  assert.ok(gzipSync(javascript).byteLength <= 160 * 1024, `JavaScript gzip is ${gzipSync(javascript).byteLength} bytes`);
  assert.ok(gzipSync(css).byteLength <= 30 * 1024, `CSS gzip is ${gzipSync(css).byteLength} bytes`);
});
