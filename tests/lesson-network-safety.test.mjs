import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import test from "node:test";

const lessonRoots = [new URL("../components/lessons/", import.meta.url), new URL("../lib/", import.meta.url)];
const productRoots = [new URL("../components/", import.meta.url), new URL("../lib/", import.meta.url)];
function sourceFiles(directory) {
  return readdirSync(directory).flatMap((name) => {
    const url = new URL(name, directory.href.endsWith("/") ? directory : new URL(`${directory.href}/`));
    if (statSync(url).isDirectory()) return sourceFiles(new URL(`${url.href}/`));
    return /\.(?:ts|tsx|mjs)$/.test(name) ? [url] : [];
  });
}

test("keeps every child lesson free of real network and navigation APIs", () => {
  const forbidden = [/\bfetch\s*\(/, /XMLHttpRequest/, /\bWebSocket\s*\(/, /sendBeacon\s*\(/, /window\.location/, /location\.href/, /<a\s/i];
  for (const file of lessonRoots.flatMap(sourceFiles)) {
    const source = readFileSync(file, "utf8");
    for (const pattern of forbidden) assert.doesNotMatch(source, pattern, `${file.pathname} uses ${pattern}`);
  }
});

test("keeps the complete child product free of outbound network APIs", () => {
  const forbidden = [/\bfetch\s*\(/, /XMLHttpRequest/, /\bWebSocket\s*\(/, /\bEventSource\s*\(/, /sendBeacon\s*\(/];
  for (const file of productRoots.flatMap(sourceFiles)) {
    const source = readFileSync(file, "utf8");
    for (const pattern of forbidden) assert.doesNotMatch(source, pattern, `${file.pathname} uses ${pattern}`);
  }
});

test("uses only reserved example domains inside lesson simulations", () => {
  const urls = lessonRoots.flatMap(sourceFiles).flatMap((file) => [...readFileSync(file, "utf8").matchAll(/https?:\/\/([a-z0-9.-]+)/gi)].map((match) => [file.pathname, match[1]]));
  assert.ok(urls.length > 0);
  for (const [file, host] of urls) assert.ok(host === "example" || host.endsWith(".example"), `${file} contains non-example host ${host}`);
});
