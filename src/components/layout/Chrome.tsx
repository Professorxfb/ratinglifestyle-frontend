"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import FloatingActions from "@/components/layout/FloatingActions";
import CartDrawer from "@/components/cart/CartDrawer";
import ThemePanel from "@/components/theme/ThemePanel";

/**
 * Renders the storefront chrome (header, footer, cart drawer, floating actions)
 * for all pages EXCEPT the admin panel, which provides its own layout/chrome.
 */
export default function Chrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin") ?? false;

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      <main className="min-h-screen">{children}</main>
      <Footer />
      <FloatingActions />
      <CartDrawer />
      <ThemePanel />
    </>
  );
}
