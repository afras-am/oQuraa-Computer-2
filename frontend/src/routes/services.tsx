import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/common/PageHeader";
import { DraftNotice } from "@/components/common/DraftNotice";
import { Button } from "@/components/ui/button";
import { whatsappUrl } from "@/lib/site";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — Product advice & support | OQURAA COMPUTER" },
      { name: "description", content: "Product guidance, build component selection and warranty assistance from OQURAA COMPUTER." },
      { property: "og:title", content: "Services — OQURAA COMPUTER" },
      { property: "og:description", content: "Help choosing laptops and components, and warranty assistance." },
      { property: "og:url", content: "/services" },
    ],
    links: [{ rel: "canonical", href: "/services" }],
  }),
  component: ServicesPage,
});

const SERVICES = [
  { t: "Product guidance", d: "Tell us your budget and use — work, study, gaming or creative — and we'll suggest suitable laptops or systems from the catalogue." },
  { t: "Component selection", d: "Matching processors, motherboards, memory and graphics cards so the parts in your build work together (socket, chipset, DDR generation)." },
  { t: "Warranty assistance", d: "Help with the warranty listed on the products you purchase from us." },
];

function ServicesPage() {
  return (
    <>
      <PageHeader crumbs={[{ label: "Services" }]} eyebrow="Support" title="How we can help" />
      <section className="container-page py-16">
        <DraftNotice>The service list below is a draft. OQURAA COMPUTER will confirm the exact services offered (e.g. repairs, upgrades, installation).</DraftNotice>
        <div className="grid gap-4 md:grid-cols-3">
          {SERVICES.map((s, i) => (
            <div key={s.t} className="rounded-xl border p-6">
              <span className="tabular text-sm text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
              <h2 className="mt-6 text-lg font-semibold">{s.t}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{s.d}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-wrap gap-3">
          <Button asChild size="lg" variant="whatsapp">
            <a href={whatsappUrl("Hello, I need help choosing a product.")} target="_blank" rel="noreferrer">Ask on WhatsApp</a>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link to="/contact">Contact page</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
