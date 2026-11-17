import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function SectionHeading({
  index,
  eyebrow,
  title,
  description,
  action,
  className,
}: {
  index?: string;
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between", className)}>
      <div className="max-w-2xl">
        {(index || eyebrow) && (
          <p className="eyebrow mb-4 flex items-center gap-3">
            {index && <span className="tabular text-foreground">{index}</span>}
            {index && eyebrow && <span aria-hidden className="h-px w-8 bg-border-strong" />}
            {eyebrow}
          </p>
        )}
        <h2 className="text-section">{title}</h2>
        {description && <p className="mt-4 max-w-xl text-muted-foreground">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function SectionLink({ to, params, children }: { to: string; params?: Record<string, string>; children: ReactNode }) {
  return (
    <Link
      to={to as "/"}
      params={params as never}
      className="group inline-flex shrink-0 items-center gap-2 text-sm font-semibold"
    >
      <span className="link-underline">{children}</span>
      <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
    </Link>
  );
}
