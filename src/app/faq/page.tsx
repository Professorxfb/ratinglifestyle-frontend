import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/ui/PageHeader";
import FaqAccordion, { type FaqItem } from "@/components/info/FaqAccordion";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "FAQ",
  description: `Frequently asked questions about ordering, shipping, returns and payments at ${SITE.name}.`,
};

const GROUPS: { heading: string; items: FaqItem[] }[] = [
  {
    heading: "Orders & Payment",
    items: [
      {
        question: "How do I place an order?",
        answer:
          "Browse the shop, add items to your cart, and proceed to checkout. You can check out as a guest or sign in. Follow the three steps — shipping, payment and review — to confirm your order.",
      },
      {
        question: "What payment methods do you accept?",
        answer:
          "We accept bKash, Nagad, card payments via SSLCommerz, and Cash on Delivery (COD) for eligible areas.",
      },
      {
        question: "Can I use a discount code?",
        answer:
          "Yes. Enter your code in the cart or at checkout. New customers can use WELCOME10 for 10% off their first order.",
      },
      {
        question: "Can I modify or cancel my order?",
        answer:
          "Orders can be changed or cancelled within 2 hours of placement, before they are processed. Contact us as soon as possible and we'll do our best to help.",
      },
    ],
  },
  {
    heading: "Shipping & Delivery",
    items: [
      {
        question: "How much does shipping cost?",
        answer: `Standard delivery is charged at checkout based on your location. Orders above ৳${SITE.freeShippingThreshold} qualify for free nationwide shipping.`,
      },
      {
        question: "How long does delivery take?",
        answer:
          "Inside Dhaka: 1–3 business days. Outside Dhaka: 3–5 business days. You'll receive tracking details once your order ships.",
      },
      {
        question: "Do you deliver across Bangladesh?",
        answer: "Yes — we deliver to all 64 districts via trusted courier partners.",
      },
    ],
  },
  {
    heading: "Returns & Exchanges",
    items: [
      {
        question: "What is your return policy?",
        answer:
          "Unworn items with tags can be returned within 7 days of delivery. See our Return Policy for full details and exclusions.",
      },
      {
        question: "How do I exchange for a different size?",
        answer:
          "Request an exchange within 7 days. Once we receive the original item, we'll ship the replacement subject to availability.",
      },
      {
        question: "When will I get my refund?",
        answer:
          "Approved refunds are processed within 5–7 business days to your original payment method or as store credit.",
      },
    ],
  },
  {
    heading: "Products & Sizing",
    items: [
      {
        question: "How do I find my size?",
        answer:
          "Check our detailed Size Guide for measurements across Men, Women and Kids. Each product page also lists size-specific details.",
      },
      {
        question: "Are the product colours accurate?",
        answer:
          "We photograph products to represent colours as faithfully as possible, though slight variation may occur depending on your screen.",
      },
    ],
  },
];

export default function FaqPage() {
  return (
    <>
      <PageHeader
        title="Frequently Asked Questions"
        description="Everything you need to know about ordering, shipping, returns and more."
        crumbs={[{ label: "Home", href: "/" }, { label: "FAQ" }]}
      />
      <div className="container-luxe py-14">
        <div className="mx-auto max-w-3xl space-y-12">
          {GROUPS.map((group) => (
            <section key={group.heading}>
              <h2 className="mb-2 font-display text-2xl text-gold">{group.heading}</h2>
              <FaqAccordion items={group.items} />
            </section>
          ))}

          <div className="rounded-sm border border-line bg-card p-8 text-center">
            <p className="font-display text-xl text-ink">Still have a question?</p>
            <p className="mt-2 text-sm text-muted">
              Our team is here to help, Saturday–Thursday, 10am–8pm.
            </p>
            <Link href="/contact" className="btn-outline mt-6">
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
