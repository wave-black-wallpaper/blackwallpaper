#!/usr/bin/env node
// 一键添加壁纸：node scripts/add-wallpaper.js <图片路径> --title "标题" --category anime --tags "动漫,插画" [--w 1080 --h 2160]
// category 可选: anime / trend / dark / cyberpunk / minimal
const fs = require("fs");
const path = require("path");

const args = process.argv.slice(2);
const image = args[0];
if (!image || image.startsWith("--")) {
  console.error("用法: node scripts/add-wallpaper.js <图片路径> --title \"标题\" --category anime --tags \"a,b\" [--w 1080 --h 2160]");
  process.exit(1);
}

function opt(name, def) {
  const i = args.indexOf(`--${name}`);
  return i > -1 && args[i + 1] ? args[i + 1] : def;
}

const VALID = ["anime", "trend", "dark", "cyberpunk", "minimal"];
const category = opt("category", "dark");
if (!VALID.includes(category)) {
  console.error(`❌ category 必须是: ${VALID.join(" / ")}`);
  process.exit(1);
}

const title = opt("title", path.basename(image, path.extname(image)));
const tags = opt("tags", "手机壁纸").split(",").map((s) => s.trim()).filter(Boolean);
const width = parseInt(opt("w", "1080"), 10);
const height = parseInt(opt("h", "2160"), 10);

const ROOT = path.join(__dirname, "..");
const OUT_DIR = path.join(ROOT, "public", "wallpapers");
const DATA_FILE = path.join(ROOT, "data", "wallpapers.json");

if (!fs.existsSync(image)) {
  console.error(`❌ 文件不存在: ${image}`);
  process.exit(1);
}

fs.mkdirSync(OUT_DIR, { recursive: true });

const list = fs.existsSync(DATA_FILE) ? JSON.parse(fs.readFileSync(DATA_FILE, "utf-8")) : [];
// 用该分类下最大编号 +1（而非数量 +1），避免移动/删除后编号冲突覆盖旧文件
// 并发安全：编号被占用时自动重读 + 重新计算，最多尝试 10 次
const ext = path.extname(image).toLowerCase();
let id, dest, attempt = 0;
while (attempt < 10) {
  const maxNum = list
    .filter((w) => w.category === category)
    .reduce((m, w) => {
      const n = parseInt(w.id.split("-")[1] || "0", 10);
      return isNaN(n) ? m : Math.max(m, n);
    }, 0);
  id = `${category}-${String(maxNum + 1).padStart(3, "0")}`;
  dest = path.join(OUT_DIR, `${id}${ext}`);
  if (!fs.existsSync(dest)) break;
  attempt++;
  // 编号被并发抢走：等一下再重读 JSON 让其反映最新状态
  require("child_process").execSync("sleep 0.2");
  if (fs.existsSync(DATA_FILE)) {
    const fresh = JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
    list.length = 0;
    list.push(...fresh);
  }
}
if (attempt >= 10) {
  console.error("❌ 多次重试后仍无法分配编号，请重试");
  process.exit(1);
}
fs.copyFileSync(image, dest);

list.push({
  id,
  title,
  category,
  tags,
  file: `/wallpapers/${id}${ext}`,
  width,
  height,
  source: "upload",
  downloads: 0,
  createdAt: new Date().toISOString().slice(0, 10),
});

fs.writeFileSync(DATA_FILE, JSON.stringify(list, null, 2));
console.log(`✅ 已入库: ${title} (${id}) → ${path.relative(process.cwd(), dest)}`);
