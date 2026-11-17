import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import heroGamingLaptop from "@/assets/hero-gaming-laptop.jpg";
import heroGamingDesktop from "@/assets/hero-gaming-desktop.jpg";
import heroProLaptop from "@/assets/hero-pro-laptop.jpg";
import { BrandCard } from "@/components/catalog/BrandCard";
import { CategoryCard } from "@/components/catalog/CategoryCard";
import { ProductRail } from "@/components/catalog/ProductRail";
import { FAQAccordion } from "@/components/common/FAQAccordion";
import { InquiryForm } from "@/components/common/InquiryForm";
import { SectionHeading, SectionLink } from "@/components/common/SectionHeading";
import { ErrorState } from "@/components/common/States";
import { HeroSlider, type HeroSlide } from "@/components/home/HeroSlider";
import { PromoBanner } from "@/components/home/PromoBanner";
import { homeQuery } from "@/lib/catalog.queries";
import { FAQ } from "@/lib/content";
import { formatLKR } from "@/lib/pricing";
import { SITE } from "@/lib/site";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(homeQuery()),
  head: () => ({
    meta: [
      { title: "OQURAA COMPUTER — Laptops, Gaming Laptops & PC Components in Sri Lanka" },
      {
        name: "description",
        content: "Explore laptops, RTX gaming laptops, graphics cards, processors, motherboards, RAM and SSDs with LKR prices and warranty details.",
      },
      { property: "og:title", content: "OQURAA COMPUTER — Laptops, Gaming & Components" },
      { property: "og:description", content: "Premium computer hardware catalogue for Sri Lanka. Compare specs, see LKR prices and inquire on WhatsApp." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: HomePage,
  errorComponent: ({ error }) => <ErrorState error={error} />,
});

function HomePage() {
  const { data } = useSuspenseQuery(homeQuery());
  const [tab, setTab] = useState<"featured" | "latest" | "offers">("featured");

  const slides: HeroSlide[] = [
    {
      eyebrow: "Gaming laptops · RTX graphics",
      title: "Performance, specified precisely.",
      body: "RTX gaming laptops from ASUS, MSI and Lenovo — every listing shows LKR pricing, stock and warranty.",
      image: heroGamingLaptop,
      imageAlt: "Black gaming laptop with a yellow-lit keyboard on a dark desk",
      note: data.promos.gamingLaptop.from ? `From ${formatLKR(data.promos.gamingLaptop.from)}` : undefined,
      link: { label: "Gaming laptops", slug: "gaming-laptop" },
    },
    {
      eyebrow: "Components for desktop builds",
      title: "Build it right, part by part.",
      body: "Graphics cards, processors, motherboards, memory and storage with specifications you can filter and compare.",
      image: heroGamingDesktop,
      imageAlt: "Inside of a desktop PC with graphics card, cooler and memory lit in warm light",
      note: data.promos.desktop.from ? `Graphics cards from ${formatLKR(data.promos.desktop.from)}` : undefined,
      link: { label: "Graphics cards", slug: "graphics-card" },
    },
    {
      eyebrow: "Professional laptops",
      title: "Quiet power for serious work.",
      body: "Business notebooks from ASUS, Dell, Lenovo and HP, many ready with Windows 11 and Microsoft Office.",
      image: heroProLaptop,
      imageAlt: "Silver laptop on a stone desk in soft daylight",
      note: data.promos.proLaptop.from ? `From ${formatLKR(data.promos.proLaptop.from)}` : undefined,
      link: { label: "Laptops", slug: "laptop" },
    },
  ].map((s) => (s.note ? s : { ...s, note: undefined })) as HeroSlide[];

  const topCats = [...data.categories].sort((a, b) => b.count - a.count).slice(0, 10);
  const rail = tab === "featured" ? data.featured : tab === "latest" ? data.latest : data.offers;

  return (
    <>
      <HeroSlider slides={slides} />

      {/* Most searched categories */}
      <section className="container-page py-20 md:py-24">
        <SectionHeading
          index="01"
          eyebrow="Categories"
          title="Most searched categories"
          action={<SectionLink to="/categories">All {data.categories.length} categories</SectionLink>}
        />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-5">
          {topCats.map((c, i) => (
            <CategoryCard key={c.slug} category={c} index={i} />
          ))}
        </div>
      </section>

      {/* Credibility: live catalogue figures */}
      <section className="border-y bg-surface">
        <div className="container-page grid gap-10 py-16 md:grid-cols-12 md:py-20">
          <div className="md:col-span-4">
            <p className="eyebrow accent-tick">The catalogue</p>
            <h2 className="text-subhead mt-4">Real stock, real prices, clearly listed.</h2>
            <p className="mt-4 text-sm text-muted-foreground">Figures update with the catalogue — nothing here is rounded up.</p>
          </div>
          <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border bg-border md:col-span-8 md:grid-cols-4">
            {[
              { k: "Products listed", v: data.stats.products },
              { k: "Currently in stock", v: data.stats.inStock },
              { k: "Brands", v: data.stats.brands },
              { k: "Max. warranty", v: `${data.stats.maxWarranty} yrs` },
            ].map((s) => (
              <div key={s.k} className="bg-surface p-6">
                <dt className="text-xs text-muted-foreground">{s.k}</dt>
                <dd className="tabular mt-3 text-4xl font-bold tracking-tighter md:text-5xl">{s.v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Product rail with tabs */}
      <section className="container-page py-20 md:py-24">
        <SectionHeading
          index="02"
          eyebrow="Products"
          title="Selected for you"
          action={
            <div role="tablist" aria-label="Product selection" className="flex gap-1 rounded-lg border p-1">
              {(
                [
                  ["featured", "Featured"],
                  ["latest", "Latest arrivals"],
                  ["offers", "On offer"],
                ] as const
              ).map(([k, label]) => (
                <button
                  key={k}
                  role="tab"
                  type="button"
                  aria-selected={tab === k}
                  onClick={() => setTab(k)}
                  className={cn(
                    "h-9 rounded-md px-3.5 text-sm font-semibold transition-colors",
                    tab === k ? "bg-inverse text-inverse-foreground" : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          }
        />
        <div role="tabpanel">
          <ProductRail products={rail} />
        </div>
        <div className="mt-10 flex justify-center">
          <SectionLink to={tab === "offers" ? "/offers" : "/products"}>{tab === "offers" ? "See all offers" : "Browse all products"}</SectionLink>
        </div>
      </section>

      {/* Promotional banners */}
      <section className="container-page grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <PromoBanner eyebrow="Gaming laptops" title="RTX power, ready to play." from={data.promos.gamingLaptop.from} product={data.promos.gamingLaptop.product} slug="gaming-laptop" tone="inverse" />
        <PromoBanner eyebrow="Professional laptops" title="Built for the working day." from={data.promos.proLaptop.from} product={data.promos.proLaptop.product} slug="laptop" />
        <PromoBanner eyebrow="Gaming desktops" title="Start with the graphics card." from={data.promos.desktop.from} product={data.promos.desktop.product} slug="graphics-card" tone="brand" className="md:col-span-2 lg:col-span-1" />
      </section>

      {/* Laptop showcase */}
      <section className="container-page py-20 md:py-24">
        <SectionHeading
          index="03"
          eyebrow="Laptops"
          title="Laptops for work and study"
          description="Intel Core and AMD Ryzen notebooks with SSD storage, listed with their exact memory, storage and warranty."
          action={<SectionLink to="/category/$slug" params={{ slug: "laptop" }}>All laptops</SectionLink>}
        />
        <ProductRail products={data.laptops} />
      </section>

      {/* Components showcase */}
      <section className="border-y bg-surface">
        <div className="container-page py-20 md:py-24">
          <SectionHeading
            index="04"
            eyebrow="Components & accessories"
            title="Upgrade or build from scratch"
            action={<SectionLink to="/products">Shop components</SectionLink>}
          />
          <ProductRail products={data.components} />
        </div>
      </section>

      {/* Brands */}
      <section className="container-page py-20 md:py-24">
        <SectionHeading index="05" eyebrow="Brands" title="Brands we carry" action={<SectionLink to="/brands">All {data.stats.brands} brands</SectionLink>} />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {data.brands.map((b) => (
            <BrandCard key={b.slug} brand={b} compact />
          ))}
        </div>
      </section>

      {/* Company introduction */}
      <section className="container-page">
        <div className="grid overflow-hidden rounded-2xl border md:grid-cols-2">
          <div className="p-8 md:p-12">
            <p className="eyebrow accent-tick">About {SITE.name}</p>
            <h2 className="text-section mt-5">Computer hardware, explained before you buy.</h2>
            <p className="mt-6 text-muted-foreground">
              {SITE.name} supplies laptops, gaming systems, components and peripherals in Sri Lanka. This catalogue lists each product with its LKR
              price, availability and warranty, so you can compare options and talk to us with the details already in hand.
            </p>
            <div className="mt-8 flex flex-wrap gap-6 text-sm font-semibold">
              <Link to="/about" className="link-underline">
                About us
              </Link>
              <Link to="/services" className="link-underline">
                Services
              </Link>
              <Link to="/warranty" className="link-underline">
                Warranty
              </Link>
            </div>
          </div>
          <img src={heroGamingDesktop} alt="" loading="lazy" width={1920} height={1088} className="h-full min-h-[280px] w-full object-cover" />
        </div>
      </section>

      {/* Lead form + FAQ */}
      <section className="container-page grid gap-12 py-20 md:py-24 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <SectionHeading index="06" eyebrow="Inquiry" title="Tell us what you need" description="Send your requirement and we'll reply with availability and a price on WhatsApp." className="mb-8" />
          <div className="rounded-2xl border bg-card p-6 md:p-8">
            <InquiryForm compact />
          </div>
        </div>
        <div className="lg:col-span-7">
          <SectionHeading index="07" eyebrow="FAQ" title="Questions, answered" className="mb-8" action={<SectionLink to="/faq">All FAQs</SectionLink>} />
          <FAQAccordion items={FAQ} />
        </div>
      </section>
    </>
  );
}
