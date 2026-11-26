// One-shot check that every external dependency is gone.
//
//   node scripts/check-external.mjs
//
// Fails when docs/ references a third-party host, so a page can never be
// published with a resource that may be unreachable inside Russia.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "docs");
const allowed = new Set(["slimsprint.ru", "www.w3.org"]);

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}

const problems = [];
for (const file of walk(root)) {
  if (!/\.(html|css|js|txt)$/i.test(file)) continue;
  const text = fs.readFileSync(file, "utf8");
  for (const match of text.matchAll(/https?:\/\/([^\s"'<>)]+)/g)) {
    const host = match[1].split("/")[0].replace(/^www\./, "");
    if (allowed.has(host) || host.endsWith("slimsprint.ru")) continue;
    if (match[0].includes("x-access-token") || host.includes("github.com")) continue;
    problems.push(`${path.relative(root, file)}: ${match[0].slice(0, 80)}`);
  }
}

if (problems.length) {
  console.error("External hosts found:\n" + problems.map((line) => " - " + line).join("\n"));
  process.exit(1);
}
console.log("No external dependencies in docs/.");