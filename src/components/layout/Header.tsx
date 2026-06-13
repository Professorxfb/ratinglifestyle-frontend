"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { clsx } from "clsx";
import { useCart } from "@/store/cart";
import { useWishlist } from "@/store/wishlist";
import { useAuth } from "@/store/auth";
import { categories } from "@/lib/mock-data";
import PromoStrip from "./PromoStrip";
import SearchBar from "./SearchBar";
import MobileMenu from "./MobileMenu";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  const cartCount = useCart((s) => s.itemCount());
  const openCart = useCart((s) => s.openCart);
  const wishCount = useWishlist((s) => s.count());
  const isAuthed = useAuth((s) => Boolean(s.token));

  useEffect(() => {
    setHydrated(true);
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="sticky top-0 z-50">
      <PromoStrip />
      <div
        className={clsx(
          "relative transition-all duration-500",
          scrolled
            ? "glass py-3 shadow-luxe"
            : "bg-transparent py-5",
        )}
      >
        <div className="container-luxe flex items-center justify-between gap-4">
          {/* Mobile hamburger */}
          <button
            className="text-ink transition-colors hover:text-gold lg:hidden"
            aria-label="Open menu"
            onClick={() => setMobileOpen(true)}
          >
            <BurgerIcon />
          </button>

          {/* Logo with gold shimmer on hover */}
          <Link
            href="/"
            className="group font-logo text-xl tracking-luxe text-ink sm:text-2xl"
          >
            RUPKOTHA{" "}
            <span className="text-gold-grad transition-all duration-500 group-hover:[background-position:200%_50%]">
              TRENDZ
            </span>
          </Link>

          {/* Desktop nav with mega menu */}
          <nav className="hidden items-center gap-8 lg:flex">
            <Link href="/shop" className="nav-link">
              Shop All
            </Link>
            {categories.map((cat) => (
              <div key={cat.id} className="group relative">
                <Link href={`/shop/${cat.slug}`} className="nav-link">
                  {cat.name}
                </Link>
                {/* Mega menu */}
                <div className="invisible absolute left-1/2 top-full w-56 -translate-x-1/2 pt-5 opacity-0 transition-all duration-300 group-hover:visible group-hover:opacity-100">
                  <div className="glass-panel rounded-sm p-5 shadow-luxe">
                    <p className="eyebrow mb-3">{cat.name}</p>
                    <ul className="space-y-2.5">
                      {cat.subcategories?.map((sub) => (
                        <li key={sub.id}>
                          <Link
                            href={`/shop/${cat.slug}/${sub.slug}`}
                            className="text-sm text-ink/70 transition-colors hover:text-gold"
                          >
                            {sub.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
            <Link href="/deals" className="nav-link text-gold">
              Sale
            </Link>
          </nav>

          {/* Action icons */}
          <div className="flex items-center gap-3 sm:gap-4">
            <IconButton label="Search" onClick={() => setSearchOpen(true)}>
              <SearchIcon />
            </IconButton>
            <IconLink href="/wishlist" label="Wishlist">
              <HeartIcon />
              {hydrated && wishCount > 0 && <Badge>{wishCount}</Badge>}
            </IconLink>
            <IconButton label="Cart" onClick={openCart}>
              <BagIcon />
              {hydrated && cartCount > 0 && <Badge>{cartCount}</Badge>}
            </IconButton>
            <Link
              href={hydrated && isAuthed ? "/account" : "/login"}
              aria-label="Account"
              className="relative hidden h-10 w-10 items-center justify-center rounded-full text-ink transition-all hover:text-gold hover:shadow-gold sm:flex"
            >
              <UserIcon />
              {hydrated && isAuthed && (
                <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-success" />
              )}
            </Link>
          </div>
        </div>

        {/* Shimmering gold bottom border */}
        <div
          className={clsx(
            "pointer-events-none absolute inset-x-0 bottom-0 h-px overflow-hidden transition-opacity duration-500",
            scrolled ? "opacity-100" : "opacity-0",
          )}
        >
          <span className="block h-full w-full bg-gradient-to-r from-transparent via-gold to-transparent" />
          <span className="absolute inset-y-0 left-0 w-1/3 animate-marquee-slow bg-gradient-to-r from-transparent via-gold-light to-transparent" />
        </div>
      </div>

      <SearchBar open={searchOpen} onClose={() => setSearchOpen(false)} />
      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </header>
  );
}

function IconButton({
  children,
  label,
  onClick,
}: {
  children: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      aria-label={label}
      onClick={onClick}
      className="relative flex h-10 w-10 items-center justify-center rounded-full text-ink transition-all duration-300 hover:text-gold hover:shadow-gold"
    >
      {children}
    </button>
  );
}

function IconLink({
  children,
  label,
  href,
}: {
  children: React.ReactNode;
  label: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      aria-label={label}
      className="relative flex h-10 w-10 items-center justify-center rounded-full text-ink transition-all duration-300 hover:text-gold hover:shadow-gold"
    >
      {children}
    </Link>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-gold-gradient px-1 text-[10px] font-bold text-obsidian">
      {children}
    </span>
  );
}

/* ── Inline icons (stroke = currentColor) ─────────────────────────── */
const ico = "h-5 w-5";
function SearchIcon() {
  return (
    <svg className={ico} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" strokeLinecap="round" />
    </svg>
  );
}
function HeartIcon() {
  return (
    <svg className={ico} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 21s-7.5-4.6-10-9.2C.5 8.5 2.2 5 5.5 5c2 0 3.3 1.2 4.5 2.6C11.2 6.2 12.5 5 14.5 5 17.8 5 19.5 8.5 18 11.8 15.5 16.4 12 21 12 21z" strokeLinejoin="round" />
    </svg>
  );
}
function BagIcon() {
  return (
    <svg className={ico} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M6 8h12l-1 12H7L6 8z" strokeLinejoin="round" />
      <path d="M9 8a3 3 0 0 1 6 0" strokeLinecap="round" />
    </svg>
  );
}
function UserIcon() {
  return (
    <svg className={ico} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4 3.6-7 8-7s8 3 8 7" strokeLinecap="round" />
    </svg>
  );
}
function BurgerIcon() {
  return (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
    </svg>
  );
}
