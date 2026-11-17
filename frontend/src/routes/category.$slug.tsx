import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { CatalogListing } from "@/components/catalog/CatalogListing";
import { Breadcrumbs, breadcrumbJsonLd } from "@/components/common/Breadcrumbs";
import { ErrorState, NotFoundState } from "@/components/common/States";
import { categoriesQuery, listingQuery } from "@/lib/catalog.queries";
import { cleanSearch, listingDeps, parseListingSearch, toListingQuery, type ListingSearch } from "@/lib/listing-search";

export const Route = createFileRoute("/category/$slug")({
  validateSearch: parseListingSearch,
  loaderDeps: ({ search }) => listingDeps(search),
  loader: async ({ context, params, deps }) => {
    const cats = await context.queryClient.ensureQueryData(categoriesQuery());
    const category = cats.find((c) => c.slug === params.slug);
    if (!category) throw notFound();
    await context.queryClient.ensureQueryData(listingQuery(toListingQuery({ ...deps, category: undefined }, { category: params.slug })));
    return { category };
  },
  head: ({ loaderData, params }) => {
    const c = loaderData?.category;
    const title = c ? `${c.name} — ${c.count} products | OQURAA COMPUTER` : "Category unavailable — OQURAA COMPUTER";
    const description = c ? `${c.description ?? `Browse ${c.name}.`} Prices in LKR with stock and warranty details.` : "This category is not available.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:url", content: `/category/${params.slug}` },
        ...(c?.image ? [{ property: "og:image", content: c.image }, { name: "twitter:image", content: c.image }] : []),
        ...(c ? [] : [{ name: "robots", content: "noindex" }]),
      ],
      links: [{ rel: "canonical", href: `/category/${params.slug}` }],
      scripts: c
        ? [
            {
              type: "application/ld+json",
              children: JSON.stringify(
                breadcrumbJsonLd([
                  { name: "Home", path: "/" },
                  { name: "Categories", path: "/categories" },
                  { name: c.name, path: `/category/${c.slug}` },
                ]),
              ),
            },
          ]
        : [],
    };
  },
  component: CategoryPage,
  errorComponent: ({ error }) => <ErrorState error={error} />,
  notFoundComponent: () => <NotFoundState title="Category not found" description="This category may have been renamed. Browse all categories instead." />,
});

function CategoryPage() {
  const { slug } = Route.useParams();
  const search = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  const { data: cats } = useSuspenseQuery(categoriesQuery());
  const c = cats.find((x) => x.slug === slug)!;
  const parent = c.parent ? cats.find((x) => x.slug === c.parent) : null;
  const related = cats.filter((x) => x.slug !== c.slug && x.group === c.group).slice(0, 6);
  const setSearch = (patch: Partial<ListingSearch>) =>
    navigate({ search: (prev) => cleanSearch({ ...prev, ...patch, category: undefined }), resetScroll: false });

  return (
    <>
      <section className="border-b">
        <div className="container-page grid gap-8 py-10 md:grid-cols-12 md:py-14">
          <div className="md:col-span-7">
            <Breadcrumbs
              items={[
                { label: "Categories", to: "/categories" },
                ...(parent ? [{ label: parent.name, to: "/category/$slug", params: { slug: parent.slug } }] : []),
                { label: c.name },
              ]}
            />
            <p className="eyebrow accent-tick mt-8">
              <span className="tabular">{c.count}</span> products
            </p>
            <h1 className="text-display mt-4">{c.name}</h1>
            {c.description && <p className="mt-5 max-w-xl text-muted-foreground">{c.description}</p>}
            {c.children.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2">
                <span className="eyebrow mr-1 self-center">Subcategories</span>
                {c.children.map((ch) => (
                  <Link key={ch.slug} to="/category/$slug" params={{ slug: ch.slug }} className="rounded-md border px-3 py-1.5 text-sm font-medium hover:border-foreground">
                    {ch.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
          {c.image && (
            <div className="image-well hidden aspect-[4/3] overflow-hidden rounded-2xl md:col-span-5 md:block">
              <img src={c.image} alt={c.name} className="size-full object-contain p-10" />
            </div>
          )}
        </div>
      </section>
      <CatalogListing search={{ ...search, category: undefined }} fixed={{ category: slug }} setSearch={setSearch} hideCategory />
      {related.length > 0 && (
        <section className="container-page pt-6">
          <p className="eyebrow mb-4">Related categories</p>
          <div className="flex flex-wrap gap-2">
            {related.map((r) => (
              <Link key={r.slug} to="/category/$slug" params={{ slug: r.slug }} className="rounded-md border px-4 py-2 text-sm font-medium hover:border-foreground">
                {r.name} <span className="tabular text-muted-foreground">· {r.count}</span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
