"use client";

import { usePathname } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { CategoryAside } from "@/components/category-aside";
import { Footer } from "@/components/footer";
import { FloatingTools } from "@/components/floating-tools";
import { SiteDetailSheet } from "@/components/site-detail-sheet";
import { useNavStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export function Shell({ children }: { children: React.ReactNode }) {
  const collapsed = useNavStore((state) => state.asideCollapsed);
  const pathname = usePathname();
  const isDetail = pathname.startsWith("/sites/");
  const isBookmark = pathname === "/bookmark";
  const hasAside = !isDetail && (pathname === "/" || pathname === "/secondary");

  return (
    <>
      <SiteHeader />
      {hasAside && <CategoryAside />}
      <main
        className={cn(
          "pt-16 transition-[padding] duration-300 lg:pt-20",
          !collapsed && hasAside && "lg:pl-[238px]"
        )}
      >
        <div
          className={cn(
            "w-full",
            !isBookmark &&
              "mx-auto max-w-[1480px] px-3 pb-4 sm:px-5 lg:px-6",
            isDetail && "mx-auto max-w-[1312px]"
          )}
        >
          {children}
          {!isBookmark && <Footer />}
        </div>
      </main>
      <SiteDetailSheet />
      <FloatingTools />
    </>
  );
}