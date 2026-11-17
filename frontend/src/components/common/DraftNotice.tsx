/** Marks copy that is awaiting client approval, so placeholder wording is never mistaken for policy. */
export function DraftNotice({ children }: { children?: React.ReactNode }) {
  return (
    <p className="mb-8 rounded-lg border border-dashed px-4 py-3 text-xs text-muted-foreground">
      {children ?? "Draft wording — awaiting approval from OQURAA COMPUTER before publication."}
    </p>
  );
}
