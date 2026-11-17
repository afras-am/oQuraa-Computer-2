/**
 * Category-specific specification templates.
 * One definition powers: product spec tables, listing filters and the compare table.
 * (Admin-editable templates arrive with the backend; keep keys stable.)
 */
export interface SpecField {
  key: string;
  label: string;
  group: string;
  filterable?: boolean;
  comparable?: boolean;
}

const COVERAGE: SpecField = { key: "warranty", label: "Warranty", group: "Coverage", filterable: true, comparable: true };

const COMPUTER: SpecField[] = [
  { key: "cpu", label: "Processor", group: "Performance", filterable: true, comparable: true },
  { key: "cpuGen", label: "CPU generation", group: "Performance", filterable: true, comparable: true },
  { key: "ram", label: "Memory (RAM)", group: "Performance", filterable: true, comparable: true },
  { key: "storage", label: "Storage", group: "Performance", filterable: true, comparable: true },
  { key: "gpu", label: "Graphics", group: "Performance", filterable: true, comparable: true },
  { key: "vram", label: "Graphics memory", group: "Performance", comparable: true },
  { key: "display", label: "Display size", group: "Display", filterable: true, comparable: true },
  { key: "os", label: "Operating system", group: "Software", filterable: true, comparable: true },
  { key: "office", label: "Productivity software", group: "Software", comparable: true },
  { key: "includes", label: "Bundle includes", group: "Package", comparable: true },
  COVERAGE,
];

export const SPEC_TEMPLATES: Record<string, SpecField[]> = {
  laptop: COMPUTER,
  "gaming-laptop": COMPUTER,
  "branded-computers": COMPUTER,
  "graphics-card": [
    { key: "gpuChip", label: "GPU", group: "Graphics", filterable: true, comparable: true },
    { key: "vram", label: "Video memory", group: "Graphics", filterable: true, comparable: true },
    { key: "memoryType", label: "Memory type", group: "Graphics", filterable: true, comparable: true },
    { key: "edition", label: "Edition", group: "Graphics", comparable: true },
    COVERAGE,
  ],
  processor: [
    { key: "family", label: "Family", group: "Processor", filterable: true, comparable: true },
    { key: "model", label: "Model", group: "Processor", comparable: true },
    { key: "generation", label: "Generation", group: "Processor", filterable: true, comparable: true },
    { key: "socket", label: "Socket", group: "Platform", filterable: true, comparable: true },
    { key: "integratedGraphics", label: "Integrated graphics", group: "Platform", filterable: true, comparable: true },
    COVERAGE,
  ],
  motherboard: [
    { key: "chipset", label: "Chipset", group: "Platform", filterable: true, comparable: true },
    { key: "socket", label: "CPU socket", group: "Platform", filterable: true, comparable: true },
    { key: "memory", label: "Memory support", group: "Platform", filterable: true, comparable: true },
    { key: "formFactor", label: "Form factor", group: "Platform", filterable: true, comparable: true },
    { key: "wifi", label: "Built-in Wi-Fi", group: "Connectivity", filterable: true, comparable: true },
    COVERAGE,
  ],
  ram: [
    { key: "ddr", label: "DDR generation", group: "Memory", filterable: true, comparable: true },
    { key: "capacity", label: "Capacity", group: "Memory", filterable: true, comparable: true },
    { key: "formFactor", label: "Form factor", group: "Memory", filterable: true, comparable: true },
    { key: "speed", label: "Speed", group: "Memory", comparable: true },
    { key: "rgb", label: "RGB lighting", group: "Memory", comparable: true },
    COVERAGE,
  ],
  ssd: [
    { key: "capacity", label: "Capacity", group: "Storage", filterable: true, comparable: true },
    { key: "interface", label: "Interface", group: "Storage", filterable: true, comparable: true },
    { key: "formFactor", label: "Form factor", group: "Storage", filterable: true, comparable: true },
    { key: "readSpeed", label: "Sequential read", group: "Storage", comparable: true },
    COVERAGE,
  ],
  monitors: [
    { key: "size", label: "Screen size", group: "Display", filterable: true, comparable: true },
    { key: "resolution", label: "Resolution", group: "Display", filterable: true, comparable: true },
    { key: "panel", label: "Panel", group: "Display", filterable: true, comparable: true },
    { key: "curved", label: "Curved", group: "Display", comparable: true },
    COVERAGE,
  ],
  projector: [{ key: "technology", label: "Technology", group: "Projection", filterable: true, comparable: true }, COVERAGE],
  printer: [
    { key: "technology", label: "Technology", group: "Printing", filterable: true, comparable: true },
    { key: "connectivity", label: "Connectivity", group: "Printing", comparable: true },
    COVERAGE,
  ],
  ups: [{ key: "capacity", label: "Capacity", group: "Power", filterable: true, comparable: true }, COVERAGE],
  casing: [
    { key: "formFactor", label: "Form factor", group: "Chassis", filterable: true, comparable: true },
    { key: "sidePanel", label: "Side panel", group: "Chassis", comparable: true },
    COVERAGE,
  ],
  "mobile-wi-fi": [
    { key: "network", label: "Network", group: "Connectivity", filterable: true, comparable: true },
    { key: "model", label: "Model", group: "Connectivity", comparable: true },
    COVERAGE,
  ],
};

export function templateFor(category: string): SpecField[] {
  return SPEC_TEMPLATES[category] ?? [COVERAGE];
}

/** Ordered, de-duplicated comparable fields across several categories. */
export function comparableFields(categories: string[]): SpecField[] {
  const seen = new Set<string>();
  const out: SpecField[] = [];
  for (const c of categories) {
    for (const f of templateFor(c)) {
      if (f.comparable && !seen.has(f.key)) {
        seen.add(f.key);
        out.push(f);
      }
    }
  }
  return out;
}
