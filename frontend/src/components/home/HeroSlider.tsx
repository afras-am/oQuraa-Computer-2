import { Link } from "@tanstack/react-router";
import { ArrowRight, Pause, Play } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface HeroSlide {
  eyebrow: string;
  title: string;
  body: string;
  image: string;
  imageAlt: string;
  note?: string;
  link: { label: string; slug: string };
}

const DURATION = 7000;

export function HeroSlider({ slides }: { slides: HeroSlide[] }) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    if (paused || reduced) return;
    const t = setTimeout(() => setI((x) => (x + 1) % slides.length), DURATION);
    return () => clearTimeout(t);
  }, [i, paused, reduced, slides.length]);

  const s = slides[i]!;
  return (
    <section aria-roledescription="carousel" aria-label="Featured" className="relative border-b">
      <div className="container-page grid items-center gap-10 py-10 md:py-14 lg:grid-cols-12 lg:gap-12 lg:py-16">
        <div className="order-2 lg:order-1 lg:col-span-5">
          <div key={i} className="animate-fade-up">
            <p className="eyebrow accent-tick">{s.eyebrow}</p>
            <h1 className="text-display mt-6">{s.title}</h1>
            <p className="mt-6 max-w-md text-[1.05rem] text-muted-foreground">{s.body}</p>
            {s.note && <p className="tabular mt-4 text-sm font-semibold">{s.note}</p>}
          </div>
          <div className="mt-9 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link to="/products">
                Explore products <ArrowRight />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/categories">Browse categories</Link>
            </Button>
          </div>
          <div className="mt-12 flex items-center gap-4">
            {slides.map((sl, n) => (
              <button
                key={sl.title}
                type="button"
                onClick={() => setI(n)}
                aria-label={`Show slide ${n + 1}: ${sl.eyebrow}`}
                aria-current={n === i}
                className="group flex flex-1 flex-col gap-2 text-left"
              >
                <span className="tabular text-xs font-semibold text-muted-foreground group-aria-[current=true]:text-foreground">
                  {String(n + 1).padStart(2, "0")}
                </span>
                <span className="relative h-0.5 w-full overflow-hidden bg-border">
                  {n === i && (
                    <span
                      key={`${i}-${paused}`}
                      className={cn("absolute inset-0 bg-brand", !paused && !reduced && "animate-progress")}
                      style={!paused && !reduced ? { animationDuration: `${DURATION}ms` } : undefined}
                    />
                  )}
                </span>
              </button>
            ))}
            <button
              type="button"
              onClick={() => setPaused((p) => !p)}
              aria-label={paused ? "Play slideshow" : "Pause slideshow"}
              className="grid size-8 shrink-0 place-items-center rounded-md border text-muted-foreground hover:text-foreground"
            >
              {paused ? <Play className="size-3.5" /> : <Pause className="size-3.5" />}
            </button>
          </div>
        </div>
        <div className="order-1 lg:order-2 lg:col-span-7">
          <Link
            to="/category/$slug"
            params={{ slug: s.link.slug }}
            className="group relative block aspect-[16/10] overflow-hidden rounded-2xl border bg-inverse"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            {slides.map((sl, n) => (
              <img
                key={sl.image}
                src={sl.image}
                alt={n === i ? sl.imageAlt : ""}
                aria-hidden={n !== i}
                width={1920}
                height={1088}
                loading={n === 0 ? "eager" : "lazy"}
                className={cn(
                  "absolute inset-0 size-full object-cover transition-[opacity,transform] duration-700 ease-out",
                  n === i ? "scale-100 opacity-100" : "scale-[1.03] opacity-0",
                )}
              />
            ))}
            <span className="absolute bottom-4 right-4 inline-flex items-center gap-2 rounded-md bg-background/90 px-3 py-2 text-sm font-semibold backdrop-blur">
              {s.link.label} <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
