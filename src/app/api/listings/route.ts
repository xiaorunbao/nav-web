import { NextResponse } from "next/server";
import { listApprovedListings } from "@/lib/submissions";

/** 公开只读：已审核收录的投稿站点，供首页「最新收录」区块展示。 */
export async function GET() {
  try {
    const listings = await listApprovedListings(12);
    return NextResponse.json(
      { ok: true, listings },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    console.error("[listings] 已收录站点查询失败：", error);
    return NextResponse.json(
      { ok: false, listings: [] },
      { headers: { "Cache-Control": "no-store" } }
    );
  }
}
