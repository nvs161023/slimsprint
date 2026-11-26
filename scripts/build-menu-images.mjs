/* Builds the shopping list and weekly menu illustrations for the landing.
 *
 * Both drawings are also a specification for the personal account: the same
 * data (days, dishes, quantities, categories, checkboxes) is what the cabinet
 * will render from the user's generated plan, so the layout can be reused
 * almost unchanged.
 *
 *   node scripts/build-menu-images.mjs
 *
 * Output: docs/assets/img/shopping-list.svg and weekly-menu.svg
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

const SHOPPING_W = 900;
const MENU_W = 1200;

const C = {
  paper: "#f6f5ef",
  card: "#fffefa",
  ink: "#202a22",
  muted: "#68736a",
  line: "#e5e7de",
  sage: "#647b65",
  dark: "#405a45",
  lime: "#dce7c9",
  limeSoft: "#eef2e4",
  sand: "#f1ece0",
  sandLine: "#e3dccb",
  check: "#8aa07e",
};

const FONT = "'Manrope','Segoe UI',Arial,sans-serif";
const BODY = "'DM Sans','Segoe UI',Arial,sans-serif";

const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function text(x, y, str, { size = 14, weight = 400, fill = C.ink, anchor = "start", family = BODY, opacity = 1 } = {}) {
  return `<text x="${x}" y="${y}" font-family="${family}" font-size="${size}" font-weight="${weight}" fill="${fill}" text-anchor="${anchor}" opacity="${opacity}">${esc(str)}</text>`;
}

function roundRect(x, y, w, h, r, fill, stroke) {
  const s = stroke ? ` stroke="${stroke}" stroke-width="1"` : "";
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}"${s}/>`;
}

function checkIcon(x, y, checked = true) {
  const box = checked
    ? `<rect x="${x}" y="${y}" width="18" height="18" rx="6" fill="${C.check}"/>
       <path d="M${x + 5} ${y + 9.5} l3 3 l5 -6" stroke="#ffffff" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`
    : `<rect x="${x}" y="${y}" width="18" height="18" rx="6" fill="#ffffff" stroke="${C.sandLine}"/>
       <path d="M${x + 5} ${y + 9.5} l3 3 l5 -6" stroke="#ffffff" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
  return box;
}

/* ------------------------------------------------------------ shopping --- */

const list = {
  title: "Список покупок",
  subtitle: "Неделя 1 · по категориям",
  groups: [
    {
      name: "Овощи и фрукты",
      items: [
        ["Помидоры", "1 кг"],
        ["Огурцы", "500 г"],
        ["Морковь", "700 г"],
        ["Яблоки", "1 кг"],
      ],
    },
    {
      name: "Белок",
      items: [
        ["Яйца", "10 шт"],
        ["Куриная грудка", "900 г"],
        ["Творог 5%", "400 г"],
      ],
    },
    {
      name: "Крупы и бакалея",
      items: [
        ["Киноа", "400 г"],
        ["Гречка", "700 г"],
        ["Оливковое масло", "1 шт"],
      ],
    },
  ],
  checkedFirst: 2,
};

