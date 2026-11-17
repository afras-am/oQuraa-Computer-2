import { z } from "zod";

export const SORTS = ["relevance", "newest", "price-asc", "price-desc", "name"] as const;
export type SortKey = (typeof SORTS)[number];
export const SORT_LABELS: Record<SortKey, string> = {
  relevance: "Best match",
  newest: "Newest",
  "price-asc": "Price: low to high",
  "price-desc": "Price: high to low",
  name: "Name: A–Z",
};
export const PAGE_SIZES = [12, 24, 48] as const;

const opt = <T extends z.ZodTypeAny>(s: T) => s.optional().catch(undefined);

/** URL search params shared by every catalogue listing (all optional so links stay simple). */
export const listingSearchSchema = z.object({
  q: opt(z.string().trim().max(100)),
  category: opt(z.string().max(60)),
  brand: opt(z.array(z.string().max(40)).max(20)),
  min: opt(z.number().int().nonnegative()),
  max: opt(z.number().int().nonnegative()),
  stock: opt(z.literal("in")),
  sale: opt(z.boolean()),
  specs: opt(z.record(z.array(z.string().max(80)).max(20))),
  sort: opt(z.enum(SORTS)),
  page: opt(z.number().int().min(1).max(500)),
  size: opt(z.union([z.literal(12), z.literal(24), z.literal(48)])),
  view: opt(z.enum(["grid", "list"])),
});
export type ListingSearch = z.infer<typeof listingSearchSchema>;

export function parseListingSearch(search: Record<string, unknown>): ListingSearch {
  return listingSearchSchema.parse(search);
}

/** Server query (prices in whole rupees as typed by users). */
export const listingQuerySchema = z.object({
  q: z.string().trim().max(100).optional(),
  category: z.string().max(60).optional(),
  brand: z.array(z.string().max(40)).max(20).optional(),
  brandSlug: z.string().max(40).optional(),
  min: z.number().int().nonnegative().optional(),
  max: z.number().int().nonnegative().optional(),
  inStock: z.boolean().optional(),
  onSale: z.boolean().optional(),
  specs: z.record(z.array(z.string().max(80)).max(20)).optional(),
  sort: z.enum(SORTS).optional(),
  page: z.number().int().min(1).max(500).optional(),
  size: z.number().int().min(1).max(48).optional(),
});
export type ListingQuery = z.infer<typeof listingQuerySchema>;

export function toListingQuery(search: ListingSearch, fixed: Partial<ListingQuery> = {}): ListingQuery {
  return {
    q: search.q || undefined,
    category: search.category,
    brand: search.brand?.length ? search.brand : undefined,
    min: search.min,
    max: search.max,
    inStock: search.stock === "in" ? true : undefined,
    onSale: search.sale || undefined,
    specs: search.specs && Object.keys(search.specs).length ? search.specs : undefined,
    sort: search.sort,
    page: search.page ?? 1,
    size: search.size ?? 24,
    ...fixed,
  };
}

/** Drop empty values so URLs stay short and shareable. */
export function cleanSearch(s: ListingSearch): ListingSearch {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(s)) {
    if (v == null || v === "" || v === false) continue;
    if (Array.isArray(v) && v.length === 0) continue;
    if (k === "specs" && typeof v === "object") {
      const specs = Object.fromEntries(Object.entries(v as Record<string, string[]>).filter(([, vals]) => vals.length));
      if (Object.keys(specs).length) out[k] = specs;
      continue;
    }
    out[k] = v;
  }
  return out as ListingSearch;
}

/** Fields that change server results (layout-only `view` excluded). */
export function listingDeps(s: ListingSearch) {
  const { view: _view, ...rest } = s;
  return rest;
}
