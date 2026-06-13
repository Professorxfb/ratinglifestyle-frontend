import type { Metadata } from "next";
import PageHeader from "@/components/ui/PageHeader";
import { Prose, ProseSection, ProseList } from "@/components/info/Prose";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${SITE.name} collects, uses and protects your personal information.`,
};

const UPDATED = "1 June 2026";

export default function PrivacyPolicyPage() {
  return (
    <>
      <PageHeader
        title="Privacy Policy"
        description={`Last updated: ${UPDATED}`}
        crumbs={[{ label: "Home", href: "/" }, { label: "Privacy Policy" }]}
      />
      <div className="container-luxe py-14">
        <div className="mx-auto max-w-3xl">
          <Prose>
            <ProseSection title="Overview">
              <p>
                At {SITE.name}, your privacy matters to us. This policy explains what information we
                collect, how we use it, and the choices you have. By using our website, you agree to
                the practices described here.
              </p>
            </ProseSection>

            <ProseSection title="Information we collect">
              <ProseList
                items={[
                  "Contact details you provide — name, email, phone and shipping address.",
                  "Order information — items purchased, payment status and delivery details.",
                  "Account information — if you create an account, your login credentials (passwords are stored securely hashed).",
                  "Usage data — pages visited and interactions, collected to improve the experience.",
                ]}
              />
            </ProseSection>

            <ProseSection title="How we use your information">
              <ProseList
                items={[
                  "To process and deliver your orders.",
                  "To provide customer support and respond to enquiries.",
                  "To send order updates and, with your consent, marketing communications.",
                  "To improve our products, website and services.",
                ]}
              />
            </ProseSection>

            <ProseSection title="Payments">
              <p>
                Payments are processed by trusted gateways (bKash, Nagad and SSLCommerz). We do not
                store your full card details on our servers.
              </p>
            </ProseSection>

            <ProseSection title="Sharing your information">
              <p>
                We never sell your data. We share information only with service providers who help us
                operate — such as courier and payment partners — and only as needed to fulfil your
                order, or where required by law.
              </p>
            </ProseSection>

            <ProseSection title="Your rights">
              <p>
                You may request access to, correction of, or deletion of your personal data, and you
                can opt out of marketing at any time. To exercise these rights, contact us at{" "}
                <a href={`mailto:${SITE.email}`} className="text-gold hover:opacity-70">
                  {SITE.email}
                </a>
                .
              </p>
            </ProseSection>

            <ProseSection title="Contact">
              <p>
                Questions about this policy? Reach us at{" "}
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
