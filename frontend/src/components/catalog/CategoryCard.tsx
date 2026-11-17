import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import type { CategorySummary } from "@/lib/catalog-types";
import { cn } from "@/lib/utils";

export function CategoryCard({ category: c, index, size = "md" }: { category: CategorySummary; index?: number; size?: "md" | "lg" }) {
  return (
    <Link
      to="/category/$slug"
      params={{ slug: c.slug }}
      className="group relative flex flex-col overflow-hidden rounded-xl border bg-card p-4 transition-colors duration-200 hover:border-border-strong"
    >
      <div className="flex items-start justify-between">
        <span className="tabular text-xs text-muted-foreground">{index != null ? String(index + 1).padStart(2, "0") : ""}</span>
        <ArrowUpRight className="size-4 text-muted-foreground transition-[transform,color] duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground" />
      </div>
      <div className={cn("image-well my-4 grid place-items-center overflow-hidden rounded-lg", size === "lg" ? "aspect-[4/3]" : "aspect-square")}>
        {c.image ? (
          <img src={c.image} alt="" loading="lazy" className="size-full object-contain p-5 transition-transform duration-300 ease-out group-hover:scale-[1.05]" />
        ) : (
          <span className="text-3xl font-bold tracking-tighter text-muted-foreground/40">{c.name.slice(0, 2)}</span>
        )}
      </div>
      <h3 className="font-semibold tracking-tight">{c.name}</h3>
      <p className="tabular mt-0.5 text-xs text-muted-foreground">{c.count} products</p>
      {size === "lg" && c.description && <p className="mt-2 text-sm text-muted-foreground">{c.description}</p>}
    </Link>
  );
}
