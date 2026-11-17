import { Link, useRouterState } from "@tanstack/react-router";
import { Columns3 } from "lucide-react";
import { useCompareIds } from "@/lib/compare-store";
import { whatsappUrl } from "@/lib/site";
import { WhatsAppIcon } from "./WhatsAppIcon";

/** Floating WhatsApp action plus a compare shortcut once products are selected. */
export function FloatingActions() {
  const ids = useCompareIds();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-3">
      {ids.length > 0 && pathname !== "/compare" && (
        <Link
          to="/compare"
          className="inline-flex h-12 items-center gap-2 rounded-full bg-inverse pl-4 pr-5 text-sm font-semibold text-inverse-foreground shadow-pop animate-fade-up"
        >
          <Columns3 className="size-4" />
          Compare
          <span className="tabular grid size-6 place-items-center rounded-full bg-brand text-xs text-brand-foreground">{ids.length}</span>
        </Link>
      )}
      <a
        href={whatsappUrl("Hello OQURAA COMPUTER, I have a product inquiry.")}
        target="_blank"
        rel="noreferrer"
        aria-label="Chat with us on WhatsApp"
        className="grid size-14 place-items-center rounded-full bg-whatsapp text-brand-foreground shadow-pop transition-transform duration-200 hover:scale-105"
      >
        <WhatsAppIcon className="size-7" />
      </a>
    </div>
  );
}
