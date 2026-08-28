import fs from "fs";
import path from "path";

export interface Wallpaper {
  id: string;
  title: string;
  category: string; // slug
  tags: string[];
  file: string; // /wallpapers/xxx.svg
  width: number;
  height: number;
  source: string; // ai | cc0 | upload
  downloads: number;
  createdAt: string; // ISO date
}

export interface Category {
  slug: string;
  name: string;
  desc: string;
}

export const CATEGORIES: Category[] = [
  { slug: "anime", name: "动漫", desc: "二次元 / 国漫 / 插画风" },
  { slug: "trend", name: "潮流", desc: "街头 / 涂鸦 / 潮牌视觉" },
  { slug: "dark", name: "暗黑", desc: "黑色系 / 极简暗调" },
  { slug: "cyberpunk", name: "赛博朋克", desc: "霓虹 / 未来感 / 机甲" },
  { slug: "minimal", name: "极简", desc: "纯色 / 几何 / 留白" },
];

const DATA_FILE = path.join(process.cwd(), "data", "wallpapers.json");

export async function getAll(): Promise<Wallpaper[]> {
  const raw = fs.readFileSync(DATA_FILE, "utf-8");
  const list: Wallpaper[] = JSON.parse(raw);
  return list.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export async function getByCategory(slug: string): Promise<Wallpaper[]> {
  const all = await getAll();
  return all.filter((w) => w.category === slug);
}

export async function getById(id: string): Promise<Wallpaper | undefined> {
  const all = await getAll();
  return all.find((w) => w.id === id);
}

export async function incrementDownloads(id: string): Promise<boolean> {
  const all = await getAll();
  const item = all.find((w) => w.id === id);
  if (!item) return false;
  item.downloads += 1;
  fs.writeFileSync(DATA_FILE, JSON.stringify(all, null, 2));
  return true;
}

export function categoryName(slug: string): string {
  return CATEGORIES.find((c) => c.slug === slug)?.name ?? slug;
}
