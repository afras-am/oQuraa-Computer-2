import { SITE } from "@/lib/site";

export function AnnouncementBar() {
  return (
    <div className="border-b bg-surface text-xs text-muted-foreground">
      <div className="container-page flex h-9 items-center justify-between gap-4">
        <p className="accent-tick truncate">{SITE.announcement}</p>
        <a href={`tel:${SITE.hotline.tel}`} className="hidden shrink-0 font-semibold text-foreground sm:inline link-underline">
          Call {SITE.hotline.display}
        </a>
      </div>
    </div>
  );
}
