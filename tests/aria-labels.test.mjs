import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import test from "node:test";

function filesUnder(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const url = new URL(`${entry.name}${entry.isDirectory() ? "/" : ""}`, directory);
    return entry.isDirectory() ? filesUnder(url) : entry.name.endsWith(".tsx") ? [url] : [];
  });
}

test("every named div exposes a semantic role", () => {
  const componentRoot = new URL("../components/", import.meta.url);
  const unnamedRoles = filesUnder(componentRoot).flatMap((file) => {
    const source = readFileSync(file, "utf8");
    return source.split("\n").flatMap((line) => [...line.matchAll(/<div\b[^>]*>/g)]
      .map((match) => match[0])
      .filter((tag) => tag.includes("aria-label=") && !tag.includes("role="))
      .map((tag) => `${file.pathname}:${tag}`));
  });
  assert.deepEqual(unnamedRoles, []);
});
