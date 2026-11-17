import { SITE } from "./site";
import type { FaqItem } from "@/components/common/FAQAccordion";

/**
 * Editable site copy. These answers describe how this website works; business policies
 * (returns, delivery, payment terms) must come from the client before they are published.
 */
export const FAQ: FaqItem[] = [
  {
    q: "Can I buy products directly on this website?",
    a: "No. This website is a product catalogue. Browse and compare products here, then contact us by WhatsApp or phone to confirm availability, pricing and how to purchase.",
  },
  {
    q: "Are the prices final?",
    a: "All prices are listed in Sri Lankan Rupees (LKR). Prices and stock can change, so please confirm the current price with our team before you buy.",
  },
  {
    q: "How do I check whether a product is in stock?",
    a: "Each product shows its stock status. For the latest availability, send an inquiry from the product page or message us on WhatsApp.",
  },
  {
    q: "What warranty comes with a product?",
    a: "The warranty period is shown on every product page (for example 1, 2 or 3 years). Coverage details depend on the manufacturer and product — ask us for the terms of a specific item.",
  },
  {
    q: "How do I compare products?",
    a: "Use the compare button on any product card or product page. You can compare up to four products side by side, and the comparison stays saved on your device.",
  },
  {
    q: "How can I contact OQURAA COMPUTER?",
    a: `Call ${SITE.hotline.display} or send us a message on WhatsApp. You can also use the inquiry form on the contact page.`,
  },
];
