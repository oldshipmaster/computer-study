import assert from "node:assert/strict";
import test from "node:test";
import { validateFileName, saveVirtualWork } from "../lib/name-your-work-lesson.ts";

test("accepts a descriptive child-safe name", () => {
  assert.deepEqual(validateFileName("海底世界-星期五.png", []), { valid: true, reason: "名称清楚，可以保存。" });
});

test("rejects empty, forbidden, private, and duplicate names", () => {
  assert.equal(validateFileName("  ", []).valid, false);
  assert.match(validateFileName("作品/最终版.png", []).reason, /不能使用/);
  assert.match(validateFileName("张小明13800138000.png", []).reason, /个人信息/);
  assert.match(validateFileName("海底世界.png", ["海底世界.png"]).reason, /已经存在/);
});

test("preserves the image extension and requires a save location", () => {
  assert.match(validateFileName("海底世界", []).reason, /\.png/);
  assert.equal(saveVirtualWork("海底世界.png", null, []).saved, false);
  assert.deepEqual(saveVirtualWork("海底世界.png", "我的作品/图画", []), { saved: true, fullPath: "我的作品/图画/海底世界.png", reason: "保存成功。" });
});
