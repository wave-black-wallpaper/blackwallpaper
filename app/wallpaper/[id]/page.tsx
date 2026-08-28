import Link from "next/link";
import { notFound } from "next/navigation";
import { getAll, getById, categoryName } from "@/lib/wallpapers";

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

  return (
    <div className="detail">
      <div className="preview">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={w.file} alt={w.title} />
      </div>

      <div>
        <div className="page-head" style={{ padding: 0 }}>
          <h1>{w.title}</h1>
          <p style={{ marginTop: 10 }}>
            {w.tags.map((t) => (
              <span key={t} className="tag">
                #{t}{" "}
              </span>
            ))}
          </p>
        </div>

        <div style={{ display: "flex", gap: 12, marginTop: 22 }}>
          <a className="btn btn-primary" href={`/api/download/${w.id}`} download>
            下载壁纸
          </a>
          <Link className="btn btn-ghost" href={`/category/${w.category}`}>
            更多{categoryName(w.category)}壁纸
          </Link>
        </div>

        <div className="meta-list">
          <div className="row">
            <span className="k">分类</span>
            <span>{categoryName(w.category)}</span>
          </div>
          <div className="row">
            <span className="k">分辨率</span>
            <span>
              {w.width} × {w.height}
            </span>
          </div>
          <div className="row">
            <span className="k">下载次数</span>
            <span>{w.downloads}</span>
          </div>
          <div className="row">
            <span className="k">更新时间</span>
            <span>{w.createdAt.slice(0, 10)}</span>
          </div>
          <div className="row">
            <span className="k">来源</span>
            <span>{w.source === "ai" ? "AI 原创" : w.source === "cc0" ? "CC0 图库" : "投稿"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
