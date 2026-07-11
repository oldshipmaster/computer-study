import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const globalCss = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");

function lessonSource() {
  return readFileSync(
    new URL("../components/KeyboardFlightLesson.tsx", import.meta.url),
    "utf8",
  );
}

function cssBlocks(selector) {
  const escapedSelector = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const matches = [...globalCss.matchAll(new RegExp(`${escapedSelector}\\s*\\{([^}]*)\\}`, "g"))];

  assert.ok(matches.length > 0, `Missing CSS block for ${selector}`);
  return matches.map((match) => match[1]);
}

function cssProperty(selector, property) {
  const escapedProperty = property.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const propertyPattern = new RegExp(`${escapedProperty}\\s*:\\s*([^;]+);`);
  const match = cssBlocks(selector)
    .map((block) => block.match(propertyPattern))
    .find(Boolean);

  assert.ok(match, `Missing ${property} in ${selector}`);
  return match[1].trim();
}

function pixelsAtMobileRoot(value) {
  if (value.endsWith("rem")) {
    return Number.parseFloat(value) * 16;
  }

  if (value.endsWith("px")) {
    return Number.parseFloat(value);
  }

  assert.fail(`Unsupported font-size unit: ${value}`);
}

function relativeLuminance(hex) {
  const channels = hex
    .match(/[a-f\d]{2}/gi)
    .map((channel) => Number.parseInt(channel, 16) / 255)
    .map((channel) =>
      channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4,
    );

  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

function contrastRatio(foreground, background) {
  const luminances = [relativeLuminance(foreground), relativeLuminance(background)].sort(
    (left, right) => right - left,
  );

  return (luminances[0] + 0.05) / (luminances[1] + 0.05);
}

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

test("keeps the playable keyboard-flight lesson contract in source", () => {
  const source = lessonSource();
  const childFacingLabels = [
    "方向键热身",
    "飞船训练场",
    "指令积木",
    "运行飞船",
    "再试一次",
    "键盘领航员",
  ];

  for (const label of childFacingLabels) {
    assert.match(source, new RegExp(label));
  }

  assert.match(source, /aria-live="polite"/);
  assert.match(source, /addEventListener\(["']keydown["']/);
});

test("keeps essential lesson-card copy readable for young learners", () => {
  const essentialCardSelectors = [
    ".course-number",
    ".course-status",
    ".course-card-copy > span",
    ".course-card-meta",
  ];

  for (const selector of essentialCardSelectors) {
    const fontSize = cssProperty(selector, "font-size");

    assert.ok(
      pixelsAtMobileRoot(fontSize) >= 16,
      `${selector} must remain at least 16px at the 680px mobile root size; received ${fontSize}`,
    );
  }
});

test("keeps normal deep-palette text at WCAG AA contrast", () => {
  const coralDeep = cssProperty(":root", "--coral-deep");
  const yellowDeep = cssProperty(":root", "--yellow-deep");
  const paper = cssProperty(":root", "--paper");
  const yellowSoft = cssProperty(":root", "--yellow-soft");

  assert.ok(
    contrastRatio(coralDeep, paper) >= 4.5,
    `--coral-deep on --paper must remain at least 4.5:1; received ${contrastRatio(
      coralDeep,
      paper,
    ).toFixed(2)}:1`,
  );
  assert.ok(
    contrastRatio(yellowDeep, yellowSoft) >= 4.5,
    `--yellow-deep on --yellow-soft must remain at least 4.5:1; received ${contrastRatio(
      yellowDeep,
      yellowSoft,
    ).toFixed(2)}:1`,
  );
});
