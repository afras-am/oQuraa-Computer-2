import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { CategoryCard } from "@/components/catalog/CategoryCard";
import { PageHeader } from "@/components/common/PageHeader";
import { ErrorState } from "@/components/common/States";
import { categoriesQuery } from "@/lib/catalog.queries";
import { CATEGORY_GROUPS } from "@/lib/site";

export const Route = createFileRoute("/categories")({
  head: () => ({
    meta: [
      { title: "Categories — Laptops, Components & Peripherals | OQURAA COMPUTER" },
      { name: "description", content: "All product categories: laptops, gaming laptops, branded computers, graphics cards, processors, motherboards, RAM, SSDs, monitors and more." },
      { property: "og:title", content: "Product categories — OQURAA COMPUTER" },
      { property: "og:description", content: "Browse computers, components and peripherals by category." },
      { property: "og:url", content: "/categories" },
    ],
    links: [{ rel: "canonical", href: "/categories" }],
  }),
  component: CategoriesPage,
  errorComponent: ({ error }) => <ErrorState error={error} />,
});

function CategoriesPage() {
  const { data } = useSuspenseQuery(categoriesQuery());
  let n = 0;
  return (
    <>
      <PageHeader crumbs={[{ label: "Categories" }]} eyebrow="Directory" title="Shop by category" description={`${data.length} categories, grouped the way you'd plan a purchase.`} />
      <div className="container-page space-y-16 py-12">
        {CATEGORY_GROUPS.map((g) => {
          const cats = data.filter((c) => c.group === g.key);
          return (
            <section key={g.key} aria-labelledby={`g-${g.key}`}>
              <div className="mb-6 flex items-baseline justify-between border-b pb-3">
                <h2 id={`g-${g.key}`} className="text-subhead">
                  {g.label}
                </h2>
                <span className="tabular text-sm text-muted-foreground">{cats.reduce((s, c) => s + (c.parent ? 0 : c.count), 0)} products</span>
              </div>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 xl:grid-cols-4">
                {cats.map((c) => (
                  <div key={c.slug} className="flex flex-col">
                    <CategoryCard category={c} index={n++} size="lg" />
                    {c.children.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {c.children.map((ch) => (
                          <Link key={ch.slug} to="/category/$slug" params={{ slug: ch.slug }} className="rounded border px-2 py-1 text-xs text-muted-foreground hover:text-foreground">
                            ↳ {ch.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </>
  );
}
