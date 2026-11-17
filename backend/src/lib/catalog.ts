/**
 * Catalogue query engine.
 * Reads the product snapshot imported from oquraacomputer.lk (src/data/catalog.snapshot.json)
 * and answers the questions served by routes/catalog.routes.ts (GET /api/v1/products, ...).
 * To move to MongoDB, replace the bodies of these functions with DB queries —
 * the DTOs in catalog-types.ts are the contract with the frontend.
 */
import snapshotJson from "../data/catalog.snapshot.json";
import type {
  BrandSummary,
  CatalogSnapshot,
  CategorySummary,
  CompareResult,
  FacetValue,
  HomeData,
  ListingResult,
  ProductCard,
  ProductDetail,
  ProductRecord,
  Ref,
  SearchSuggestion,
  SpecGroup,
} from "./catalog-types";
import type { ListingQuery } from "./listing-query";
import { discountPercent, effectivePrice, rupeesToMinor, validSalePrice } from "./pricing";
import { comparableFields, templateFor } from "./spec-templates";

export function createCatalog(snapshot: CatalogSnapshot) {
  const products = snapshot.products;
  const catBySlug = new Map(snapshot.categories.map((c) => [c.slug, c]));
  const brandBySlug = new Map(snapshot.brands.map((b) => [b.slug, b]));
  const numericId = (p: ProductRecord) => Number(p.id) || 0;

  const catRef = (slug: string): Ref => ({ slug, name: catBySlug.get(slug)?.name ?? slug });
  const brandRef = (slug: string | null): Ref | null => {
    const b = slug ? brandBySlug.get(slug) : undefined;
    return b ? { slug: b.slug, name: b.name } : null;
  };

  const norm = (s: string) =>
    s
      .toLowerCase()
      .replace(/[™®]/g, "")
      .replace(/[^a-z0-9.+\s-]/g, " ")
      .replace(/\s+/g, " ")
      .trim();

  const haystacks = new Map<string, { name: string; all: string; compact: string }>();
  for (const p of products) {
    const name = norm(p.name);
    const all = norm(
      [p.name, brandRef(p.brand)?.name ?? "", p.sku ?? "", ...p.categories.map((c) => catRef(c).name), ...Object.values(p.specs)].join(" "),
    );
    haystacks.set(p.id, { name, all, compact: all.replace(/[\s-]/g, "") });
  }

  function score(p: ProductRecord, q: string): number {
    const tokens = norm(q).split(" ").filter(Boolean);
    if (!tokens.length) return 1;
    const h = haystacks.get(p.id)!;
    let s = 0;
    for (const t of tokens) {
      const ct = t.replace(/-/g, "");
      if (h.name.includes(t)) s += 3;
      else if (h.all.includes(t) || h.compact.includes(ct)) s += 1;
      else return 0;
    }
    if (tokens[0] && h.name.startsWith(tokens[0])) s += 2;
    return s;
  }

  function keySpecs(p: ProductRecord): string[] {
    const fields = templateFor(p.category).filter((f) => f.key !== "warranty");
    return fields
      .map((f) => p.specs[f.key])
      .filter((v): v is string => Boolean(v))
      .slice(0, 4);
  }

  function toCard(p: ProductRecord): ProductCard {
    const sale = validSalePrice(p.price, p.salePrice);
    return {
      id: p.id,
      slug: p.slug,
      name: p.name,
      brand: brandRef(p.brand),
      category: catRef(p.category),
      price: p.price,
      salePrice: sale,
      discount: discountPercent(p.price, sale),
      inStock: p.inStock,
      stockQty: p.stockQty,
      image: p.images[0] ?? null,
      keySpecs: keySpecs(p),
      warrantyYears: p.warrantyYears,
    };
  }

  function specGroups(p: ProductRecord): SpecGroup[] {
    const groups = new Map<string, SpecGroup>();
    for (const f of templateFor(p.category)) {
      const value = p.specs[f.key];
      if (!value) continue;
      if (!groups.has(f.group)) groups.set(f.group, { group: f.group, rows: [] });
      groups.get(f.group)!.rows.push({ key: f.key, label: f.label, value });
    }
    return [...groups.values()];
  }

  function toDetail(p: ProductRecord): ProductDetail {
    return {
      ...toCard(p),
      sku: p.sku,
      categories: p.categories.map(catRef),
      images: p.images,
      highlights: p.highlights,
      details: p.details,
      specGroups: specGroups(p),
    };
  }

  function matches(p: ProductRecord, q: ListingQuery, skip?: "category" | "brand" | "specs" | "price") {
    if (skip !== "category" && q.category && !p.categories.includes(q.category)) return false;
    if (q.brandSlug && p.brand !== q.brandSlug) return false;
    if (skip !== "brand" && q.brand?.length && (!p.brand || !q.brand.includes(p.brand))) return false;
    if (q.inStock && !p.inStock) return false;
    if (q.onSale && validSalePrice(p.price, p.salePrice) == null) return false;
    if (skip !== "price") {
      const price = effectivePrice(p.price, p.salePrice);
      if (q.min != null && price < rupeesToMinor(q.min)) return false;
      if (q.max != null && q.max > 0 && price > rupeesToMinor(q.max)) return false;
    }
    if (skip !== "specs" && q.specs) {
      for (const [key, values] of Object.entries(q.specs)) {
        const v = p.specs[key];
        if (values.length && (!v || !values.includes(v))) return false;
      }
    }
    return true;
  }

  function sortProducts(list: { p: ProductRecord; s: number }[], sort: ListingQuery["sort"], hasQuery: boolean) {
    const key = sort ?? (hasQuery ? "relevance" : "newest");
    const price = (p: ProductRecord) => effectivePrice(p.price, p.salePrice);
    const stockFirst = (a: ProductRecord, b: ProductRecord) => Number(b.inStock) - Number(a.inStock);
    list.sort((A, B) => {
      const a = A.p;
      const b = B.p;
      switch (key) {
        case "price-asc":
          return price(a) - price(b) || a.name.localeCompare(b.name);
        case "price-desc":
          return price(b) - price(a) || a.name.localeCompare(b.name);
        case "name":
          return a.name.localeCompare(b.name);
        case "relevance":
          return B.s - A.s || stockFirst(a, b) || numericId(b) - numericId(a);
        case "newest":
        default:
          return stockFirst(a, b) || numericId(b) - numericId(a);
      }
    });
  }

  function count<T extends string>(values: (T | null | undefined)[]) {
    const m = new Map<T, number>();
    for (const v of values) if (v) m.set(v, (m.get(v) ?? 0) + 1);
    return m;
  }

  function listProducts(q: ListingQuery): ListingResult {
    const query = q.q?.trim() ?? "";
    const scored = products
      .map((p) => ({ p, s: query ? score(p, query) : 1 }))
      .filter((x) => x.s > 0);
    const pool = scored.map((x) => x.p);

    const filtered = scored.filter((x) => matches(x.p, q));
    sortProducts(filtered, q.sort, Boolean(query));

    const size = q.size ?? 24;
    const total = filtered.length;
    const pages = Math.max(1, Math.ceil(total / size));
    const page = Math.min(Math.max(1, q.page ?? 1), pages);
    const items = filtered.slice((page - 1) * size, page * size).map((x) => toCard(x.p));

    const catCounts = count(pool.filter((p) => matches(p, q, "category")).flatMap((p) => p.categories));
    const brandCounts = count(pool.filter((p) => matches(p, q, "brand")).map((p) => p.brand));

    const specFacets = [] as ListingResult["facets"]["specs"];
    if (q.category) {
      const base = pool.filter((p) => matches(p, q, "specs"));
      for (const f of templateFor(q.category).filter((f) => f.filterable)) {
        // Count each value with the other spec filters applied, but not this field's own.
        const others = { ...q, specs: { ...(q.specs ?? {}) } };
        delete others.specs[f.key];
        const counts = count(base.filter((p) => matches(p, others)).map((p) => p.specs[f.key]));
        if (counts.size < 2 && !(q.specs?.[f.key]?.length)) continue;
        specFacets.push({
          key: f.key,
          label: f.label,
          values: [...counts.entries()]
            .map(([value, n]) => ({ value, label: value, count: n }))
            .sort((a, b) => a.value.localeCompare(b.value, "en", { numeric: true })),
        });
      }
    }

    const pricePool = pool.filter((p) => matches(p, q, "price")).map((p) => effectivePrice(p.price, p.salePrice)).filter((v) => v > 0);
    const facetsCategories: FacetValue[] = snapshot.categories
      .filter((c) => catCounts.has(c.slug))
      .map((c) => ({ value: c.slug, label: c.name, count: catCounts.get(c.slug)! }));
    const facetsBrands: FacetValue[] = snapshot.brands
      .filter((b) => brandCounts.has(b.slug))
      .map((b) => ({ value: b.slug, label: b.name, count: brandCounts.get(b.slug)! }))
      .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));

    return {
      items,
      total,
      page,
      pages,
      size,
      facets: {
        categories: facetsCategories,
        brands: facetsBrands,
        specs: specFacets,
        price: {
          min: pricePool.length ? Math.floor(Math.min(...pricePool) / 100) : 0,
          max: pricePool.length ? Math.ceil(Math.max(...pricePool) / 100) : 0,
        },
        inStock: filtered.filter((x) => x.p.inStock).length,
        onSale: filtered.filter((x) => validSalePrice(x.p.price, x.p.salePrice) != null).length,
      },
    };
  }

  function getProduct(slug: string) {
    const p = products.find((x) => x.slug === slug);
    if (!p) return null;
    const related = products
      .filter((x) => x.id !== p.id && x.category === p.category)
      .map((x) => ({ x, d: Math.abs(effectivePrice(x.price, x.salePrice) - effectivePrice(p.price, p.salePrice)) }))
      .sort((a, b) => Number(b.x.inStock) - Number(a.x.inStock) || a.d - b.d)
      .slice(0, 8)
      .map(({ x }) => toCard(x));
    const sameBrand = p.brand
      ? products
          .filter((x) => x.id !== p.id && x.brand === p.brand && x.category !== p.category)
          .slice(0, 4)
          .map(toCard)
      : [];
    return { product: toDetail(p), related, sameBrand };
  }

  function categorySummaries(): CategorySummary[] {
    return snapshot.categories.map((c) => ({
      ...c,
      count: products.filter((p) => p.categories.includes(c.slug)).length,
      children: snapshot.categories.filter((x) => x.parent === c.slug).map((x) => ({ slug: x.slug, name: x.name })),
    }));
  }

  function brandSummaries(): BrandSummary[] {
    return snapshot.brands
      .map((b) => {
        const ps = products.filter((p) => p.brand === b.slug);
        const cats = [...new Set(ps.map((p) => p.category))].map(catRef);
        return { ...b, count: ps.length, categories: cats };
      })
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
  }

  function suggest(q: string): SearchSuggestion {
    const query = q.trim();
    if (query.length < 2) return { products: [], categories: [], brands: [] };
    const n = norm(query);
    const list = products
      .map((p) => ({ p, s: score(p, query) }))
      .filter((x) => x.s > 0);
    sortProducts(list, "relevance", true);
    return {
      products: list.slice(0, 6).map(({ p }) => {
        const c = toCard(p);
        return { id: c.id, slug: c.slug, name: c.name, price: c.price, salePrice: c.salePrice, image: c.image, category: c.category };
      }),
      categories: snapshot.categories.filter((c) => norm(c.name).includes(n)).slice(0, 4).map((c) => ({ slug: c.slug, name: c.name })),
      brands: snapshot.brands.filter((b) => norm(b.name).includes(n)).slice(0, 4),
    };
  }

  function compare(ids: string[]): CompareResult {
    const list = ids
      .slice(0, 4)
      .map((id) => products.find((p) => p.id === id))
      .filter((p): p is ProductRecord => Boolean(p));
    const fields = comparableFields([...new Set(list.map((p) => p.category))]);
    const rows = fields
      .map((f) => {
        const values = list.map((p) => p.specs[f.key] ?? "—");
        return { key: f.key, label: f.label, values };
      })
      .filter((r) => r.values.some((v) => v !== "—"))
      .map((r) => ({ ...r, differs: new Set(r.values).size > 1 }));
    return { products: list.map(toDetail), rows };
  }

  function minPrice(filter: (p: ProductRecord) => boolean) {
    const prices = products.filter((p) => filter(p) && p.price > 0).map((p) => effectivePrice(p.price, p.salePrice));
    return prices.length ? Math.min(...prices) : 0;
  }

  function home(): HomeData {
    const byNewest = [...products].sort((a, b) => Number(b.inStock) - Number(a.inStock) || numericId(b) - numericId(a));
    const inStock = byNewest.filter((p) => p.inStock && p.price > 0);
    const pickTop = (f: (p: ProductRecord) => boolean) =>
      inStock.filter(f).sort((a, b) => effectivePrice(b.price, b.salePrice) - effectivePrice(a.price, a.salePrice))[0] ?? null;
    const gl = pickTop((p) => p.category === "gaming-laptop");
    const pl = pickTop((p) => p.category === "laptop" && /expertbook|vostro|zenbook|commercial/i.test(p.name));
    const dk = pickTop((p) => p.category === "graphics-card");
    const featured = [
      ...inStock.filter((p) => p.category === "gaming-laptop").slice(0, 4),
      ...inStock.filter((p) => p.category === "graphics-card").slice(0, 2),
      ...inStock.filter((p) => p.category === "monitors").slice(0, 2),
    ];
    return {
      stats: {
        products: products.length,
        categories: snapshot.categories.length,
        brands: snapshot.brands.length,
        inStock: products.filter((p) => p.inStock).length,
        maxWarranty: Math.max(...products.map((p) => p.warrantyYears ?? 0)),
      },
      categories: categorySummaries(),
      featured: featured.map(toCard),
      latest: byNewest.slice(0, 8).map(toCard),
      offers: inStock.filter((p) => validSalePrice(p.price, p.salePrice) != null).slice(0, 8).map(toCard),
      laptops: inStock.filter((p) => p.category === "laptop").slice(0, 8).map(toCard),
      components: ["graphics-card", "processor", "motherboard", "ram", "ssd", "casing"]
        .flatMap((c) => inStock.filter((p) => p.category === c).slice(0, 2))
        .map(toCard),
      brands: brandSummaries().slice(0, 12),
      promos: {
        gamingLaptop: { from: minPrice((p) => p.category === "gaming-laptop" && p.inStock), product: gl && toCard(gl) },
        proLaptop: { from: minPrice((p) => p.category === "laptop" && p.inStock), product: pl && toCard(pl) },
        desktop: { from: minPrice((p) => p.category === "graphics-card" && p.inStock), product: dk && toCard(dk) },
      },
    };
  }

  return {
    listProducts,
    getProduct,
    categories: categorySummaries,
    brands: brandSummaries,
    suggest,
    compare,
    home,
    meta: () => ({ source: snapshot.source, snapshotDate: snapshot.snapshotDate }),
  };
}

export const catalog = createCatalog(snapshotJson as unknown as CatalogSnapshot);
