import { useSuspenseQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { Phone } from "lucide-react";
import { categoriesQuery } from "@/lib/catalog.queries";
import { SITE, whatsappUrl } from "@/lib/site";
import { Logo } from "./Logo";
import { WhatsAppIcon } from "./WhatsAppIcon";

const COMPANY = [
  { label: "About Us", to: "/about" },
  { label: "Services", to: "/services" },
  { label: "Contact", to: "/contact" },
  { label: "Brands", to: "/brands" },
] as const;
const HELP = [
  { label: "Warranty", to: "/warranty" },
  { label: "FAQ", to: "/faq" },
  { label: "Compare products", to: "/compare" },
  { label: "Offers", to: "/offers" },
] as const;
const LEGAL = [
  { label: "Privacy Policy", to: "/privacy-policy" },
  { label: "Terms", to: "/terms" },
] as const;

export function SiteFooter() {
  const { data: categories } = useSuspenseQuery(categoriesQuery());
  return (
    <footer className="mt-24 border-t bg-surface">
      <div className="container-page grid gap-12 py-16 md:grid-cols-12">
        <div className="md:col-span-4">
          <Logo />
          <p className="mt-5 max-w-sm text-sm text-muted-foreground">
            {SITE.tagline}. Browse the catalogue, compare specifications and talk to us before you buy — there is no online checkout.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            <a href={`tel:${SITE.hotline.tel}`} className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-semibold hover:border-foreground">
              <Phone className="size-4" /> {SITE.hotline.display}
            </a>
            <a href={whatsappUrl()} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-semibold hover:border-foreground">
              <WhatsAppIcon className="size-4" /> WhatsApp
            </a>
          </div>
        </div>
        <FooterCol title="Categories" className="md:col-span-3">
          {categories
            .filter((c) => !c.parent)
            .slice(0, 8)
            .map((c) => (
              <li key={c.slug}>
                <Link to="/category/$slug" params={{ slug: c.slug }} className="hover:text-foreground">
                  {c.name}
                </Link>
              </li>
            ))}
        </FooterCol>
        <FooterCol title="Company" className="md:col-span-2">
          {COMPANY.map((l) => (
            <li key={l.to}>
              <Link to={l.to} className="hover:text-foreground">
                {l.label}
              </Link>
            </li>
          ))}
        </FooterCol>
        <FooterCol title="Help" className="md:col-span-3">
          {HELP.map((l) => (
            <li key={l.to}>
              <Link to={l.to} className="hover:text-foreground">
                {l.label}
              </Link>
            </li>
          ))}
        </FooterCol>
      </div>
      <div className="border-t">
        <div className="container-page flex flex-col gap-3 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getUTCFullYear()} {SITE.name}. All prices in Sri Lankan Rupees (LKR).</p>
          <ul className="flex gap-5">
            {LEGAL.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="hover:text-foreground">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, className, children }: { title: string; className?: string; children: React.ReactNode }) {
  return (
    <div className={className}>
      <p className="eyebrow mb-4">{title}</p>
      <ul className="space-y-2.5 text-sm text-muted-foreground">{children}</ul>
    </div>
  );
}
