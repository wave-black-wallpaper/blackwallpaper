import Link from "next/link";
import { notFound } from "next/navigation";
import { getByCategory, CATEGORIES } from "@/lib/wallpapers";

export const revalidate = 0;

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ slug: c.slug }));
}

const CATEGORY_EN: Record<string, string> = {
  anime: "Anime Art",
  trend: "Street Trend",
  dark: "Midnight Dark",
  cyberpunk: "Cyberpunk",
  minimal: "Ethereal Minimal",
};

export default async function CategoryPage({
  params,
}: {
  params: { slug: string };
}) {
  const category = CATEGORIES.find((c) => c.slug === params.slug);
  if (!category) notFound();

  const wallpapers = await getByCategory(params.slug);
  const cover = wallpapers[0]?.file;

  return (
    <>
      <section className="cat-hero">
        {cover && (
          <div className="cat-hero-bg">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={cover} alt={category.name} />
          </div>
        )}
        <div className="container cat-hero-inner">
          <span className="micro-label fade-up">
            {CATEGORY_EN[params.slug] ?? "Collection"}
          </span>
          <h1 className="fade-up fade-up-1">{category.name}</h1>
          <p className="cat-desc fade-up fade-up-2">
            {category.desc} · {wallpapers.length} 张
          </p>
        </div>
      </section>

      <nav className="container chips">
        <Link href="/#collection" className="chip">全部</Link>
        {CATEGORIES.map((c) => (
          <Link
            key={c.slug}
            href={`/category/${c.slug}`}
            className={`chip ${c.slug === params.slug ? "active" : ""}`}
          >
            {c.name}
          </Link>
        ))}
      </nav>

      <div className="container masonry-wrap">
        {wallpapers.length === 0 ? (
          <div className="empty">该分类暂时没有壁纸</div>
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
      </div>
    </>
  );
}
