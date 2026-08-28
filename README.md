# 黑色壁纸 · 手机壁纸网站 MVP

年轻人的手机壁纸站（动漫 / 潮流 / 暗黑 / 赛博朋克 / 极简），移动端优先，暗色主题。

## 运行

```bash
npm install        # 安装依赖
npm run seed       # 生成 15 张示例 SVG 壁纸 + 数据文件（首次必跑）
npm run dev        # 开发模式 http://localhost:3000
npm run build && npm start   # 生产模式
```

## 添加真实壁纸

```bash
npm run add /path/to/图片.png --title "标题" --category anime --tags "动漫,插画"
# category 可选: anime / trend / dark / cyberpunk / minimal
# 可选参数: --w 1080 --h 2160（默认竖屏手机比例）
```

图片会复制到 `public/wallpapers/`，元数据追加到 `data/wallpapers.json`。

## 目录结构

```
app/
  page.tsx                    # 首页瀑布流（CSS columns 响应式 2/3/4 列）
  category/[slug]/page.tsx    # 分类页
  wallpaper/[id]/page.tsx     # 详情页（大图预览 + 下载按钮 + 元数据）
  api/download/[id]/route.ts  # 下载接口：计数 + 307 跳转到图片
lib/wallpapers.ts             # 数据层（JSON 文件读写）
scripts/seed.js               # 示例内容生成
scripts/add-wallpaper.js      # 一键入库脚本
data/wallpapers.json          # 壁纸元数据
public/wallpapers/            # 图片文件
```

## 下一步规划

- [ ] 换真实素材：ImageGen 批量生成 → `npm run add` 入库
- [ ] 图片上 CDN（腾讯云 COS + WebP 压缩）
- [ ] SEO：sitemap.xml、结构化数据、长尾词落地页
- [ ] 用户系统 + 会员（Supabase Auth + 微信登录）
- [ ] 变现：广告位 / 会员订阅 / 定制壁纸付费
- [ ] 国内部署需 ICP 备案（约 2-4 周），海外可先上 Vercel

## 已知事项

- 示例壁纸为程序生成的 SVG 占位图（1080×2160），正式内容用 add 脚本替换
- 当前数据层为 JSON 文件（MVP 简化），量大了再迁 PostgreSQL
