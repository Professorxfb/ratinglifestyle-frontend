import type { Metadata } from "next";
import PageHeader from "@/components/ui/PageHeader";
import { Prose, ProseSection, ProseList } from "@/components/info/Prose";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: `The terms governing your use of ${SITE.name} and purchases made on our website.`,
};

const UPDATED = "1 June 2026";

export default function TermsConditionsPage() {
  return (
    <>
      <PageHeader
        title="Terms & Conditions"
        description={`Last updated: ${UPDATED}`}
        crumbs={[{ label: "Home", href: "/" }, { label: "Terms & Conditions" }]}
      />
      <div className="container-luxe py-14">
        <div className="mx-auto max-w-3xl">
          <Prose>
            <ProseSection title="Acceptance of terms">
              <p>
                By accessing or purchasing from {SITE.name}, you agree to these Terms & Conditions.
                If you do not agree, please do not use our website.
              </p>
            </ProseSection>

            <ProseSection title="Products & pricing">
              <ProseList
                items={[
                  "All prices are listed in Bangladeshi Taka (৳) and are inclusive of applicable taxes unless stated otherwise.",
                  "We strive for accuracy, but product descriptions, images and prices may change without notice.",
                  "Colours may vary slightly depending on your screen.",
                  "We reserve the right to limit quantities or refuse any order.",
                ]}
              />
            </ProseSection>

            <ProseSection title="Orders">
              <p>
                An order is confirmed once you receive confirmation from us. We reserve the right to
                cancel any order due to stock, pricing errors, or suspected fraudulent activity, in
                which case any payment will be refunded.
              </p>
            </ProseSection>

            <ProseSection title="Payment">
              <p>
                We accept bKash, Nagad, cards via SSLCommerz, and Cash on Delivery for eligible
                areas. Orders are processed only after payment is verified (except COD).
              </p>
            </ProseSection>

            <ProseSection title="Intellectual property">
              <p>
                All content on this site — including logos, designs, images and text — is the
                property of {SITE.name} and may not be used without our written permission.
              </p>
            </ProseSection>

            <ProseSection title="Limitation of liability">
              <p>
                {SITE.name} is not liable for any indirect or consequential loss arising from the use
                of our website or products, to the extent permitted by law.
              </p>
            </ProseSection>

            <ProseSection title="Governing law">
              <p>These terms are governed by the laws of Bangladesh.</p>
            </ProseSection>

            <ProseSection title="Contact">
              <p>
                For questions about these terms, email{" "}
                <a href={`mailto:${SITE.email}`} className="text-gold hover:opacity-70">
                  {SITE.email}
                </a>
                .
              </p>
            </ProseSection>
          </Prose>
        </div>
      </div>
    </>
  );
}
