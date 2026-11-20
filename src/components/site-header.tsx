"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronDown,
  Crown,
  LogIn,
  LogOut,
  Menu,
  Moon,
  PanelLeftOpen,
  Search,
  Sun,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { logoutAction } from "@/app/login/actions";
import type { SessionUser } from "@/lib/auth-shared";
import { OAUTH_PROVIDER_LABELS } from "@/lib/oauth-shared";
import { useNavStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const PROVIDER_LABEL: Record<SessionUser["provider"], string> = {
  password: "账号密码登录",
  qq: `${OAUTH_PROVIDER_LABELS.qq} 登录`,
  wechat: `${OAUTH_PROVIDER_LABELS.wechat}登录`,
  baidu: `${OAUTH_PROVIDER_LABELS.baidu}登录`,
  weibo: `${OAUTH_PROVIDER_LABELS.weibo}登录`,
  google: `${OAUTH_PROVIDER_LABELS.google} 登录`,
  github: `${OAUTH_PROVIDER_LABELS.github} 登录`,
};

const NAV = [
  { label: "快速筛选", href: "/iotags" },
  { label: "次级导航", href: "/secondary" },
  { label: "排行榜", href: "/rankings" },
  { label: "我的书签", href: "/bookmark" },
  { label: "关于", href: "/about" },
  { label: "投稿收录", href: "/submit" },
];

const NOTICE: Record<"vip", { title: string; desc: string }> = {
  vip: {
    title: "开通会员",
    desc: "这是界面原型，会员权益与支付流程尚未接入，敬请期待。",
  },
};

function UserAvatar({
  user,
  className,
}: {
  user: SessionUser;
  className?: string;
}) {
  const [broken, setBroken] = useState(false);

  if (user.avatar && !broken) {
    return (
      <img
        src={user.avatar}
        alt={user.name}
        referrerPolicy="no-referrer"
        onError={() => setBroken(true)}
        className={cn("rounded-full object-cover", className)}
      />
    );
  }

  return (
    <span
      className={cn(
        "grid place-items-center rounded-full gradient-brand font-semibold text-white",
        className
      )}
    >
      {user.name.slice(0, 1)}
    </span>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const theme = useNavStore((state) => state.theme);
  const toggleTheme = useNavStore((state) => state.toggleTheme);
  const asideCollapsed = useNavStore((state) => state.asideCollapsed);
  const toggleAside = useNavStore((state) => state.toggleAside);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notice, setNotice] = useState<"vip" | null>(null);
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loggingOut, startLogout] = useTransition();
  const isListing = pathname === "/" || pathname === "/secondary";
  const isBookmark = pathname === "/bookmark";
  const loginHref = "/login";

  useEffect(() => {
    let active = true;

    fetch("/api/auth/me", { cache: "no-store" })
      .then((response) => (response.ok ? response.json() : null))
      .then((data: { user: SessionUser | null } | null) => {
        if (active) setUser(data?.user ?? null);
      })
      .catch(() => {
        if (active) setUser(null);
      });

    return () => {
      active = false;
    };
  }, []);

  const handleLogout = () => {
    startLogout(async () => {
      await logoutAction();
    });
  };

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
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 h-16 lg:h-20",
        isBookmark
          ? "border-transparent bg-transparent shadow-none"
          : "border-b border-border/70 blur-bg shadow-[0_10px_30px_-26px_rgba(55,30,95,0.45)]"
      )}
    >
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
                    : isBookmark
                      ? "text-white/80 hover:bg-white/10 hover:text-white"
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
            className={cn(
              "hidden h-9 items-center gap-2 rounded-full border px-3 text-xs shadow-[0_2px_10px_-6px_rgba(55,30,95,0.25)] transition lg:flex lg:w-44",
              isBookmark
                ? "border-white/15 bg-white/15 text-white/80 hover:border-white/30 hover:text-white"
                : "border-border/80 bg-card/80 text-muted-foreground hover:border-brand/30 hover:text-foreground"
            )}
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
            className={cn(isBookmark && "text-white/80 hover:text-white")}
            aria-label="切换深浅色"
          >
            {theme === "dark" ? (
              <Sun className="size-4.5" />
            ) : (
              <Moon className="size-4.5" />
            )}
          </Button>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="hidden h-9 items-center gap-2 rounded-full border border-border/80 bg-card/80 py-1 pl-1 pr-2.5 text-xs text-foreground shadow-[0_2px_10px_-6px_rgba(55,30,95,0.25)] transition hover:border-brand/30 md:inline-flex"
                  aria-label="账号菜单"
                >
                  <UserAvatar user={user} className="size-7 shrink-0 text-[11px]" />
                  <span className="max-w-[84px] truncate font-medium">
                    {user.name}
                  </span>
                  <ChevronDown className="size-3.5 text-muted-foreground" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="space-y-0.5">
                  <span className="block truncate text-sm font-medium text-foreground">
                    {user.name}
                  </span>
                  <span className="block truncate text-[11px] font-normal text-muted-foreground">
                    {PROVIDER_LABEL[user.provider]} ·{" "}
                    {user.account}
                  </span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/" className="cursor-pointer">
                    <LogIn className="size-4" />
                    返回首页
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  variant="destructive"
                  disabled={loggingOut}
                  onSelect={(event) => {
                    event.preventDefault();
                    handleLogout();
                  }}
                >
                  <LogOut className="size-4" />
                  {loggingOut ? "退出中…" : "退出登录"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              asChild
              className={cn("hidden md:inline-flex", isBookmark ? "text-white/80 hover:text-white" : "text-muted-foreground")}
            >
              <Link href={loginHref}>
                <LogIn className="size-4" />
                登录
              </Link>
            </Button>
          )}

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
              <div className="space-y-2 border-t p-3">
                {user ? (
                  <>
                    <div className="flex items-center gap-2.5 rounded-xl bg-muted/60 px-3 py-2.5">
                      <UserAvatar user={user} className="size-8 shrink-0 text-xs" />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium text-foreground">
                          {user.name}
                        </span>
                        <span className="block truncate text-[11px] text-muted-foreground">
                          {PROVIDER_LABEL[user.provider]}
                        </span>
                      </span>
                    </div>
                    <Button
                      variant="outline"
                      disabled={loggingOut}
                      onClick={handleLogout}
                      className="w-full rounded-full"
                    >
                      <LogOut className="size-4" />
                      {loggingOut ? "退出中…" : "退出登录"}
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="outline"
                    asChild
                    className="w-full rounded-full"
                    onClick={() => setMobileOpen(false)}
                  >
                    <Link href={loginHref}>
                      <LogIn className="size-4" />
                      登录
                    </Link>
                  </Button>
                )}
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
