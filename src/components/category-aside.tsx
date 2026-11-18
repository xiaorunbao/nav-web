"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { ChevronDown, Link2, PanelLeftClose } from "lucide-react";
import { NavIcon } from "@/components/nav-icons";
import { panels, sidebarItems, siteById } from "@/data/nav";
import { useNavStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export function CategoryAside() {
  const pathname = usePathname();
  const activeCategory = useNavStore((state) => state.activeCategory);
  const activeSub = useNavStore((state) => state.activeSub);
  const selectCategory = useNavStore((state) => state.selectCategory);
  const toggleAside = useNavStore((state) => state.toggleAside);
  const [openItems, setOpenItems] = useState<string[]>([]);

  const prefix = pathname === "/secondary" ? "panel" : "block";

  const items =
    pathname === "/secondary"
      ? sidebarItems
          .filter((item) => panels.some((panel) => panel.id === item.id))
          .map((item) => ({ ...item, children: undefined }))
      : sidebarItems;

  const go = (id: string, sub?: string) => {
    selectCategory(id, sub ?? null);
    const target = document.getElementById(`${prefix}-${id}`);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    if (sub) {
      setOpenItems((items) =>
        items.includes(id) ? items : [...items, id]
      );
    }
  };

  const count = Object.keys(siteById).length;

  return (
    <aside className="fixed bottom-0 left-0 top-16 z-30 hidden w-[238px] p-3 lg:block lg:top-20">
      <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-border/70 card-shadow blur-bg">
        <div className="brand-hairline h-1 w-full shrink-0 opacity-90" />
        <div className="flex items-center justify-between px-4 pb-2 pt-3">
          <div>
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
              Categories
            </p>
            <h2 className="mt-0.5 text-sm font-semibold text-foreground">
              站点分类
            </h2>
          </div>
          <span className="rounded-full gradient-brand px-2 py-0.5 text-[10px] font-medium text-white shadow-[0_6px_14px_-8px_rgba(241,64,75,0.7)]">
            {count}
          </span>
        </div>

        <div className="flex-1 overflow-y-auto px-2 pb-2 no-scrollbar">
          {items.map((item) => {
            const active = activeCategory === item.id;
            const showChildren = active && item.children?.length;
            const expanded = openItems.includes(item.id) || showChildren;

            return (
              <div key={item.id} className="mb-0.5">
                <button
                  onClick={() => {
                    go(item.id);
                    setOpenItems((items) =>
                      items.includes(item.id)
                        ? items.filter((id) => id !== item.id)
                        : [...items, item.id]
                    );
                  }}
                  className={cn(
                    "group flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2.5 text-left text-[13px] transition",
                    active
                      ? "gradient-brand-soft font-semibold text-brand shadow-[inset_3px_0_0_var(--brand)]"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <span
                    className={cn(
                      "flex size-7 items-center justify-center rounded-lg transition",
                      active
                        ? "gradient-brand-violet text-white shadow-[0_8px_16px_-10px_rgba(134,24,219,0.6)]"
                        : "bg-muted text-muted-foreground group-hover:bg-card group-hover:text-foreground"
                    )}
                  >
                    <NavIcon name={item.icon} className="size-3.5" />
                  </span>
                  <span className="flex-1 truncate">{item.name}</span>
                  {item.children?.length ? (
                    <ChevronDown
                      className={cn(
                        "size-3.5 transition-transform",
                        expanded ? "rotate-180" : ""
                      )}
                    />
                  ) : (
                    <span className="text-[10px] tabular-nums text-muted-foreground/70">
                      {item.id === "recommend"
                        ? "12"
                        : item.id === "cloud"
                          ? "8"
                          : ""}
                    </span>
                  )}
                </button>

                {item.children?.length && expanded ? (
                  <div className="mb-1 ml-9 mr-1 mt-1 flex flex-wrap gap-1">
                    {item.children.map((child) => (
                      <button
                        key={child}
                        onClick={() => go(item.id, child)}
                        className={cn(
                          "rounded-md px-2 py-1 text-[11px] transition",
                          activeSub === child
                            ? "bg-brand-soft text-brand"
                            : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
                        )}
                      >
                        {child}
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>
            );
          })}

          <div className="my-2 h-px bg-border/70" />

          <button
            onClick={() => {
              const footer = document.getElementById("footer");
              footer?.scrollIntoView({ behavior: "smooth" });
            }}
            className="flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2.5 text-[13px] text-muted-foreground transition hover:bg-muted hover:text-foreground"
          >
            <span className="flex size-7 items-center justify-center rounded-lg bg-muted text-muted-foreground">
              <Link2 className="size-3.5" />
            </span>
            友情链接
          </button>
        </div>

        <div className="border-t border-border/60 p-2">
          <button
            onClick={toggleAside}
            className="flex w-full items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs text-muted-foreground transition hover:bg-muted hover:text-foreground"
          >
            <PanelLeftClose className="size-3.5" />
            收起侧栏
          </button>
        </div>
      </div>
    </aside>
  );
}
