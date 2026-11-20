"use client";

import { useState } from "react";
import {
  CheckCircle2,
  Clock,
  Loader2,
  RotateCcw,
  Send,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { blocks } from "@/data/nav";
import { cn } from "@/lib/utils";
import type { SubmissionRecord } from "@/lib/submissions";

type PaymentConfig = { enabled: boolean; amount: string | null; currency: string };

type SubmitResult = { submission: SubmissionRecord; payment: PaymentConfig };

type Values = {
  name: string;
  url: string;
  category: string;
  desc: string;
  contact: string;
};

const EMPTY: Values = {
  name: "",
  url: "",
  category: blocks[0]?.title ?? "",
  desc: "",
  contact: "",
};

const FIELDS: { key: keyof Values; label: string; placeholder: string }[] = [
  { key: "name", label: "站点名称", placeholder: "例如：一为导航" },
  { key: "url", label: "站点地址", placeholder: "https://example.com" },
  { key: "desc", label: "一句话介绍", placeholder: "这个站点能帮用户解决什么问题" },
  { key: "contact", label: "联系方式（选填）", placeholder: "邮箱或微信，便于我们确认收录" },
];

export function SubmitForm() {
  const [values, setValues] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof Values, string>>>({});
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<SubmitResult | null>(null);
  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState("");

  const update =
    (key: keyof Values) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const value = event.target.value;
      setValues((prev) => ({ ...prev, [key]: value }));
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const next: Partial<Record<keyof Values, string>> = {};
    if (!values.name.trim()) next.name = "请填写站点名称";
    if (!values.url.trim()) next.url = "请填写站点地址";
    else if (!/^https?:\/\/.+/i.test(values.url.trim()))
      next.url = "地址需以 http:// 或 https:// 开头";
    setErrors(next);
    setServerError("");
    if (Object.keys(next).length > 0) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok) {
        setServerError(data.error ?? "提交失败，请稍后重试");
        return;
      }
      setResult({ submission: data.submission, payment: data.payment });
    } catch {
      setServerError("网络异常，请稍后重试");
    } finally {
      setSubmitting(false);
    }
  };

  const pay = async () => {
    if (!result) return;
    setPaying(true);
    setPayError("");
    try {
      const res = await fetch(`/api/submissions/${result.submission.id}/pay`, {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) {
        setPayError(data.error ?? "支付失败，请稍后重试");
        return;
      }
      setResult({ ...result, submission: data.submission });
    } catch {
      setPayError("网络异常，请稍后重试");
    } finally {
      setPaying(false);
    }
  };

  if (result) {
    const sub = result.submission;
    const needPay = result.payment.enabled && sub.paymentStatus === "unpaid";

    return (
      <div className="rounded-2xl border border-border/70 bg-card p-5 card-shadow sm:p-6">
        <div className="flex flex-col items-center py-4 text-center">
          <span
            className={cn(
              "flex size-12 items-center justify-center rounded-full ring-1",
              needPay
                ? "gradient-brand-soft text-amber-600 ring-amber-500/20 dark:text-amber-400"
                : "gradient-brand-soft text-brand ring-brand/10"
            )}
          >
            {needPay ? <Wallet className="size-6" /> : <CheckCircle2 className="size-6" />}
          </span>

          <h3 className="mt-3 text-base font-semibold text-foreground">
            {needPay ? "投稿已生成，待完成付费" : "投稿已收到，进入人工审核"}
          </h3>
          <p className="mt-1.5 max-w-sm text-xs leading-relaxed text-muted-foreground">
            「{sub.name}」{needPay ? "需完成收录费用后进入人工审核" : "编辑会按收录标准人工筛选"}，
            通过后会展示在对应分类目录中。
          </p>

          {needPay && (
            <div className="mt-4 w-full max-w-sm rounded-xl border border-border/70 bg-muted/30 p-3 text-left">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">收录费用</span>
                <span className="text-sm font-semibold text-foreground">
                  ¥{result.payment.amount ?? "0.00"}
                </span>
              </div>
              <div className="mt-1 flex items-center justify-between text-[11px] text-muted-foreground">
                <span>订单号</span>
                <span className="tabular-nums">{sub.paymentOrderNo ?? "-"}</span>
              </div>
              {payError && <p className="mt-2 text-[11px] text-destructive">{payError}</p>}
              <Button
                onClick={pay}
                disabled={paying}
                className="mt-3 w-full rounded-full gradient-brand px-4 text-white shadow-[0_10px_22px_-12px_rgba(241,64,75,0.7)]"
              >
                {paying ? <Loader2 className="size-3.5 animate-spin" /> : <Wallet className="size-3.5" />}
                {paying ? "支付确认中…" : `模拟支付 ¥${result.payment.amount ?? "0.00"}`}
              </Button>
              <p className="mt-2 text-[10px] text-muted-foreground">
                原型演示为模拟支付，未接入真实支付网关。
              </p>
            </div>
          )}

          {!needPay && (
            <p className="mt-2 inline-flex items-center gap-1 text-[11px] text-muted-foreground">
              <Clock className="size-3" />
              {sub.paymentStatus === "paid" ? "已支付，等待审核" : "无需付费，等待审核"}
            </p>
          )}

          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setValues(EMPTY);
              setResult(null);
              setPayError("");
            }}
            className="mt-4 rounded-full px-4"
          >
            <RotateCcw className="size-3.5" />
            再提交一个
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={submit}
      noValidate
      className="rounded-2xl border border-border/70 bg-card p-5 card-shadow sm:p-6"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {FIELDS.map((field) => (
          <label
            key={field.key}
            className={cn(
              "block",
              (field.key === "desc" || field.key === "contact") && "sm:col-span-2"
            )}
          >
            <span className="text-xs font-medium text-foreground">{field.label}</span>
            <Input
              value={values[field.key]}
              onChange={update(field.key)}
              placeholder={field.placeholder}
              aria-invalid={Boolean(errors[field.key])}
              className="mt-1.5 h-10 rounded-lg border-border/70 bg-muted/30 text-sm"
            />
            {errors[field.key] ? (
              <span className="mt-1 block text-[11px] text-destructive">{errors[field.key]}</span>
            ) : null}
          </label>
        ))}

        <label className="block">
          <span className="text-xs font-medium text-foreground">建议分类</span>
          <select
            value={values.category}
            onChange={update("category")}
            className="mt-1.5 h-10 w-full rounded-lg border border-border/70 bg-muted/30 px-2.5 text-sm text-foreground outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            {blocks.map((block) => (
              <option key={block.id} value={block.title}>
                {block.title}
              </option>
            ))}
          </select>
        </label>
      </div>

      {serverError && (
        <p className="mt-3 rounded-lg bg-destructive/10 px-3 py-2 text-[11px] text-destructive">
          {serverError}
        </p>
      )}

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-border/60 pt-4">
        <p className="text-[11px] text-muted-foreground">
          提交即表示同意我们按公开目录标准审核收录，站点需可正常访问且无违规内容。
        </p>
        <Button
          type="submit"
          size="sm"
          disabled={submitting}
          className="rounded-full gradient-brand px-5 text-white shadow-[0_10px_22px_-12px_rgba(241,64,75,0.7)]"
        >
          {submitting ? <Loader2 className="size-3.5 animate-spin" /> : <Send className="size-3.5" />}
          {submitting ? "提交中…" : "提交收录"}
        </Button>
      </div>
    </form>
  );
}
