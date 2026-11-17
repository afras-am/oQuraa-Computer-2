import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { CatalogListing } from "@/components/catalog/CatalogListing";
import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import { ErrorState, NotFoundState } from "@/components/common/States";
import { brandsQuery, listingQuery } from "@/lib/catalog.queries";
import { cleanSearch, listingDeps, parseListingSearch, toListingQuery, type ListingSearch } from "@/lib/listing-search";

export const Route = createFileRoute("/brands/$slug")({
  validateSearch: parseListingSearch,
  loaderDeps: ({ search }) => listingDeps(search),
  loader: async ({ context, params, deps }) => {
    const brands = await context.queryClient.ensureQueryData(brandsQuery());
    const brand = brands.find((b) => b.slug === params.slug);
    if (!brand) throw notFound();
    await context.queryClient.ensureQueryData(listingQuery(toListingQuery({ ...deps, brand: undefined }, { brandSlug: params.slug })));
    return { brand };
  },
  head: ({ loaderData, params }) => {
    const b = loaderData?.brand;
    const title = b ? `${b.name} products in Sri Lanka — OQURAA COMPUTER` : "Brand unavailable — OQURAA COMPUTER";
    const description = b
      ? `${b.count} ${b.name} products: ${b.categories.map((c) => c.name).join(", ")}. LKR prices, stock and warranty.`
      : "This brand is not available.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:url", content: `/brands/${params.slug}` },
        ...(b ? [] : [{ name: "robots", content: "noindex" }]),
      ],
      links: [{ rel: "canonical", href: `/brands/${params.slug}` }],
    };
  },
  component: BrandPage,
  errorComponent: ({ error }) => <ErrorState error={error} />,
  notFoundComponent: () => <NotFoundState title="Brand not found" />,
});

function BrandPage() {
  const { slug } = Route.useParams();
  const search = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  const { data: brands } = useSuspenseQuery(brandsQuery());
  const b = brands.find((x) => x.slug === slug)!;
  const setSearch = (patch: Partial<ListingSearch>) =>
    navigate({ search: (prev) => cleanSearch({ ...prev, ...patch, brand: undefined }), resetScroll: false });
  return (
    <>
      <section className="border-b">
        <div className="container-page py-10 md:py-14">
          <Breadcrumbs items={[{ label: "Brands", to: "/brands" }, { label: b.name }]} />
          <div className="mt-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="eyebrow accent-tick">
                <span className="tabular">{b.count}</span> products
              </p>
              <h1 className="text-display mt-4">{b.name}</h1>
            </div>
            <div className="flex flex-wrap gap-2">
              {b.categories.map((c) => (
                <Link key={c.slug} to="/category/$slug" params={{ slug: c.slug }} className="rounded-md border px-3 py-1.5 text-sm font-medium hover:border-foreground">
                  {c.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
      <CatalogListing search={{ ...search, brand: undefined }} fixed={{ brandSlug: slug }} setSearch={setSearch} hideBrand />
    </>
  );
}
