import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

async function read(path) {
  return readFile(new URL(path, root), "utf8");
}

test("defines an isolated GitHub Pages static build", async () => {
  const [packageJson, viteConfig, entry, html, css] = await Promise.all([
    read("package.json"),
    read("vite.pages.config.ts"),
    read("github-pages/main.tsx"),
    read("github-pages/index.html"),
    read("github-pages/pages.css"),
  ]);

  assert.match(packageJson, /"build:pages":\s*"vite build --config vite\.pages\.config\.ts"/);
  assert.match(packageJson, /"test:pages":\s*"npm run build:pages/);
  assert.match(packageJson, /"lint":[^\n]*--ignore-pattern out-pages/);
  assert.match(viteConfig, /GITHUB_PAGES_BASE_PATH/);
  assert.match(viteConfig, /outDir:\s*"\.\.\/out-pages"/);
  assert.match(viteConfig, /root:\s*"github-pages"/);
  assert.match(entry, /createRoot/);
  assert.match(entry, /<BitIslandApp\s*\/>/);
  assert.match(entry, /app\/globals\.css/);
  assert.match(html, /比特岛大冒险｜儿童计算机启蒙课/);
  assert.match(html, /%BASE_URL%favicon\.svg/);
  assert.match(css, /--font-geist-sans/);
});

test("deploys the static artifact with the official Pages actions", async () => {
  const workflow = await read(".github/workflows/deploy-pages.yml");

  assert.match(workflow, /pages:\s*write/);
  assert.match(workflow, /id-token:\s*write/);
  assert.match(workflow, /actions\/configure-pages@v5/);
  assert.match(workflow, /actions\/upload-pages-artifact@v4/);
  assert.match(workflow, /actions\/deploy-pages@v4/);
  assert.match(workflow, /npm run build:pages/);
  assert.match(workflow, /GITHUB_PAGES_BASE_PATH:\s*\/computer-study\//);
  assert.match(workflow, /path:\s*\.\/out-pages/);
});
