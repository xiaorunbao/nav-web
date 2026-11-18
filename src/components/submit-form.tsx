"use client";

import { useState } from "react";
import { CheckCircle2, RotateCcw, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { blocks } from "@/data/nav";
import { cn } from "@/lib/utils";

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

const FIELDS: { key: keyof Values; label: string; placeholder: string; hint?: string }[] = [
  { key: "name", label: "站点名称", placeholder: "例如：一为导航" },
  { key: "url", label: "站点地址", placeholder: "https://example.com" },
  { key: "desc", label: "一句话介绍", placeholder: "这个站点能帮用户解决什么问题" },
  { key: "contact", label: "联系方式（选填）", placeholder: "邮箱或微信，便于我们确认收录" },
];

export function SubmitForm() {
  const [values, setValues] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof Values, string>>>({});
  const [submitted, setSubmitted] = useState(false);

  const update =
    (key: keyof Values) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const value = event.target.value;
      setValues((prev) => ({ ...prev, [key]: value }));
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    };

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const next: Partial<Record<keyof Values, string>> = {};
    if (!values.name.trim()) next.name = "请填写站点名称";
    if (!values.url.trim()) next.url = "请填写站点地址";
    else if (!/^https?:\/\/.+/i.test(values.url.trim()))
      next.url = "地址需以 http:// 或 https:// 开头";
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="rounded-2xl border border-border/70 bg-card p-5 card-shadow sm:p-6">
        <div className="flex flex-col items-center py-6 text-center">
          <span className="flex size-12 items-center justify-center rounded-full gradient-brand-soft text-brand ring-1 ring-brand/10">
            <CheckCircle2 className="size-6" />
          </span>
          <h3 className="mt-3 text-base font-semibold text-foreground">
            已收到你的投稿
          </h3>
          <p className="mt-1.5 max-w-sm text-xs leading-relaxed text-muted-foreground">
            「{values.name}」已提交。这是界面原型，表单数据不会真实发送，
            后续接入服务后会由人工筛选收录。
          </p>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setValues(EMPTY);
              setSubmitted(false);
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
              <span className="mt-1 block text-[11px] text-destructive">
                {errors[field.key]}
              </span>
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

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border/60 pt-4">
        <p className="text-[11px] text-muted-foreground">
          原型演示：提交仅在前端校验，不会真实发送。
        </p>
        <Button
          type="submit"
          size="sm"
          className="rounded-full gradient-brand px-5 text-white shadow-[0_10px_22px_-12px_rgba(241,64,75,0.7)]"
        >
          <Send className="size-3.5" />
          提交收录
        </Button>
      </div>
    </form>
  );
}