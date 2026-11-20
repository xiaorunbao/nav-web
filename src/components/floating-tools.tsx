"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowUp,
  Bell,
  Bookmark,
  MessageCircle,
  Search,
  Sparkles,
  WandSparkles,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SiteIcon } from "@/components/site-icon";
import { searchSites } from "@/lib/search";
import type { NavSite } from "@/data/nav";

const PROMPTS = ["找一个在线配色工具", "AI 设计工具推荐", "免费素材站", "团队设计博客"];

type NoticeKind = "qq" | "bell" | null;

const NOTICE_CONTENT: Record<Exclude<NoticeKind, null>, { title: string; desc: string }> = {
  qq: {
    title: "在线客服",
    desc: "原型演示阶段暂未配置客服 QQ 临时会话；接入真实站点后可通过 wpa.qq.com 唤起 QQ 聊天窗口。",
  },
  bell: {
    title: "消息通知",
    desc: "暂无新通知。评论回复、收录审核结果等消息会在这里提醒，当前为原型占位。",
  },
};

export function FloatingTools() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [answered, setAnswered] = useState(false);
  const [results, setResults] = useState<NavSite[]>([]);
  const [notice, setNotice] = useState<NoticeKind>(null);
  const router = useRouter();

  const ask = (text: string) => {
    setValue(text);
    setResults(searchSites(text, 4));
    setAnswered(true);
  };

  return (
    <>
      <div className="fixed bottom-5 right-4 z-30 flex flex-col items-center gap-2 sm:bottom-7 sm:right-6">
        <button
          onClick={() => setOpen(true)}
          aria-label="AI 找站"
          className="group relative flex size-11 items-center justify-center rounded-full gradient-brand-violet text-white shadow-[0_14px_30px_-12px_rgba(134,24,219,0.7)] transition hover:scale-105"
        >
          <span className="absolute inset-0 animate-ping rounded-full bg-purple-400/30" />
          <Sparkles className="relative size-5" />
        </button>
        <Link
          href="/bookmark"
          aria-label="我的书签"
          className="flex size-9 items-center justify-center rounded-full border border-border/70 bg-card/90 text-muted-foreground shadow-sm backdrop-blur transition hover:text-brand"
        >
          <Bookmark className="size-4" />
        </Link>
        <button
          onClick={() => setNotice("qq")}
          aria-label="在线客服"
          className="flex size-9 items-center justify-center rounded-full border border-border/70 bg-card/90 text-muted-foreground shadow-sm backdrop-blur transition hover:text-brand"
        >
          <MessageCircle className="size-4" />
        </button>
        <button
          onClick={() => setNotice("bell")}
          aria-label="消息通知"
          className="flex size-9 items-center justify-center rounded-full border border-border/70 bg-card/90 text-muted-foreground shadow-sm backdrop-blur transition hover:text-brand"
        >
          <Bell className="size-4" />
        </button>
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="回到顶部"
          className="flex size-9 items-center justify-center rounded-full border border-border/70 bg-card/90 text-muted-foreground shadow-sm backdrop-blur transition hover:text-brand"
        >
          <ArrowUp className="size-4" />
        </button>
      </div>

      <Dialog
        open={open}
        onOpenChange={(next) => {
          setOpen(next);
          if (!next) {
            setValue("");
            setAnswered(false);
            setResults([]);
          }
        }}
      >
        <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-[460px]">
          <div className="relative overflow-hidden border-b border-border/60 bg-[linear-gradient(135deg,rgba(134,24,219,0.12),rgba(241,64,75,0.08))] px-5 pb-4 pt-5">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-base">
                <span className="flex size-8 items-center justify-center rounded-xl gradient-brand-violet text-white ring-1 ring-white/20">
                  <WandSparkles className="size-4" />
                </span>
                AI 找站助手
              </DialogTitle>
              <DialogDescription className="text-xs">
                用一句话描述你的需求，从 {results.length ? "已收录站点" : "全站"} 中帮你挑出合适的入口。
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className="p-4">
            <div className="flex items-center gap-2 rounded-xl border border-border/70 bg-muted/40 px-3">
              <Search className="size-4 text-muted-foreground" />
              <Input
                value={value}
                onChange={(event) => setValue(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && value.trim()) ask(value);
                }}
                placeholder="例如：帮我找一个免费配色工具"
                className="h-10 border-0 bg-transparent px-0 shadow-none focus-visible:ring-0 dark:bg-transparent"
              />
              <Button
                size="sm"
                onClick={() => value.trim() && ask(value)}
                className="rounded-lg gradient-brand text-white shadow-[0_8px_18px_-10px_rgba(241,64,75,0.7)]"
              >
                找一找
              </Button>
            </div>

            <div className="mt-2 flex flex-wrap gap-1.5">
              {PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => ask(prompt)}
                  className="rounded-full bg-muted px-2.5 py-1 text-[11px] text-muted-foreground transition hover:bg-brand-soft hover:text-brand"
                >
                  {prompt}
                </button>
              ))}
            </div>

            {answered && (
              <div className="mt-4">
                <p className="text-xs text-muted-foreground">
                  {results.length > 0
                    ? `为你找到 ${results.length} 个相关站点：`
                    : "暂时没有匹配结果，换个说法试试，比如“配色”“素材”。"}
                </p>
                <div className="mt-2 space-y-1">
                  {results.map((site) => (
                    <button
                      key={site.id}
                      onClick={() => {
                        setOpen(false);
                        router.push(`/sites/${site.id}.html`);
                      }}
                      className="flex w-full items-center gap-2.5 rounded-lg p-2 text-left transition hover:bg-muted"
                    >
                      <SiteIcon site={site} size={30} />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm text-foreground">
                          {site.name}
                        </span>
                        <span className="block truncate text-[11px] text-muted-foreground">
                          {site.desc}
                        </span>
                      </span>
                      <span className="rounded-full border border-brand/15 bg-brand-soft px-1.5 py-0.5 text-[10px] text-brand">
                        查看
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={notice !== null} onOpenChange={(next) => !next && setNotice(null)}>
        <DialogContent className="sm:max-w-[380px]">
          <DialogHeader>
            <DialogTitle>{notice ? NOTICE_CONTENT[notice].title : ""}</DialogTitle>
            <DialogDescription>
              {notice ? NOTICE_CONTENT[notice].desc : ""}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}