function shoppingList() {
  const W = SHOPPING_W;
  const pad = 34;
  const colW = (W - pad * 2 - 28) / 2;

  let y = 0;
  const parts = [];

  // Card height depends on the tallest column, so it is computed first.
  const cardTops = [150, 150, 404];
  const cardBottoms = cardTops.map((top, gi) => top + 44 + (list.groups[gi].items?.length ?? 3) * 44 + 10);
  const gridBottom = Math.max(...cardBottoms);

  // Card
  parts.push(roundRect(0, 0, W, gridBottom + 96, 0, "#f3f2ec"));

  // Header
  const hx = pad + 26;
  let hy = 62;
  parts.push(roundRect(pad, 26, W - pad * 2, 92, 22, C.card));
  parts.push(roundRect(hx, hy - 18, 44, 44, 14, C.lime));
  parts.push(
    `<path d="M${hx + 12} ${hy - 6} h20 l-2 20 h-16 Z" fill="none" stroke="${C.dark}" stroke-width="2" stroke-linejoin="round"/>` +
      `<path d="M${hx + 16} ${hy + 14} v4 a6 6 0 0 0 6 6 h4 a6 6 0 0 0 6 -6 v-4" fill="none" stroke="${C.dark}" stroke-width="2" stroke-linecap="round"/>` +
      `<path d="M${hx + 17} ${hy - 6} l1.5 -6 h13 l1.5 6" fill="none" stroke="${C.dark}" stroke-width="2" stroke-linejoin="round"/>`,
  );
  parts.push(text(hx + 60, hy - 2, list.title, { size: 21, weight: 800, family: FONT }));
  parts.push(text(hx + 60, hy + 20, list.subtitle, { size: 13, fill: C.muted }));
  parts.push(roundRect(W - pad - 148, hy - 4, 122, 36, 18, C.limeSoft));
  parts.push(text(W - pad - 87, hy + 18, "14 из 20", { size: 12, weight: 700, fill: C.dark, anchor: "middle" }));

  // Columns
  let itemIndex = 0;
  const groupTops = cardTops;
  list.groups.forEach((group, gi) => {
    const col = gi === 2 ? 0 : gi;
    const x = pad + col * (colW + 28);
    const top = groupTops[gi];
    const rowH = 44;
    const rows = group.items?.length ?? 0;
    if (!group.items) {
      // "Список собирается" card in the empty slot, kept inside the grid
      const cardH = 44 + 3 * rowH + 10;
      parts.push(roundRect(x, top, colW, cardH, 20, "#eef1e6"));
      parts.push(
        text(x + colW / 2, top + cardH / 2 - 30, "+", { size: 34, weight: 400, fill: C.sage, anchor: "middle", family: FONT }),
      );
      parts.push(text(x + colW / 2, top + cardH / 2 + 2, "Список собирается", { size: 15, weight: 700, anchor: "middle", family: FONT }));
      parts.push(
        text(x + colW / 2, top + cardH / 2 + 26, "по вашему меню на неделю", { size: 12, fill: C.muted, anchor: "middle" }),
      );
      return;
    }
    const cardH = 44 + rows * rowH + 10;
    parts.push(roundRect(x, top, colW, cardH, 20, C.card));
    parts.push(text(x + 22, top + 28, group.name, { size: 12, weight: 700, fill: C.sage, family: FONT }));
    group.items.forEach((item, i) => {
      const ry = top + 44 + i * rowH;
      const checked = itemIndex < list.checkedFirst;
      itemIndex += 1;
      parts.push(checkIcon(x + 22, ry + 10, checked));
      parts.push(
        text(x + 52, ry + 24, item[0], {
          size: 14,
          weight: 600,
          fill: checked ? "#8b948b" : C.ink,
          opacity: checked ? 0.85 : 1,
        }),
      );
      parts.push(text(x + colW - 22, ry + 24, item[1], { size: 13, fill: C.muted, anchor: "end" }));
      if (i < rows - 1) {
        parts.push(
          `<line x1="${x + 22}" y1="${ry + rowH}" x2="${x + colW - 22}" y2="${ry + rowH}" stroke="${C.line}"/>`,
        );
      }
    });
  });

  // Footer note, below the grid
  const footerY = gridBottom + 24;
  parts.push(roundRect(pad, gridBottom + 8, W - pad * 2, 2, 1, C.line));
  parts.push(
    text(pad, footerY + 14, "Порции рассчитаны под ваш режим питания и пересчитываются при замене блюда.", {
      size: 12,
      fill: C.muted,
    }),
  );
  parts.push(text(pad, footerY + 36, "Иллюстрация показывает принцип списка, а не готовые данные.", { size: 11, fill: "#8b948b" }));

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${gridBottom + 96}" width="${W}" height="${gridBottom + 96}" role="img" aria-label="Пример списка покупок по категориям">
<title>Пример списка покупок по категориям</title>
${parts.join("\n")}
</svg>
`;
}

/* --------------------------------------------------------------- menu --- */

const menu = {
  title: "Меню на неделю",
  subtitle: "Режим: 3 приёма + 1 перекус",
  days: ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"],
  meals: ["Завтрак", "Обед", "Перекус", "Ужин"],
  cells: [
    // awake / breakfast / lunch / snack / dinner (short names)
    ["Овсянка с ягодами", "Боул с киноа", "Йогурт и яблоко", "Омлет с овощами"],
    ["Яйца и тосты", "Курица с гречкой", "Творог с грушей", "Рыба с овощами"],
    ["Сырники", "Суп-пюре с курицей", "Орехи и апельсин", "Запечённая грудка"],
    ["Гранола с йогурт", "Боул с овощами", "Хумус и морковь", "Паста с тунцом"],
    ["Омлет с шпинатом", "Рис с рыбой", "Смузи и проростки", "Салат с фетой"],
    ["Блины с творогом", "Свободный приём пищи", "Фрукты и орехи", "Лёгкий суп-пюре"],
    ["Овсянка с бананом", "Индейка с овощами", "Кефир и хлебец", "Овощи на гриле"],
  ],
  free: [5, 1], // day index (Сб), meal index (обед) — free meal
  today: 1,
};

function weeklyMenu() {
  const W = MENU_W;
  const H = 700;
  const pad = 34;
  const left = 132;
  const colW = (W - pad - left) / menu.days.length;
  const headerH = 92;
  const rowH = 118;

  const parts = [];
  parts.push(roundRect(0, 0, W, H, 0, "#f3f2ec"));

  // Header
  const hy = 58;
  parts.push(roundRect(pad, 24, W - pad * 2, 76, 20, C.card));
  parts.push(text(pad + 24, hy - 6, menu.title, { size: 21, weight: 800, family: FONT }));
  parts.push(text(pad + 24, hy + 16, menu.subtitle, { size: 13, fill: C.muted }));
  // week switcher
  const chipY = hy - 14;
  parts.push(roundRect(W - pad - 250, chipY, 34, 34, 12, "#ffffff", C.line));
  parts.push(
    text(W - pad - 233, chipY + 22, "‹", { size: 18, fill: C.sage, anchor: "middle", family: FONT }),
  );
  parts.push(roundRect(W - pad - 210, chipY, 130, 34, 12, C.limeSoft));
  parts.push(text(W - pad - 145, chipY + 22, "Неделя 1", { size: 13, weight: 700, fill: C.dark, anchor: "middle" }));
  parts.push(roundRect(W - pad - 74, chipY, 34, 34, 12, "#ffffff", C.line));
  parts.push(
    text(W - pad - 57, chipY + 22, "›", { size: 18, fill: C.sage, anchor: "middle", family: FONT }),
  );

  // Day headers
  const gridTop = headerH + 28;
  menu.days.forEach((day, d) => {
    const x = left + d * colW;
    const isToday = d === menu.today;
    if (isToday) {
      parts.push(roundRect(x + 6, gridTop - 6, colW - 12, 40, 12, C.lime));
    }
    parts.push(
      text(x + colW / 2, gridTop + 19, day, {
        size: 14,
        weight: 800,
        anchor: "middle",
        family: FONT,
        fill: isToday ? C.dark : "#44504a",
      }),
    );
  });

  // Row labels
  menu.meals.forEach((meal, m) => {
    const y = gridTop + 46 + m * rowH;
    parts.push(text(pad + 4, y + 22, meal, { size: 13, weight: 700, fill: C.sage, family: FONT }));
  });

  // Cells
  menu.days.forEach((_, d) => {
    menu.meals.forEach((__, m) => {
      const x = left + d * colW + 6;
      const y = gridTop + 46 + m * rowH;
      const w = colW - 12;
      const h = rowH - 12;
      const isFree = menu.free[0] === d && menu.free[1] === m;
      const fill = isFree ? C.dark : d === menu.today ? "#fbfcf7" : C.card;
      parts.push(roundRect(x, y, w, h, 14, fill, isFree ? null : C.line));
      const label = menu.cells[d][m];
      const color = isFree ? "#f6f5ef" : C.ink;
      // wrap label to two lines
      const words = label.split(" ");
      let line1 = label;
      let line2 = "";
      if (label.length > 16 && words.length > 1) {
        const mid = Math.ceil(words.length / 2);
        line1 = words.slice(0, mid).join(" ");
        line2 = words.slice(mid).join(" ");
      }
      if (isFree) {
        parts.push(
          text(x + w / 2, y + h / 2 - 14, "Свободный", { size: 13, weight: 800, fill: "#e9efdf", anchor: "middle", family: FONT }),
        );
        parts.push(
          text(x + w / 2, y + h / 2 + 4, "приём пищи", { size: 11, fill: "#c9d8bd", anchor: "middle" }),
        );
      } else {
        parts.push(text(x + 14, y + (line2 ? h / 2 - 6 : h / 2 + 4), line1, { size: 12.5, weight: 600, fill: color }));
        if (line2) {
          parts.push(text(x + 14, y + h / 2 + 12, line2, { size: 12.5, weight: 600, fill: color }));
        }
      }
    });
  });

  parts.push(
    text(pad, H - 20, "Иллюстрация показывает формат меню. Блюда, порции и перекусы подбираются индивидуально.", {
      size: 11.5,
      fill: "#8b948b",
    }),
  );

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="Пример меню на неделю с четырьмя приёмами пищи и свободным приёмом">
<title>Пример меню на неделю с четырьмя приёмами пищи и свободным приёмом</title>
${parts.join("\n")}
</svg>
`;
}

const files = {
  "shopping-list.svg": shoppingList(),
  "weekly-menu.svg": weeklyMenu(),
};

for (const [name, content] of Object.entries(files)) {
  fs.writeFileSync(path.join(outDir, name), content, "utf8");
  console.log(`${name}: ${Buffer.byteLength(content)} bytes`);
}