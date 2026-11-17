/**
 * Site-wide business information.
 * Only verified details belong here. The hotline is published on oquraacomputer.lk;
 * WhatsApp uses the same number until the client confirms a dedicated one.
 * Email, address, opening hours and map are intentionally null until client-approved.
 */
export const SITE = {
  name: "OQURAA COMPUTER",
  shortName: "Oquraa Computer",
  tagline: "Laptops, gaming systems and components in Sri Lanka",
  country: "Sri Lanka",
  currency: "LKR",
  hotline: { display: "075 05 222 11", tel: "+94750522211" },
  whatsapp: { number: "94750522211" },
  email: null as string | null,
  address: null as string | null,
  openingHours: null as string | null,
  mapUrl: null as string | null,
  announcement: "Prices shown in LKR · Product inquiries: 075 05 222 11",
} as const;

export function whatsappUrl(message?: string) {
  const base = `https://wa.me/${SITE.whatsapp.number}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export const PRIMARY_NAV = [
  { label: "Home", to: "/" },
  { label: "Products", to: "/products" },
  { label: "Categories", to: "/categories", mega: true },
  { label: "Brands", to: "/brands" },
  { label: "Compare", to: "/compare" },
  { label: "Offers", to: "/offers" },
  { label: "About Us", to: "/about" },
  { label: "Contact", to: "/contact" },
] as const;

export const CATEGORY_GROUPS = [
  { key: "computers", label: "Computers" },
  { key: "components", label: "Components" },
  { key: "peripherals", label: "Peripherals & Power" },
] as const;
