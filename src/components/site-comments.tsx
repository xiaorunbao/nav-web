"use client";

import { useEffect, useState } from "react";
import { Loader2, MessageSquare, Reply, Send, User, X } from "lucide-react";
import { formatCommentTime } from "@/lib/site";
import { cn } from "@/lib/utils";
import type { CommentRecord } from "@/lib/comments";
import type { SessionUser } from "@/lib/auth-shared";

function Avatar({ comment, size = 34 }: { comment: CommentRecord; size?: number }) {
  const style = { width: size, height: size };
  if (comment.avatar) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={comment.avatar}
        alt={comment.nickname}
        style={style}
        referrerPolicy="no-referrer"
        className="shrink-0 rounded-full object-cover"
      />
    );
  }
  return (
    <span
      style={style}
      className="grid shrink-0 place-items-center rounded-full bg-muted text-muted-foreground"
    >
      <User className="size-4" />
    </span>
  );
}

function CommentItem({
  comment,
  depth,
  onReply,
}: {
  comment: CommentRecord;
  depth: number;
  onReply: (comment: CommentRecord) => void;
}) {
  return (
    <div className={cn("flex gap-3", depth > 0 && "ml-10 mt-4")}>
      <Avatar comment={comment} />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span className="text-[13px] font-medium text-foreground">{comment.nickname}</span>
          {comment.badge && (
            <span className="rounded-[2px] bg-[#fdf0ec] px-1.5 py-0.5 text-[10px] text-[#e07a4f]">
              {comment.badge}
            </span>
          )}
          <span className="text-[11px] text-muted-foreground/70">
            {formatCommentTime(comment.createTime)}
          </span>
          {comment.region && (
            <span className="text-[11px] text-muted-foreground/70">· {comment.region}</span>
          )}
        </div>
        <p className="mt-1.5 whitespace-pre-wrap text-[13px] leading-[1.8] text-foreground/80">
          {comment.content}
        </p>
        <button
          onClick={() => onReply(comment)}
          className="mt-1.5 inline-flex items-center gap-1 text-[11px] text-muted-foreground transition hover:text-brand"
        >
          <Reply className="size-3" />
          回复
        </button>

        {comment.replies.map((reply) => (
          <CommentItem key={reply.id} comment={reply} depth={depth + 1} onReply={onReply} />
        ))}
      </div>
    </div>
  );
}

