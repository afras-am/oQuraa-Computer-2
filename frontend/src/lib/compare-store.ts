import { useSyncExternalStore } from "react";

/** Anonymous comparison list (max 4 product ids) persisted in localStorage. */
export const COMPARE_KEY = "oq-compare";
export const COMPARE_MAX = 4;

type Listener = () => void;
const listeners = new Set<Listener>();
let cache: string[] | null = null;
const EMPTY: string[] = [];

function read(): string[] {
  if (cache) return cache;
  try {
    const raw = JSON.parse(localStorage.getItem(COMPARE_KEY) ?? "[]");
    cache = Array.isArray(raw) ? raw.filter((x): x is string => typeof x === "string").slice(0, COMPARE_MAX) : [];
  } catch {
    cache = [];
  }
  return cache;
}

function write(ids: string[]) {
  cache = ids.slice(0, COMPARE_MAX);
  try {
    localStorage.setItem(COMPARE_KEY, JSON.stringify(cache));
  } catch {
    /* storage unavailable */
  }
  listeners.forEach((l) => l());
}

function subscribe(l: Listener) {
  listeners.add(l);
  const onStorage = (e: StorageEvent) => {
    if (e.key === COMPARE_KEY) {
      cache = null;
      l();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(l);
    window.removeEventListener("storage", onStorage);
  };
}

/** Pure helpers (exported for tests). */
export function addId(ids: string[], id: string): { ids: string[]; added: boolean; full: boolean } {
  if (ids.includes(id)) return { ids, added: false, full: false };
  if (ids.length >= COMPARE_MAX) return { ids, added: false, full: true };
  return { ids: [...ids, id], added: true, full: false };
}

export function replaceId(ids: string[], oldId: string, newId: string): string[] {
  if (ids.includes(newId)) return ids;
  return ids.map((x) => (x === oldId ? newId : x));
}

export const compareStore = {
  get: read,
  add(id: string) {
    const r = addId(read(), id);
    if (r.added) write(r.ids);
    return r;
  },
  remove(id: string) {
    write(read().filter((x) => x !== id));
  },
  replace(oldId: string, newId: string) {
    write(replaceId(read(), oldId, newId));
  },
  toggle(id: string) {
    const ids = read();
    if (ids.includes(id)) {
      write(ids.filter((x) => x !== id));
      return { added: false, full: false, removed: true };
    }
    return { ...compareStore.add(id), removed: false };
  },
  clear() {
    write([]);
  },
};

export function useCompareIds(): string[] {
  return useSyncExternalStore(subscribe, read, () => EMPTY);
}
