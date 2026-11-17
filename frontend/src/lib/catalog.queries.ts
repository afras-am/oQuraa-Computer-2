import { queryOptions } from "@tanstack/react-query";
import {
  getBrands,
  getCategories,
  getCompare,
  getHome,
  getProduct,
  listProducts,
  searchSuggest,
} from "./catalog.functions";
import type { ListingQuery } from "./listing-search";

const FIVE_MIN = 5 * 60_000;

export const homeQuery = () => queryOptions({ queryKey: ["home"], queryFn: () => getHome(), staleTime: FIVE_MIN });

export const categoriesQuery = () =>
  queryOptions({ queryKey: ["categories"], queryFn: () => getCategories(), staleTime: FIVE_MIN });

export const brandsQuery = () => queryOptions({ queryKey: ["brands"], queryFn: () => getBrands(), staleTime: FIVE_MIN });

export const listingQuery = (q: ListingQuery) =>
  queryOptions({ queryKey: ["products", q], queryFn: () => listProducts({ data: q }), staleTime: 60_000 });

export const productQuery = (slug: string) =>
  queryOptions({ queryKey: ["product", slug], queryFn: () => getProduct({ data: { slug } }), staleTime: 60_000 });

export const suggestQuery = (q: string) =>
  queryOptions({
    queryKey: ["suggest", q],
    queryFn: () => searchSuggest({ data: { q } }),
    staleTime: 60_000,
    enabled: q.trim().length >= 2,
  });

export const compareQuery = (ids: string[]) =>
  queryOptions({
    queryKey: ["compare", ids],
    queryFn: () => getCompare({ data: { ids } }),
    staleTime: 60_000,
    enabled: ids.length > 0,
  });