export function SiteComments({
  siteId,
  onCount,
}: {
  siteId: string;
  onCount?: (total: number) => void;
}) {
  const [comments, setComments] = useState<CommentRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ nickname: "", email: "", content: "" });
  const [replyTo, setReplyTo] = useState<CommentRecord | null>(null);
  const [user, setUser] = useState<SessionUser | null>(null);

  const applyData = (data: { ok: boolean; comments: CommentRecord[]; total: number }) => {
    if (!data.ok) return;
    setComments(data.comments);
    setTotal(Number(data.total) || 0);
    onCount?.(Number(data.total) || 0);
  };

  const refresh = async () => {
    try {
      const res = await fetch(`/api/comments?siteId=${encodeURIComponent(siteId)}`, {
        cache: "no-store",
      });
      applyData(await res.json());
    } catch {
      // 列表失败保留空态，不阻断页面
    }
  };

  useEffect(() => {
    let active = true;
    fetch(`/api/comments?siteId=${encodeURIComponent(siteId)}`, { cache: "no-store" })
      .then((res) => res.json())
      .then((data: { ok: boolean; comments: CommentRecord[]; total: number }) => {
        if (active) applyData(data);
      })
      .catch(() => {})
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [siteId]);

  useEffect(() => {
    fetch("/api/auth/me", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { user: SessionUser | null } | null) => {
        const current = data?.user ?? null;
        setUser(current);
        if (current) {
          setForm((prev) => ({
            ...prev,
            nickname: current.name,
            email: current.account,
          }));
        }
      })
      .catch(() => {});
  }, []);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const content = form.content.trim();
    if (!content) {
      setError("请输入评论内容");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          siteId,
          content,
          nickname: form.nickname,
          email: form.email,
          parentId: replyTo?.id ?? null,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "提交失败，请稍后重试");
        return;
      }
      setForm((prev) => ({ ...prev, content: "" }));
      setReplyTo(null);
      await refresh();
    } catch {
      setError("网络异常，请稍后重试");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="respond" className="mt-6">
      <div className="flex items-center gap-1.5">
        <MessageSquare className="size-4 text-muted-foreground" />
        <h2 className="text-[13px] font-medium text-foreground">
          {total > 0 ? `${total} 条评论` : "暂无评论"}
        </h2>
      </div>

      <div className="mt-2.5 rounded-[10px] bg-card p-5 shadow-[0_1px_3px_rgba(20,20,30,0.05)]">
        {loading ? (
          <p className="py-2 text-[12px] text-muted-foreground">评论加载中…</p>
        ) : comments.length > 0 ? (
          <div className="space-y-5 border-b border-border/40 pb-5">
            {comments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                depth={0}
                onReply={(target) => {
                  setReplyTo(target);
                  setForm((prev) => ({ ...prev, nickname: prev.nickname || target.nickname }));
                }}
              />
            ))}
          </div>
        ) : null}

        <form onSubmit={submit} className={cn(comments.length > 0 && "pt-5")}>
          {replyTo && (
            <div className="mb-2 flex items-center justify-between gap-2 rounded-[4px] bg-muted/50 px-3 py-2 text-[11px] text-muted-foreground">
              <span>
                回复 <span className="font-medium text-foreground">@{replyTo.nickname}</span>
              </span>
              <button
                type="button"
                onClick={() => setReplyTo(null)}
                className="inline-flex items-center gap-1 hover:text-brand"
              >
                <X className="size-3" />
                取消回复
              </button>
            </div>
          )}

          <div className="flex items-center gap-2">
            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-muted text-[13px] font-medium text-muted-foreground">
              {user ? user.name.slice(0, 1).toUpperCase() : <User className="size-5" />}
            </span>
          </div>

          <textarea
            value={form.content}
            onChange={(event) => setForm((prev) => ({ ...prev, content: event.target.value }))}
            placeholder={replyTo ? `回复 @${replyTo.nickname}…` : "输入评论内容..."}
            className="mt-2.5 min-h-[104px] w-full resize-y rounded-[6px] bg-muted/50 px-3 py-2.5 text-[13px] text-foreground outline-none transition placeholder:text-muted-foreground/70 focus:bg-muted/60"
          />

          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <input
              value={form.nickname}
              onChange={(event) => setForm((prev) => ({ ...prev, nickname: event.target.value }))}
              placeholder="昵称"
              className="h-9 w-full rounded-[6px] bg-muted/50 px-3 text-[13px] text-foreground outline-none transition placeholder:text-muted-foreground/70 focus:bg-muted/60"
            />
            <input
              value={form.email}
              onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
              placeholder="邮箱"
              className="h-9 w-full rounded-[6px] bg-muted/50 px-3 text-[13px] text-foreground outline-none transition placeholder:text-muted-foreground/70 focus:bg-muted/60"
            />
          </div>

          {error && <p className="mt-2 text-[11px] text-destructive">{error}</p>}

          <div className="mt-3 flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex h-9 items-center gap-1.5 rounded-[4px] bg-[#e8453c] px-5 text-[13px] text-white transition hover:bg-[#d93b33] disabled:opacity-70"
            >
              {submitting ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <Send className="size-3.5" />
              )}
              发表评论
            </button>
          </div>
        </form>

        {!loading && comments.length === 0 && (
          <div className="mt-2 flex flex-col items-center gap-1 pt-2 text-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/illustrations/empty-comments.png"
              alt=""
              className="w-[176px] select-none"
            />
            <span className="text-[12px] text-muted-foreground">暂无评论... 快来抢沙发吧！</span>
          </div>
        )}
      </div>
    </section>
  );
}
