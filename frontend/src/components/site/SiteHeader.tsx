import { useSuspenseQuery } from "@tanstack/react-query";
import { Link, useRouterState } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { categoriesQuery } from "@/lib/catalog.queries";
import { PRIMARY_NAV, whatsappUrl } from "@/lib/site";
import { cn } from "@/lib/utils";
import { AnnouncementBar } from "./AnnouncementBar";
import { Logo } from "./Logo";
import { MegaMenu } from "./MegaMenu";
import { MobileNav } from "./MobileNav";
import { SearchDialog } from "./SearchDialog";
import { ThemeToggle } from "./ThemeToggle";
import { WhatsAppIcon } from "./WhatsAppIcon";

export function SiteHeader() {
  const { data: categories } = useSuspenseQuery(categoriesQuery());
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const loading = useRouterState({ select: (s) => s.isLoading });
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const typing = target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable);
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || (e.key === "/" && !typing)) {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <AnnouncementBar />
      <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur-md supports-[backdrop-filter]:bg-background/80">
        <div className="container-page relative flex h-16 items-center gap-2">
          <MobileNav categories={categories} pathname={pathname} />
          <Link to="/" aria-label="OQURAA COMPUTER home" className="mr-4 shrink-0">
            <Logo />
          </Link>
          <nav aria-label="Primary" className="hidden flex-1 items-center lg:flex">
            {PRIMARY_NAV.map((n) =>
              "mega" in n ? (
                <MegaMenu key={n.to} categories={categories} pathname={pathname} />
              ) : (
                <Link
                  key={n.to}
                  to={n.to}
                  activeOptions={{ exact: n.to === "/" }}
                  className="relative inline-flex h-16 items-center px-3 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground data-[status=active]:text-foreground data-[status=active]:after:absolute data-[status=active]:after:inset-x-3 data-[status=active]:after:bottom-0 data-[status=active]:after:h-0.5 data-[status=active]:after:bg-brand"
                >
                  {n.label}
                </Link>
              ),
            )}
          </nav>
          <div className="ml-auto flex items-center gap-1">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="hidden h-10 w-56 items-center gap-2 rounded-md border bg-surface px-3 text-sm text-muted-foreground transition-colors hover:border-border-strong xl:flex"
            >
              <Search className="size-4" />
              <span className="flex-1 text-left">Search products</span>
              <kbd className="rounded border px-1.5 text-[0.65rem]">/</kbd>
            </button>
            <Button variant="ghost" size="icon" className="xl:hidden" onClick={() => setSearchOpen(true)} aria-label="Search products">
              <Search />
            </Button>
            <ThemeToggle />
            <Button asChild variant="whatsapp" size="sm" className="ml-1 hidden h-10 px-4 sm:inline-flex">
              <a href={whatsappUrl("Hello OQURAA COMPUTER, I have a product inquiry.")} target="_blank" rel="noreferrer">
                <WhatsAppIcon className="size-4" /> WhatsApp
              </a>
            </Button>
          </div>
          <div
            aria-hidden
            className={cn(
              "pointer-events-none absolute inset-x-0 -bottom-px h-0.5 origin-left bg-brand transition-transform duration-500",
              loading ? "scale-x-75" : "scale-x-0",
            )}
          />
        </div>
      </header>
      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
}
