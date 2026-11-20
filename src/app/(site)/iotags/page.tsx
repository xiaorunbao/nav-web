"use client";

import Link from "next/link";
import { Tags } from "lucide-react";
import { blocks, sites } from "@/data/nav";
import { allTags, tagGroups } from "@/lib/site";
import { NavIcon } from "@/components/nav-icons";
import { cn } from "@/lib/utils";

function sizeClass(count: number) {
  if (count >= 6) return "px-3 py-1.5 text-sm font-semibold";
  if (count >= 3) return "px-2.5 py-1 text-xs";
  return "px-2 py-1 text-[11px]";
}

export default function TagsPage() {
  const tags = allTags();
  const groups = tagGroups();

  const groupedTags = new Set(groups.flatMap((group) => group.tags.map((item) => item.tag)));
  const leftovers = tags.filter((item) => !groupedTags.has(item.tag));

  const stats = [
    { value: tags.length, label: "收录标签" },
    { value: sites.length, label: "收录站点" },
    { value: blocks.length, label: "精选分类" },
  ];

  return (
    <div>
      <section className="relative overflow-hidden rounded-2xl border border-border/70 bg-card p-5 card-shadow sm:p-7">
        <div className="brand-hairline absolute inset-x-0 top-0 h-[3px] opacity-90" />
        <div className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-[radial-gradient(circle,rgba(134,24,219,0.22),transparent_65%)]" />
        <div className="relative">
          <div className="flex items-center gap-2">
            <span className="flex size-9 items-center justify-center rounded-xl gradient-brand-violet text-white shadow-[0_10px_22px_-12px_rgba(134,24,219,0.7)] ring-1 ring-white/20">
              <Tags className="size-4" />
            </span>
            <span className="rounded-full bg-muted px-2.5 py-1 text-[10px] uppercase tracking-wider text-muted-foreground">
              Tags
            </span>
          </div>
          <h1 className="mt-4 text-2xl font-semibold tracking-tight text-foreground sm:text-[28px]">
            快速筛选 · 标签云
          </h1>
          <p className="mt-2 max-w-xl text-xs leading-relaxed text-muted-foreground sm:text-sm">
            按分类主题浏览全站标签，点击任一标签查看同标签下的全部入口。
          </p>
        </div>

        <div className="mt-5 grid max-w-xl grid-cols-3 gap-2">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-border/60 bg-card/70 px-2 py-3 text-center backdrop-blur"
            >
              <p className="text-lg font-semibold text-foreground">{stat.value}</p>
              <p className="mt-0.5 text-[10px] text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="mt-5 space-y-6">
        {groups.map((group) => (
          <section key={group.title}>
            <div className="mb-2.5 flex items-center gap-2">
              <span className="flex size-7 items-center justify-center rounded-lg gradient-brand-soft text-brand ring-1 ring-brand/10">
                <NavIcon name={group.icon} className="size-3.5" />
              </span>
              <span className="size-1.5 rounded-full bg-[#f1404b]" />
              <h2 className="text-sm font-semibold text-foreground">{group.title}</h2>
              <span className="text-[10px] text-muted-foreground">
                {group.tags.length} 个标签
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {group.tags.map(({ tag, count }) => (
                <Link
                  key={tag}
                  href={`/tags/${encodeURIComponent(tag)}`}
                  className={cn(
                    "rounded-full border border-border/70 bg-card text-muted-foreground transition hover:border-brand/30 hover:bg-brand-soft hover:text-brand",
                    sizeClass(count)
                  )}
                >
                  # {tag}
                  <span className="ml-1 text-[10px] text-muted-foreground/70">{count}</span>
                </Link>
              ))}
            </div>
          </section>
        ))}

        {leftovers.length > 0 && (
          <section>
            <div className="mb-2.5 flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-muted-foreground" />
              <h2 className="text-sm font-semibold text-foreground">其他标签</h2>
              <span className="text-[10px] text-muted-foreground">{leftovers.length} 个</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {leftovers.map(({ tag, count }) => (
                <Link
                  key={tag}
                  href={`/tags/${encodeURIComponent(tag)}`}
                  className={cn(
                    "rounded-full border border-border/70 bg-card text-muted-foreground transition hover:border-brand/30 hover:bg-brand-soft hover:text-brand",
                    sizeClass(count)
                  )}
                >
                  # {tag}
                  <span className="ml-1 text-[10px] text-muted-foreground/70">{count}</span>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
