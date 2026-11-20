import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { getSubmission, markSubmissionPaid } from "@/lib/submissions";

/**
 * 模拟支付回调（原型占位）：把待支付订单标记为已支付。
 * 接入真实支付网关后，应由支付平台异步回调更新订单状态，而不是前端直接调用。
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "请先登录再完成支付" }, { status: 401 });
  }

  const submission = await getSubmission(id);
  if (!submission) {
    return NextResponse.json({ error: "投稿不存在" }, { status: 404 });
  }
  if (submission.paymentStatus !== "unpaid") {
    return NextResponse.json({ error: "订单当前状态无需支付" }, { status: 400 });
  }

  try {
    const paid = await markSubmissionPaid(id);
    return NextResponse.json(
      { ok: true, submission: paid },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    console.error("[submissions] 支付标记失败：", error);
    return NextResponse.json(
      { error: "支付确认失败，请稍后重试" },
      { status: 500, headers: { "Cache-Control": "no-store" } }
    );
  }
}
