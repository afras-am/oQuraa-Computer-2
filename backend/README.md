# Oquraa Computer API

Express + TypeScript (run with `tsx`). Currently serves the catalogue snapshot imported from
oquraacomputer.lk (152 products, 14 categories, 30 brands). The query engine is in
`src/lib/catalog.ts`; swap its function bodies for MongoDB queries when the database is ready.

```
npm install
copy .env.example .env     # PORT=5000, CORS_ORIGIN=http://localhost:5173
npm run dev                # watch mode
npm run typecheck
```

## Endpoints (all GET, prefix /api/v1)

| Path | Returns |
| --- | --- |
| `/home` | HomeData: stats, featured, latest, offers, promos |
| `/categories` | CategorySummary[] |
| `/brands` | BrandSummary[] |
| `/products` | ListingResult (items, total, pages, facets). Query: `q`, `category`, `brand` (repeatable), `brandSlug`, `min`, `max` (whole rupees), `inStock=true`, `onSale=true`, `specs` (JSON, e.g. `{"ram":["16GB"]}`), `sort`, `page`, `size` (max 48) |
| `/products/:slug` | { product, related, sameBrand } or 404 |
| `/search/suggest?q=` | SearchSuggestion |
| `/compare?ids=1,2,3` | CompareResult (max 4 ids) |
| `/sitemap` | { paths } for the frontend sitemap |
| `/meta` | snapshot source and date |

Invalid input returns 400 `{ error, issues }`. `GET /health` (outside /api/v1) returns `{ ok: true }`.
