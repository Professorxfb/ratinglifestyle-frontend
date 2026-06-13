import type { Metadata } from "next";
import PageHeader from "@/components/ui/PageHeader";
import ContactForm from "@/components/info/ContactForm";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact Us",
  description: `Get in touch with ${SITE.name}. Order support, returns, wholesale enquiries and more.`,
};

const CHANNELS = [
  { label: "Email", value: SITE.email, href: `mailto:${SITE.email}` },
  { label: "Phone", value: SITE.phone, href: `tel:${SITE.phone.replace(/\s/g, "")}` },
  {
    label: "WhatsApp",
    value: SITE.whatsapp,
    href: `https://wa.me/${SITE.whatsapp.replace(/[^0-9]/g, "")}`,
  },
  { label: "Studio", value: SITE.address },
];

export default function ContactPage() {
  return (
    <>
      <PageHeader
        title="Contact Us"
        description="Questions about an order, a size, or a collaboration? We'd love to hear from you."
        crumbs={[{ label: "Home", href: "/" }, { label: "Contact" }]}
      />
      <div className="container-luxe grid gap-12 py-14 lg:grid-cols-[1fr_1.4fr]">
        {/* Info column */}
        <div className="space-y-8">
          <div>
            <p className="eyebrow">Reach us</p>
            <h2 className="mt-3 font-display text-2xl text-ink">Concierge support</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              Our team is available Saturday–Thursday, 10am–8pm (BST). We aim to reply to every
              message within 24 hours.
            </p>
          </div>
          <ul className="space-y-5">
            {CHANNELS.map((c) => (
              <li key={c.label}>
                <p className="text-xs uppercase tracking-wide text-gold">{c.label}</p>
                {c.href ? (
                  <a
                    href={c.href}
                    className="mt-1 block text-sm text-ink transition-colors hover:text-gold"
                  >
                    {c.value}
                  </a>
                ) : (
                  <p className="mt-1 text-sm text-ink/80">{c.value}</p>
                )}
              </li>
            ))}
          </ul>
          <div className="flex gap-4 text-xs uppercase tracking-wide">
            {Object.entries(SITE.social).map(([name, url]) => (
              <a
                key={name}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted transition-colors hover:text-gold"
              >
                {name}
              </a>
            ))}
          </div>
        </div>

        {/* Form column */}
        <div className="rounded-sm border border-line bg-card p-6 sm:p-8">
          <ContactForm />
        </div>
      </div>
    </>
  );
}
