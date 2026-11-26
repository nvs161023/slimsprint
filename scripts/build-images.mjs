/* SlimSprint — self-contained SVG illustrations.
 *
 * Each file is a standalone SVG with no external fonts or images, so it
 * renders identically everywhere, weighs a few kilobytes and can never be
 * blocked by a network. Replace a file with a real photo of the same
 * dimensions (and matching name) to swap the group.
 *
 * Palette matches the landing page tokens:
 *   paper #f6f5ef, white #fffefa, sage #647b65, sage-dark #405a45,
 *   lime #dce7c9, line #e5e7de, sand #eee9dd, ink #202a22
 *
 *   node scripts/build-images.mjs
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const outDir = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
  "docs",
  "assets",
  "img",
);
fs.mkdirSync(outDir, { recursive: true });

const P = {
  paper: "#f6f5ef",
  white: "#fffefa",
  sage: "#647b65",
  dark: "#405a45",
  lime: "#dce7c9",
  line: "#e5e7de",
  sand: "#eee9dd",
  ink: "#202a22",
  leaf: "#7e9a72",
  leafMid: "#94ab86",
  leafLight: "#b3c4a2",
  grainL: "#ecdcb6",
  grainM: "#dcc796",
  grainD: "#c4ab74",
  tomato: "#d4685a",
  tomatoD: "#b8503f",
  carrot: "#e0965a",
  carrotD: "#cc7a3f",
  egg: "#fdfbf4",
  yolk: "#f2c964",
  table: "#5d4a3b",
  tableD: "#4b3b2f",
  board: "#e6d3ac",
  boardIn: "#eeddba",
};

// Tiny seeded RNG so repeated builds produce identical files.
function rng(seed) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function svg(w, h, title, body) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-label="${title}">
<title>${title}</title>
${body}
</svg>
`;
}

// Grain: two layers of small seeds with soft shadow.
function seeds(cx, cy, rx, ry, n, seed, fill = P.grainL) {
  const r = rng(seed);
  let dark = "";
  let light = "";
  for (let i = 0; i < n; i += 1) {
    const a = r() * Math.PI * 2;
    const d = Math.sqrt(r());
    const x = (cx + Math.cos(a) * rx * d).toFixed(1);
    const y = (cy + Math.sin(a) * ry * d).toFixed(1);
    const rot = Math.round(a * 57);
    const el = `<ellipse cx="${x}" cy="${y}" rx="5.2" ry="3.3" transform="rotate(${rot} ${x} ${y})"/>`;
    dark += el;
    light += `<ellipse cx="${(+x + 0.8).toFixed(1)}" cy="${(+y - 0.8).toFixed(1)}" rx="3.4" ry="2" transform="rotate(${rot} ${x} ${y})"/>`;
  }
  return `<g fill="${P.grainD}" opacity=".85">${dark}</g><g fill="${fill}">${light}</g>`;
}

function leaves(x, y, s, rot, c1 = P.leaf, c2 = P.leafMid) {
  return `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})">
    <ellipse cx="-6" cy="4" rx="34" ry="15" transform="rotate(-24)" fill="${c1}"/>
    <ellipse cx="26" cy="-8" rx="30" ry="13" transform="rotate(18)" fill="${c2}"/>
    <ellipse cx="6" cy="-26" rx="26" ry="12" transform="rotate(-64)" fill="${c1}"/>
    <path d="M-34 10 q30 10 60 -6" stroke="#6d8763" stroke-width="2.4" fill="none" opacity=".55"/>
    <path d="M-4 -6 q22 -14 44 -6" stroke="#6d8763" stroke-width="2" fill="none" opacity=".45"/>
  </g>`;
}

function tomato(cx, cy, r) {
  const stem = `M${cx} ${cy - r * 0.98} l${r * 0.14} ${r * 0.24} l${r * 0.26} ${-r * 0.08} l${-r * 0.1} ${r * 0.26} l${r * 0.22} ${r * 0.18} l${-r * 0.28} ${r * 0.03} l${r * 0.02} ${r * 0.24} l${-r * 0.22} ${-r * 0.16} l${-r * 0.2} ${r * 0.2} l${-r * 0.02} ${-r * 0.26} l${-r * 0.26} ${-r * 0.06} l${r * 0.2} ${-r * 0.18} l${-r * 0.14} ${-r * 0.22} l${r * 0.26} ${r * 0.05} Z`;
  return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${P.tomato}"/>
  <path d="M${cx - r * 0.7} ${cy + r * 0.15} A${r * 0.82} ${r * 0.82} 0 0 0 ${cx + r * 0.42} ${cy + r * 0.72}" stroke="${P.tomatoD}" stroke-width="${r * 0.16}" fill="none" opacity=".45"/>
  <ellipse cx="${cx - r * 0.32}" cy="${cy - r * 0.34}" rx="${r * 0.26}" ry="${r * 0.18}" transform="rotate(-28 ${cx - r * 0.32} ${cy - r * 0.34})" fill="#f6b3a6" opacity=".85"/>
  <path d="${stem}" fill="${P.sage}"/>
  <path d="M${cx - r * 0.2} ${cy - r * 1.05} q${r * 0.2} ${-r * 0.22} ${r * 0.42} ${-r * 0.12}" stroke="${P.dark}" stroke-width="${r * 0.1}" fill="none" stroke-linecap="round"/>`;
}

function carrot(x, y, s, rot = 0) {
  return `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})">
    <path d="M0 0 C12 8 18 22 15 36 C12 54 2 70 -9 80 C-17 87 -25 84 -21 74 C-16 58 -9 42 1 28 C-5 20 -7 8 0 0 Z" fill="${P.carrot}"/>
    <path d="M-1 6 C-9 24 -13 46 -14 70" stroke="${P.carrotD}" stroke-width="2.6" fill="none" opacity=".55"/>
    <path d="M3 10 C-1 28 -4 48 -5 68" stroke="${P.carrotD}" stroke-width="2" fill="none" opacity=".4"/>
    <path d="M-2 5 C-12 -6 -17 -17 -14 -27 C-4 -21 3 -9 4 0 Z" fill="${P.sage}"/>
    <path d="M3 3 C6 -10 14 -20 26 -25 C23 -13 15 -2 7 6 Z" fill="${P.leafMid}"/>
    <path d="M0 2 C-2 -12 2 -24 12 -32 C13 -19 9 -6 4 3 Z" fill="${P.leafLight}"/>
  </g>`;
}

function egg(x, y, rot) {
  return `<g transform="translate(${x} ${y}) rotate(${rot})">
    <ellipse cx="0" cy="0" rx="24" ry="17" fill="${P.egg}"/>
    <ellipse cx="-1.5" cy="0.5" rx="24" ry="17" fill="none" stroke="#efe9d8" stroke-width="1.6"/>
    <circle cx="-3" cy="-1" r="10" fill="${P.yolk}"/>
    <circle cx="-6" cy="-4" r="3.6" fill="#fbe3a6" opacity=".9"/>
  </g>`;
}

function chickpeas(cx, cy, n, seed, r = 7) {
  const rand = rng(seed);
  let out = "";
  for (let i = 0; i < n; i += 1) {
    const a = rand() * Math.PI * 2;
    const d = Math.sqrt(rand()) * 34;
    const x = (cx + Math.cos(a) * d).toFixed(1);
    const y = (cy + Math.sin(a) * d * 0.7).toFixed(1);
    out += `<circle cx="${x}" cy="${y}" r="${(r * (0.8 + rand() * 0.35)).toFixed(1)}" fill="${P.sand}"/>
    <circle cx="${x}" cy="${y}" r="${(r * 0.55).toFixed(1)}" fill="#e3dccb"/>`;
  }
  return `<g>${out}</g>`;
}

const archClip = (id, x, y, w, h, r) =>
  `<clipPath id="${id}"><path d="M${x} ${y + h} V${y + r} A${r} ${r} 0 0 1 ${x + r} ${y} H${x + w - r} A${r} ${r} 0 0 1 ${x + w} ${y + r} V${y + h} Z"/></clipPath>`;

const shadow = (cx, cy, rx, ry, o = 0.16) =>
  `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="#2f3b2f" opacity="${o}"/>`;

// ---------------------------------------------------------------- plates ---

function plateHero() {
  const cx = 400;
  const cy = 400;
  let b = `<defs>
    <radialGradient id="table" cx="50%" cy="40%" r="75%">
      <stop offset="0" stop-color="#6a5443"/><stop offset="1" stop-color="#46382d"/>
    </radialGradient>
    <radialGradient id="plateGloss" cx="38%" cy="30%" r="70%">
      <stop offset="0" stop-color="#ffffff"/><stop offset=".75" stop-color="#fbf9f2"/><stop offset="1" stop-color="#ece7da"/>
    </radialGradient>
    <radialGradient id="innerGloss" cx="42%" cy="34%" r="70%">
      <stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#f4f1e6"/>
    </radialGradient>
  </defs>
  <rect width="800" height="800" fill="url(#table)"/>
  ${[...Array(7)].map((_, i) => `<rect x="${i * 118}" width="2" height="800" fill="${P.tableD}" opacity=".55"/>`).join("")}
  <ellipse cx="400" cy="430" rx="330" ry="330" fill="#2f3b2f" opacity=".22"/>
  <circle cx="${cx}" cy="${cy}" r="300" fill="url(#plateGloss)"/>
  <circle cx="${cx}" cy="${cy}" r="292" fill="none" stroke="#ded7c6" stroke-width="2"/>
  <circle cx="${cx}" cy="${cy}" r="258" fill="url(#innerGloss)"/>
  <circle cx="${cx}" cy="${cy}" r="258" fill="none" stroke="#e8e2d3" stroke-width="3"/>`;

  // quinoa base with herby edge
  b += seeds(352, 330, 120, 96, 46, 11);
  b += seeds(470, 470, 96, 84, 34, 23);
  b += seeds(300, 500, 86, 74, 28, 37);

  // chickpeas
  b += chickpeas(505, 300, 11, 5);
  b += chickpeas(300, 420, 7, 19);

  // greens
  b += leaves(330, 300, 1.25, -14);
  b += leaves(470, 250, 1.05, 24, P.leafMid, P.leafLight);
  b += leaves(560, 430, 0.95, 46, P.leaf, P.leafMid);
  b += leaves(260, 470, 0.85, 12, P.leafLight, P.leafMid);

  // tomatoes, carrot slices, egg
  b += tomato(330, 560, 38);
  b += tomato(272, 596, 26);
  b += carrot(560, 250, 1.05, -18);
  b += egg(470, 590, -10);
  b += egg(540, 596, 14);
  b += `<circle cx="420" cy="520" r="18" fill="${P.leafLight}"/><circle cx="420" cy="520" r="9" fill="${P.leaf}" opacity=".55"/>`;
  b += `<circle cx="620" cy="350" r="14" fill="${P.carrot}" opacity=".85"/>`;
  return b;
}

function plateBowl() {
  const cx = 350;
  const cy = 225;
  let b = `<defs>
    <radialGradient id="bowlBg" cx="50%" cy="30%" r="80%">
      <stop offset="0" stop-color="#f2f4ea"/><stop offset="1" stop-color="#e2e6d6"/>
    </radialGradient>
    <radialGradient id="bowl" cx="40%" cy="30%" r="72%">
      <stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#f3f0e5"/>
    </radialGradient>
  </defs>
  <rect width="700" height="466" fill="url(#bowlBg)"/>
  <rect y="350" width="700" height="116" fill="#dfe4d3"/>
  ${shadow(350, 384, 186, 26)}
  <circle cx="${cx}" cy="${cy}" r="172" fill="url(#bowl)"/>
  <circle cx="${cx}" cy="${cy}" r="172" fill="none" stroke="#e6e0d0" stroke-width="2"/>
  <circle cx="${cx}" cy="${cy}" r="150" fill="#f8f6ee"/>`;

  b += seeds(350, 235, 92, 74, 34, 41);
  b += chickpeas(420, 196, 8, 9, 6);
  b += leaves(300, 178, 1.05, -18);
  b += leaves(410, 168, 0.85, 28, P.leafMid, P.leafLight);
  b += tomato(266, 286, 28);
  b += tomato(438, 292, 23);
  b += carrot(468, 200, 0.72, 24);
  b += `<path d="M300 300 q38 26 82 4" stroke="${P.leaf}" stroke-width="6" fill="none" stroke-linecap="round"/>`;
  b += `<circle cx="350" cy="252" r="9" fill="${P.grainD}" opacity=".6"/>`;
  return b;
}

function platePrep() {
  let b = `<defs>
    <linearGradient id="prepBg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#f6f3ea"/><stop offset="1" stop-color="#ece8da"/>
    </linearGradient>
    <linearGradient id="boardIn" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${P.boardIn}"/><stop offset="1" stop-color="#e3cda3"/>
    </linearGradient>
  </defs>
  <rect width="700" height="466" fill="url(#prepBg)"/>
  <rect y="330" width="700" height="136" fill="#e6e1d2"/>
  ${shadow(350, 372, 250, 18, 0.12)}
  <rect x="76" y="104" width="548" height="256" rx="30" fill="${P.board}"/>
  <rect x="88" y="116" width="524" height="232" rx="24" fill="url(#boardIn)"/>
  <path d="M120 116 V348 M580 116 V348" stroke="#dfc9a0" stroke-width="3" opacity=".8"/>`;

  b += seeds(212, 236, 74, 56, 26, 7);
  b += leaves(300, 286, 0.92, 16);
  b += tomato(372, 208, 30);
  b += tomato(420, 250, 22);
  b += carrot(462, 176, 0.88, 12);
  b += egg(300, 178, 8);
  b += chickpeas(530, 270, 7, 13, 7);
  b += `<circle cx="530" cy="228" r="26" fill="${P.leafLight}"/><circle cx="530" cy="228" r="14" fill="${P.leaf}" opacity=".5"/>`;
  b += `<path d="M120 336 h460" stroke="#dccba6" stroke-width="8" stroke-linecap="round" opacity=".7"/>`;
  return b;
}

function bandKitchen() {
  let b = `<defs>
    <linearGradient id="kitBg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#f2efe4"/><stop offset="1" stop-color="#e6e4d4"/>
    </linearGradient>
  </defs>
  <rect width="700" height="700" fill="url(#kitBg)"/>
  <rect y="470" width="700" height="230" fill="#e3dfd0"/>
  ${shadow(350, 610, 280, 26, 0.12)}
  <rect x="60" y="70" width="580" height="560" rx="34" fill="${P.board}"/>
  <rect x="74" y="84" width="552" height="532" rx="26" fill="${P.boardIn}"/>
  <path d="M112 84 V616 M588 84 V616" stroke="#dfc9a0" stroke-width="4" opacity=".8"/>`;

  b += seeds(228, 210, 100, 80, 34, 17);
  b += seeds(430, 270, 76, 62, 24, 29);
  b += leaves(230, 330, 1.35, -12);
  b += leaves(452, 176, 1.15, 24, P.leafMid, P.leafLight);
  b += tomato(330, 430, 38);
  b += tomato(282, 480, 28);
  b += carrot(486, 386, 1.2);
  b += egg(232, 152, -8);
  b += chickpeas(484, 470, 10, 3);
  b += `<circle cx="560" cy="520" r="20" fill="${P.leafLight}"/><circle cx="560" cy="520" r="10" fill="${P.leaf}" opacity=".5"/>`;
  b += `<rect x="156" y="548" width="300" height="10" rx="5" fill="#dccba6" opacity=".8"/>`;
  return b;
}

// --------------------------------------------------------------- og card ---

function ogCard() {
  let b = `<defs>
    <linearGradient id="ogBg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#f8f7f1"/><stop offset="1" stop-color="#eef1e6"/>
    </linearGradient>
    <linearGradient id="ogArch" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#dfe7d1"/><stop offset="1" stop-color="#cfdabb"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#ogBg)"/>
  ${archClip("ogArchClip", 690, 60, 450, 510, 205)}
  <g clip-path="url(#ogArchClip)">
    <rect x="690" y="60" width="450" height="510" fill="url(#ogArch)"/>
    <circle cx="915" cy="330" r="168" fill="#fbf9f2"/>
    <circle cx="915" cy="330" r="146" fill="#ffffff"/>
    ${seeds(915, 330, 96, 78, 30, 51)}
    ${leaves(880, 270, 0.95, -16)}
    ${tomato(840, 384, 26)}
    ${tomato(940, 396, 20)}
    ${chickpeas(980, 300, 6, 8, 6)}
    ${carrot(1000, 240, 0.7, 20)}
  </g>
  <rect x="80" y="118" width="58" height="3" rx="1.5" fill="${P.sage}"/>
  <text x="156" y="126" font-family="Segoe UI, Arial, sans-serif" font-size="19" font-weight="700" letter-spacing="3.6" fill="${P.sage}">НОВЫЙ ПОДХОД К ПИТАНИЮ</text>
  <text x="78" y="248" font-family="Segoe UI, Arial, sans-serif" font-size="72" font-weight="800" letter-spacing="-2" fill="${P.ink}">Питание, которое</text>
  <text x="78" y="332" font-family="Georgia, Times New Roman, serif" font-style="italic" font-size="76" letter-spacing="-1" fill="${P.sage}">вписывается</text>
  <text x="78" y="416" font-family="Segoe UI, Arial, sans-serif" font-size="72" font-weight="800" letter-spacing="-2" fill="${P.ink}">в твою жизнь.</text>
  <text x="80" y="486" font-family="Segoe UI, Arial, sans-serif" font-size="25" fill="#5c6a61">Персональный план на 30 дней: меню, рецепты и гибкий режим.</text>
  <rect x="80" y="524" width="252" height="58" rx="29" fill="${P.dark}"/>
  <text x="206" y="561" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="21" font-weight="700" fill="#ffffff">Ранний доступ</text>
  <text x="1120" y="600" text-anchor="end" font-family="Segoe UI, Arial, sans-serif" font-size="17" fill="#6b766d">slimsprint.ru</text>`;
  return b;
}

const files = {
  "meal-hero.svg": svg(800, 800, "Сбалансированный приём пищи: овощи, крупа и зелень", plateHero()),
  "meal-bowl.svg": svg(700, 466, "Боул с крупой, овощами и зеленью", plateBowl()),
  "meal-prep.svg": svg(700, 466, "Простые продукты и понятные шаги приготовления", platePrep()),
  "meal-kitchen.svg": svg(700, 700, "Свежие продукты для домашнего приготовления", bandKitchen()),
  "og-image.svg": svg(1200, 630, "SlimSprint — питание, которое вписывается в твою жизнь", ogCard()),
};

for (const [name, content] of Object.entries(files)) {
  fs.writeFileSync(path.join(outDir, name), content, "utf8");
  console.log(`${name}: ${Buffer.byteLength(content)} bytes`);
}