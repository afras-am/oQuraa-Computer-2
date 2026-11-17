import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { CatalogListing } from "@/components/catalog/CatalogListing";
import { PageHeader } from "@/components/common/PageHeader";
import { ErrorState } from "@/components/common/States";
import { listingQuery } from "@/lib/catalog.queries";
import { cleanSearch, listingDeps, parseListingSearch, toListingQuery, type ListingSearch } from "@/lib/listing-search";

export const Route = createFileRoute("/products")({
  validateSearch: parseListingSearch,
  loaderDeps: ({ search }) => listingDeps(search),
  loader: ({ context, deps }) => context.queryClient.ensureQueryData(listingQuery(toListingQuery(deps))),
  head: () => ({
    meta: [
      { title: "All products — OQURAA COMPUTER" },
      { name: "description", content: "Browse every laptop, gaming laptop, component and peripheral. Filter by brand, price, stock and specifications." },
      { property: "og:title", content: "All products — OQURAA COMPUTER" },
      { property: "og:description", content: "Filter laptops, graphics cards, processors, RAM, SSDs and more by brand, LKR price and specs." },
      { property: "og:url", content: "/products" },
    ],
    links: [{ rel: "canonical", href: "/products" }],
  }),
  component: ProductsPage,
  errorComponent: ({ error }) => <ErrorState error={error} />,
});

function ProductsPage() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  const setSearch = (patch: Partial<ListingSearch>) =>
    navigate({ search: (prev) => cleanSearch({ ...prev, ...patch }), resetScroll: false });
  return (
    <>
      <PageHeader
        crumbs={[{ label: "Products" }]}
        eyebrow="Catalogue"
        title="All products"
        description="Every listing shows its LKR price, stock status and warranty. Use the filters to narrow by brand, price or specification."
      />
      <CatalogListing search={search} setSearch={setSearch} />
    </>
  );
}
