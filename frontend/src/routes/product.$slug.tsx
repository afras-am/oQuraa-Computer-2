import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { MessageSquareText, Phone, ShieldCheck, Tag } from "lucide-react";
import { CompareButton } from "@/components/catalog/CompareButton";
import { PriceDisplay, StockBadge } from "@/components/catalog/PriceDisplay";
import { ProductGallery } from "@/components/catalog/ProductGallery";
import { ProductRail } from "@/components/catalog/ProductRail";
import { SpecificationTable } from "@/components/catalog/SpecificationTable";
import { Breadcrumbs, breadcrumbJsonLd } from "@/components/common/Breadcrumbs";
import { InquiryForm } from "@/components/common/InquiryForm";
import { SectionHeading } from "@/components/common/SectionHeading";
import { ErrorState, NotFoundState } from "@/components/common/States";
import { WhatsAppIcon } from "@/components/site/WhatsAppIcon";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { productQuery } from "@/lib/catalog.queries";
import { effectivePrice, formatLKR, savings, toRupees } from "@/lib/pricing";
import { SITE, whatsappUrl } from "@/lib/site";

export const Route = createFileRoute("/product/$slug")({
  loader: async ({ context, params }) => {
    const data = await context.queryClient.ensureQueryData(productQuery(params.slug));
    if (!data) throw notFound();
    return data;
  },
  head: ({ loaderData, params }) => {
    const p = loaderData?.product;
    if (!p) return { meta: [{ title: "Product unavailable — OQURAA COMPUTER" }, { name: "robots", content: "noindex" }] };
    const price = p.price > 0 ? ` — ${formatLKR(effectivePrice(p.price, p.salePrice))}` : "";
    const title = `${p.name}${price} | OQURAA COMPUTER`;
    const description = `${p.name}. ${p.keySpecs.join(", ")}${p.warrantyYears ? `. ${p.warrantyYears}-year warranty` : ""}. Price in LKR — inquire on WhatsApp.`;
    const image = p.images[0]?.src;
    return {
      meta: [
        { title },
        { name: "description", content: description.slice(0, 300) },
        { property: "og:title", content: p.name },
        { property: "og:description", content: description.slice(0, 300) },
        { property: "og:type", content: "product" },
        { property: "og:url", content: `/product/${params.slug}` },
        ...(image ? [{ property: "og:image", content: image }, { name: "twitter:image", content: image }] : []),
      ],
      links: [{ rel: "canonical", href: `/product/${params.slug}` }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: p.name,
            image: p.images.map((i) => i.src),
            ...(p.brand ? { brand: { "@type": "Brand", name: p.brand.name } } : {}),
            category: p.category.name,
            ...(p.price > 0
              ? {
                  offers: {
                    "@type": "Offer",
                    priceCurrency: "LKR",
                    price: toRupees(effectivePrice(p.price, p.salePrice)),
                    availability: p.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
                  },
                }
              : {}),
          }),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Home", path: "/" },
              { name: p.category.name, path: `/category/${p.category.slug}` },
              { name: p.name, path: `/product/${p.slug}` },
            ]),
          ),
        },
      ],
    };
  },
  component: ProductPage,
  errorComponent: ({ error }) => <ErrorState error={error} />,
  notFoundComponent: () => <NotFoundState title="Product not found" description="This product may no longer be listed. Browse similar items in our catalogue." />,
});

