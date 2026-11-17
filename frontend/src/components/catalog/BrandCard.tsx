import { Link } from "@tanstack/react-router";
import type { BrandSummary } from "@/lib/catalog-types";

/** Typographic brand tile (official manufacturer logos are added via the admin later). */
export function BrandCard({ brand: b, compact }: { brand: BrandSummary; compact?: boolean }) {
  return (
    <Link
      to="/brands/$slug"
      params={{ slug: b.slug }}
      className="group flex flex-col justify-between rounded-xl border bg-card p-5 transition-colors duration-200 hover:border-foreground"
    >
      <span className={compact ? "text-lg font-bold tracking-tight" : "text-2xl font-bold tracking-tighter"}>{b.name}</span>
      <span className="mt-6 flex items-end justify-between gap-2 text-xs text-muted-foreground">
        <span className="line-clamp-1">{b.categories.map((c) => c.name).join(" · ")}</span>
        <span className="tabular shrink-0 font-semibold text-foreground">{b.count}</span>
      </span>
    </Link>
  );
}
