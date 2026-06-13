import Link from "next/link";
import { SITE } from "@/lib/site";

const quickLinks = [
  { label: "Shop All", href: "/shop" },
  { label: "New Arrivals", href: "/new-arrivals" },
  { label: "Deals & Offers", href: "/deals" },
  { label: "Men", href: "/shop/men" },
  { label: "Women", href: "/shop/women" },
  { label: "Kids", href: "/shop/kids" },
];

const serviceLinks = [
  { label: "Shipping Policy", href: "/shipping-policy" },
  { label: "Return Policy", href: "/return-policy" },
  { label: "Size Guide", href: "/size-guide" },
  { label: "FAQ", href: "/faq" },
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms & Conditions", href: "/terms-conditions" },
];

const payments = ["bKash", "Nagad", "Rocket", "VISA", "Mastercard", "COD"];

const socials = [
  { label: "Facebook", short: "f", href: SITE.social.facebook },
  { label: "Instagram", short: "ig", href: SITE.social.instagram },
  { label: "YouTube", short: "yt", href: SITE.social.youtube },
  { label: "TikTok", short: "tt", href: SITE.social.tiktok },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-line bg-charcoal">
      {/* faint gold glow at the top edge */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent" />

      <div className="container-luxe grid grid-cols-1 gap-12 py-20 sm:grid-cols-2 lg:grid-cols-4">
        {/* Brand */}
        <div>
          <span className="font-logo text-2xl tracking-luxe">
            <span className="text-gold-grad">RUPKOTHA TRENDZ</span>
          </span>
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-muted">
            Premium fashion for Men, Women & Kids. Crafted in Bangladesh, designed to make
            every moment a statement.
          </p>
          <div className="mt-6 flex gap-3">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                aria-label={s.label}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-xs uppercase text-muted transition-all duration-300 hover:scale-110 hover:border-gold hover:text-gold hover:shadow-gold"
              >
                {s.short}
              </a>
            ))}
          </div>
        </div>

        {/* Quick links */}
        <FooterCol title="Explore">
          {quickLinks.map((l) => (
            <FooterLink key={l.href} {...l} />
          ))}
        </FooterCol>

        {/* Customer service */}
        <FooterCol title="Customer Service">
          {serviceLinks.map((l) => (
            <FooterLink key={l.href} {...l} />
          ))}
        </FooterCol>

        {/* Contact */}
        <div>
          <h3 className="eyebrow mb-5">Get in Touch</h3>
          <div className="mb-4 h-px w-full bg-gradient-to-r from-gold/30 to-transparent" />
          <ul className="space-y-3 text-sm text-muted">
            <li>{SITE.address}</li>
            <li>
              <a href={`tel:${SITE.phone}`} className="transition-colors hover:text-gold">
                {SITE.phone}
              </a>
            </li>
            <li>
              <a href={`mailto:${SITE.email}`} className="transition-colors hover:text-gold">
                {SITE.email}
              </a>
            </li>
          </ul>
          <form className="mt-6">
            <p className="mb-2 text-xs uppercase tracking-luxe text-ink/70">Newsletter</p>
            <div className="flex gold-border-grad rounded-sm p-px">
              <input
                type="email"
                placeholder="Your email"
                className="w-full bg-transparent px-3 py-2.5 text-sm text-ink placeholder:text-muted focus:outline-none"
              />
              <button
                type="submit"
                className="bg-gold-gradient px-4 text-sm font-semibold text-obsidian transition-all hover:brightness-110"
              >
                Join
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Payments + copyright */}
      <div className="border-t border-line">
        <div className="container-luxe flex flex-col items-center justify-between gap-4 py-7 sm:flex-row">
          <p className="text-xs text-platinum/70">
            © {2026} {SITE.name}. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-2">
            {payments.map((p) => (
              <span
                key={p}
                className="rounded-sm border border-line px-2.5 py-1 text-[10px] uppercase tracking-wide text-muted transition-colors duration-300 hover:border-gold/50 hover:text-gold"
              >
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="eyebrow mb-5">{title}</h3>
      <div className="mb-4 h-px w-full bg-gradient-to-r from-gold/30 to-transparent" />
      <ul className="space-y-3">{children}</ul>
    </div>
  );
}

function FooterLink({ label, href }: { label: string; href: string }) {
  return (
    <li>
      <Link
        href={href}
        className="group inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-gold"
      >
        <span className="h-px w-0 bg-gold transition-all duration-300 group-hover:w-3" />
        {label}
      </Link>
    </li>
  );
}
