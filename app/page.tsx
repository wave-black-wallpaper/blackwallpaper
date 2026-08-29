import Link from "next/link";
import { getAll, getByCategory, CATEGORIES } from "@/lib/wallpapers";

export const revalidate = 0;

const CATEGORY_EN: Record<string, string> = {
  anime: "Anime",
  trend: "Trend",
  dark: "Midnight",
  cyberpunk: "Cyberpunk",
  minimal: "Minimal",
};

export default async function Home() {
  const wallpapers = await getAll();
  const trending = [...wallpapers].sort((a, b) => b.downloads - a.downloads).slice(0, 8);
  const heroStrip = [...wallpapers].sort((a, b) => b.downloads - a.downloads).slice(0, 7);

  const categoryCards = await Promise.all(
    CATEGORIES.map(async (c) => ({
      ...c,
      en: CATEGORY_EN[c.slug] ?? c.slug,
      cover: (await getByCategory(c.slug))[0]?.file ?? "",
      count: (await getByCategory(c.slug)).length,
    }))
  );

  return (
    <>
      {/* ===== Hero ===== */}
      <section className="hero">
        <div className="container hero-center">
          <span className="micro-label fade-up">Black Wallpaper · The Curated Gallery</span>
          <h1 className="fade-up fade-up-1">
            提升你的
            <br />
            <span className="gold">屏幕氛围</span>
          </h1>
          <p className="hero-desc fade-up fade-up-2">
            纯黑美学 × 高清原创壁纸 · iPhone 原生分辨率
          </p>
          <div className="hero-actions fade-up fade-up-3">
            <a href="#collection" className="btn btn-gold">探索合集</a>
            <a href="#trending" className="btn btn-glass">人气榜单</a>
          </div>
        </div>
        <div className="hero-strip fade-up fade-up-4">
          {heroStrip.map((w) => (
            <Link key={w.id} href={`/wallpaper/${w.id}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={w.file} alt={w.title} loading="lazy" />
            </Link>
          ))}
        </div>
      </section>

      {/* ===== Trending ===== */}
      <section className="section container" id="trending">
        <div className="section-head">
          <span className="micro-label">In High Demand</span>
          <h2>人气热门</h2>
          <p className="section-desc">Trending Archive · 下载量最高</p>
        </div>
        <div className="trend-grid">
          {trending.map((w) => (
            <Link key={w.id} href={`/wallpaper/${w.id}`} className="card">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={w.file} alt={w.title} loading="lazy" />
              <div className="card-overlay">
                <span className="card-title">{w.title}</span>
                <span className="card-dl">⬇ {w.downloads} 次下载</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ===== Discover by vibe ===== */}
      <section className="section container" id="vibes">
        <div className="section-head">
          <span className="micro-label">Discover By Atmosphere</span>
          <h2>按氛围探索</h2>
          <p className="section-desc">Choose Your Vibe</p>
        </div>
        <div className="vibe-grid">
          {categoryCards.map((c) => (
            <Link key={c.slug} href={`/category/${c.slug}`} className="vibe-card">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={c.cover} alt={c.name} loading="lazy" />
              <div className="vibe-info">
                <span className="vibe-en">{c.en}</span>
                <div className="vibe-name">{c.name}</div>
                <div className="vibe-count">{c.count} 张壁纸</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ===== Featured / full collection ===== */}
      <section className="section container" id="collection">
        <div className="section-head">
          <span className="micro-label">The Curated Suite</span>
          <h2>精选合集</h2>
          <p className="section-desc">{wallpapers.length} Wallpapers · High Resolution · Free</p>
        </div>
        {wallpapers.length === 0 ? (
          <div className="empty">还没有壁纸</div>
        ) : (
          <div className="masonry">
            {wallpapers.map((w) => (
              <Link key={w.id} href={`/wallpaper/${w.id}`} className="card">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={w.file} alt={w.title} loading="lazy" />
                <div className="card-overlay">
                  <span className="card-title">{w.title}</span>
                  <span className="card-dl">⬇ {w.downloads} 次下载</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* ===== Features ===== */}
      <section className="section container">
        <div className="feature-grid">
          <div className="feature-card">
            <div className="feature-icon">✦</div>
            <h3>精选品质</h3>
            <p>每一张壁纸均经过人工筛选与二次精修，细节无损，观感纯净。</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">◈</div>
            <h3>原生适配</h3>
            <p>统一 1179 × 2556 分辨率，完美贴合 iPhone 全系屏幕，无损下载。</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">∞</div>
            <h3>无限免费</h3>
            <p>无需注册，无需付费，点开即存，全部壁纸免费开放下载。</p>
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="cta container">
        <span className="micro-label">Your Next Wallpaper Awaits</span>
        <h2>你的下一张壁纸，就在这里</h2>
        <p>整个合集免费开放。找到那张最能代表你风格的作品，为你的屏幕注入新的氛围。</p>
        <a href="#collection" className="btn btn-gold">开始探索</a>
      </section>
    </>
  );
}
