import { z } from "zod";

export const SORTS = ["relevance", "newest", "price-asc", "price-desc", "name"] as const;
export type SortKey = (typeof SORTS)[number];

/** Validated catalogue query (prices in whole rupees as typed by users). Mirrors frontend ListingQuery. */
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
