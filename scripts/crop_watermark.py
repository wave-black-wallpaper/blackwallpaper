#!/usr/bin/env python3
"""批量裁剪图片底部 N 像素（用于去除右下角 AI 水印）。"""
import os
import sys
from pathlib import Path
from PIL import Image

BOTTOM_CROP = int(os.environ.get("WALLPAPER_CROP_BOTTOM", "80"))


def crop_bottom(file_path: str, bottom_px: int = BOTTOM_CROP):
    p = Path(file_path)
    if not p.exists():
        print(f"❌ 文件不存在: {file_path}", file=sys.stderr)
        return None
    with Image.open(p) as im:
        w, h = im.size
        if h <= bottom_px:
            print(f"⚠️ 图片高度不足，跳过: {file_path}", file=sys.stderr)
            return None
        new_h = h - bottom_px
        cropped = im.crop((0, 0, w, new_h))
        # 覆盖保存，保留原格式；PNG 默认用最高质量
        if im.format == "PNG":
            cropped.save(p, format="PNG", optimize=True)
        else:
            cropped.save(p)
    print(f"✂️  {p.name}: {w}x{h} → {w}x{new_h} (底部裁剪 {bottom_px}px)")
    return {"file": str(p), "old": {"width": w, "height": h}, "new": {"width": w, "height": new_h}}


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("用法: python scripts/crop_watermark.py <图片路径> [底部裁剪像素数]", file=sys.stderr)
        sys.exit(1)

    path = sys.argv[1]
    bottom = int(sys.argv[2]) if len(sys.argv) > 2 else BOTTOM_CROP
    crop_bottom(path, bottom)
