import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { isAdminUser } from "@/lib/admin";
import { getPaymentConfig } from "@/lib/payment";
import { getSubmission, reviewSubmission } from "@/lib/submissions";

/** 后台审核：approve 收录 / reject 驳回；付费开启时未支付不可收录。 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const user = await getSessionUser();
  if (!user || !isAdminUser(user)) {
    return NextResponse.json({ error: "无权限审核" }, { status: 403 });
  }

  let payload: Record<string, unknown> = {};
  try {
    payload = await request.json();
  } catch {
    payload = {};
  }

  const action =
    payload.action === "approve" ? "approve" : payload.action === "reject" ? "reject" : null;
  if (!action) {
    return NextResponse.json({ error: "审核操作无效" }, { status: 400 });
  }

  const submission = await getSubmission(id);
  if (!submission) {
    return NextResponse.json({ error: "投稿不存在" }, { status: 404 });
  }

  const payment = getPaymentConfig();
  if (action === "approve" && payment.enabled && submission.paymentStatus !== "paid") {
    return NextResponse.json(
      { error: "投稿尚未完成付费，无法收录" },
      { status: 400 }
    );
  }

  const reason =
    typeof payload.reason === "string" && payload.reason.trim()
      ? payload.reason.trim()
      : null;

  try {
    const updated = await reviewSubmission(id, action, {
      reason,
      approver: user.name,
    });
    return NextResponse.json(
      { ok: true, submission: updated },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    console.error("[submissions] 审核更新失败：", error);
    return NextResponse.json(
      { error: "审核操作失败，请稍后重试" },
      { status: 500, headers: { "Cache-Control": "no-store" } }
    );
  }
}
