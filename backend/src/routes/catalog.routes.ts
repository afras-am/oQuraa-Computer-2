import { Router } from "express";
import { catalog } from "../lib/catalog";
import {
  parseCompareIds,
  parseListingQuery,
  parseSlug,
  parseSuggestQuery,
} from "../lib/parse-query";

/**
 * Public, read-only catalogue API, mounted at /api/v1.
 * Response shapes are the DTOs in lib/catalog-types.ts (copied in frontend/src/lib).
 */
export const catalogRouter = Router();

catalogRouter.get("/home", (_req, res) => {
  res.json(catalog.home());
});

catalogRouter.get("/categories", (_req, res) => {
  res.json(catalog.categories());
});

catalogRouter.get("/brands", (_req, res) => {
  res.json(catalog.brands());
});

catalogRouter.get("/products", (req, res) => {
  res.json(catalog.listProducts(parseListingQuery(req.query)));
});

catalogRouter.get("/products/:slug", (req, res) => {
  const result = catalog.getProduct(parseSlug(req.params.slug));
  if (!result) {
    res.status(404).json({ error: "Product not found" });
    return;
  }
  res.json(result);
});

catalogRouter.get("/search/suggest", (req, res) => {
  res.json(catalog.suggest(parseSuggestQuery(req.query)));
});

catalogRouter.get("/compare", (req, res) => {
  res.json(catalog.compare(parseCompareIds(req.query)));
});

/** Dynamic URL paths for the frontend to put in its sitemap.xml. */
catalogRouter.get("/sitemap", (_req, res) => {
  const products: string[] = [];
  for (let page = 1; ; page++) {
    const r = catalog.listProducts({ size: 48, page });
    products.push(...r.items.map((p) => `/product/${p.slug}`));
    if (page >= r.pages) break;
  }
  res.json({
    paths: [
      ...catalog.categories().map((c) => `/category/${c.slug}`),
      ...catalog.brands().map((b) => `/brands/${b.slug}`),
      ...products,
    ],
  });
});

catalogRouter.get("/meta", (_req, res) => {
  res.json(catalog.meta());
});
