import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/ui/PageHeader";
import { Prose, ProseSection, ProseList } from "@/components/info/Prose";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Return & Refund Policy",
  description: `Easy 7-day returns and exchanges at ${SITE.name}. Learn how to return or exchange an item.`,
};

const UPDATED = "1 June 2026";

export default function ReturnPolicyPage() {
  return (
    <>
      <PageHeader
        title="Return & Refund Policy"
        description={`Last updated: ${UPDATED}`}
        crumbs={[{ label: "Home", href: "/" }, { label: "Return Policy" }]}
      />
      <div className="container-luxe py-14">
        <div className="mx-auto max-w-3xl">
          <Prose>
            <ProseSection title="Our promise">
              <p>
                If something isn&apos;t quite right, we&apos;re here to help. You may return eligible items
                within <strong className="text-ink">7 days</strong> of delivery for an exchange,
                refund or store credit.
              </p>
            </ProseSection>

            <ProseSection title="Eligibility">
              <p>To be eligible for a return, items must be:</p>
              <ProseList
                items={[
                  "Unworn, unwashed and undamaged, with all original tags attached.",
                  "In their original packaging.",
                  "Accompanied by proof of purchase (order number).",
                ]}
              />
            </ProseSection>

            <ProseSection title="Non-returnable items">
              <ProseList
                items={[
                  "Innerwear, socks and other intimate items, for hygiene reasons.",
                  "Items marked as Final Sale or Clearance.",
                  "Customised or made-to-order pieces.",
                ]}
              />
            </ProseSection>

            <ProseSection title="How to request a return">
              <ProseList
                items={[
                  "Contact us within 7 days of delivery with your order number.",
                  "We'll confirm eligibility and share return instructions.",
                  "Pack the item securely and hand it to our courier or drop-off point.",
                  "Once received and inspected, we'll process your refund or exchange.",
                ]}
              />
            </ProseSection>

            <ProseSection title="Refunds">
              <p>
                Approved refunds are issued within 5–7 business days to your original payment method
                or as store credit. Original shipping charges are non-refundable unless the return is
                due to our error.
              </p>
            </ProseSection>

            <ProseSection title="Exchanges">
              <p>
                Need a different size or colour? Request an exchange and, once we receive the
                original item, we&apos;ll ship the replacement subject to availability.
              </p>
            </ProseSection>

            <ProseSection title="Need help?">
              <p>
                Reach our support team at{" "}
                <a href={`mailto:${SITE.email}`} className="text-gold hover:opacity-70">
                  {SITE.email}
                </a>{" "}
                or visit the{" "}
                <Link href="/contact" className="text-gold hover:opacity-70">
                  contact page
                </Link>
                .
              </p>
            </ProseSection>
          </Prose>
        </div>
      </div>
    </>
  );
}
