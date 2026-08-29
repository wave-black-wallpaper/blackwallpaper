import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { CATEGORIES } from "@/lib/wallpapers";

export const metadata: Metadata = {
  title: "黑色壁纸 BLACK WALLPAPER | 精品手机壁纸合集",
  description:
    "纯黑美学 × 香槟金质感。动漫、潮流、暗黑、赛博朋克、极简风格高清手机壁纸，iPhone 原生分辨率，免费下载。",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>
        <header className="header">
          <div className="container header-inner">
            <Link href="/" className="logo">
              黑色壁纸
              <span className="logo-dot" />
              <span className="logo-en">Black Wallpaper</span>
            </Link>
            <nav className="header-nav">
              <Link href="/" className="nav-link">首页</Link>
              {CATEGORIES.slice(0, 4).map((c) => (
                <Link key={c.slug} href={`/category/${c.slug}`} className="nav-link">
                  {c.name}
                </Link>
              ))}
              <Link href="/#collection" className="nav-cta">全部合集</Link>
            </nav>
          </div>
        </header>
        <main>{children}</main>
        <footer className="footer">
          <div className="container">
            <div className="footer-grid">
              <div className="footer-brand">
                <div className="logo">
                  黑色壁纸
                  <span className="logo-dot" />
                </div>
                <p>
                  精选高清手机壁纸合集，纯黑美学与品质视觉。所有壁纸均为原创，免费下载，适配 iPhone 及主流机型。
                </p>
              </div>
              <div className="footer-col">
                <h4>分类</h4>
                {CATEGORIES.map((c) => (
                  <Link key={c.slug} href={`/category/${c.slug}`}>{c.name}</Link>
                ))}
              </div>
              <div className="footer-col">
                <h4>探索</h4>
                <Link href="/#trending">人气热门</Link>
                <Link href="/#collection">全部合集</Link>
                <Link href="/#vibes">按氛围探索</Link>
              </div>
            </div>
            <div className="footer-bottom">
              <span>Black Wallpaper · 2026</span>
              <span>壁纸仅供个人使用</span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
