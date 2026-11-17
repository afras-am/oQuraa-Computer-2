import { createFileRoute } from "@tanstack/react-router";
import { Phone } from "lucide-react";
import { InquiryForm } from "@/components/common/InquiryForm";
import { PageHeader } from "@/components/common/PageHeader";
import { WhatsAppIcon } from "@/components/site/WhatsAppIcon";
import { SITE, whatsappUrl } from "@/lib/site";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact OQURAA COMPUTER — Call 075 05 222 11" },
      { name: "description", content: "Call or WhatsApp OQURAA COMPUTER on 075 05 222 11, or send a product inquiry." },
      { property: "og:title", content: "Contact OQURAA COMPUTER" },
      { property: "og:description", content: "Call or WhatsApp 075 05 222 11 for product availability and prices." },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <>
      <PageHeader crumbs={[{ label: "Contact" }]} eyebrow="Get in touch" title="Talk to our team" description="Ask about availability, final prices, warranty or a custom build." />
      <section className="container-page grid gap-10 py-16 lg:grid-cols-12">
        <div className="space-y-3 lg:col-span-5">
          <a href={`tel:${SITE.hotline.tel}`} className="group flex items-center justify-between rounded-xl border p-6 hover:border-foreground">
            <div>
              <p className="eyebrow">Hotline</p>
              <p className="tabular mt-2 text-2xl font-bold tracking-tight">{SITE.hotline.display}</p>
            </div>
            <Phone className="size-6" />
          </a>
          <a href={whatsappUrl()} target="_blank" rel="noreferrer" className="flex items-center justify-between rounded-xl border p-6 hover:border-foreground">
            <div>
              <p className="eyebrow">WhatsApp</p>
              <p className="tabular mt-2 text-2xl font-bold tracking-tight">{SITE.hotline.display}</p>
            </div>
            <WhatsAppIcon className="size-6" />
          </a>
          {(SITE.email || SITE.address || SITE.openingHours) && (
            <div className="rounded-xl border p-6 text-sm">
              {SITE.email && <p>{SITE.email}</p>}
              {SITE.address && <p>{SITE.address}</p>}
              {SITE.openingHours && <p>{SITE.openingHours}</p>}
            </div>
          )}
        </div>
        <div className="rounded-2xl border bg-surface p-6 md:p-10 lg:col-span-7">
          <h2 className="text-subhead">Send an inquiry</h2>
          <p className="mt-2 text-sm text-muted-foreground">Fill in your details and we'll continue the conversation on WhatsApp.</p>
          <InquiryForm className="mt-8" />
        </div>
      </section>
    </>
  );
}
