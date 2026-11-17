import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { FAQAccordion } from "@/components/common/FAQAccordion";
import { PageHeader } from "@/components/common/PageHeader";
import { DraftNotice } from "@/components/common/DraftNotice";
import { ErrorState } from "@/components/common/States";
import { homeQuery } from "@/lib/catalog.queries";

export const Route = createFileRoute("/warranty")({
  loader: ({ context }) => context.queryClient.ensureQueryData(homeQuery()),
  head: () => ({
    meta: [
      { title: "Warranty — Coverage by product | OQURAA COMPUTER" },
      { name: "description", content: "Warranty periods are listed on every product, from 1 to 5 years depending on the item and manufacturer." },
      { property: "og:title", content: "Warranty information — OQURAA COMPUTER" },
      { property: "og:description", content: "How warranty periods are shown and how to request warranty help." },
      { property: "og:url", content: "/warranty" },
    ],
    links: [{ rel: "canonical", href: "/warranty" }],
  }),
  component: WarrantyPage,
  errorComponent: ({ error }) => <ErrorState error={error} />,
});

function WarrantyPage() {
  const { data } = useSuspenseQuery(homeQuery());
  return (
    <>
      <PageHeader crumbs={[{ label: "Warranty" }]} eyebrow="Coverage" title="Warranty" description={`Every product lists its warranty period — currently up to ${data.stats.maxWarranty} years depending on the item.`} />
      <section className="container-page grid gap-12 py-16 lg:grid-cols-12">
        <div className="prose-page lg:col-span-7">
          <DraftNotice />
          <h2>Where to find the warranty</h2>
          <p>The warranty period appears on each product card (for example “3Y”) and in the product details under “Warranty”.</p>
          <h2>Making a warranty request</h2>
          <p>Contact us with your product name and purchase details. Our team will explain the next steps for that product.</p>
          <h2>Conditions</h2>
          <p>Detailed warranty conditions (coverage, exclusions, service periods) will be published here once approved by OQURAA COMPUTER.</p>
        </div>
        <div className="lg:col-span-5">
          <FAQAccordion
            items={[
              { q: "Is warranty the same for every product?", a: "No. Warranty depends on the product and manufacturer — check the period shown on each product page." },
              { q: "What does “03Y” mean in a product name?", a: "It indicates a 3-year warranty period for that item." },
            ]}
          />
        </div>
      </section>
    </>
  );
}
