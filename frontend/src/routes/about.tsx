import { createFileRoute, Link } from "@tanstack/react-router";
import heroDesk from "@/assets/hero-pro-laptop.jpg";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About OQURAA COMPUTER — Computer hardware in Sri Lanka" },
      { name: "description", content: "OQURAA COMPUTER supplies laptops, gaming systems, PC components and peripherals in Sri Lanka." },
      { property: "og:title", content: "About OQURAA COMPUTER" },
      { property: "og:description", content: "Laptops, gaming systems, components and peripherals for customers in Sri Lanka." },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: AboutPage,
});

const OFFER = [
  { t: "Laptops & branded PCs", d: "Business, student and gaming laptops plus complete branded desktop systems." },
  { t: "Components", d: "Graphics cards, processors, motherboards, memory, SSDs and PC cases for builds and upgrades." },
  { t: "Peripherals & power", d: "Monitors, printers, projectors, UPS units and mobile Wi-Fi routers." },
];

function AboutPage() {
  return (
    <>
      <PageHeader crumbs={[{ label: "About Us" }]} eyebrow="Company" title={`About ${SITE.name}`} description={`${SITE.name} supplies laptops, gaming systems, components and peripherals to customers in Sri Lanka.`} />
      <section className="container-page grid gap-12 py-16 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <h2 className="text-subhead">What we offer</h2>
          <div className="mt-8 divide-y border-y">
            {OFFER.map((o, i) => (
              <div key={o.t} className="grid grid-cols-[3rem_1fr] gap-4 py-6">
                <span className="tabular text-sm text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <h3 className="font-semibold">{o.t}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{o.d}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-8 rounded-lg border border-dashed px-4 py-3 text-xs text-muted-foreground">
            Company history, mission, vision, values and achievements will appear here once provided by {SITE.name}. We don't publish claims we can't verify.
          </p>
        </div>
        <div className="lg:col-span-6">
          <img src={heroDesk} alt="" width={1920} height={1088} loading="lazy" className="aspect-[4/3] w-full rounded-2xl border object-cover" />
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link to="/contact">Contact us</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/services">Our services</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
