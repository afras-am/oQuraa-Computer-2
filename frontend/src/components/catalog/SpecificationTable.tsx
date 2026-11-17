import type { SpecGroup } from "@/lib/catalog-types";

export function SpecificationTable({ groups }: { groups: SpecGroup[] }) {
  if (!groups.length) return <p className="text-sm text-muted-foreground">Detailed specifications are listed in the description below.</p>;
  return (
    <div className="divide-y rounded-xl border">
      {groups.map((g) => (
        <div key={g.group} className="grid gap-2 p-5 md:grid-cols-[180px_1fr] md:gap-6">
          <h3 className="eyebrow pt-1">{g.group}</h3>
          <dl className="divide-y">
            {g.rows.map((r) => (
              <div key={r.key} className="grid grid-cols-[minmax(120px,40%)_1fr] gap-4 py-2.5 text-sm first:pt-0 last:pb-0">
                <dt className="text-muted-foreground">{r.label}</dt>
                <dd className="font-medium">{r.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      ))}
    </div>
  );
}
