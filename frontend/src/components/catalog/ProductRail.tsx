import { useState } from "react";
import type { ProductCard as Card } from "@/lib/catalog-types";
import { ProductCard } from "./ProductCard";
import { ProductQuickView } from "./ProductQuickView";

export function ProductRail({ products, columns = 4 }: { products: Card[]; columns?: 4 | 5 }) {
  const [quick, setQuick] = useState<string | null>(null);
  return (
    <>
      <div
        className={
          columns === 5
            ? "grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-5"
            : "grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4"
        }
      >
        {products.map((p) => (
          <ProductCard key={p.id} product={p} onQuickView={setQuick} />
        ))}
      </div>
      <ProductQuickView slug={quick} onClose={() => setQuick(null)} />
    </>
  );
}
