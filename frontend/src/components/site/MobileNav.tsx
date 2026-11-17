import { Link } from "@tanstack/react-router";
import { Menu, Phone } from "lucide-react";
import { useEffect, useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import type { CategorySummary } from "@/lib/catalog-types";
import { CATEGORY_GROUPS, PRIMARY_NAV, SITE, whatsappUrl } from "@/lib/site";
import { Logo } from "./Logo";
import { WhatsAppIcon } from "./WhatsAppIcon";

export function MobileNav({ categories, pathname }: { categories: CategorySummary[]; pathname: string }) {
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [pathname]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="flex w-[88vw] max-w-sm flex-col gap-0 overflow-y-auto p-0">
        <SheetTitle className="sr-only">Menu</SheetTitle>
        <div className="border-b p-5">
          <Logo />
        </div>
        <nav aria-label="Mobile" className="flex-1 px-5 py-3">
          {PRIMARY_NAV.filter((n) => !("mega" in n)).map((n) => (
            <Link
              key={n.to}
              to={n.to}
              activeOptions={{ exact: n.to === "/" }}
              activeProps={{ className: "text-foreground accent-tick" }}
              className="flex items-center border-b py-3.5 text-lg font-semibold text-muted-foreground"
            >
              {n.label}
            </Link>
          ))}
          <Accordion type="single" collapsible {...(pathname.startsWith("/categor") ? { defaultValue: "cats" } : {})}>
            <AccordionItem value="cats" className="border-b">
              <AccordionTrigger className="py-3.5 text-lg font-semibold text-muted-foreground hover:no-underline">
                Categories
              </AccordionTrigger>
              <AccordionContent>
                {CATEGORY_GROUPS.map((g) => (
                  <div key={g.key} className="mb-4">
                    <p className="eyebrow mb-1.5">{g.label}</p>
                    {categories
                      .filter((c) => c.group === g.key)
                      .map((c) => (
                        <Link
                          key={c.slug}
                          to="/category/$slug"
                          params={{ slug: c.slug }}
                          className="flex justify-between py-1.5 text-[0.95rem]"
                        >
                          <span className={c.parent ? "pl-4 text-muted-foreground" : ""}>{c.name}</span>
                          <span className="tabular text-xs text-muted-foreground">{c.count}</span>
                        </Link>
                      ))}
                  </div>
                ))}
                <Link to="/categories" className="text-sm font-semibold link-underline">
                  All categories
                </Link>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </nav>
        <div className="grid gap-2 border-t p-5">
          <Button asChild variant="whatsapp" size="lg">
            <a href={whatsappUrl("Hello OQURAA COMPUTER, I have a product inquiry.")} target="_blank" rel="noreferrer">
              <WhatsAppIcon className="size-5" /> WhatsApp us
            </a>
          </Button>
          <Button asChild variant="outline" size="lg">
            <a href={`tel:${SITE.hotline.tel}`}>
              <Phone /> {SITE.hotline.display}
            </a>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
