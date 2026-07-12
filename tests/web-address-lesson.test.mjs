import assert from "node:assert/strict";
import test from "node:test";
import { inspectWebAddress, resolveVirtualHost } from "../lib/web-address-lesson.ts";
import { readFileSync } from "node:fs";

test("separates scheme, site identity, and path", () => {
  assert.deepEqual(inspectWebAddress("https://library.example/books/space", "library.example"), {
    valid: true, scheme: "https", host: "library.example", path: "/books/space", trustedHost: true,
  });
});

test("rejects lookalike hosts even when trusted words appear inside", () => {
  assert.equal(inspectWebAddress("https://library.example.bad.example/books", "library.example").trustedHost, false);
  assert.equal(inspectWebAddress("https://library-example.example/books", "library.example").trustedHost, false);
});

test("handles malformed addresses without navigating", () => {
  assert.equal(inspectWebAddress("not a web address", "library.example").valid, false);
});

test("resolves host names only inside a documentation-only virtual DNS range", () => {
  const safe = resolveVirtualHost("library.example");
  const lookalike = resolveVirtualHost("library.example.bad.example");
  assert.match(safe ?? "", /^192\.0\.2\.\d+$/);
  assert.match(lookalike ?? "", /^192\.0\.2\.\d+$/);
  assert.notEqual(safe, lookalike);
  assert.equal(resolveVirtualHost("not a host"), null);
});

test("inspector teaches children to read host labels from right to left", () => {
  const source = readFileSync(new URL("../components/lessons/network/AddressInspector.tsx", import.meta.url), "utf8");
  assert.match(source, /host-labels/);
  assert.match(source, /从右向左读/);
  assert.match(source, /网站身份核心/);
  assert.match(source, /可能迷惑人的前缀/);
  assert.match(source, /identity-comparison/);
  assert.match(source, /完成网址防伪训练/);
  assert.match(source, /virtual-dns-lookup/);
  assert.match(source, /查询虚拟 DNS 目录/);
  assert.match(source, /能找到数字地址.*不代表网站可信/s);
});
