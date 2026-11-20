import { randomBytes } from "node:crypto";
import { getDb } from "./db";

export type SubmissionStatus = "pending" | "approved" | "rejected";
export type PaymentStatus = "not_required" | "unpaid" | "paid" | "refunded";

export type SubmissionRecord = {
  id: string;
  name: string;
  url: string;
  category: string | null;
  description: string | null;
  contact: string | null;
  status: SubmissionStatus;
  paymentStatus: PaymentStatus;
  paymentAmount: number | null;
  paymentOrderNo: string | null;
  paidTime: string | null;
  approveTime: string | null;
  approveBy: string | null;
  rejectReason: string | null;
  createTime: string | null;
};

export type CreateSubmissionInput = {
  name: string;
  url: string;
  category?: string | null;
  description?: string | null;
  contact?: string | null;
};

type SubmissionRow = Omit<SubmissionRecord, "paymentAmount"> & {
  paymentAmount: string | number | null;
};

function normalizeTime(value: Date | string | null | undefined): string | null {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

function rowToRecord(row: SubmissionRow): SubmissionRecord {
  return {
    ...row,
    paymentAmount:
      row.paymentAmount === null || row.paymentAmount === undefined
        ? null
        : Number(row.paymentAmount),
    paidTime: normalizeTime(row.paidTime),
    approveTime: normalizeTime(row.approveTime),
    createTime: normalizeTime(row.createTime),
  };
}

const COLUMNS = [
  "`id`",
  "`name`",
  "`url`",
  "`category`",
  "`description`",
  "`contact`",
  "`status`",
  "`paymentStatus`",
  "`paymentAmount`",
  "`paymentOrderNo`",
  "`paidTime`",
  "`approveTime`",
  "`approveBy`",
  "`rejectReason`",
  "`createTime`",
].join(", ");

/** 写入投稿；付费开关开启时生成待支付订单，关闭时标记无需付费。 */
export async function createSubmission(
  input: CreateSubmissionInput,
  opts: { paymentEnabled: boolean; amount: string | null }
): Promise<SubmissionRecord> {
  const id = `sub_${randomBytes(12).toString("hex")}`;
  const now = new Date();
  const paymentEnabled = opts.paymentEnabled;
  const amount = paymentEnabled && opts.amount ? Number(opts.amount) : null;
  const orderNo = paymentEnabled
    ? `ORD_${randomBytes(8).toString("hex").toUpperCase()}`
    : null;
  const paymentStatus: PaymentStatus = paymentEnabled ? "unpaid" : "not_required";

  await getDb().execute(
    `INSERT INTO \`nav_site_submission\` (
       \`id\`, \`name\`, \`url\`, \`category\`, \`description\`, \`contact\`,
       \`status\`, \`paymentStatus\`, \`paymentAmount\`, \`paymentOrderNo\`,
       \`createTime\`, \`createBy\`, \`updateTime\`, \`updateBy\`, \`yn\`
     ) VALUES (?, ?, ?, ?, ?, ?, 'pending', ?, ?, ?, ?, 'guest', ?, 'guest', 1)`,
    [
      id,
      input.name.trim().slice(0, 128),
      input.url.trim().slice(0, 1024),
      input.category ?? null,
      input.description ?? null,
      input.contact ?? null,
      paymentStatus,
      amount,
      orderNo,
      now,
      now,
    ]
  );

  const created = await getSubmission(id);
  if (!created) throw new Error("投稿写入后读取失败");
  return created;
}

export async function getSubmission(id: string): Promise<SubmissionRecord | null> {
  const [rows] = await getDb().execute(
    `SELECT ${COLUMNS} FROM \`nav_site_submission\` WHERE \`id\` = ? AND \`yn\` = 1 LIMIT 1`,
    [id]
  );
  const row = (rows as SubmissionRow[])[0];
  return row ? rowToRecord(row) : null;
}

/** 后台审核列表，按投稿时间倒序。 */
export async function listSubmissions(limit = 100): Promise<SubmissionRecord[]> {
  const [rows] = await getDb().execute(
    `SELECT ${COLUMNS} FROM \`nav_site_submission\`
     WHERE \`yn\` = 1
     ORDER BY \`createTime\` DESC
     LIMIT ?`,
    [limit]
  );
  return (rows as SubmissionRow[]).map(rowToRecord);
}

/** 标记订单已支付（原型占位；真实支付网关回调二期接入）。 */
export async function markSubmissionPaid(id: string): Promise<SubmissionRecord | null> {
  const now = new Date();
  await getDb().execute(
    `UPDATE \`nav_site_submission\`
     SET \`paymentStatus\` = 'paid', \`paidTime\` = ?,
         \`updateTime\` = ?, \`updateBy\` = 'payment'
     WHERE \`id\` = ? AND \`yn\` = 1 AND \`paymentStatus\` = 'unpaid'`,
    [now, now, id]
  );
  return getSubmission(id);
}

/** 审核：approve 收录 / reject 驳回；写入审核人与时间、驳回原因。 */
export async function reviewSubmission(
  id: string,
  action: "approve" | "reject",
  opts: { reason?: string | null; approver: string }
): Promise<SubmissionRecord | null> {
  const now = new Date();
  if (action === "approve") {
    await getDb().execute(
      `UPDATE \`nav_site_submission\`
       SET \`status\` = 'approved', \`approveTime\` = ?, \`approveBy\` = ?,
           \`rejectReason\` = NULL, \`updateTime\` = ?, \`updateBy\` = ?
       WHERE \`id\` = ? AND \`yn\` = 1`,
      [now, opts.approver, now, opts.approver, id]
    );
  } else {
    await getDb().execute(
      `UPDATE \`nav_site_submission\`
       SET \`status\` = 'rejected', \`rejectReason\` = ?,
           \`updateTime\` = ?, \`updateBy\` = ?
       WHERE \`id\` = ? AND \`yn\` = 1`,
      [opts.reason?.slice(0, 500) ?? null, now, opts.approver, id]
    );
  }
  return getSubmission(id);
}

/** 已收录（审核通过）投稿，供前台站点流合并展示。 */
export async function listApprovedListings(limit = 12): Promise<SubmissionRecord[]> {
  const [rows] = await getDb().execute(
    `SELECT ${COLUMNS} FROM \`nav_site_submission\`
     WHERE \`yn\` = 1 AND \`status\` = 'approved'
     ORDER BY \`approveTime\` DESC
     LIMIT ?`,
    [limit]
  );
  return (rows as SubmissionRow[]).map(rowToRecord);
}
