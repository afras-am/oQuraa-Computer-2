import { Link } from "@tanstack/react-router";
import { Eye, ShieldCheck } from "lucide-react";
import type { ProductCard as Card } from "@/lib/catalog-types";
import { cn } from "@/lib/utils";
import { CompareButton } from "./CompareButton";
import { DiscountBadge, PriceDisplay, StockBadge } from "./PriceDisplay";

export function ProductCard({
  product: p,
  view = "grid",
  onQuickView,
  priority,
}: {
  product: Card;
  view?: "grid" | "list";
  onQuickView?: (slug: string) => void;
  priority?: boolean;
}) {
  const list = view === "list";
  return (
    <article
      className={cn(
        "group relative flex rounded-xl border bg-card transition-[border-color,box-shadow] duration-200 hover:border-border-strong hover:shadow-soft",
        list ? "flex-row gap-5 p-3 sm:p-4" : "flex-col p-3",
      )}
    >
      <div className={cn("image-well relative overflow-hidden rounded-lg", list ? "w-32 shrink-0 sm:w-48" : "aspect-square")}>
        {p.image ? (
          <img
            src={p.image.thumb}
            alt={p.image.alt}
            width={300}
            height={300}
            loading={priority ? "eager" : "lazy"}
            decoding="async"
            className={cn(
              "size-full object-contain p-5 transition-transform duration-300 ease-out group-hover:scale-[1.04]",
              !p.inStock && "opacity-60",
              list && "aspect-square",
            )}
          />
        ) : (
          <div className="grid size-full place-items-center text-xs text-muted-foreground">No image</div>
        )}
        <div className="absolute left-2 top-2 flex gap-1.5">
          <DiscountBadge percent={p.discount} />
        </div>
        {!list && (
          <div className="absolute right-2 top-2 z-10 flex flex-col gap-1.5 opacity-100 transition-opacity duration-200 md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100">
            <CompareButton id={p.id} name={p.name} />
            {onQuickView && (
              <button
                type="button"
                onClick={() => onQuickView(p.slug)}
                aria-label={`Quick view ${p.name}`}
                title="Quick view"
                className="grid size-9 place-items-center rounded-md border bg-background/90 backdrop-blur hover:border-foreground"
              >
                <Eye className="size-4" />
              </button>
            )}
          </div>
        )}
      </div>
      <div className={cn("flex min-w-0 flex-1 flex-col", list ? "py-1" : "px-1 pb-1 pt-4")}>
        <div className="flex items-center justify-between gap-2 text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          <span className="truncate">{p.brand?.name ?? p.category.name}</span>
          <StockBadge inStock={p.inStock} qty={p.stockQty} className="normal-case tracking-normal" />
        </div>
        <h3 className={cn("mt-1.5 font-semibold leading-snug tracking-tight", list ? "text-base sm:text-lg" : "line-clamp-2 text-[0.95rem]")}>
          <Link to="/product/$slug" params={{ slug: p.slug }} className="after:absolute after:inset-0 after:rounded-xl focus-visible:outline-none">
            {p.name}
          </Link>
        </h3>
        {p.keySpecs.length > 0 && (
          <ul className={cn("mt-2 flex flex-wrap gap-1", !list && "line-clamp-1")}>
            {p.keySpecs.slice(0, list ? 4 : 3).map((s) => (
              <li key={s} className="rounded border px-1.5 py-0.5 text-[0.7rem] text-muted-foreground">
                {s}
              </li>
            ))}
          </ul>
        )}
        <div className={cn("mt-auto flex items-end justify-between gap-3", list ? "pt-4" : "pt-4")}>
          <PriceDisplay price={p.price} salePrice={p.salePrice} size="sm" />
          {p.warrantyYears ? (
            <span className="inline-flex shrink-0 items-center gap-1 text-[0.7rem] text-muted-foreground" title="Warranty">
              <ShieldCheck className="size-3.5" /> {p.warrantyYears}Y
            </span>
          ) : null}
        </div>
        {list && (
          <div className="relative z-10 mt-4 flex gap-2">
            <CompareButton id={p.id} name={p.name} />
            {onQuickView && (
              <button type="button" onClick={() => onQuickView(p.slug)} className="h-9 rounded-md border px-3 text-sm font-medium hover:border-foreground">
                Quick view
              </button>
            )}
          </div>
        )}
      </div>
    </article>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="rounded-xl border p-3">
      <div className="aspect-square animate-pulse rounded-lg bg-surface-2" />
      <div className="mt-4 h-3 w-1/3 animate-pulse rounded bg-surface-2" />
      <div className="mt-3 h-4 w-5/6 animate-pulse rounded bg-surface-2" />
      <div className="mt-2 h-4 w-2/3 animate-pulse rounded bg-surface-2" />
      <div className="mt-6 h-5 w-1/2 animate-pulse rounded bg-surface-2" />
    </div>
  );
}
