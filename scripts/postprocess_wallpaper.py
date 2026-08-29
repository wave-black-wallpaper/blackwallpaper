#!/usr/bin/env python3
"""自动后处理 AI 生成壁纸：裁掉底部 80px 水印 → 精确缩放到 iPhone 原生 1179×2556"""
import sys
from PIL import Image

if len(sys.argv) != 2:
    print("用法: postprocess_wallpaper.py <png>", file=sys.stderr)
    sys.exit(1)

p = sys.argv[1]
im = Image.open(p).convert("RGB")
w, h = im.size
if (w, h) == (1179, 2556):
    sys.exit(0)  # 已是目标尺寸
# 裁掉底部 80px AI 水印 + 等比缩放到精确 iPhone 原生尺寸
im = im.crop((0, 0, w, h - 80))
im = im.resize((1179, 2556), Image.LANCZOS)
im.save(p, "PNG", optimize=True)
print(f"postprocessed: {p} {w}x{h} -> 1179x2556")
