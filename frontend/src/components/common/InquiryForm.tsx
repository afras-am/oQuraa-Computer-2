import { zodResolver } from "@hookform/resolvers/zod";
import { Send } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { WhatsAppIcon } from "@/components/site/WhatsAppIcon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SITE, whatsappUrl } from "@/lib/site";
import { cn } from "@/lib/utils";

export const inquirySchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(80),
  phone: z
    .string()
    .trim()
    .regex(/^(\+?94|0)?\s?\d{2}[\s-]?\d{3}[\s-]?\d{4}$/, "Enter a Sri Lankan phone number, e.g. 077 123 4567"),
  email: z.union([z.literal(""), z.string().trim().email("Enter a valid email").max(120)]),
  message: z.string().trim().min(5, "Tell us a little about what you need").max(1000),
  // Honeypot: real visitors never see or fill this.
  company: z.string().max(0).optional(),
});
export type Inquiry = z.infer<typeof inquirySchema>;

export function buildInquiryMessage(v: Inquiry, product?: { name: string; url?: string }) {
  return [
    `Hello ${SITE.name},`,
    product ? `I'm interested in: ${product.name}${product.url ? ` (${product.url})` : ""}` : null,
    "",
    v.message,
    "",
    `Name: ${v.name}`,
    `Phone: ${v.phone}`,
    v.email ? `Email: ${v.email}` : null,
  ]
    .filter((l) => l !== null)
    .join("\n");
}

/**
 * Inquiry form. Until the admin inquiries inbox exists, a validated inquiry is
 * handed to WhatsApp as a pre-filled message to the business number.
 */
export function InquiryForm({
  product,
  compact,
  className,
}: {
  product?: { name: string; slug: string };
  compact?: boolean;
  className?: string;
}) {
  const form = useForm<Inquiry>({
    resolver: zodResolver(inquirySchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      message: product ? `Please share availability and the final price for ${product.name}.` : "",
      company: "",
    },
  });
  const { register, handleSubmit, formState } = form;
  const errors = formState.errors;

  const onSubmit = (v: Inquiry) => {
    if (v.company) return;
    const url = product ? `${window.location.origin}/product/${product.slug}` : undefined;
    const msg = buildInquiryMessage(v, product ? { name: product.name, ...(url ? { url } : {}) } : undefined);
    window.open(whatsappUrl(msg), "_blank", "noopener,noreferrer");
    toast.success("Opening WhatsApp", { description: "Your inquiry is ready to send — just press send in WhatsApp." });
    form.reset({ ...form.getValues(), message: "" });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className={cn("grid gap-4", className)}>
      <div className={cn("grid gap-4", !compact && "sm:grid-cols-2")}>
        <Field id="inq-name" label="Name" error={errors.name?.message}>
          <Input id="inq-name" autoComplete="name" aria-invalid={!!errors.name} {...register("name")} />
        </Field>
        <Field id="inq-phone" label="Phone" error={errors.phone?.message}>
          <Input id="inq-phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="07X XXX XXXX" aria-invalid={!!errors.phone} {...register("phone")} />
        </Field>
      </div>
      <Field id="inq-email" label="Email (optional)" error={errors.email?.message}>
        <Input id="inq-email" type="email" autoComplete="email" aria-invalid={!!errors.email} {...register("email")} />
      </Field>
      <Field id="inq-message" label="How can we help?" error={errors.message?.message}>
        <Textarea id="inq-message" rows={compact ? 3 : 4} aria-invalid={!!errors.message} {...register("message")} />
      </Field>
      <input type="text" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" {...register("company")} />
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-muted-foreground">Sends via WhatsApp to {SITE.hotline.display}.</p>
        <Button type="submit" size="lg" disabled={formState.isSubmitting}>
          <WhatsAppIcon className="size-4" /> Send inquiry <Send className="hidden" />
        </Button>
      </div>
    </form>
  );
}

function Field({ id, label, error, children }: { id: string; label: string; error?: string | undefined; children: React.ReactNode }) {
  return (
    <div className="grid gap-1.5">
      <Label htmlFor={id} className="text-xs font-semibold uppercase tracking-[0.1em] text-muted-foreground">
        {label}
      </Label>
      {children}
      {error && (
        <p role="alert" className="text-xs text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
