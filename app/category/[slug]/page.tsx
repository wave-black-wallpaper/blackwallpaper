import Link from "next/link";
import { notFound } from "next/navigation";
import { getByCategory, CATEGORIES } from "@/lib/wallpapers";

export const revalidate = 0;

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ slug: c.slug }));
}

export default async function CategoryPage({
  params,
}: {
  params: { slug: string };
}) {
  const category = CATEGORIES.find((c) => c.slug === params.slug);
  if (!category) notFound();

  const wallpapers = await getByCategory(params.slug);

  return (
    <>
      <div className="page-head">
        <h1>{category.name}</h1>
        <p>{category.desc}</p>
      </div>

      <nav className="chips">
        <Link href="/" className="chip">全部</Link>
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

      {wallpapers.length === 0 ? (
        <div className="empty">该分类暂时没有壁纸</div>
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
