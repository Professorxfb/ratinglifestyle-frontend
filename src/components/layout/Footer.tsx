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

export default function Footer() {
  return (
    <footer className="border-t border-line bg-charcoal">
      <div className="container-luxe grid grid-cols-1 gap-10 py-16 sm:grid-cols-2 lg:grid-cols-4">
        {/* Brand */}
        <div>
          <span className="font-logo text-xl tracking-luxe text-ink">
            RUPKOTHA <span className="text-gold">TRENDZ</span>
          </span>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">
            Premium fashion for Men, Women & Kids. Crafted in Bangladesh, designed to make
            every moment a statement.
          </p>
          <div className="mt-5 flex gap-3">
            {[
              { label: "FB", href: SITE.social.facebook },
              { label: "IG", href: SITE.social.instagram },
              { label: "YT", href: SITE.social.youtube },
              { label: "TT", href: SITE.social.tiktok },
            ].map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-xs text-ink/70 transition-colors hover:border-gold hover:text-gold"
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>

        {/* Quick links */}
        <div>
          <h3 className="eyebrow mb-4">Quick Links</h3>
          <ul className="space-y-2.5">
            {quickLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-sm text-muted transition-colors hover:text-gold">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Customer service */}
        <div>
          <h3 className="eyebrow mb-4">Customer Service</h3>
          <ul className="space-y-2.5">
            {serviceLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-sm text-muted transition-colors hover:text-gold">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="eyebrow mb-4">Get in Touch</h3>
          <ul className="space-y-3 text-sm text-muted">
            <li>{SITE.address}</li>
            <li>
              <a href={`tel:${SITE.phone}`} className="hover:text-gold">
                {SITE.phone}
              </a>
            </li>
            <li>
              <a href={`mailto:${SITE.email}`} className="hover:text-gold">
                {SITE.email}
              </a>
            </li>
          </ul>
          <form className="mt-5">
            <p className="mb-2 text-xs uppercase tracking-luxe text-ink/70">Newsletter</p>
            <div className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="w-full border border-line bg-obsidian px-3 py-2 text-sm text-ink placeholder:text-muted focus:border-gold focus:outline-none"
              />
              <button
                type="submit"
                className="bg-gold-gradient px-4 text-sm font-semibold text-obsidian"
              >
                Join
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Payments + copyright */}
      <div className="border-t border-line">
        <div className="container-luxe flex flex-col items-center justify-between gap-4 py-6 sm:flex-row">
          <p className="text-xs text-muted">
            © {2026} {SITE.name}. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-2">
            {payments.map((p) => (
              <span
                key={p}
                className="rounded-sm border border-line px-2.5 py-1 text-[10px] uppercase tracking-wide text-muted"
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
