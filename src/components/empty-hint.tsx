import type { ReactNode } from "react";

export function EmptyHint({ text, children }: { text: string; children?: ReactNode }) {
  return (
    <div className="rounded-xl border border-dashed border-border bg-card/60 px-4 py-10 text-center text-sm text-muted-foreground">
      {text}
      {children ? <div className="mt-3">{children}</div> : null}
    </div>
  );
}
