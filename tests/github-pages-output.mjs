import assert from "node:assert/strict";
import { access, readFile, readdir } from "node:fs/promises";
import { gzipSync } from "node:zlib";
import test from "node:test";

const outputRoot = new URL("../out-pages/", import.meta.url);

test("emits a GitHub Pages artifact under the repository base path", async () => {
  const html = await readFile(new URL("index.html", outputRoot), "utf8");

  assert.match(html, /\/computer-study\/assets\//);
  assert.match(html, /\/computer-study\/favicon\.svg/);
  assert.match(html, /rel="apple-touch-icon" sizes="192x192" href="\/computer-study\/icon-192\.png"/);
  assert.match(html, /rel="sitemap" type="application\/xml" href="\/computer-study\/sitemap\.xml"/);
  assert.match(html, /九岛四十五课互动计算机课程/);
  assert.match(html, /rel="canonical" href="https:\/\/oldshipmaster\.github\.io\/computer-study\/"/);
  assert.match(html, /需要开启 JavaScript/);
  assert.match(html, /\/computer-study\/manifest\.webmanifest/);
  assert.match(html, /http-equiv="Content-Security-Policy"/);
  assert.match(html, /connect-src 'none'/);
  assert.match(html, /form-action 'none'/);
  assert.match(html, /name="referrer" content="no-referrer"/);
  assert.doesNotMatch(html, /(?:src|href)="\/assets\//);
  await access(new URL("favicon.svg", outputRoot));
  const serviceWorker = await readFile(new URL("sw.js", outputRoot), "utf8");
  assert.match(serviceWorker, /requestUrl\.origin !== scopeUrl\.origin/);
  assert.match(serviceWorker, /event\.request\.mode === "navigate"/);
  assert.match(serviceWorker, /mutableCoreFile/);
  assert.match(serviceWorker, /event\.request\.mode === "navigate" \? networkFirst\(event\.request, true\)/);
  assert.match(serviceWorker, /return Response\.error\(\)/);
  assert.match(serviceWorker, /html\.matchAll/);
  assert.match(serviceWorker, /url\.pathname\.startsWith\(scopeUrl\.pathname\)/);
  assert.match(serviceWorker, /cache\.addAll\(\[\.\.\.new Set/);
  assert.doesNotMatch(serviceWorker, /https?:\/\//);
  const manifest = JSON.parse(await readFile(new URL("manifest.webmanifest", outputRoot), "utf8"));
  assert.equal(manifest.name, "比特岛大冒险｜儿童计算机启蒙课");
  assert.equal(manifest.start_url, ".");
  assert.equal(manifest.display, "standalone");
  assert.equal(manifest.theme_color, "#12324a");
  assert.deepEqual(manifest.icons.slice(0, 2).map((icon) => [icon.src, icon.sizes, icon.type]), [
    ["icon-192.png", "192x192", "image/png"],
    ["icon-512.png", "512x512", "image/png"],
  ]);
  for (const [name, expectedSize] of [["icon-192.png", 192], ["icon-512.png", 512]]) {
    const png = await readFile(new URL(name, outputRoot));
    assert.equal(png.toString("ascii", 1, 4), "PNG");
    assert.equal(png.readUInt32BE(16), expectedSize);
    assert.equal(png.readUInt32BE(20), expectedSize);
  }
  const [robots, sitemap] = await Promise.all([
    readFile(new URL("robots.txt", outputRoot), "utf8"),
    readFile(new URL("sitemap.xml", outputRoot), "utf8"),
  ]);
  assert.match(robots, /Sitemap: https:\/\/oldshipmaster\.github\.io\/computer-study\/sitemap\.xml/);
  assert.match(sitemap, /<loc>https:\/\/oldshipmaster\.github\.io\/computer-study\/<\/loc>/);
  assert.equal((sitemap.match(/<url>/g) ?? []).length, 1);
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
