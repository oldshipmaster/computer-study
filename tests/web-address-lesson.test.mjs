import assert from "node:assert/strict";
import test from "node:test";
import { inspectWebAddress } from "../lib/web-address-lesson.ts";

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
