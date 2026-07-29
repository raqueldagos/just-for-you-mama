import { createFileRoute, Link } from "@tanstack/react-router";
import { useT } from "@/lib/i18n";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — Even Me" },
      {
        name: "description",
        content:
          "EvenMe privacy policy: what we collect, how we use it, and how we protect your information.",
      },
      { property: "og:title", content: "Privacy Policy — Even Me" },
      {
        property: "og:description",
        content:
          "What EvenMe collects, how we use it, and how we keep your information safe.",
      },
      { property: "og:url", content: "https://evenme.online/privacy" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "https://evenme.online/privacy" }],
  }),
  component: Privacy,
});

function Privacy() {
  const t = useT();
  return (
    <main className="min-h-screen px-6 py-10">
      <div className="mx-auto max-w-2xl">
        <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">
          {t("← Back")}
        </Link>

        <p className="mt-4 text-xs text-muted-foreground italic">
          {t("This page is maintained by EvenMe to answer common privacy questions about the EvenMe service.")}
        </p>

        <h1 className="mt-2 text-3xl font-serif text-foreground">
          {t("Privacy Policy for EvenMe")}
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          {t("Last updated: July 29, 2026.")}
        </p>

        <p className="mt-6 text-foreground leading-relaxed">
          {t("This Privacy Policy describes how EvenMe (\"we,\" \"us,\" or \"our\") collects, uses, and protects information when you use our mobile application and website (the \"Service\").")}
        </p>

        <section className="mt-8 rounded-3xl bg-card border border-border p-6">
          <h2 className="text-xl font-serif text-card-foreground">{t("1. Information We Collect")}</h2>

          <h3 className="mt-4 font-medium text-card-foreground">{t("Account Information")}</h3>
          <p className="mt-1 text-muted-foreground leading-relaxed">
            {t("When you create an account, we collect information such as your email address and any other details you provide during sign-up. This information is stored and managed through our authentication provider, Supabase.")}
          </p>

          <h3 className="mt-4 font-medium text-card-foreground">{t("Payment Information")}</h3>
          <p className="mt-1 text-muted-foreground leading-relaxed">
            {t("If you make a purchase or subscribe through EvenMe, payment processing is handled entirely by Stripe, a third-party payment processor. We do not directly collect, store, or have access to your full credit card number or sensitive payment credentials. Stripe's own privacy policy governs how they handle this data, available at")}{" "}
            <a
              href="https://stripe.com/privacy"
              target="_blank"
              rel="noreferrer"
              className="text-primary underline"
            >
              stripe.com/privacy
            </a>
            .
          </p>

          <h3 className="mt-4 font-medium text-card-foreground">{t("Usage Information")}</h3>
          <p className="mt-1 text-muted-foreground leading-relaxed">
            {t("We may collect basic information about how you interact with the Service to help us maintain and improve it.")}
          </p>
        </section>

        <section className="mt-6 rounded-3xl bg-card border border-border p-6">
          <h2 className="text-xl font-serif text-card-foreground">{t("2. How We Use Your Information")}</h2>
          <p className="mt-2 text-muted-foreground leading-relaxed">
            {t("We use the information we collect to:")}
          </p>
          <ul className="mt-3 list-disc pl-5 space-y-1 text-muted-foreground leading-relaxed">
            <li>{t("Create and manage your account")}</li>
            <li>{t("Process payments and subscriptions")}</li>
            <li>{t("Provide, maintain, and improve the Service")}</li>
            <li>{t("Communicate with you about your account or updates to the Service")}</li>
            <li>{t("Ensure the security and integrity of the Service")}</li>
          </ul>
        </section>

        <section className="mt-6 rounded-3xl bg-card border border-border p-6">
          <h2 className="text-xl font-serif text-card-foreground">{t("3. How We Share Your Information")}</h2>
          <p className="mt-2 text-muted-foreground leading-relaxed">
            {t("We do not sell your personal information. We may share information with:")}
          </p>
          <ul className="mt-3 list-disc pl-5 space-y-1 text-muted-foreground leading-relaxed">
            <li>
              {t("Service providers (such as Supabase and Stripe) who help us operate the Service, under their own privacy and security obligations")}
            </li>
            <li>
              {t("Legal authorities, if required to comply with the law, protect our rights, or ensure user safety")}
            </li>
          </ul>
        </section>

        <section className="mt-6 rounded-3xl bg-card border border-border p-6">
          <h2 className="text-xl font-serif text-card-foreground">{t("4. Data Storage and Security")}</h2>
          <p className="mt-2 text-muted-foreground leading-relaxed">
            {t("Your account information is stored securely through Supabase's infrastructure. Payment information is stored and secured by Stripe in accordance with industry-standard security practices (including PCI-DSS compliance). While we take reasonable measures to protect your information, no method of transmission or storage is 100% secure.")}
          </p>
        </section>

        <section className="mt-6 rounded-3xl bg-card border border-border p-6">
          <h2 className="text-xl font-serif text-card-foreground">{t("5. Your Choices and Rights")}</h2>
          <p className="mt-2 text-muted-foreground leading-relaxed">{t("You may:")}</p>
          <ul className="mt-3 list-disc pl-5 space-y-1 text-muted-foreground leading-relaxed">
            <li>{t("Access, update, or delete your account information by contacting us")}</li>
            <li>{t("Request a copy of the personal data we hold about you")}</li>
            <li>{t("Withdraw consent for data processing, where applicable")}</li>
          </ul>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            {t("To exercise any of these rights, please contact us at")}{" "}
            <a href="mailto:admin@storiahub.online" className="text-primary underline">
              admin@storiahub.online
            </a>
            .
          </p>
        </section>

        <section className="mt-6 rounded-3xl bg-card border border-border p-6">
          <h2 className="text-xl font-serif text-card-foreground">{t("6. Children's Privacy")}</h2>
          <p className="mt-2 text-muted-foreground leading-relaxed">
            {t("EvenMe is intended for a general adult audience. We do not knowingly collect personal information from children under 13. If you believe a child has provided us with personal information, please contact us so we can remove it.")}
          </p>
        </section>

        <section className="mt-6 rounded-3xl bg-card border border-border p-6">
          <h2 className="text-xl font-serif text-card-foreground">{t("7. Changes to This Policy")}</h2>
          <p className="mt-2 text-muted-foreground leading-relaxed">
            {t("We may update this Privacy Policy from time to time. We will notify users of significant changes by updating the \"Last updated\" date above.")}
          </p>
        </section>

        <section className="mt-6 rounded-3xl bg-card border border-border p-6">
          <h2 className="text-xl font-serif text-card-foreground">{t("8. Contact Us")}</h2>
          <p className="mt-2 text-muted-foreground leading-relaxed">
            {t("If you have any questions about this Privacy Policy, please contact us at:")}
          </p>
          <div className="mt-4 space-y-1 text-muted-foreground">
            <p>
              {t("Email:")}{" "}
              <a href="mailto:admin@storiahub.online" className="text-primary underline">
                admin@storiahub.online
              </a>
            </p>
            <p>
              {t("Website:")}{" "}
              <a
                href="https://evenme.online"
                target="_blank"
                rel="noreferrer"
                className="text-primary underline"
              >
                https://evenme.online
              </a>
            </p>
          </div>
        </section>

        <footer className="mt-12 text-center">
          <Link to="/" className="text-sm text-muted-foreground underline">
            {t("Go home")}
          </Link>
        </footer>
      </div>
    </main>
  );
}
