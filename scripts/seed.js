#!/usr/bin/env node
// 生成示例 SVG 壁纸 + data/wallpapers.json（占位内容，正式上线用 add-wallpaper.js 换成真实图片）
const fs = require("fs");
const path = require("path");

const OUT_DIR = path.join(__dirname, "..", "public", "wallpapers");
const DATA_FILE = path.join(__dirname, "..", "data", "wallpapers.json");

const W = 1080;
const H = 2160;

const THEMES = [
  { category: "anime", name: "动漫", items: [
    ["暮色少女", "#2b1d4e", "#ff8fab", "circle"],
    ["星海列车", "#101a3a", "#8ecae6", "stars"],
    ["风之谷", "#173f35", "#95d5b2", "wave"],
  ]},
  { category: "trend", name: "潮流", items: [
    ["街头涂鸦", "#1a1a1a", "#ffd60a", "graffiti"],
    ["霓虹标语", "#12101f", "#ff477e", "neon"],
    ["街头涂鸦·夜", "#0d0d12", "#00f5d4", "graffiti"],
  ]},
  { category: "dark", name: "暗黑", items: [
    ["纯黑·呼吸", "#000000", "#333333", "dot"],
    ["月蚀", "#050507", "#e0e0e0", "eclipse"],
    ["黑曜石纹", "#0a0a0c", "#3d3d4a", "shards"],
  ]},
  { category: "cyberpunk", name: "赛博朋克", items: [
    ["赛博都市 2099", "#0b1026", "#ff2a6d", "grid"],
    ["机甲之心", "#150a1e", "#05d9e8", "circuit"],
    ["霓虹雨巷", "#0d0618", "#d1f7ff", "rain"],
  ]},
  { category: "minimal", name: "极简", items: [
    ["雾白", "#1c1c1e", "#d8d8dc", "blank"],
    ["一线之间", "#111114", "#f2f2f7", "line"],
    ["几何·蓝", "#0e1626", "#4f7cff", "geo"],
  ]},
];

function svgFor(style, bg, accent) {
  const base = `<rect width="${W}" height="${H}" fill="${bg}"/>`;
  const cx = W / 2;
  switch (style) {
    case "circle":
      return base + `<circle cx="${cx}" cy="820" r="300" fill="${accent}" opacity="0.85"/><circle cx="${cx - 260}" cy="1250" r="140" fill="${accent}" opacity="0.4"/>`;
    case "stars":
      return base + Array.from({ length: 90 }, () =>
        `<circle cx="${Math.random() * W | 0}" cy="${Math.random() * H | 0}" r="${Math.random() * 3 + 1}" fill="${accent}" opacity="${(Math.random() * 0.8 + 0.2).toFixed(2)}"/>`
      ).join("");
    case "wave":
      return base + `<path d="M0 1200 Q 270 1000 540 1200 T 1080 1200 V 2160 H 0 Z" fill="${accent}" opacity="0.5"/><path d="M0 1500 Q 270 1300 540 1500 T 1080 1500 V 2160 H 0 Z" fill="${accent}" opacity="0.8"/>`;
    case "graffiti": {
      let rects = "";
      for (let i = 0; i < 14; i++) {
        const x = Math.random() * W, y = Math.random() * H;
        rects += `<rect x="${x | 0}" y="${y | 0}" width="${60 + Math.random() * 200 | 0}" height="${20 + Math.random() * 60 | 0}" fill="${accent}" opacity="${(Math.random() * 0.5 + 0.3).toFixed(2)}" transform="rotate(${Math.random() * 90 - 45} ${x} ${y})"/>`;
      }
      return base + rects;
    }
    case "neon":
      return base + `<rect x="140" y="900" width="800" height="260" rx="130" fill="none" stroke="${accent}" stroke-width="14"/><rect x="140" y="1260" width="560" height="260" rx="130" fill="none" stroke="${accent}" stroke-width="14" opacity="0.6"/>`;
    case "dot":
      return base + `<circle cx="${cx}" cy="${H / 2}" r="160" fill="${accent}"/>`;
    case "eclipse":
      return base + `<circle cx="${cx}" cy="${H / 2}" r="420" fill="${accent}"/><circle cx="${cx + 130}" cy="${H / 2 - 60}" r="400" fill="${bg}"/>`;
    case "shards": {
      let p = "";
      for (let i = 0; i < 10; i++) {
        const x = Math.random() * W, y = Math.random() * H;
        p += `<polygon points="${x},${y} ${x + 220},${y + 90} ${x + 60},${y + 260}" fill="${accent}" opacity="${(Math.random() * 0.35 + 0.1).toFixed(2)}"/>`;
      }
      return base + p;
    }
    case "grid":
      return base + Array.from({ length: 22 }, (_, i) =>
        `<line x1="0" y1="${1000 + i * 55}" x2="${W}" y2="${1000 + i * 55 + 130}" stroke="${accent}" stroke-width="2" opacity="${(1 - i / 26).toFixed(2)}"/>`
      ).join("") + `<circle cx="${cx}" cy="760" r="230" fill="${accent}" opacity="0.75"/>`;
    case "circuit":
      return base + `<rect x="340" y="900" width="400" height="400" rx="40" fill="none" stroke="${accent}" stroke-width="10"/><line x1="540" y1="900" x2="540" y2="600" stroke="${accent}" stroke-width="8"/><line x1="540" y1="1300" x2="540" y2="1600" stroke="${accent}" stroke-width="8"/><circle cx="540" cy="1100" r="90" fill="${accent}" opacity="0.8"/>`;
    case "rain": {
      let drops = "";
      for (let i = 0; i < 120; i++) {
        drops += `<line x1="${Math.random() * W | 0}" y1="${Math.random() * H | 0}" x2="${Math.random() * W | 0}" y2="${Math.random() * H | 0}" stroke="${accent}" stroke-width="2" opacity="${(Math.random() * 0.6 + 0.1).toFixed(2)}"/>`;
      }
      return base + drops;
    }
    case "blank":
      return base + `<rect x="80" y="880" width="920" height="400" rx="30" fill="${accent}" opacity="0.08"/>`;
    case "line":
      return base + `<line x1="200" y1="${H / 2}" x2="880" y2="${H / 2}" stroke="${accent}" stroke-width="6"/><circle cx="880" cy="${H / 2}" r="18" fill="${accent}"/>`;
    default:
      return base + `<circle cx="${cx}" cy="880" r="280" fill="${accent}" opacity="0.85"/><rect x="340" y="1300" width="400" height="400" rx="20" fill="${accent}" opacity="0.4"/>`;
  }
}

function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const list = [];
  let idx = 1;
  for (const theme of THEMES) {
    for (const [title, bg, accent, style] of theme.items) {
      const id = `${theme.category}-${String(idx).padStart(3, "0")}`;
      const file = `/wallpapers/${id}.svg`;
      fs.writeFileSync(
        path.join(OUT_DIR, `${id}.svg`),
        `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${svgFor(style, bg, accent)}</svg>`
      );
      list.push({
        id,
        title,
        category: theme.category,
        tags: [theme.name, "手机壁纸"],
        file,
        width: W,
        height: H,
        source: "ai",
        downloads: Math.floor(Math.random() * 900) + 100,
        createdAt: new Date().toISOString().slice(0, 10),
      });
      idx++;
    }
    idx = 1;
  }
  fs.writeFileSync(DATA_FILE, JSON.stringify(list, null, 2));
  console.log(`✅ 已生成 ${list.length} 张示例壁纸 → public/wallpapers/ 与 data/wallpapers.json`);
}

main();