function ProductPage() {
  const { slug } = Route.useParams();
  const { data } = useSuspenseQuery(productQuery(slug));
  const { product: p, related, sameBrand } = data!;
  const save = savings(p.price, p.salePrice);
  const waMsg = `Hello ${SITE.name}, I'm interested in "${p.name}". Is it available?`;

  return (
    <>
      <div className="container-page pt-8">
        <Breadcrumbs
          items={[
            { label: "Products", to: "/products" },
            { label: p.category.name, to: "/category/$slug", params: { slug: p.category.slug } },
            { label: p.name },
          ]}
        />
      </div>

      <section className="container-page grid gap-10 py-8 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-7">
          <ProductGallery images={p.images} name={p.name} />
        </div>
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-24">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
              {p.brand && (
                <Link to="/brands/$slug" params={{ slug: p.brand.slug }} className="text-foreground hover:underline">
                  {p.brand.name}
                </Link>
              )}
              <span aria-hidden>·</span>
              <Link to="/category/$slug" params={{ slug: p.category.slug }} className="hover:text-foreground">
                {p.category.name}
              </Link>
              {p.sku && (
                <>
                  <span aria-hidden>·</span>
                  <span>SKU {p.sku}</span>
                </>
              )}
            </div>
            <h1 className="mt-3 text-3xl font-bold leading-tight tracking-tight md:text-4xl">{p.name}</h1>
            <div className="mt-4">
              <StockBadge inStock={p.inStock} qty={p.stockQty} className="text-sm" />
            </div>

            <div className="mt-6 border-y py-6">
              <PriceDisplay price={p.price} salePrice={p.salePrice} size="lg" />
              {save > 0 && <p className="tabular mt-2 text-sm text-success">You save {formatLKR(save)}</p>}
              <p className="mt-2 text-xs text-muted-foreground">Price in Sri Lankan Rupees. Confirm final price and availability with our team.</p>
            </div>

            {p.highlights.length > 0 && (
              <ul className="mt-6 space-y-2 text-sm">
                {p.highlights.slice(0, 8).map((h) => (
                  <li key={h} className="flex gap-3">
                    <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-sm bg-brand" />
                    <span className="text-muted-foreground">{h}</span>
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-8 grid gap-2 sm:grid-cols-2">
              <Button asChild variant="whatsapp" size="lg">
                <a href={whatsappUrl(waMsg)} target="_blank" rel="noreferrer">
                  <WhatsAppIcon className="size-5" /> WhatsApp inquiry
                </a>
              </Button>
              <Button asChild variant="inverse" size="lg">
                <a href={`tel:${SITE.hotline.tel}`}>
                  <Phone /> Call now
                </a>
              </Button>
              <Button asChild variant="outline" size="lg">
                <a href="#inquiry">
                  <MessageSquareText /> Request information
                </a>
              </Button>
              <CompareButton id={p.id} name={p.name} variant="full" />
            </div>

            <dl className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-xl border bg-border text-sm">
              <div className="bg-background p-4">
                <dt className="flex items-center gap-2 text-xs text-muted-foreground">
                  <ShieldCheck className="size-4" /> Warranty
                </dt>
                <dd className="mt-1 font-semibold">{p.warrantyYears ? `${p.warrantyYears} year${p.warrantyYears > 1 ? "s" : ""}` : "Ask our team"}</dd>
              </div>
              <div className="bg-background p-4">
                <dt className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Tag className="size-4" /> Category
                </dt>
                <dd className="mt-1 font-semibold">{p.categories.map((c) => c.name).join(", ")}</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      <section className="container-page py-12">
        <Tabs defaultValue="specs">
          <TabsList className="h-auto w-full justify-start gap-1 rounded-none border-b bg-transparent p-0">
            {[
              ["specs", "Specifications"],
              ["details", "Description"],
            ].map(([v, l]) => (
              <TabsTrigger
                key={v}
                value={v!}
                className="rounded-none border-b-2 border-transparent px-4 py-3 text-sm font-semibold data-[state=active]:border-brand data-[state=active]:bg-transparent data-[state=active]:shadow-none"
              >
                {l}
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsContent value="specs" className="pt-8">
            <div className="max-w-4xl">
              <SpecificationTable groups={p.specGroups} />
            </div>
          </TabsContent>
          <TabsContent value="details" className="pt-8">
            {p.details.length ? (
              <ul className="max-w-3xl divide-y border-y text-sm">
                {p.details.map((d, i) => (
                  <li key={`${i}-${d}`} className="py-2.5 text-muted-foreground">
                    {d}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">No additional description has been provided for this product.</p>
            )}
          </TabsContent>
        </Tabs>
      </section>

      <section id="inquiry" className="container-page scroll-mt-24 py-12">
        <div className="grid gap-10 rounded-2xl border bg-surface p-6 md:p-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="eyebrow accent-tick">Request information</p>
            <h2 className="text-subhead mt-4">Ask about this product</h2>
            <p className="mt-3 text-sm text-muted-foreground">We'll confirm availability, the final price and warranty terms. Your message opens in WhatsApp, ready to send.</p>
          </div>
          <div className="lg:col-span-7">
            <InquiryForm product={{ name: p.name, slug: p.slug }} />
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="container-page py-12">
          <SectionHeading eyebrow="Related" title="Similar products" description="Same category, closest in price." />
          <ProductRail products={related.slice(0, 4)} />
        </section>
      )}
      {sameBrand.length > 0 && p.brand && (
        <section className="container-page py-12">
          <SectionHeading eyebrow={p.brand.name} title={`More from ${p.brand.name}`} />
          <ProductRail products={sameBrand} />
        </section>
      )}
    </>
  );
}
