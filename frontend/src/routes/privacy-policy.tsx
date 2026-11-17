import { createFileRoute } from "@tanstack/react-router";
import { DraftNotice } from "@/components/common/DraftNotice";
import { PageHeader } from "@/components/common/PageHeader";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/privacy-policy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — OQURAA COMPUTER" },
      { name: "description", content: "How the OQURAA COMPUTER website handles information you share through inquiries." },
      { property: "og:title", content: "Privacy Policy — OQURAA COMPUTER" },
      { property: "og:description", content: "Information handling on the OQURAA COMPUTER website." },
      { property: "og:url", content: "/privacy-policy" },
    ],
    links: [{ rel: "canonical", href: "/privacy-policy" }],
  }),
  component: () => (
    <>
      <PageHeader crumbs={[{ label: "Privacy Policy" }]} eyebrow="Legal" title="Privacy Policy" />
      <article className="container-page prose-page py-16">
        <DraftNotice />
        <h2>Information you share</h2>
        <p>When you send an inquiry, the details you enter (name, phone, optional email and message) are placed into a WhatsApp message that you choose to send to {SITE.name}.</p>
        <h2>Information stored on your device</h2>
        <ul>
          <li>Your colour theme choice (light or dark).</li>
          <li>Products you add to the compare list.</li>
        </ul>
        <p>These stay in your browser and can be cleared at any time.</p>
        <h2>Contact</h2>
        <p>Questions about privacy: call {SITE.hotline.display}.</p>
      </article>
    </>
  ),
});
