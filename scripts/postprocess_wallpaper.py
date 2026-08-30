#!/usr/bin/env python3
"""自动后处理 AI 生成壁纸：裁掉底部 80px 水印 → 等比缩放 + 居中裁切到 iPhone 原生 1179×2556（永不变形）"""
import sys
from PIL import Image

TARGET = (1179, 2556)

if len(sys.argv) != 2:
    print("用法: postprocess_wallpaper.py <png>", file=sys.stderr)
    sys.exit(1)

p = sys.argv[1]
im = Image.open(p).convert("RGB")
w, h = im.size
if (w, h) == TARGET:
    sys.exit(0)  # 已是目标尺寸

# 1) 裁掉底部 80px AI 水印
if h > 200:
    im = im.crop((0, 0, w, h - 80))
    w, h = im.size

# 2) 等比缩放至完全覆盖目标尺寸（cover），再居中裁切 —— 不拉伸、不变形
tw, th = TARGET
scale = max(tw / w, th / h)
nw, nh = round(w * scale), round(h * scale)
im = im.resize((nw, nh), Image.LANCZOS)
left = (nw - tw) // 2
top = (nh - th) // 2
im = im.crop((left, top, left + tw, top + th))
im.save(p, "PNG", optimize=True)
print(f"postprocessed: {p} -> {TARGET[0]}x{TARGET[1]} (cover-crop, 无变形)")
