# Oquraa Computer

Catalogue website for oquraacomputer.lk, split into two independent npm projects.

```
oquraa-computer/
├── frontend/   React + TanStack Start + Tailwind (the website, runs on :5173)
└── backend/    Node + Express REST API under /api/v1 (runs on :5000)
```

## Run locally (two terminals)

```powershell
# Terminal 1 - API
cd backend
npm install
copy .env.example .env
npm run dev          # http://localhost:5000/api/v1

# Terminal 2 - website
cd frontend
npm install
copy .env.example .env.local
npm run dev          # http://localhost:5173
```

Start the backend first: pages load their data from the API (also during server-side rendering).

## How they talk

- Frontend reads `VITE_API_URL` (default `http://localhost:5000/api/v1`) in `frontend/src/lib/catalog.functions.ts`.
- Backend allows the browser origin from `CORS_ORIGIN` (default `http://localhost:5173`).
- Money is integer LKR minor units end to end.
- Contract files that exist in both projects and must stay identical:
  `src/lib/catalog-types.ts` and `src/lib/pricing.ts` (frontend and backend).

## Where things moved

| Before (single Lovable app) | Now |
| --- | --- |
| `src/lib/catalog.server.ts` | `backend/src/lib/catalog.ts` |
| `src/lib/spec-templates.ts` | `backend/src/lib/spec-templates.ts` |
| `src/data/catalog.snapshot.json` | `backend/src/data/catalog.snapshot.json` |
| TanStack server functions in `catalog.functions.ts` | Express routes in `backend/src/routes/catalog.routes.ts`; `catalog.functions.ts` is now a fetch client with the same export names |
| `/sitemap.xml` read the catalogue directly | frontend route fetches `GET /api/v1/sitemap` |
| everything else (routes, components, styles, assets, tests) | `frontend/` unchanged |
