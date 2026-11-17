import type { Minor } from "./pricing";

export interface ProductImage {
  src: string;
  thumb: string;
  alt: string;
}

/** Raw record as stored in the catalogue snapshot (mirrors the planned MongoDB `products` document). */
export interface ProductRecord {
  id: string;
  slug: string;
  name: string;
  brand: string | null;
  sku: string | null;
  categories: string[];
  category: string;
  price: Minor;
  salePrice: Minor | null;
  inStock: boolean;
  stockQty: number | null;
  images: ProductImage[];
  highlights: string[];
  details: string[];
  specs: Record<string, string>;
  warrantyYears: number | null;
  sourceUrl: string;
}

export interface CategoryRecord {
  slug: string;
  name: string;
  description: string | null;
  parent: string | null;
  group: string | null;
  order: number;
  image: string | null;
}

export interface BrandRecord {
  slug: string;
  name: string;
}

export interface CatalogSnapshot {
  source: string;
  snapshotDate: string;
  categories: CategoryRecord[];
  brands: BrandRecord[];
  products: ProductRecord[];
}

export interface Ref {
  slug: string;
  name: string;
}

export interface ProductCard {
  id: string;
  slug: string;
  name: string;
  brand: Ref | null;
  category: Ref;
  price: Minor;
  salePrice: Minor | null;
  discount: number;
  inStock: boolean;
  stockQty: number | null;
  image: ProductImage | null;
  keySpecs: string[];
  warrantyYears: number | null;
}

export interface SpecRow {
  key: string;
  label: string;
  value: string;
}

export interface SpecGroup {
  group: string;
  rows: SpecRow[];
}

export interface ProductDetail extends ProductCard {
  sku: string | null;
  categories: Ref[];
  images: ProductImage[];
  highlights: string[];
  details: string[];
  specGroups: SpecGroup[];
}

export interface CategorySummary extends CategoryRecord {
  count: number;
  children: Ref[];
}

export interface BrandSummary extends BrandRecord {
  count: number;
  categories: Ref[];
}

export interface FacetValue {
  value: string;
  label: string;
  count: number;
}

export interface SpecFacet {
  key: string;
  label: string;
  values: FacetValue[];
}

export interface ListingResult {
  items: ProductCard[];
  total: number;
  page: number;
  pages: number;
  size: number;
  facets: {
    categories: FacetValue[];
    brands: FacetValue[];
    specs: SpecFacet[];
    price: { min: number; max: number };
    inStock: number;
    onSale: number;
  };
}

export interface SearchSuggestion {
  products: Pick<ProductCard, "id" | "slug" | "name" | "price" | "salePrice" | "image" | "category">[];
  categories: Ref[];
  brands: Ref[];
}

export interface CompareResult {
  products: ProductDetail[];
  rows: { key: string; label: string; values: string[]; differs: boolean }[];
}

export interface HomeData {
  stats: { products: number; categories: number; brands: number; inStock: number; maxWarranty: number };
  categories: CategorySummary[];
  featured: ProductCard[];
  latest: ProductCard[];
  offers: ProductCard[];
  laptops: ProductCard[];
  components: ProductCard[];
  brands: BrandSummary[];
  promos: {
    gamingLaptop: { from: Minor; product: ProductCard | null };
    proLaptop: { from: Minor; product: ProductCard | null };
    desktop: { from: Minor; product: ProductCard | null };
  };
}
