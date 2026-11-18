export function EmptyHint({ text }: { text: string }) {
  return (
    <div className="rounded-xl border border-dashed border-border bg-card/60 px-4 py-10 text-center text-sm text-muted-foreground">
      {text}
    </div>
  );
}
