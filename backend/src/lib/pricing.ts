/**
 * Money is stored as integer LKR minor units (cents) — never floats.
 * All arithmetic here is integer-safe; only display formatting rounds to rupees.
 */
export type Minor = number;

export function toRupees(minor: Minor): number {
  return Math.round(minor / 100);
}

export function rupeesToMinor(rupees: number): Minor {
  return Math.round(rupees) * 100;
}

function groupThousands(n: number) {
  return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/** "LKR 239,500" — deterministic (no Intl) so server and client render identically. */
export function formatLKR(minor: Minor): string {
  return `LKR ${groupThousands(toRupees(minor))}`;
}

/** A sale price counts only when it is positive and strictly lower than the regular price. */
export function validSalePrice(regular: Minor, sale: Minor | null | undefined): Minor | null {
  if (sale == null || regular <= 0) return null;
  return sale > 0 && sale < regular ? sale : null;
}

export function effectivePrice(regular: Minor, sale: Minor | null | undefined): Minor {
  return validSalePrice(regular, sale) ?? regular;
}

/** Whole-percent discount derived from validated monetary values. */
export function discountPercent(regular: Minor, sale: Minor | null | undefined): number {
  const s = validSalePrice(regular, sale);
  if (s == null) return 0;
  return Math.round(((regular - s) * 100) / regular);
}

export function savings(regular: Minor, sale: Minor | null | undefined): Minor {
  const s = validSalePrice(regular, sale);
  return s == null ? 0 : regular - s;
}

/** Price 0 means the listing has no public price. */
export function hasPublicPrice(regular: Minor) {
  return regular > 0;
}
