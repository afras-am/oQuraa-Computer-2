import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useState } from "react";
import { CatalogListing } from "@/components/catalog/CatalogListing";
import { PageHeader } from "@/components/common/PageHeader";
import { ErrorState } from "@/components/common/States";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { categoriesQuery, listingQuery } from "@/lib/catalog.queries";
import { cleanSearch, listingDeps, parseListingSearch, toListingQuery, type ListingSearch } from "@/lib/listing-search";

export const Route = createFileRoute("/search")({
  validateSearch: parseListingSearch,
  loaderDeps: ({ search }) => listingDeps(search),
  loader: ({ context, deps }) => context.queryClient.ensureQueryData(listingQuery(toListingQuery(deps))),
  head: () => ({
    meta: [
      { title: "Search — OQURAA COMPUTER" },
      { name: "description", content: "Search laptops, components and peripherals by name, brand, model or specification." },
      { property: "og:title", content: "Search the OQURAA COMPUTER catalogue" },
      { property: "og:description", content: "Find products by name, brand, model or specification." },
      { name: "robots", content: "noindex, follow" },
    ],
  }),
  component: SearchPage,
  errorComponent: ({ error }) => <ErrorState error={error} />,
});

function SearchPage() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  const { data: categories } = useSuspenseQuery(categoriesQuery());
  const [q, setQ] = useState(search.q ?? "");
  const setSearch = (patch: Partial<ListingSearch>) =>
    navigate({ search: (prev) => cleanSearch({ ...prev, ...patch }), resetScroll: false });

  return (
    <>
      <PageHeader
        crumbs={[{ label: "Search" }]}
        eyebrow="Search"
        title={search.q ? <>Results for “{search.q}”</> : "Search the catalogue"}
        aside={
          <form
            role="search"
            className="flex w-full gap-2 md:w-[420px]"
            onSubmit={(e) => {
              e.preventDefault();
              setSearch({ q: q.trim() || undefined, page: undefined, sort: undefined });
            }}
          >
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="e.g. RTX 4060, 16GB DDR5" aria-label="Search products" />
            <Button type="submit" className="h-11" aria-label="Search">
              <Search />
            </Button>
          </form>
        }
      />
      <CatalogListing
        search={search}
        setSearch={setSearch}
        emptyHint={
          <span>
            Check the spelling or try a broader term. Popular categories:{" "}
            {categories.slice(0, 5).map((c, i) => (
              <span key={c.slug}>
                {i > 0 && ", "}
                <Link to="/category/$slug" params={{ slug: c.slug }} className="font-semibold text-foreground link-underline">
                  {c.name}
                </Link>
              </span>
            ))}
          </span>
        }
      />
    </>
  );
}
