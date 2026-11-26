/* Converts the generated SVG illustrations into PNG for places that cannot
 * use SVG (VK ad creatives, social previews, screenshots in messages).
 *
 * Needs Playwright with Chromium. If it is missing, open the SVG files in a
 * browser and export them with any tool that can rasterise them.
 *
 *   npx playwright install chromium
 *   node scripts/export-png.mjs
 *
 * PNG output goes to docs/assets/img/png/ and is not published by the site
 * unless the HTML references it.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const imgDir = path.join(root, "docs", "assets", "img");
const outDir = path.join(imgDir, "png");

const jobs = [
  { file: "og-image.svg", size: { width: 1200, height: 630 }, scale: 1 },
  { file: "meal-hero.svg", size: { width: 800, height: 800 }, scale: 1 },
  { file: "meal-bowl.svg", size: { width: 700, height: 466 }, scale: 1 },
  { file: "meal-prep.svg", size: { width: 700, height: 466 }, scale: 1 },
  { file: "meal-kitchen.svg", size: { width: 700, height: 700 }, scale: 1 },
  // VK square creative, cropped around the plate
  { file: "meal-hero.svg", name: "vk-creative-1080.svg", size: { width: 1080, height: 1080 } },
];

let chromium;
try {
  ({ chromium } = await import("playwright"));
} catch {
  console.error("Playwright is not installed. Run: npm i -D playwright && npx playwright install chromium");
  process.exit(1);
}

fs.mkdirSync(outDir, { recursive: true });
const browser = await chromium.launch();

for (const job of jobs) {
  const svg = fs.readFileSync(path.join(imgDir, job.file), "utf8");
  const page = await browser.newPage({
    viewport: job.size,
    deviceScaleFactor: job.scale ?? 1,
  });
  await page.setContent(
    `<!doctype html><html><head><style>html,body{margin:0;padding:0;background:#f6f5ef}svg{display:block;width:${job.size.width}px;height:${job.size.height}px}</style></head><body>${svg}</body></html>`,
  );
  const name = (job.name ?? job.file).replace(/\.svg$/, ".png");
  await page.screenshot({ path: path.join(outDir, name), omitBackground: false });
  await page.close();
  console.log(`docs/assets/img/png/${name}`);
}

await browser.close();