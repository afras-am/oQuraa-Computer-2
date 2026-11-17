import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, CornerDownLeft, Loader2, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { suggestQuery } from "@/lib/catalog.queries";
import { formatLKR, effectivePrice } from "@/lib/pricing";
import { useDebounced } from "@/lib/use-debounced";
import { cn } from "@/lib/utils";

type Item =
  | { kind: "product"; slug: string; label: string; sub: string; img: string | null; price: string }
  | { kind: "category"; slug: string; label: string }
  | { kind: "brand"; slug: string; label: string }
  | { kind: "all"; label: string };

export function SearchDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const debounced = useDebounced(q, 200);
  const navigate = useNavigate();
  const { data, isFetching } = useQuery(suggestQuery(debounced));

  useEffect(() => {
    if (!open) setQ("");
  }, [open]);

  const items = useMemo<Item[]>(() => {
    if (!data || debounced.trim().length < 2) return [];
    const list: Item[] = [
      ...data.products.map((p) => ({
        kind: "product" as const,
        slug: p.slug,
        label: p.name,
        sub: p.category.name,
        img: p.image?.thumb ?? null,
        price: p.price > 0 ? formatLKR(effectivePrice(p.price, p.salePrice)) : "Price on request",
      })),
      ...data.categories.map((c) => ({ kind: "category" as const, slug: c.slug, label: c.name })),
      ...data.brands.map((b) => ({ kind: "brand" as const, slug: b.slug, label: b.name })),
    ];
    list.push({ kind: "all", label: `See all results for “${debounced.trim()}”` });
    return list;
  }, [data, debounced]);

  useEffect(() => setActive(0), [items.length]);

  function go(item: Item | undefined) {
    onOpenChange(false);
    if (!item || item.kind === "all") {
      if (q.trim()) navigate({ to: "/search", search: { q: q.trim() } });
      return;
    }
    if (item.kind === "product") navigate({ to: "/product/$slug", params: { slug: item.slug } });
    if (item.kind === "category") navigate({ to: "/category/$slug", params: { slug: item.slug } });
    if (item.kind === "brand") navigate({ to: "/brands/$slug", params: { slug: item.slug } });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="top-[12vh] max-w-2xl translate-y-0 gap-0 overflow-hidden p-0 sm:rounded-xl [&>button]:hidden">
        <DialogTitle className="sr-only">Search products</DialogTitle>
        <form
          role="search"
          onSubmit={(e) => {
            e.preventDefault();
            go(items[active] ?? undefined);
          }}
          className="flex items-center gap-3 border-b px-5"
        >
          <Search className="size-5 shrink-0 text-muted-foreground" />
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setActive((a) => Math.min(a + 1, Math.max(items.length - 1, 0)));
              }
              if (e.key === "ArrowUp") {
                e.preventDefault();
                setActive((a) => Math.max(a - 1, 0));
              }
            }}
            placeholder="Search laptops, RTX 4060, Z790, 1TB SSD…"
            aria-label="Search products"
            aria-autocomplete="list"
            aria-controls="search-suggestions"
            className="h-16 w-full bg-transparent text-base outline-none placeholder:text-muted-foreground"
          />
          {isFetching && <Loader2 className="size-4 animate-spin text-muted-foreground" aria-label="Searching" />}
          <kbd className="hidden rounded border px-1.5 py-0.5 text-[0.7rem] text-muted-foreground sm:inline">Esc</kbd>
        </form>
        <div id="search-suggestions" role="listbox" className="max-h-[60vh] overflow-y-auto p-2">
          {debounced.trim().length < 2 ? (
            <div className="px-3 py-6">
              <p className="eyebrow mb-3">Popular searches</p>
              <div className="flex flex-wrap gap-2">
                {["Gaming laptop", "RTX 4060", "Z790", "DDR5", "NVMe 1TB", "Projector"].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setQ(t)}
                    className="rounded-md border px-3 py-1.5 text-sm hover:border-foreground"
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          ) : items.length === 1 && !isFetching ? (
            <p className="px-3 py-8 text-center text-sm text-muted-foreground">
              No matches. Try a brand, model or spec such as “16GB”.
            </p>
          ) : (
            items.map((it, i) => (
              <button
                key={`${it.kind}-${"slug" in it ? it.slug : "all"}`}
                type="button"
                role="option"
                aria-selected={i === active}
                onMouseEnter={() => setActive(i)}
                onClick={() => go(it)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm",
                  i === active && "bg-accent",
                )}
              >
                {it.kind === "product" ? (
                  <>
                    <span className="image-well grid size-11 shrink-0 place-items-center overflow-hidden rounded-md">
                      {it.img && <img src={it.img} alt="" className="size-full object-contain p-1" loading="lazy" />}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="line-clamp-1 font-medium">{it.label}</span>
                      <span className="text-xs text-muted-foreground">{it.sub}</span>
                    </span>
                    <span className="tabular shrink-0 text-xs font-semibold">{it.price}</span>
                  </>
                ) : (
                  <>
                    <span className="eyebrow w-20 shrink-0">{it.kind === "all" ? "Search" : it.kind}</span>
                    <span className="flex-1 font-medium">{it.label}</span>
                    {i === active ? <CornerDownLeft className="size-4 text-muted-foreground" /> : <ArrowRight className="size-4 text-muted-foreground" />}
                  </>
                )}
              </button>
            ))
          )}
        </div>
        <div className="flex items-center justify-between border-t px-5 py-3 text-xs text-muted-foreground">
          <span>Search by name, brand, model or specification</span>
          <Link to="/products" onClick={() => onOpenChange(false)} className="font-semibold text-foreground link-underline">
            Browse all products
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  );
}
