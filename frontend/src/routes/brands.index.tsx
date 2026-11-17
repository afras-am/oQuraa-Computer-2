import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { BrandCard } from "@/components/catalog/BrandCard";
import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState, ErrorState } from "@/components/common/States";
import { Input } from "@/components/ui/input";
import { brandsQuery } from "@/lib/catalog.queries";

export const Route = createFileRoute("/brands/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(brandsQuery()),
  head: () => ({
    meta: [
      { title: "Brands — ASUS, MSI, Lenovo, Dell & more | OQURAA COMPUTER" },
      { name: "description", content: "Browse computer hardware by manufacturer: ASUS, MSI, Lenovo, Dell, HP, Acer, Intel, Lexar, Transcend and more." },
      { property: "og:title", content: "Brands — OQURAA COMPUTER" },
      { property: "og:description", content: "Every manufacturer in the catalogue with product counts." },
      { property: "og:url", content: "/brands" },
    ],
    links: [{ rel: "canonical", href: "/brands" }],
  }),
  component: BrandsPage,
  errorComponent: ({ error }) => <ErrorState error={error} />,
});

function BrandsPage() {
  const { data } = useSuspenseQuery(brandsQuery());
  const [q, setQ] = useState("");
  const list = useMemo(() => data.filter((b) => b.name.toLowerCase().includes(q.trim().toLowerCase())), [data, q]);
  return (
    <>
      <PageHeader
        crumbs={[{ label: "Brands" }]}
        eyebrow="Manufacturers"
        title="Brands"
        description={`${data.length} manufacturers across laptops, components and peripherals.`}
        aside={
          <label className="relative block w-full md:w-80">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Find a brand" aria-label="Find a brand" className="pl-9" />
          </label>
        }
      />
      <section className="container-page py-10">
        {list.length === 0 ? (
          <EmptyState title="No brand matches that name" />
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-4 xl:grid-cols-5">
            {list.map((b) => (
              <BrandCard key={b.slug} brand={b} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
