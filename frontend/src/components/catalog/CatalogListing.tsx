import { useSuspenseQuery } from "@tanstack/react-query";
import { useRouterState } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, LayoutGrid, List, SlidersHorizontal, X } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import type { ListingResult } from "@/lib/catalog-types";
import { listingQuery } from "@/lib/catalog.queries";
import {
  PAGE_SIZES,
  SORT_LABELS,
  SORTS,
  toListingQuery,
  type ListingQuery,
  type ListingSearch,
  type SortKey,
} from "@/lib/listing-search";
import { cn } from "@/lib/utils";
import { EmptyState } from "@/components/common/States";
import { ProductCard } from "./ProductCard";
import { ProductQuickView } from "./ProductQuickView";

export type SetSearch = (patch: Partial<ListingSearch>) => void;

interface Props {
  search: ListingSearch;
  fixed?: Partial<ListingQuery>;
  setSearch: SetSearch;
  hideCategory?: boolean;
  hideBrand?: boolean;
  emptyHint?: ReactNode;
}

export function CatalogListing({ search, fixed = {}, setSearch, hideCategory, hideBrand, emptyHint }: Props) {
  const query = toListingQuery(search, fixed);
  const { data } = useSuspenseQuery(listingQuery(query));
  const loading = useRouterState({ select: (s) => s.isLoading });
  const [quick, setQuick] = useState<string | null>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const view = search.view ?? "grid";
  const sort: SortKey = search.sort ?? (query.q ? "relevance" : "newest");

  const update: SetSearch = (patch) => setSearch({ page: undefined, ...patch });
  const goPage = (page: number) => {
    setSearch({ page: page > 1 ? page : undefined });
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const chips = activeChips(search, data, hideCategory);
  const filters = (
    <FilterPanel search={search} data={data} update={update} hideCategory={hideCategory} hideBrand={hideBrand} />
  );

  return (
    <div ref={topRef} className="container-page scroll-mt-24 py-10">
      <div className="grid gap-10 lg:grid-cols-[260px_1fr]">
        <aside className="hidden lg:block" aria-label="Filters">
          <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto pb-6 pr-2">{filters}</div>
        </aside>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3 border-b pb-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="lg:hidden">
                  <SlidersHorizontal /> Filters{chips.length ? ` (${chips.length})` : ""}
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[88vw] max-w-sm overflow-y-auto">
                <SheetTitle className="mb-4 text-lg font-semibold">Filters</SheetTitle>
                {filters}
              </SheetContent>
            </Sheet>
            <p className="tabular text-sm text-muted-foreground" aria-live="polite">
              <span className="font-semibold text-foreground">{data.total}</span> {data.total === 1 ? "product" : "products"}
              {loading && <span className="ml-2 text-xs">· updating…</span>}
            </p>
            <div className="ml-auto flex items-center gap-2">
              <Select value={sort} onValueChange={(v) => update({ sort: v as SortKey })}>
                <SelectTrigger className="h-10 w-[170px]" aria-label="Sort products">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SORTS.filter((s) => s !== "relevance" || query.q).map((s) => (
                    <SelectItem key={s} value={s}>
                      {SORT_LABELS[s]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={String(search.size ?? 24)} onValueChange={(v) => update({ size: Number(v) as 12 | 24 | 48 })}>
                <SelectTrigger className="hidden h-10 w-[92px] sm:flex" aria-label="Products per page">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PAGE_SIZES.map((s) => (
                    <SelectItem key={s} value={String(s)}>
                      {s} / page
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="hidden rounded-md border p-0.5 sm:flex" role="group" aria-label="Layout">
                {(["grid", "list"] as const).map((v) => (
                  <button
                    key={v}
                    type="button"
                    aria-pressed={view === v}
                    aria-label={v === "grid" ? "Grid view" : "List view"}
                    onClick={() => setSearch({ view: v === "grid" ? undefined : "list" })}
                    className={cn("grid size-8 place-items-center rounded", view === v ? "bg-inverse text-inverse-foreground" : "text-muted-foreground hover:text-foreground")}
                  >
                    {v === "grid" ? <LayoutGrid className="size-4" /> : <List className="size-4" />}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {chips.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 pt-4">
              {chips.map((c) => (
                <button
                  key={c.key}
                  type="button"
                  onClick={() => update(c.remove)}
                  className="inline-flex h-8 items-center gap-1.5 rounded-md border bg-surface px-2.5 text-xs font-medium hover:border-foreground"
                >
                  {c.label} <X className="size-3" aria-label="Remove filter" />
                </button>
              ))}
              <button
                type="button"
                onClick={() => setSearch(clearAll(search))}
                className="h-8 px-2 text-xs font-semibold text-muted-foreground hover:text-foreground"
              >
                Clear all
              </button>
            </div>
          )}

          <div className={cn("pt-6 transition-opacity duration-200", loading && "opacity-60")}>
            {data.items.length === 0 ? (
              <EmptyState
                title="No products match these filters"
                description={emptyHint ?? "Try removing a filter or widening the price range."}
                action={
                  chips.length ? (
                    <Button variant="outline" onClick={() => setSearch(clearAll(search))}>
                      Clear filters
                    </Button>
                  ) : undefined
                }
              />
            ) : (
              <div className={cn(view === "grid" ? "grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 2xl:grid-cols-4" : "grid gap-3")}>
                {data.items.map((p, i) => (
                  <ProductCard key={p.id} product={p} view={view} onQuickView={setQuick} priority={i < 4} />
                ))}
              </div>
            )}
          </div>

          {data.pages > 1 && <Pagination page={data.page} pages={data.pages} onPage={goPage} />}
        </div>
      </div>
      <ProductQuickView slug={quick} onClose={() => setQuick(null)} />
    </div>
  );
}

function clearAll(s: ListingSearch): Partial<ListingSearch> {
  return { brand: undefined, min: undefined, max: undefined, stock: undefined, sale: undefined, specs: undefined, page: undefined, category: undefined, ...(s.q ? {} : {}) };
}

function activeChips(s: ListingSearch, data: ListingResult, hideCategory?: boolean) {
  const out: { key: string; label: string; remove: Partial<ListingSearch> }[] = [];
  if (s.category && !hideCategory)
    out.push({ key: "cat", label: data.facets.categories.find((c) => c.value === s.category)?.label ?? s.category, remove: { category: undefined, specs: undefined } });
  for (const b of s.brand ?? [])
    out.push({
      key: `b-${b}`,
      label: data.facets.brands.find((x) => x.value === b)?.label ?? b,
      remove: { brand: (s.brand ?? []).filter((x) => x !== b) },
    });
  if (s.min != null || s.max != null)
    out.push({ key: "price", label: `LKR ${s.min ?? 0} – ${s.max ?? "any"}`, remove: { min: undefined, max: undefined } });
  if (s.stock) out.push({ key: "stock", label: "In stock", remove: { stock: undefined } });
  if (s.sale) out.push({ key: "sale", label: "On sale", remove: { sale: undefined } });
  for (const [k, vals] of Object.entries(s.specs ?? {}))
    for (const v of vals)
      out.push({
        key: `s-${k}-${v}`,
        label: v,
        remove: { specs: { ...(s.specs ?? {}), [k]: vals.filter((x) => x !== v) } },
      });
  return out;
}

function FilterPanel({
  search,
  data,
  update,
  hideCategory,
  hideBrand,
}: {
  search: ListingSearch;
  data: ListingResult;
  update: SetSearch;
  hideCategory?: boolean | undefined;
  hideBrand?: boolean | undefined;
}) {
  const [showAllBrands, setShowAllBrands] = useState(false);
  const brands = showAllBrands ? data.facets.brands : data.facets.brands.slice(0, 8);
  const toggleIn = (list: string[] | undefined, v: string) => {
    const set = new Set(list ?? []);
    if (set.has(v)) set.delete(v);
    else set.add(v);
    return [...set];
  };

  return (
    <div className="space-y-8 text-sm">
      {!hideCategory && data.facets.categories.length > 0 && (
        <FilterGroup title="Category">
          <ul className="space-y-0.5">
            {data.facets.categories.map((c) => {
              const on = search.category === c.value;
              return (
                <li key={c.value}>
                  <button
                    type="button"
                    aria-pressed={on}
                    onClick={() => update({ category: on ? undefined : c.value, specs: undefined })}
                    className={cn(
                      "-mx-2 flex w-[calc(100%+1rem)] items-center justify-between rounded-md px-2 py-1.5 text-left hover:bg-accent",
                      on && "bg-accent font-semibold",
                    )}
                  >
                    <span className={cn(on && "accent-tick")}>{c.label}</span>
                    <span className="tabular text-xs text-muted-foreground">{c.count}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </FilterGroup>
      )}

      <FilterGroup title="Availability">
        <CheckRow id="f-stock" checked={search.stock === "in"} onChange={(v) => update({ stock: v ? "in" : undefined })} label="In stock only" />
        <CheckRow id="f-sale" checked={!!search.sale} onChange={(v) => update({ sale: v || undefined })} label="On sale" />
      </FilterGroup>

      <PriceFilter key={`${search.min}-${search.max}`} search={search} bounds={data.facets.price} update={update} />

      {!hideBrand && data.facets.brands.length > 0 && (
        <FilterGroup title="Brand">
          {brands.map((b) => (
            <CheckRow
              key={b.value}
              id={`f-b-${b.value}`}
              checked={search.brand?.includes(b.value) ?? false}
              onChange={() => update({ brand: toggleIn(search.brand, b.value) })}
              label={b.label}
              count={b.count}
            />
          ))}
          {data.facets.brands.length > 8 && (
            <button type="button" onClick={() => setShowAllBrands((s) => !s)} className="mt-1 text-xs font-semibold link-underline">
              {showAllBrands ? "Show fewer" : `Show all ${data.facets.brands.length}`}
            </button>
          )}
        </FilterGroup>
      )}

      {data.facets.specs.map((f) => (
        <FilterGroup key={f.key} title={f.label}>
          {f.values.map((v) => (
            <CheckRow
              key={v.value}
              id={`f-s-${f.key}-${v.value}`}
              checked={search.specs?.[f.key]?.includes(v.value) ?? false}
              onChange={() => update({ specs: { ...(search.specs ?? {}), [f.key]: toggleIn(search.specs?.[f.key], v.value) } })}
              label={v.label}
              count={v.count}
            />
          ))}
        </FilterGroup>
      ))}
    </div>
  );
}

function PriceFilter({ search, bounds, update }: { search: ListingSearch; bounds: { min: number; max: number }; update: SetSearch }) {
  const [min, setMin] = useState(search.min != null ? String(search.min) : "");
  const [max, setMax] = useState(search.max != null ? String(search.max) : "");
  const parse = (s: string) => {
    const n = Number(s.replace(/[^\d]/g, ""));
    return s.trim() && Number.isFinite(n) ? Math.round(n) : undefined;
  };
  return (
    <FilterGroup title="Price (LKR)">
      <form
        className="grid grid-cols-[1fr_1fr_auto] gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          let a = parse(min);
          let b = parse(max);
          if (a != null && b != null && a > b) [a, b] = [b, a];
          update({ min: a, max: b });
        }}
      >
        <Input aria-label="Minimum price" inputMode="numeric" placeholder={String(bounds.min)} value={min} onChange={(e) => setMin(e.target.value)} className="h-9 text-xs" />
        <Input aria-label="Maximum price" inputMode="numeric" placeholder={String(bounds.max)} value={max} onChange={(e) => setMax(e.target.value)} className="h-9 text-xs" />
        <Button type="submit" size="sm" variant="inverse" className="h-9">
          Go
        </Button>
      </form>
    </FilterGroup>
  );
}

function FilterGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <fieldset>
      <legend className="eyebrow mb-3">{title}</legend>
      <div className="space-y-1">{children}</div>
    </fieldset>
  );
}

function CheckRow({ id, checked, onChange, label, count }: { id: string; checked: boolean; onChange: (v: boolean) => void; label: string; count?: number }) {
  return (
    <label htmlFor={id} className="flex cursor-pointer items-center gap-2.5 py-1">
      <Checkbox id={id} checked={checked} onCheckedChange={(v) => onChange(v === true)} />
      <span className="flex-1">{label}</span>
      {count != null && <span className="tabular text-xs text-muted-foreground">{count}</span>}
    </label>
  );
}

function Pagination({ page, pages, onPage }: { page: number; pages: number; onPage: (p: number) => void }) {
  const nums = pageNumbers(page, pages);
  return (
    <nav aria-label="Pagination" className="mt-12 flex items-center justify-center gap-1">
      <Button variant="ghost" size="icon" disabled={page <= 1} onClick={() => onPage(page - 1)} aria-label="Previous page">
        <ChevronLeft />
      </Button>
      {nums.map((n, i) =>
        n === "…" ? (
          <span key={`e${i}`} className="px-2 text-muted-foreground">
            …
          </span>
        ) : (
          <button
            key={n}
            type="button"
            onClick={() => onPage(n)}
            aria-current={n === page ? "page" : undefined}
            className={cn(
              "tabular size-10 rounded-md text-sm font-semibold",
              n === page ? "bg-brand text-brand-foreground" : "hover:bg-accent",
            )}
          >
            {n}
          </button>
        ),
      )}
      <Button variant="ghost" size="icon" disabled={page >= pages} onClick={() => onPage(page + 1)} aria-label="Next page">
        <ChevronRight />
      </Button>
    </nav>
  );
}

export function pageNumbers(page: number, pages: number): (number | "…")[] {
  if (pages <= 7) return Array.from({ length: pages }, (_, i) => i + 1);
  const out: (number | "…")[] = [1];
  const start = Math.max(2, page - 1);
  const end = Math.min(pages - 1, page + 1);
  if (start > 2) out.push("…");
  for (let i = start; i <= end; i++) out.push(i);
  if (end < pages - 1) out.push("…");
  out.push(pages);
  return out;
}

/** Shared hook: scroll restoration nicety when the listing's category changes. */
export function useResetOnChange(dep: unknown, fn: () => void) {
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    fn();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dep]);
}
