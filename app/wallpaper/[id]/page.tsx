import Link from "next/link";
import { notFound } from "next/navigation";
import { getAll, getById, getByCategory, categoryName } from "@/lib/wallpapers";

export const revalidate = 0;

export async function generateStaticParams() {
  const all = await getAll();
  return all.map((w) => ({ id: w.id }));
}

export default async function WallpaperPage({
  params,
}: {
  params: { id: string };
}) {
  const w = await getById(params.id);
  if (!w) notFound();

  const related = (await getByCategory(w.category)).filter((r) => r.id !== w.id).slice(0, 6);

  return (
    <div className="container" style={{ position: "relative" }}>
      <Link href="/" className="back-link">← 返回首页</Link>

      <div className="detail">
        <div className="detail-preview-wrap">
          <div className="preview">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={w.file} alt={w.title} />
          </div>
        </div>

        <div className="detail-info">
          <span className="micro-label">{categoryName(w.category)} · Wallpaper</span>
          <h1>{w.title}</h1>

          <div className="tag-row">
            {w.tags.map((t) => (
              <span key={t} className="tag">#{t}</span>
            ))}
          </div>

          <div className="detail-actions">
            <a className="btn btn-gold" href={`/api/download/${w.id}`} download>
              免费下载
            </a>
            <Link className="btn btn-glass" href={`/category/${w.category}`}>
              更多{categoryName(w.category)}壁纸
            </Link>
          </div>

          <div className="meta-list">
            <div className="row">
              <span className="k">分类</span>
              <span className="v gold">{categoryName(w.category)}</span>
            </div>
            <div className="row">
              <span className="k">分辨率</span>
              <span className="v">
                {w.width} × {w.height} · iPhone 原生
              </span>
            </div>
            <div className="row">
              <span className="k">下载次数</span>
              <span className="v">{w.downloads}</span>
            </div>
            <div className="row">
              <span className="k">更新时间</span>
              <span className="v">{w.createdAt.slice(0, 10)}</span>
            </div>
            <div className="row">
              <span className="k">来源</span>
              <span className="v">
                {w.source === "ai" ? "AI 原创" : w.source === "cc0" ? "CC0 图库" : "投稿"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="related">
          <div className="section-head">
            <span className="micro-label">More In {categoryName(w.category)}</span>
            <h2>同系列推荐</h2>
          </div>
          <div className="related-grid">
            {related.map((r) => (
              <Link key={r.id} href={`/wallpaper/${r.id}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={r.file} alt={r.title} loading="lazy" />
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
