// Resolves {{PLACEHOLDER}} tokens in docs/*.html from docs/assets/legal-data.txt.
//
//   node scripts/build-legal.mjs          # resolve and write the pages in place
//   node scripts/build-legal.mjs --check  # dry run: fail on unresolved tokens
//
// A REQUIRED token must have a value. An optional token that is empty is
// removed from sentences that the template writes as {{TOKEN_SEGMENT}},
// which contain their own leading separator.
//
// Optional sentence parts use the SEP_ prefix: an empty SEP_TOKEN resolves
// to nothing, a filled one is read verbatim, including its leading separator.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const docsDir = path.join(root, "docs");
const dataFile = path.join(docsDir, "assets", "legal-data.txt");

function readData(file) {
  const values = new Map();
  if (!fs.existsSync(file)) return values;
  for (const line of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq < 1) continue;
    values.set(trimmed.slice(0, eq).trim(), trimmed.slice(eq + 1).trim());
  }
  return values;
}

const data = readData(dataFile);
const required = new Set(
  (data.get("REQUIRED") || "")
    .split(",")
    .map((name) => name.trim())
    .filter(Boolean),
);

const checkOnly = process.argv.includes("--check");
const pages = fs.readdirSync(docsDir).filter((name) => name.endsWith(".html"));
const problems = [];
const outputs = new Map();
let resolvedCount = 0;

for (const page of pages) {
  const file = path.join(docsDir, page);
  const source = fs.readFileSync(file, "utf8");
  const resolved = source.replace(/\{\{([A-Z0-9_]+)\}\}/g, (match, name) => {
    if (!data.has(name)) {
      problems.push(`${page}: unknown placeholder ${match}`);
      return match;
    }
    const value = data.get(name);
    if (!value && required.has(name)) {
      problems.push(`${page}: required placeholder ${match} is empty`);
      return match;
    }
    resolvedCount += 1;
    return value;
  });
  if (/\{\{[A-Z0-9_]+\}\}/.test(resolved)) {
    problems.push(`${page}: unresolved placeholders remain`);
  }
  outputs.set(file, resolved);
}

const missingRequired = [...required].filter((name) => !data.get(name));
if (missingRequired.length) {
  problems.push(`legal-data.txt: required values are empty: ${missingRequired.join(", ")}`);
}

if (problems.length) {
  console.error("Legal build problems:\n" + problems.map((line) => " - " + line).join("\n"));
  if (checkOnly) process.exit(1);
}

if (checkOnly) {
  console.log(`Check passed: ${resolvedCount} placeholders across ${outputs.size} pages.`);
  process.exit(0);
}

for (const [file, content] of outputs) fs.writeFileSync(file, content);
console.log(`Resolved ${resolvedCount} placeholders in ${outputs.size} pages.`);