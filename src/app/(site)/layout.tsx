import { Shell } from "@/components/shell";

export default function SiteLayout({ children }: LayoutProps<"/">) {
  return <Shell>{children}</Shell>;
}
