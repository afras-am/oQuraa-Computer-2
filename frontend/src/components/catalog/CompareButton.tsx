import { Columns3, Check } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { COMPARE_MAX, compareStore, useCompareIds } from "@/lib/compare-store";
import { cn } from "@/lib/utils";

export function CompareButton({
  id,
  name,
  variant = "icon",
  className,
}: {
  id: string;
  name: string;
  variant?: "icon" | "full";
  className?: string;
}) {
  const ids = useCompareIds();
  const selected = ids.includes(id);
  const onClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const r = compareStore.toggle(id);
    if (r.full) toast.error(`You can compare up to ${COMPARE_MAX} products`, { description: "Remove one from the compare list first." });
    else if (r.added) toast.success("Added to compare", { description: name });
    else if (r.removed) toast("Removed from compare", { description: name });
  };
  const label = selected ? "Remove from compare" : "Add to compare";
  if (variant === "full") {
    return (
      <Button type="button" variant="outline" size="lg" onClick={onClick} aria-pressed={selected} className={className}>
        {selected ? <Check /> : <Columns3 />} {selected ? "In compare list" : "Add to compare"}
      </Button>
    );
  }
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      aria-label={label}
      title={label}
      className={cn(
        "grid size-9 place-items-center rounded-md border bg-background/90 backdrop-blur transition-colors hover:border-foreground",
        selected && "border-brand bg-brand text-brand-foreground hover:border-brand",
        className,
      )}
    >
      {selected ? <Check className="size-4" /> : <Columns3 className="size-4" />}
    </button>
  );
}
