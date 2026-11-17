import { createFileRoute } from "@tanstack/react-router";
import { FAQAccordion, faqJsonLd } from "@/components/common/FAQAccordion";
import { PageHeader } from "@/components/common/PageHeader";
import { FAQ } from "@/lib/content";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ — Buying, prices & warranty | OQURAA COMPUTER" },
      { name: "description", content: "Answers about how to buy, LKR prices, stock, warranty and product comparison at OQURAA COMPUTER." },
      { property: "og:title", content: "Frequently asked questions — OQURAA COMPUTER" },
      { property: "og:description", content: "How buying, prices, stock and warranty work." },
      { property: "og:url", content: "/faq" },
    ],
    links: [{ rel: "canonical", href: "/faq" }],
    scripts: [{ type: "application/ld+json", children: JSON.stringify(faqJsonLd(FAQ)) }],
  }),
  component: () => (
    <>
      <PageHeader crumbs={[{ label: "FAQ" }]} eyebrow="Help" title="Frequently asked questions" />
      <section className="container-page max-w-4xl py-16">
        <FAQAccordion items={FAQ} />
      </section>
    </>
  ),
});
