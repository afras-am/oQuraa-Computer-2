import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { productQuery } from "@/lib/catalog.queries";
import { whatsappUrl } from "@/lib/site";
import { WhatsAppIcon } from "@/components/site/WhatsAppIcon";
import { CompareButton } from "./CompareButton";
import { PriceDisplay, StockBadge } from "./PriceDisplay";

export function ProductQuickView({ slug, onClose }: { slug: string | null; onClose: () => void }) {
  const { data, isLoading } = useQuery({ ...productQuery(slug ?? ""), enabled: Boolean(slug) });
  const p = data?.product;
  return (
    <Dialog open={Boolean(slug)} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto p-0 sm:rounded-xl">
        {isLoading || !p ? (
          <div className="grid h-80 place-items-center">
            <DialogTitle className="sr-only">Loading product</DialogTitle>
            <Loader2 className="size-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="grid md:grid-cols-2">
            <div className="image-well aspect-square md:rounded-l-xl">
              {p.images[0] && <img src={p.images[0].src} alt={p.images[0].alt} className="size-full object-contain p-10" />}
            </div>
            <div className="flex flex-col p-6 md:p-8">
              <p className="eyebrow">{p.brand?.name ?? p.category.name}</p>
              <DialogTitle className="mt-2 text-2xl font-bold leading-tight tracking-tight">{p.name}</DialogTitle>
              <DialogDescription asChild>
                <div className="mt-3">
                  <StockBadge inStock={p.inStock} qty={p.stockQty} />
                </div>
              </DialogDescription>
              <PriceDisplay price={p.price} salePrice={p.salePrice} size="lg" className="mt-5" />
              {p.specGroups.length > 0 && (
                <dl className="mt-6 divide-y border-y text-sm">
                  {p.specGroups
                    .flatMap((g) => g.rows)
                    .slice(0, 6)
                    .map((r) => (
                      <div key={r.key} className="flex justify-between gap-4 py-2">
                        <dt className="text-muted-foreground">{r.label}</dt>
                        <dd className="text-right font-medium">{r.value}</dd>
                      </div>
                    ))}
                </dl>
              )}
              <div className="mt-auto flex flex-wrap gap-2 pt-6">
                <Button asChild size="lg" className="flex-1">
                  <Link to="/product/$slug" params={{ slug: p.slug }} onClick={onClose}>
                    Full details <ArrowRight />
                  </Link>
                </Button>
                <Button asChild variant="whatsapp" size="lg">
                  <a href={whatsappUrl(`Hello, I'm interested in ${p.name}.`)} target="_blank" rel="noreferrer" aria-label="Ask on WhatsApp">
                    <WhatsAppIcon className="size-5" />
                  </a>
                </Button>
                <CompareButton id={p.id} name={p.name} className="size-12" />
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
