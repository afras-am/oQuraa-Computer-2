import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export interface FaqItem {
  q: string;
  a: string;
}

export function FAQAccordion({ items }: { items: FaqItem[] }) {
  return (
    <Accordion type="single" collapsible className="border-t">
      {items.map((it, i) => (
        <AccordionItem key={it.q} value={`q${i}`}>
          <AccordionTrigger className="py-5 text-left text-base font-semibold hover:no-underline">
            <span className="flex gap-4">
              <span className="tabular w-6 shrink-0 text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
              {it.q}
            </span>
          </AccordionTrigger>
          <AccordionContent className="pb-5 pl-10 text-[0.95rem] leading-relaxed text-muted-foreground">{it.a}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

export function faqJsonLd(items: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((i) => ({ "@type": "Question", name: i.q, acceptedAnswer: { "@type": "Answer", text: i.a } })),
  };
}
