import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus, RefreshCw, Search, Trash2, X } from "lucide-react";
import { useState } from "react";
import { PriceDisplay, StockBadge } from "@/components/catalog/PriceDisplay";
import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState } from "@/components/common/States";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { compareQuery, suggestQuery } from "@/lib/catalog.queries";
import { COMPARE_MAX, compareStore, useCompareIds } from "@/lib/compare-store";
import { formatLKR, effectivePrice } from "@/lib/pricing";
import { useDebounced } from "@/lib/use-debounced";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/compare")({
  head: () => ({
    meta: [
      { title: "Compare products — OQURAA COMPUTER" },
      { name: "description", content: "Compare up to four laptops or components side by side: price, availability, warranty, CPU, RAM, storage, graphics and display." },
      { property: "og:title", content: "Compare products — OQURAA COMPUTER" },
      { property: "og:description", content: "Side-by-side comparison of up to four products with differences highlighted." },
      { property: "og:url", content: "/compare" },
      { name: "robots", content: "noindex, follow" },
    ],
  }),
  component: ComparePage,
});

function ComparePage() {
  const ids = useCompareIds();
  const { data, isLoading } = useQuery(compareQuery(ids));
  const [onlyDiff, setOnlyDiff] = useState(false);
  const [picker, setPicker] = useState<{ replace?: string } | null>(null);
  const products = data?.products ?? [];

  return (
    <>
      <PageHeader
        crumbs={[{ label: "Compare" }]}
        eyebrow="Side by side"
        title="Compare products"
        description={`Select 2–${COMPARE_MAX} products. Your selection is saved on this device.`}
        aside={
          ids.length > 0 ? (
            <div className="flex flex-wrap items-center gap-4">
              <label className="flex items-center gap-2 text-sm">
                <Switch checked={onlyDiff} onCheckedChange={setOnlyDiff} /> Highlight differences only
              </label>
              <Button variant="outline" onClick={() => compareStore.clear()}>
                <Trash2 /> Clear
              </Button>
            </div>
          ) : undefined
        }
      />
      <section className="container-page py-10">
        {ids.length === 0 ? (
          <EmptyState
            title="No products selected yet"
            description="Use the compare button on any product to add it here, or search below."
            action={
              <div className="flex flex-wrap justify-center gap-2">
                <Button onClick={() => setPicker({})}>
                  <Plus /> Add a product
                </Button>
                <Button asChild variant="outline">
                  <Link to="/products">Browse products</Link>
                </Button>
              </div>
            }
          />
        ) : isLoading ? (
          <div className="h-96 animate-pulse rounded-xl bg-surface" />
        ) : (
          <div className="overflow-x-auto rounded-xl border">
            <table className="w-full min-w-[720px] table-fixed border-collapse text-sm">
              <caption className="sr-only">Product comparison</caption>
              <colgroup>
                <col className="w-44" />
                {products.map((p) => (
                  <col key={p.id} />
                ))}
                {products.length < COMPARE_MAX && <col />}
              </colgroup>
              <thead>
                <tr className="align-top">
                  <th scope="col" className="sticky left-0 z-10 bg-background p-4 text-left">
                    <span className="eyebrow">{products.length} selected</span>
                  </th>
                  {products.map((p) => (
                    <th key={p.id} scope="col" className="border-l p-4 text-left font-normal">
                      <div className="flex justify-end gap-1">
                        <button type="button" onClick={() => setPicker({ replace: p.id })} aria-label={`Replace ${p.name}`} className="grid size-8 place-items-center rounded-md hover:bg-accent">
                          <RefreshCw className="size-4" />
                        </button>
                        <button type="button" onClick={() => compareStore.remove(p.id)} aria-label={`Remove ${p.name}`} className="grid size-8 place-items-center rounded-md hover:bg-accent">
                          <X className="size-4" />
                        </button>
                      </div>
                      <Link to="/product/$slug" params={{ slug: p.slug }} className="group block">
                        <div className="image-well mt-2 aspect-square overflow-hidden rounded-lg">
                          {p.image && <img src={p.image.thumb} alt={p.image.alt} className="size-full object-contain p-4" />}
                        </div>
                        <p className="mt-3 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">{p.brand?.name ?? p.category.name}</p>
                        <p className="mt-1 line-clamp-3 font-semibold leading-snug group-hover:underline">{p.name}</p>
                      </Link>
                    </th>
                  ))}
                  {products.length < COMPARE_MAX && (
                    <th scope="col" className="border-l p-4">
                      <button
                        type="button"
                        onClick={() => setPicker({})}
                        className="grid aspect-square w-full place-items-center rounded-lg border border-dashed text-muted-foreground hover:border-foreground hover:text-foreground"
                      >
                        <span className="flex flex-col items-center gap-2 text-sm font-semibold">
                          <Plus className="size-5" /> Add product
                        </span>
                      </button>
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                <Row label="Price" differs={new Set(products.map((p) => effectivePrice(p.price, p.salePrice))).size > 1} onlyDiff={false} extra={products.length < COMPARE_MAX}>
                  {products.map((p) => (
                    <PriceDisplay key={p.id} price={p.price} salePrice={p.salePrice} size="sm" />
                  ))}
                </Row>
                <Row label="Availability" differs={new Set(products.map((p) => p.inStock)).size > 1} onlyDiff={false} extra={products.length < COMPARE_MAX}>
                  {products.map((p) => (
                    <StockBadge key={p.id} inStock={p.inStock} qty={p.stockQty} />
                  ))}
                </Row>
                <Row label="Category" differs={new Set(products.map((p) => p.category.slug)).size > 1} onlyDiff={onlyDiff} extra={products.length < COMPARE_MAX}>
                  {products.map((p) => (
                    <span key={p.id}>{p.category.name}</span>
                  ))}
                </Row>
                <Row label="Brand" differs={new Set(products.map((p) => p.brand?.slug)).size > 1} onlyDiff={onlyDiff} extra={products.length < COMPARE_MAX}>
                  {products.map((p) => (
                    <span key={p.id}>{p.brand?.name ?? "—"}</span>
                  ))}
                </Row>
                {data?.rows.map((r) => (
                  <Row key={r.key} label={r.label} differs={r.differs} onlyDiff={onlyDiff} extra={products.length < COMPARE_MAX}>
                    {r.values.map((v, i) => (
                      <span key={`${r.key}-${i}`} className={cn(v === "—" && "text-muted-foreground")}>
                        {v}
                      </span>
                    ))}
                  </Row>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {ids.length === 1 && <p className="mt-4 text-sm text-muted-foreground">Add at least one more product to compare.</p>}
      </section>
      <ProductPicker
        open={picker != null}
        onClose={() => setPicker(null)}
        exclude={ids}
        onPick={(id) => {
          if (picker?.replace) compareStore.replace(picker.replace, id);
          else compareStore.add(id);
          setPicker(null);
        }}
      />
    </>
  );
}

function Row({ label, differs, onlyDiff, extra, children }: { label: string; differs: boolean; onlyDiff: boolean; extra: boolean; children: React.ReactNode[] }) {
  if (onlyDiff && !differs) return null;
  return (
    <tr className={cn("border-t", differs && "bg-brand/10")}>
      <th scope="row" className="sticky left-0 z-10 bg-background p-4 text-left text-xs font-semibold uppercase tracking-[0.1em] text-muted-foreground">
        <span className="flex items-center gap-2">
          {differs && <span aria-label="Differs" className="size-1.5 rounded-full bg-brand" />}
          {label}
        </span>
      </th>
      {children.map((c, i) => (
        <td key={i} className="border-l p-4 align-top font-medium">
          {c}
        </td>
      ))}
      {extra && <td className="border-l" />}
    </tr>
  );
}

function ProductPicker({ open, onClose, onPick, exclude }: { open: boolean; onClose: () => void; onPick: (id: string) => void; exclude: string[] }) {
  const [q, setQ] = useState("");
  const dq = useDebounced(q, 200);
  const { data } = useQuery(suggestQuery(dq));
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogTitle>Add a product to compare</DialogTitle>
        <label className="relative block">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name or model" className="pl-9" aria-label="Search products to compare" />
        </label>
        <ul className="max-h-80 space-y-1 overflow-y-auto">
          {dq.trim().length < 2 && <li className="py-6 text-center text-sm text-muted-foreground">Type at least 2 characters.</li>}
          {data?.products.map((p) => (
            <li key={p.slug}>
              <PickRow id={p.id} name={p.name} img={p.image?.thumb} price={p.price > 0 ? formatLKR(effectivePrice(p.price, p.salePrice)) : "Price on request"} exclude={exclude} onPick={onPick} />
            </li>
          ))}
        </ul>
      </DialogContent>
    </Dialog>
  );
}

function PickRow({ id, name, img, price, exclude, onPick }: { id: string; name: string; img: string | undefined; price: string; exclude: string[]; onPick: (id: string) => void }) {
  const taken = exclude.includes(id);
  return (
    <button
      type="button"
      disabled={taken}
      onClick={() => onPick(id)}
      className="flex w-full items-center gap-3 rounded-lg p-2 text-left text-sm hover:bg-accent disabled:opacity-50"
    >
      <span className="image-well grid size-11 shrink-0 place-items-center overflow-hidden rounded-md">{img && <img src={img} alt="" className="size-full object-contain p-1" />}</span>
      <span className="line-clamp-2 flex-1 font-medium">{name}</span>
      <span className="tabular shrink-0 text-xs font-semibold">{taken ? "Added" : price}</span>
    </button>
  );
}
