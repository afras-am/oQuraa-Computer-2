import { discountPercent, formatLKR, hasPublicPrice, validSalePrice, type Minor } from "@/lib/pricing";
import { cn } from "@/lib/utils";

export function PriceDisplay({
  price,
  salePrice,
  size = "md",
  className,
}: {
  price: Minor;
  salePrice: Minor | null;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  if (!hasPublicPrice(price)) {
    return <p className={cn("text-sm font-semibold text-muted-foreground", className)}>Price on request</p>;
  }
  const sale = validSalePrice(price, salePrice);
  const main = sale ?? price;
  return (
    <div className={cn("tabular flex flex-wrap items-baseline gap-x-2.5 gap-y-1", className)}>
      <span
        className={cn(
          "font-bold tracking-tight",
          size === "sm" && "text-[0.95rem]",
          size === "md" && "text-lg",
          size === "lg" && "text-3xl md:text-4xl",
        )}
      >
        {formatLKR(main)}
      </span>
      {sale != null && (
        <>
          <span className={cn("text-muted-foreground line-through", size === "lg" ? "text-base" : "text-xs")}>
            {formatLKR(price)}
          </span>
          {size === "lg" && <DiscountBadge percent={discountPercent(price, sale)} />}
        </>
      )}
    </div>
  );
}

export function DiscountBadge({ percent, className }: { percent: number; className?: string }) {
  if (percent <= 0) return null;
  return (
    <span className={cn("tabular inline-flex h-6 items-center rounded bg-brand px-2 text-xs font-bold text-brand-foreground", className)}>
      −{percent}%
    </span>
  );
}

export function StockBadge({ inStock, qty, className }: { inStock: boolean; qty: number | null; className?: string }) {
  const low = inStock && qty != null && qty <= 3;
  return (
    <span className={cn("inline-flex items-center gap-1.5 text-xs font-medium", className)}>
      <span
        aria-hidden
        className={cn("size-1.5 rounded-full", !inStock ? "bg-muted-foreground" : low ? "bg-warning" : "bg-success")}
      />
      <span className={cn(!inStock ? "text-muted-foreground" : low ? "text-warning" : "text-success")}>
        {!inStock ? "Out of stock" : low ? `Only ${qty} left` : "In stock"}
      </span>
    </span>
  );
}
