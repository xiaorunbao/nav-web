"use client";

import { useEffect, useState } from "react";
import {
  Ban,
  CheckCircle2,
  Clock,
  ExternalLink,
  FileCheck2,
  Loader2,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyHint } from "@/components/empty-hint";
import { cn } from "@/lib/utils";
import type {
  PaymentStatus,
  SubmissionRecord,
  SubmissionStatus,
} from "@/lib/submissions";

const STATUS_META: Record<SubmissionStatus, { label: string; className: string }> = {
  pending: {
    label: "待审核",
    className: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  },
  approved: {
    label: "已收录",
    className: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  },
  rejected: { label: "已驳回", className: "bg-muted text-muted-foreground" },
};

const PAYMENT_LABEL: Record<PaymentStatus, string> = {
  not_required: "无需付费",
  unpaid: "待支付",
  paid: "已支付",
  refunded: "已退款",
};

function formatDateTime(iso?: string | null) {
  if (!iso) return "-";
  const date = new Date(iso);
  return Number.isNaN(date.getTime())
    ? "-"
    : date.toLocaleString("zh-CN", { hour12: false });
}

type PaymentConfig = { enabled: boolean; amount: string | null; currency: string };

export function AdminSubmissionsView({ adminName }: { adminName: string }) {
  const [submissions, setSubmissions] = useState<SubmissionRecord[]>([]);
  const [payment, setPayment] = useState<PaymentConfig>({
    enabled: false,
    amount: null,
    currency: "CNY",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reviewingId, setReviewingId] = useState<string | null>(null);
  const [rejectTarget, setRejectTarget] = useState<SubmissionRecord | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const applyData = (data: {
    ok: boolean;
    submissions: SubmissionRecord[];
    payment?: PaymentConfig;
    error?: string;
  }) => {
    if (data.ok) {
      setSubmissions(data.submissions);
      if (data.payment) setPayment(data.payment);
    } else {
      setError(data.error ?? "加载失败");
    }
  };

  const refresh = async () => {
    try {
      const res = await fetch("/api/submissions", { cache: "no-store" });
      applyData(await res.json());
    } catch {
      setError("网络异常，请稍后重试");
    }
  };

  useEffect(() => {
    let active = true;
    fetch("/api/submissions", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (active) applyData(data);
      })
      .catch(() => {
        if (active) setError("网络异常，请稍后重试");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const review = async (item: SubmissionRecord, action: "approve" | "reject") => {
    setReviewingId(item.id);
    setError("");
    try {
      const res = await fetch(`/api/submissions/${item.id}/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, reason: rejectReason }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "操作失败");
        return;
      }
      setRejectTarget(null);
      setRejectReason("");
      await refresh();
    } catch {
      setError("网络异常，请稍后重试");
    } finally {
      setReviewingId(null);
    }
  };

  return (
    <div className="space-y-4 pt-4">
      <section className="flex flex-wrap items-center gap-3 rounded-2xl border border-border/70 bg-card p-5 card-shadow">
        <span className="flex size-9 items-center justify-center rounded-xl gradient-brand-violet text-white ring-1 ring-white/20">
          <FileCheck2 className="size-4" />
        </span>
        <div>
          <h1 className="text-base font-semibold text-foreground">投稿审核后台</h1>
          <p className="text-[11px] text-muted-foreground">
            管理员：{adminName} · 付费环节
            {payment.enabled ? (
              <span className="text-emerald-600 dark:text-emerald-400">
                已开启（¥{payment.amount ?? "0.00"}）
              </span>
            ) : (
              <span className="text-muted-foreground">已关闭</span>
            )}
          </p>
        </div>
      </section>

      {error && (
        <p className="rounded-lg bg-destructive/10 px-3 py-2 text-[11px] text-destructive">
          {error}
        </p>
      )}

      {loading ? (
        <p className="py-10 text-center text-xs text-muted-foreground">加载投稿列表…</p>
      ) : submissions.length === 0 ? (
        <EmptyHint text="暂无投稿，提交收录后会出现在这里" />
      ) : (
        <div className="space-y-3">
          {submissions.map((item) => {
            const status = STATUS_META[item.status];
            const unpaid = payment.enabled && item.paymentStatus === "unpaid";
            const reviewing = reviewingId === item.id;
            return (
              <article
                key={item.id}
                className="rounded-2xl border border-border/70 bg-card p-4 card-shadow sm:p-5"
              >
                <div className="flex flex-wrap items-start gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-sm font-semibold text-foreground">{item.name}</h2>
                      <span
                        className={cn(
                          "rounded-full px-2 py-0.5 text-[10px]",
                          status.className
                        )}
                      >
                        {status.label}
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">
                        <Wallet className="size-3" />
                        {PAYMENT_LABEL[item.paymentStatus]}
                      </span>
                    </div>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 inline-flex items-center gap-1 text-[11px] text-brand hover:underline"
                    >
                      {item.url}
                      <ExternalLink className="size-3" />
                    </a>
                  </div>
                </div>

                {item.description && (
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                )}

                <div className="mt-2 flex flex-wrap gap-1.5 text-[10px] text-muted-foreground">
                  {item.category && (
                    <span className="rounded-full bg-brand-soft px-2 py-0.5 text-brand">
                      {item.category}
                    </span>
                  )}
                  {item.contact && <span>联系方式：{item.contact}</span>}
                  <span className="inline-flex items-center gap-1">
                    <Clock className="size-3" />
                    {formatDateTime(item.createTime)}
                  </span>
                  {item.paymentOrderNo && (
                    <span>订单号：{item.paymentOrderNo}</span>
                  )}
                  {item.paymentAmount !== null && (
                    <span>金额：¥{item.paymentAmount.toFixed(2)}</span>
                  )}
                </div>

                {item.status === "rejected" && item.rejectReason && (
                  <p className="mt-2 rounded-lg bg-muted/60 px-3 py-2 text-[11px] text-muted-foreground">
                    驳回原因：{item.rejectReason}
                  </p>
                )}
                {item.status === "approved" && item.approveBy && (
                  <p className="mt-2 text-[11px] text-emerald-600 dark:text-emerald-400">
                    已由 {item.approveBy} 收录
                    {item.approveTime ? ` · ${formatDateTime(item.approveTime)}` : ""}
                  </p>
                )}

                {item.status === "pending" && (
                  <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-border/60 pt-3">
                    <Button
                      size="xs"
                      disabled={reviewing || unpaid}
                      onClick={() => review(item, "approve")}
                      className="inline-flex items-center gap-1 rounded-full bg-emerald-600 px-3.5 text-white hover:bg-emerald-500"
                    >
                      {reviewing ? (
                        <Loader2 className="size-3 animate-spin" />
                      ) : (
                        <CheckCircle2 className="size-3" />
                      )}
                      {unpaid ? "待支付，不可收录" : "通过并收录"}
                    </Button>
                    <Button
                      size="xs"
                      variant="outline"
                      disabled={reviewing}
                      onClick={() => {
                        setRejectTarget(item);
                        setRejectReason("");
                      }}
                      className="inline-flex items-center gap-1 rounded-full"
                    >
                      <Ban className="size-3" />
                      驳回
                    </Button>
                  </div>
                )}

                {rejectTarget?.id === item.id && (
                  <div className="mt-3 rounded-xl border border-border/70 bg-muted/30 p-3">
                    <label className="text-[11px] font-medium text-foreground">
                      驳回原因（选填）
                    </label>
                    <textarea
                      value={rejectReason}
                      onChange={(event) => setRejectReason(event.target.value)}
                      placeholder="说明未收录的原因，便于投稿人修改后重新提交"
                      className="mt-1.5 h-16 w-full resize-none rounded-lg border border-border/70 bg-card px-3 py-2 text-xs outline-none focus-visible:ring-2 focus-visible:ring-brand/30"
                    />
                    <div className="mt-2 flex items-center gap-2">
                      <Button
                        size="xs"
                        disabled={reviewing}
                        onClick={() => review(item, "reject")}
                        className="rounded-full gradient-brand px-3.5 text-white"
                      >
                        确认驳回
                      </Button>
                      <Button
                        size="xs"
                        variant="outline"
                        onClick={() => {
                          setRejectTarget(null);
                          setRejectReason("");
                        }}
                        className="rounded-full"
                      >
                        取消
                      </Button>
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
