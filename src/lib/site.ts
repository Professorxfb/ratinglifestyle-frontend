// Central site config — in production these come from the Laravel `site_settings` table
// via /api/settings. Kept here as defaults / mock values for the frontend foundation.
export const SITE = {
  name: "Rupkotha Trendz",
  url: "https://rupkothatrendz.com",
  tagline: "Wear the Story.",
  description: "Premium fashion for Men, Women & Kids in Bangladesh.",
  whatsapp: "+8801712345678",
  email: "hello@rupkothatrendz.com",
  phone: "+880 1712-345678",
  address: "House 12, Road 7, Banani, Dhaka 1213, Bangladesh",
  freeShippingThreshold: 1500,
  currency: "৳",
  promoStrip:
    "Free shipping on orders above ৳1500  •  Use code WELCOME10 for 10% off your first order",
  social: {
    facebook: "https://facebook.com/rupkothatrendz",
    instagram: "https://instagram.com/rupkothatrendz",
    youtube: "https://youtube.com/@rupkothatrendz",
    tiktok: "https://tiktok.com/@rupkothatrendz",
  },
};

export function formatBDT(amount: number): string {
  return `৳${amount.toLocaleString("en-BD")}`;
}
