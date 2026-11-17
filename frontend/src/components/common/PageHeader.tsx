import type { ReactNode } from "react";
import { Breadcrumbs, type Crumb } from "./Breadcrumbs";

export function PageHeader({
  crumbs,
  eyebrow,
  title,
  description,
  aside,
}: {
  crumbs: Crumb[];
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  aside?: ReactNode;
}) {
  return (
    <section className="border-b">
      <div className="container-page py-10 md:py-14">
        <Breadcrumbs items={crumbs} />
        <div className="mt-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl animate-fade-up">
            {eyebrow && <p className="eyebrow accent-tick mb-4">{eyebrow}</p>}
            <h1 className="text-section">{title}</h1>
            {description && <p className="mt-4 max-w-2xl text-muted-foreground">{description}</p>}
          </div>
          {aside}
        </div>
      </div>
    </section>
  );
}
