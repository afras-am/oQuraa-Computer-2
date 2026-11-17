import { Link } from "@tanstack/react-router";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { CategorySummary } from "@/lib/catalog-types";
import { CATEGORY_GROUPS } from "@/lib/site";
import { cn } from "@/lib/utils";

export function MegaMenu({ categories, pathname }: { categories: CategorySummary[]; pathname: string }) {
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onClick = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  const enter = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(true);
  };
  const leave = () => {
    closeTimer.current = setTimeout(() => setOpen(false), 140);
  };

  const active = pathname.startsWith("/categor");
  const featured = categories.find((c) => c.slug === "gaming-laptop");

  return (
    <div
      ref={wrapRef}
      onMouseEnter={enter}
      onMouseLeave={leave}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setOpen(false);
      }}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-controls="mega-menu"
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "inline-flex h-16 items-center gap-1 px-3 text-sm font-medium transition-colors hover:text-foreground",
          active || open ? "text-foreground" : "text-muted-foreground",
        )}
      >
        Categories
        <ChevronDown className={cn("size-3.5 transition-transform duration-200", open && "rotate-180")} />
      </button>
      <div
        id="mega-menu"
        hidden={!open}
        className="absolute inset-x-0 top-full border-y bg-popover shadow-pop animate-in fade-in-0 slide-in-from-top-1 duration-200"
      >
        <div className="container-page grid grid-cols-12 gap-8 py-10">
          {CATEGORY_GROUPS.map((g) => (
            <div key={g.key} className="col-span-3">
              <p className="eyebrow mb-4">{g.label}</p>
              <ul className="space-y-0.5">
                {categories
                  .filter((c) => c.group === g.key && !c.parent)
                  .map((c) => (
                    <li key={c.slug}>
                      <Link
                        to="/category/$slug"
                        params={{ slug: c.slug }}
                        className="group flex items-baseline justify-between rounded-md px-2 py-1.5 -mx-2 hover:bg-accent"
                      >
                        <span className="font-medium">{c.name}</span>
                        <span className="tabular text-xs text-muted-foreground">{c.count}</span>
                      </Link>
                      {c.children.map((ch) => (
                        <Link
                          key={ch.slug}
                          to="/category/$slug"
                          params={{ slug: ch.slug }}
                          className="-mx-2 flex items-baseline justify-between rounded-md py-1 pl-6 pr-2 text-sm text-muted-foreground hover:bg-accent hover:text-foreground"
                        >
                          <span>{ch.name}</span>
                          <span className="tabular text-xs">{categories.find((x) => x.slug === ch.slug)?.count}</span>
                        </Link>
                      ))}
                    </li>
                  ))}
              </ul>
            </div>
          ))}
          {featured && (
            <Link
              to="/category/$slug"
              params={{ slug: featured.slug }}
              className="group col-span-3 flex flex-col justify-between overflow-hidden rounded-xl border bg-surface p-5"
            >
              <div>
                <p className="eyebrow">Spotlight</p>
                <p className="text-subhead mt-2">{featured.name}s</p>
                <p className="mt-1 text-sm text-muted-foreground">{featured.count} models with RTX graphics</p>
              </div>
              {featured.image && (
                <div className="image-well mt-4 aspect-[4/3] overflow-hidden rounded-lg">
                  <img src={featured.image} alt="" className="size-full object-contain p-4 transition-transform duration-300 group-hover:scale-[1.03]" loading="lazy" />
                </div>
              )}
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold">
                Explore <ArrowUpRight className="size-4" />
              </span>
            </Link>
          )}
          <div className="col-span-12 flex items-center justify-between border-t pt-5 text-sm">
            <span className="text-muted-foreground">{categories.length} categories · prices in LKR</span>
            <Link to="/categories" className="font-semibold link-underline">
              View all categories
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
