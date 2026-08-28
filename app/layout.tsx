import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "黑色壁纸 | 年轻人的手机壁纸站",
  description:
    "动漫、潮流、暗黑、赛博朋克风格手机壁纸，每日更新，免费下载高清 4K 壁纸。",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>
        <header className="header">
          <div className="container header-inner">
            <Link href="/" className="logo">
              黑色<span>壁纸</span>
            </Link>
            <nav className="chips" style={{ padding: 0 }}>
              <Link href="/" className="chip">首页</Link>
            </nav>
          </div>
        </header>
        <main className="container">{children}</main>
        <footer className="footer">
          <div className="container">
            黑色壁纸 blackwallpaper · 壁纸仅供个人使用 · 每日更新
          </div>
        </footer>
      </body>
    </html>
  );
}
