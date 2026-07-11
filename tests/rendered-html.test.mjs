import assert from "node:assert/strict";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the Bit Island product shell", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<html lang="zh-CN"/i);
  assert.match(html, /<title>比特岛大冒险/);
  assert.match(html, /跟比比一起，学会真正的电脑本领/);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape/);
});

test("server-renders the complete curriculum map", async () => {
  const response = await render();
  const html = await response.text();

  assert.match(html, />继续冒险</);
  assert.match(html, /启航港/);
  assert.match(html, /文件森林/);
  assert.match(html, /机器人工坊/);
  assert.match(html, /安全灯塔/);
  assert.equal((html.match(/data-course-card=/g) ?? []).length, 20);
  assert.equal((html.match(/course-card--available/g) ?? []).length, 1);
  assert.equal((html.match(/course-card--locked/g) ?? []).length, 19);
  assert.equal((html.match(/disabled=""/g) ?? []).length, 19);
  assert.match(html, /data-course-id="keyboard-flight"/);
  assert.match(html, /即将开放/);
});
