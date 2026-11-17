import type {
  BrandSummary,
  CategorySummary,
  CompareResult,
  HomeData,
  ListingResult,
  ProductCard,
  ProductDetail,
  SearchSuggestion,
} from "./catalog-types";
import type { ListingQuery } from "./listing-search";

/**
 * Catalogue API client. Talks to the Express backend (see /backend, routes under /api/v1).
 * Export names and call shapes match the old TanStack server functions, so catalog.queries.ts
 * and every route stay unchanged.
 */
const API_URL = String(import.meta.env.VITE_API_URL ?? "http://localhost:5000/api/v1").replace(
  /\/+$/,
  "",
);

export class ApiError extends Error {
  readonly status: number;
  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function request(path: string, params?: URLSearchParams): Promise<Response> {
  const qs = params?.toString();
  return fetch(`${API_URL}${path}${qs ? `?${qs}` : ""}`, {
    headers: { Accept: "application/json" },
  });
}

async function getJson<T>(path: string, params?: URLSearchParams): Promise<T> {
  const res = await request(path, params);
  if (!res.ok) throw new ApiError(res.status, `API ${path} failed (${res.status})`);
  return (await res.json()) as T;
}

/** Query-string form of a ListingQuery: brand=a&brand=b, specs=<json>, inStock=true ... */
export function listingParams(q: ListingQuery): URLSearchParams {
  const p = new URLSearchParams();
  if (q.q) p.set("q", q.q);
  if (q.category) p.set("category", q.category);
  if (q.brandSlug) p.set("brandSlug", q.brandSlug);
  for (const b of q.brand ?? []) p.append("brand", b);
  if (q.min != null) p.set("min", String(q.min));
  if (q.max != null) p.set("max", String(q.max));
  if (q.inStock) p.set("inStock", "true");
  if (q.onSale) p.set("onSale", "true");
  if (q.specs && Object.keys(q.specs).length) p.set("specs", JSON.stringify(q.specs));
  if (q.sort) p.set("sort", q.sort);
  if (q.page != null) p.set("page", String(q.page));
  if (q.size != null) p.set("size", String(q.size));
  return p;
}

export type ProductPageData = {
  product: ProductDetail;
  related: ProductCard[];
  sameBrand: ProductCard[];
};

export const listProducts = ({ data }: { data: ListingQuery }) =>
  getJson<ListingResult>("/products", listingParams(data));

/** Resolves to null when the product does not exist (the product route renders not-found). */
export const getProduct = async ({
  data,
}: {
  data: { slug: string };
}): Promise<ProductPageData | null> => {
  const res = await request(`/products/${encodeURIComponent(data.slug)}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new ApiError(res.status, `API product failed (${res.status})`);
  return (await res.json()) as ProductPageData;
};

export const getCategories = () => getJson<CategorySummary[]>("/categories");

export const getBrands = () => getJson<BrandSummary[]>("/brands");

export const getHome = () => getJson<HomeData>("/home");

export const searchSuggest = ({ data }: { data: { q: string } }) =>
  getJson<SearchSuggestion>("/search/suggest", new URLSearchParams({ q: data.q }));

export const getCompare = ({ data }: { data: { ids: string[] } }) =>
  getJson<CompareResult>("/compare", new URLSearchParams({ ids: data.ids.join(",") }));

export const getSitemapPaths = () => getJson<{ paths: string[] }>("/sitemap");
