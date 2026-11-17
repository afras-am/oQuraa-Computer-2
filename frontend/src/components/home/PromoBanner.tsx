import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import type { ProductCard } from "@/lib/catalog-types";
import { formatLKR } from "@/lib/pricing";
import { cn } from "@/lib/utils";

/** Promotional banner built from a real catalogue product and live "from" price. */
export function PromoBanner({
  eyebrow,
  title,
  from,
  product,
  slug,
  tone = "surface",
  className,
}: {
  eyebrow: string;
  title: string;
  from: number;
  product: ProductCard | null;
  slug: string;
  tone?: "surface" | "inverse" | "brand";
  className?: string;
}) {
  return (
    <Link
      to="/category/$slug"
      params={{ slug }}
      className={cn(
        "group relative flex min-h-[300px] flex-col justify-between overflow-hidden rounded-2xl border p-7 md:p-9",
        tone === "surface" && "bg-surface",
        tone === "inverse" && "border-transparent bg-inverse text-inverse-foreground",
        tone === "brand" && "border-transparent bg-brand text-brand-foreground",
        className,
      )}
    >
      <div className="relative z-10 max-w-[60%]">
        <p className={cn("eyebrow", tone !== "surface" && "text-current opacity-70")}>{eyebrow}</p>
        <h3 className="text-subhead mt-3">{title}</h3>
        {from > 0 && (
          <p className="tabular mt-3 text-sm font-semibold opacity-80">From {formatLKR(from)}</p>
        )}
      </div>
      <span className="relative z-10 inline-flex items-center gap-2 text-sm font-semibold">
        Shop the range <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
      </span>
      {product?.image && (
        <div className="image-well absolute -bottom-6 -right-6 aspect-square w-[52%] max-w-[300px] rounded-2xl">
          <img src={product.image.src} alt={product.image.alt} loading="lazy" className="size-full object-contain p-6 transition-transform duration-500 ease-out group-hover:scale-[1.05]" />
        </div>
      )}
    </Link>
  );
}
