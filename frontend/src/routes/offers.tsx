import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { CatalogListing } from "@/components/catalog/CatalogListing";
import { PageHeader } from "@/components/common/PageHeader";
import { ErrorState } from "@/components/common/States";
import { listingQuery } from "@/lib/catalog.queries";
import { cleanSearch, listingDeps, parseListingSearch, toListingQuery, type ListingSearch } from "@/lib/listing-search";

export const Route = createFileRoute("/offers")({
  validateSearch: parseListingSearch,
  loaderDeps: ({ search }) => listingDeps(search),
  loader: ({ context, deps }) => context.queryClient.ensureQueryData(listingQuery(toListingQuery(deps, { onSale: true }))),
  head: () => ({
    meta: [
      { title: "Offers — Discounted computer hardware | OQURAA COMPUTER" },
      { name: "description", content: "Active price reductions on SSDs, graphics cards and more, with the regular and offer price shown in LKR." },
      { property: "og:title", content: "Current offers — OQURAA COMPUTER" },
      { property: "og:description", content: "See every product currently on offer with its discounted LKR price." },
      { property: "og:url", content: "/offers" },
    ],
    links: [{ rel: "canonical", href: "/offers" }],
  }),
  component: OffersPage,
  errorComponent: ({ error }) => <ErrorState error={error} />,
});

function OffersPage() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  const setSearch = (patch: Partial<ListingSearch>) =>
    navigate({ search: (prev) => cleanSearch({ ...prev, ...patch, sale: undefined }), resetScroll: false });
  return (
    <>
      <PageHeader
        crumbs={[{ label: "Offers" }]}
        eyebrow="Promotions"
        title="Current offers"
        description="Only products with an active offer price appear here. Discounts are calculated from the listed regular and offer prices."
      />
      <CatalogListing search={{ ...search, sale: undefined }} fixed={{ onSale: true }} setSearch={setSearch} emptyHint="There are no active offers right now. Check back soon or browse the full catalogue." />
    </>
  );
}
