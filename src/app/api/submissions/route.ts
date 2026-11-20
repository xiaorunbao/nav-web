import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { isAdminUser } from "@/lib/admin";
import {
  createSubmission,
  listSubmissions,
} from "@/lib/submissions";
import { getPaymentConfig } from "@/lib/payment";

/** 后台投稿列表：仅管理员可访问。 */
export async function GET() {
  const user = await getSessionUser();
  if (!isAdminUser(user)) {
    return NextResponse.json({ error: "无权限访问" }, { status: 403 });
  }

  try {
    const submissions = await listSubmissions();
    return NextResponse.json(
      { ok: true, submissions, payment: getPaymentConfig() },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    console.error("[submissions] 列表查询失败：", error);
    return NextResponse.json(
      { ok: false, submissions: [] },
      { status: 500, headers: { "Cache-Control": "no-store" } }
    );
  }
}

/** 投稿收录申请：按付费开关初始化待支付订单或直接进入待审核。 */
export async function POST(request: Request) {
  let payload: Record<string, unknown> = {};
  try {
    payload = await request.json();
  } catch {
    payload = {};
  }

  const name = typeof payload.name === "string" ? payload.name.trim() : "";
  const url = typeof payload.url === "string" ? payload.url.trim() : "";
  const category =
    typeof payload.category === "string" && payload.category.trim()
      ? payload.category.trim().slice(0, 64)
      : null;
  const description =
    typeof payload.desc === "string" && payload.desc.trim()
      ? payload.desc.trim().slice(0, 2000)
      : typeof payload.description === "string" && payload.description.trim()
        ? payload.description.trim().slice(0, 2000)
        : null;
  const contact =
    typeof payload.contact === "string" && payload.contact.trim()
      ? payload.contact.trim().slice(0, 255)
      : null;

  if (!name) {
    return NextResponse.json({ error: "请填写站点名称" }, { status: 400 });
  }
  if (!url || !/^https?:\/\/.+/i.test(url)) {
    return NextResponse.json(
      { error: "站点地址需以 http:// 或 https:// 开头" },
      { status: 400 }
    );
  }

  const payment = getPaymentConfig();

  try {
    const submission = await createSubmission(
      { name, url, category, description, contact },
      { paymentEnabled: payment.enabled, amount: payment.amount }
    );
    return NextResponse.json(
      { ok: true, submission, payment },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    console.error("[submissions] 投稿写入失败：", error);
    return NextResponse.json(
      { error: "提交失败，请稍后重试" },
      { status: 500, headers: { "Cache-Control": "no-store" } }
    );
  }
}
