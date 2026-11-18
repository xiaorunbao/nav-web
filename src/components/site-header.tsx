"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Crown,
  LogIn,
  Menu,
  Moon,
  PanelLeftOpen,
  Search,
  Sun,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SearchDialog } from "@/components/search-dialog";
import { NavIcon } from "@/components/nav-icons";
import { sidebarItems } from "@/data/nav";
import { useNavStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const NAV = [
  { label: "快速筛选", href: "/#blocks" },
  { label: "次级导航", href: "/secondary" },
  { label: "排行榜", href: "/#hot" },
  { label: "关于", href: "/about" },
  { label: "投稿收录", href: "/submit" },
];

const NOTICE: Record<"login" | "vip", { title: string; desc: string }> = {
  login: {
    title: "登录",
    desc: "这是界面原型，账号体系尚未接入，暂时无法登录。",
  },
  vip: {
    title: "开通会员",
    desc: "这是界面原型，会员权益与支付流程尚未接入，敬请期待。",
  },
};

export function SiteHeader() {
  const pathname = usePathname();
  const theme = useNavStore((state) => state.theme);
  const toggleTheme = useNavStore((state) => state.toggleTheme);
  const asideCollapsed = useNavStore((state) => state.asideCollapsed);
  const toggleAside = useNavStore((state) => state.toggleAside);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notice, setNotice] = useState<"login" | "vip" | null>(null);
  const isListing = pathname === "/" || pathname === "/secondary";

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const typing =
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable);
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearchOpen(true);
      }
      if (event.key === "/" && !typing) {
        event.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-40 h-16 border-b border-border/70 blur-bg shadow-[0_10px_30px_-26px_rgba(55,30,95,0.45)] lg:h-20">
      <div className="mx-auto flex h-full w-full max-w-[1480px] items-center gap-2 px-3 sm:px-5 lg:gap-4 lg:px-6">
        {asideCollapsed && isListing && (
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={toggleAside}
            className="hidden text-muted-foreground lg:inline-flex"
            aria-label="展开分类侧栏"
          >
            <PanelLeftOpen className="size-4" />
          </Button>
        )}

        <Link href="/" className="flex shrink-0 items-center">
          <img
            src="/logo.png"
            alt="一为导航"
            className="h-7 w-auto lg:h-8 dark:rounded-md dark:bg-white/95 dark:px-1.5 dark:py-1"
          />
        </Link>

        <nav className="ml-2 hidden items-center gap-0.5 lg:flex">
          {NAV.map((item) => {
            const active = item.href === pathname;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  "rounded-lg px-3 py-2 text-[13px] font-medium transition-colors",
                  active
                    ? "gradient-brand text-white shadow-[0_10px_22px_-12px_rgba(241,64,75,0.65)]"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex-1" />

        <div className="flex items-center gap-1.5 lg:gap-2">
          <button
            onClick={() => setSearchOpen(true)}
            className="hidden h-9 items-center gap-2 rounded-full border border-border/80 bg-card/80 px-3 text-xs text-muted-foreground shadow-[0_2px_10px_-6px_rgba(55,30,95,0.25)] transition hover:border-brand/30 hover:text-foreground lg:flex lg:w-44"
          >
            <Search className="size-3.5" />
            <span className="flex-1 text-left">搜索站点</span>
            <kbd className="rounded border bg-muted px-1 py-0.5 text-[10px]">
              ⌘K
            </kbd>
          </button>

          <Button
            variant="ghost"
            size="icon-sm"
            className="text-muted-foreground lg:hidden"
            onClick={() => setSearchOpen(true)}
            aria-label="搜索"
          >
            <Search className="size-4.5" />
          </Button>

          <Button
            variant="ghost"
            size="icon-sm"
            onClick={toggleTheme}
            className="text-muted-foreground"
            aria-label="切换深浅色"
          >
            {theme === "dark" ? (
              <Sun className="size-4.5" />
            ) : (
              <Moon className="size-4.5" />
            )}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setNotice("login")}
            className="hidden text-muted-foreground md:inline-flex"
          >
            <LogIn className="size-4" />
            登录
          </Button>

          <Button
            size="sm"
            onClick={() => setNotice("vip")}
            className="hidden rounded-full gradient-brand px-3 text-white shadow-[0_10px_22px_-12px_rgba(241,64,75,0.7)] hover:brightness-105 md:inline-flex"
          >
            <Crown className="size-3.5" />
            开通会员
          </Button>

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon-sm"
                className="lg:hidden"
                aria-label="打开菜单"
              >
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] gap-0 p-0">
              <SheetHeader className="border-b px-5 py-4">
                <SheetTitle>
                  <img src="/logo.png" alt="一为导航" className="h-7 w-auto" />
                </SheetTitle>
              </SheetHeader>
              <div className="flex-1 overflow-y-auto px-3 py-3">
                <p className="px-2 pb-2 text-[11px] uppercase tracking-wider text-muted-foreground">
                  导航
                </p>
                <div className="grid grid-cols-2 gap-1">
                  {NAV.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className="rounded-lg px-2 py-2 text-sm text-muted-foreground hover:bg-muted"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>

                <p className="px-2 pb-2 pt-4 text-[11px] uppercase tracking-wider text-muted-foreground">
                  分类
                </p>
                <div className="space-y-0.5">
                  {sidebarItems.map((item) => (
                    <Link
                      key={item.id}
                      href={`/#block-${item.id}`}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2.5 rounded-lg px-2 py-2.5 text-sm text-muted-foreground hover:bg-muted"
                    >
                      <NavIcon name={item.icon} className="size-4 text-brand" />
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>
              <div className="border-t p-3">
                <Button
                  onClick={() => {
                    setMobileOpen(false);
                    setNotice("vip");
                  }}
                  className="w-full rounded-full gradient-brand text-white shadow-[0_10px_22px_-12px_rgba(241,64,75,0.7)]"
                >
                  <Crown className="size-4" />
                  开通会员
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />

      <Dialog
        open={Boolean(notice)}
        onOpenChange={(open) => {
          if (!open) setNotice(null);
        }}
      >
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>{notice ? NOTICE[notice].title : ""}</DialogTitle>
            <DialogDescription>{notice ? NOTICE[notice].desc : ""}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button
                size="sm"
                className="rounded-full gradient-brand px-4 text-white"
              >
                知道了
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </header>
  );
}