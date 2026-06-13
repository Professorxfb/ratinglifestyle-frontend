import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/ui/PageHeader";
import { Prose, ProseSection, ProseList } from "@/components/info/Prose";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Shipping Policy",
  description: `Delivery times, charges and coverage for orders from ${SITE.name}, nationwide across Bangladesh.`,
};

const UPDATED = "1 June 2026";

export default function ShippingPolicyPage() {
  return (
    <>
      <PageHeader
        title="Shipping Policy"
        description={`Last updated: ${UPDATED}`}
        crumbs={[{ label: "Home", href: "/" }, { label: "Shipping Policy" }]}
      />
      <div className="container-luxe py-14">
        <div className="mx-auto max-w-3xl">
          <Prose>
            <ProseSection title="Coverage">
              <p>
                We deliver to all 64 districts of Bangladesh through trusted courier partners.
              </p>
            </ProseSection>

            <ProseSection title="Delivery times">
              <ProseList
                items={[
                  "Inside Dhaka: 1–3 business days.",
                  "Outside Dhaka: 3–5 business days.",
                  "Orders placed on Fridays or public holidays are processed the next business day.",
                ]}
              />
            </ProseSection>

            <ProseSection title="Shipping charges">
              <p>
                Delivery charges are calculated at checkout based on your location. Orders above{" "}
                <strong className="text-ink">৳{SITE.freeShippingThreshold}</strong> qualify for free
                nationwide shipping.
              </p>
            </ProseSection>

            <ProseSection title="Order tracking">
              <p>
                Once your order ships, we&apos;ll send tracking details by SMS or email. You can also view
                order status anytime in{" "}
                <Link href="/account/orders" className="text-gold hover:opacity-70">
                  your account
                </Link>
                .
              </p>
            </ProseSection>

            <ProseSection title="Cash on Delivery">
              <p>
                COD is available for eligible areas. Please keep the exact amount ready for the
                delivery agent.
              </p>
            </ProseSection>

            <ProseSection title="Delays">
              <p>
                Occasionally, delivery may be delayed due to weather, courier load or unforeseen
                events. We&apos;ll keep you informed and appreciate your patience.
              </p>
            </ProseSection>

            <ProseSection title="Questions?">
              <p>
                Contact us at{" "}
                <a href={`mailto:${SITE.email}`} className="text-gold hover:opacity-70">
                  {SITE.email}
                </a>{" "}
                or {SITE.phone}.
              </p>
            </ProseSection>
          </Prose>
        </div>
      </div>
    </>
  );
}
