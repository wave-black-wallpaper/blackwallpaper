import Link from "next/link";
import { getAll, CATEGORIES } from "@/lib/wallpapers";

export const revalidate = 0;

export default async function Home() {
  const wallpapers = await getAll();

  return (
    <>
      <div className="page-head">
        <h1>今日壁纸</h1>
        <p>每日更新 · 免费下载 · 点卡片看大图</p>
      </div>

      <nav className="chips">
        {CATEGORIES.map((c) => (
          <Link key={c.slug} href={`/category/${c.slug}`} className="chip">
            {c.name}
          </Link>
        ))}
      </nav>

      {wallpapers.length === 0 ? (
        <div className="empty">
          还没有壁纸，先运行 <code>npm run seed</code> 生成示例内容
        </div>
      ) : (
        <div className="masonry">
          {wallpapers.map((w) => (
            <Link key={w.id} href={`/wallpaper/${w.id}`} className="card">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={w.file} alt={w.title} loading="lazy" />
              <div className="card-meta">
                <span className="card-title">{w.title}</span>
                <span className="card-dl">⬇ {w.downloads}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
