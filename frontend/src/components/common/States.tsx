import { useRouter } from "@tanstack/react-router";
import { AlertTriangle, PackageSearch } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";

export function EmptyState({ title, description, action }: { title: string; description?: ReactNode; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center rounded-xl border border-dashed px-6 py-16 text-center">
      <PackageSearch className="size-8 text-muted-foreground" />
      <h3 className="mt-4 text-lg font-semibold">{title}</h3>
      {description && <p className="mt-2 max-w-md text-sm text-muted-foreground">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

export function ErrorState({ error, title = "This section didn't load" }: { error?: unknown; title?: string }) {
  const router = useRouter();
  if (error) console.error(error);
  return (
    <div role="alert" className="container-page py-24">
      <div className="mx-auto flex max-w-md flex-col items-center text-center">
        <AlertTriangle className="size-8 text-warning" />
        <h2 className="mt-4 text-xl font-semibold">{title}</h2>
        <p className="mt-2 text-sm text-muted-foreground">Please try again. If it keeps happening, contact us on WhatsApp.</p>
        <Button className="mt-6" onClick={() => router.invalidate()}>
          Try again
        </Button>
      </div>
    </div>
  );
}

export function NotFoundState({ title = "We couldn't find that page", description }: { title?: string; description?: string }) {
  return (
    <div className="container-page py-28">
      <div className="mx-auto max-w-xl text-center">
        <p className="tabular text-[7rem] font-bold leading-none tracking-tighter text-brand">404</p>
        <h1 className="text-subhead mt-4">{title}</h1>
        <p className="mt-3 text-muted-foreground">
          {description ?? "The link may be out of date, or the product may no longer be listed."}
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild size="lg">
            <a href="/">Return home</a>
          </Button>
          <Button asChild variant="outline" size="lg">
            <a href="/products">Browse products</a>
          </Button>
        </div>
      </div>
    </div>
  );
}
