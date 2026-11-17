import { z } from "zod";
import { listingQuerySchema, type ListingQuery } from "./listing-query";

type Raw = Record<string, unknown>;

const first = (v: unknown) => (Array.isArray(v) ? v[0] : v);

function str(v: unknown): string | undefined {
  const s = first(v);
  return typeof s === "string" && s !== "" ? s : undefined;
}

function strings(v: unknown): string[] | undefined {
  if (v == null) return undefined;
  const list = (Array.isArray(v) ? v : [v]).filter((x): x is string => typeof x === "string" && x !== "");
  return list.length ? list : undefined;
}

/** Non-numeric input becomes NaN so validation rejects it with a 400. */
function num(v: unknown): number | undefined {
  const s = str(v);
  return s === undefined ? undefined : Number(s);
}

function bool(v: unknown): boolean | undefined {
  const s = str(v);
  return s === "true" || s === "1" ? true : undefined;
}

function json(v: unknown): unknown {
  const s = str(v);
  if (s === undefined) return undefined;
  try {
    return JSON.parse(s);
  } catch {
    return null; // fails schema validation -> 400
  }
}

function dropUndefined<T extends Raw>(o: T): Partial<T> {
  return Object.fromEntries(Object.entries(o).filter(([, v]) => v !== undefined)) as Partial<T>;
}

/** GET /products query string: brand=a&brand=b, specs={"ram":["16GB"]}, inStock=true ... */
export function parseListingQuery(query: Raw): ListingQuery {
  return listingQuerySchema.parse(
    dropUndefined({
      q: str(query.q),
      category: str(query.category),
      brand: strings(query.brand),
      brandSlug: str(query.brandSlug),
      min: num(query.min),
      max: num(query.max),
      inStock: bool(query.inStock),
      onSale: bool(query.onSale),
      specs: json(query.specs),
      sort: str(query.sort),
      page: num(query.page),
      size: num(query.size),
    }),
  );
}

const slugSchema = z.string().min(1).max(200);
export const parseSlug = (v: unknown) => slugSchema.parse(v);

const suggestSchema = z.string().max(100);
export const parseSuggestQuery = (query: Raw) => suggestSchema.parse(str(query.q) ?? "");

const idSchema = z.array(z.string().min(1).max(20)).max(4);
/** GET /compare?ids=12,34,56 */
export function parseCompareIds(query: Raw): string[] {
  const raw = str(query.ids);
  return idSchema.parse(raw ? raw.split(",").map((s) => s.trim()).filter(Boolean) : []);
}
