import { createFileRoute } from "@tanstack/react-router";
import { DraftNotice } from "@/components/common/DraftNotice";
import { PageHeader } from "@/components/common/PageHeader";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Use — OQURAA COMPUTER" },
      { name: "description", content: "Terms for using the OQURAA COMPUTER product catalogue website." },
      { property: "og:title", content: "Terms of Use — OQURAA COMPUTER" },
      { property: "og:description", content: "Terms for using the OQURAA COMPUTER website." },
      { property: "og:url", content: "/terms" },
    ],
    links: [{ rel: "canonical", href: "/terms" }],
  }),
  component: () => (
    <>
      <PageHeader crumbs={[{ label: "Terms" }]} eyebrow="Legal" title="Terms of Use" />
      <article className="container-page prose-page py-16">
        <DraftNotice />
        <h2>Product information</h2>
        <p>Prices are shown in Sri Lankan Rupees (LKR). Prices, specifications and stock can change; please confirm with {SITE.name} before purchasing.</p>
        <h2>Images</h2>
        <p>Product images are for illustration and may differ slightly from the delivered item.</p>
        <h2>Contact</h2>
        <p>For questions about these terms, call {SITE.hotline.display}.</p>
      </article>
    </>
  ),
});
