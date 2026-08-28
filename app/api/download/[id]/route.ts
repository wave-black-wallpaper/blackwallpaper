import { NextRequest, NextResponse } from "next/server";
import { getById, incrementDownloads } from "@/lib/wallpapers";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const w = await getById(params.id);
  if (!w) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }
  // 下载计数（Vercel 等只读文件系统上写入会失败，忽略即可，不影响下载）
  try {
    await incrementDownloads(params.id);
  } catch {
    // read-only filesystem
  }
  return NextResponse.redirect(new URL(w.file, _req.url));
}
