import { useState } from "react";
import type { ProductImage } from "@/lib/catalog-types";
import { cn } from "@/lib/utils";

/** Main image with hover/tap zoom and thumbnail strip. */
export function ProductGallery({ images, name }: { images: ProductImage[]; name: string }) {
  const [active, setActive] = useState(0);
  const [zoom, setZoom] = useState<{ x: number; y: number } | null>(null);
  const img = images[active];

  return (
    <div className="flex flex-col-reverse gap-3 md:flex-row">
      {images.length > 1 && (
        <div className="no-scrollbar flex gap-2 overflow-x-auto md:max-h-[560px] md:flex-col md:overflow-y-auto">
          {images.map((im, i) => (
            <button
              key={im.src}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Show image ${i + 1} of ${images.length}`}
              aria-current={i === active}
              className={cn(
                "image-well size-16 shrink-0 overflow-hidden rounded-lg border-2 transition-colors md:size-20",
                i === active ? "border-brand" : "border-transparent hover:border-border-strong",
              )}
            >
              <img src={im.thumb} alt="" loading="lazy" className="size-full object-contain p-1.5" />
            </button>
          ))}
        </div>
      )}
      <div
        className="image-well relative aspect-square flex-1 cursor-zoom-in overflow-hidden rounded-2xl"
        onMouseMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          setZoom({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
        }}
        onMouseLeave={() => setZoom(null)}
      >
        {img ? (
          <img
            src={img.src}
            alt={img.alt || name}
            width={800}
            height={800}
            className="size-full object-contain p-8 transition-transform duration-200 ease-out md:p-12"
            style={zoom ? { transform: "scale(1.9)", transformOrigin: `${zoom.x}% ${zoom.y}%` } : undefined}
          />
        ) : (
          <div className="grid size-full place-items-center text-sm text-muted-foreground">No image available</div>
        )}
        {images.length > 1 && (
          <span className="tabular absolute bottom-3 left-3 rounded bg-background/90 px-2 py-1 text-xs font-semibold">
            {active + 1} / {images.length}
          </span>
        )}
      </div>
    </div>
  );
}
