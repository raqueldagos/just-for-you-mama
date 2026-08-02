import { createFileRoute, Link } from "@tanstack/react-router";
import { useT } from "@/lib/i18n";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Use — Even Me" },
      {
        name: "description",
        content:
          "EvenMe Terms of Use: subscription terms, cancellation policy, disclaimers, and contact information.",
      },
      { property: "og:title", content: "Terms of Use — Even Me" },
      {
        property: "og:description",
        content:
          "EvenMe Terms of Use: subscription terms, cancellation policy, disclaimers, and contact information.",
      },
      { property: "og:url", content: "https://evenme.online/terms" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "https://evenme.online/terms" }],
  }),
  component: Terms,
});

function Terms() {
  const t = useT();
  return (
    <main className="min-h-screen px-6 py-10">
      <div className="mx-auto max-w-2xl">
        <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">
          {t("← Back")}
        </Link>

        <p className="mt-4 text-xs text-muted-foreground italic">
          {t("This page is maintained by EvenMe to set out the rules and expectations for using the EvenMe service.")}
        </p>

        <h1 className="mt-2 text-3xl font-serif text-foreground">
          {t("Terms of Use for EvenMe")}
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          {t("Last updated: July 29, 2026.")}
        </p>

        <p className="mt-6 text-foreground leading-relaxed">
          {t("Welcome to EvenMe. These Terms of Use (\"Terms\") govern your access to and use of the EvenMe mobile application and website (together, the \"Service\"), operated by Bruna Raquel Dagostino (\"we,\" \"us,\" or \"our\"). By creating an account or using the Service, you agree to these Terms. If you do not agree, please do not use the Service.")}
        </p>

        <section className="mt-8 rounded-3xl bg-card border border-border p-6">
          <h2 className="text-xl font-serif text-card-foreground">{t("1. The Service")}</h2>
          <p className="mt-2 text-muted-foreground leading-relaxed">
            {t("EvenMe provides mood and energy check-ins along with personalized suggestions intended to support everyday emotional wellbeing. EvenMe is not a substitute for professional medical or mental health care, diagnosis, or treatment. If you are experiencing a crisis or having thoughts of harming yourself, please contact emergency services or a crisis helpline in your area immediately.")}
          </p>
        </section>

        <section className="mt-6 rounded-3xl bg-card border border-border p-6">
          <h2 className="text-xl font-serif text-card-foreground">{t("2. Eligibility")}</h2>
          <p className="mt-2 text-muted-foreground leading-relaxed">
            {t("The Service is intended for general audiences and adults. By using the Service, you confirm that you are legally able to enter into these Terms in your jurisdiction.")}
          </p>
        </section>

        <section className="mt-6 rounded-3xl bg-card border border-border p-6">
          <h2 className="text-xl font-serif text-card-foreground">{t("3. Accounts")}</h2>
          <p className="mt-2 text-muted-foreground leading-relaxed">
            {t("You are responsible for maintaining the confidentiality of your account credentials and for all activity under your account. Please notify us promptly if you suspect unauthorized use of your account.")}
          </p>
        </section>

        <section className="mt-6 rounded-3xl bg-card border border-border p-6">
          <h2 className="text-xl font-serif text-card-foreground">{t("4. Free Access and Subscriptions")}</h2>
          <p className="mt-2 text-muted-foreground leading-relaxed">
            {t("Free access: New users may access one piece of advice or content from EvenMe free of charge before being asked to subscribe.")}
          </p>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            {t("Subscription plans: Continued access to EvenMe's full features requires a paid subscription, offered as either a Weekly Plan or an Annual Plan, at the prices displayed in the app at the time of purchase.")}
          </p>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            {t("Billing: If you subscribe through the iOS app, payment is processed through your Apple ID account, and your subscription automatically renews unless you turn off auto-renewal at least 24 hours before the end of the current period. Payment will be charged to your Apple ID account at confirmation of purchase.")}
          </p>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            {t("Managing your subscription: You can manage or cancel your subscription at any time through your device's Settings (Settings → [Your Name] → Subscriptions on iOS), or through your account settings if you subscribed via our website.")}
          </p>
        </section>

        <section className="mt-6 rounded-3xl bg-card border border-border p-6">
          <h2 className="text-xl font-serif text-card-foreground">{t("5. Cancellation and Refunds")}</h2>
          <p className="mt-2 text-muted-foreground leading-relaxed">
            {t("You may cancel your subscription at any time. Cancelling stops future renewal charges, but you will continue to have access to paid features through the end of the period you already paid for.")}
          </p>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            {t("Annual Plan: The Annual Plan is billed as a single upfront payment covering a full year of access. If you cancel partway through the year, your access continues until the end of the paid annual period, but no partial refund will be issued for the unused portion.")}
          </p>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            {t("Weekly Plan: The Weekly Plan renews on a weekly basis. Cancelling stops future weekly charges; the current paid week is non-refundable but remains active until it ends.")}
          </p>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            {t("Refund requests for purchases made through the Apple App Store are handled by Apple in accordance with Apple's own refund policies, not by us directly.")}
          </p>
        </section>

        <section className="mt-6 rounded-3xl bg-card border border-border p-6">
          <h2 className="text-xl font-serif text-card-foreground">{t("6. Acceptable Use")}</h2>
          <p className="mt-2 text-muted-foreground leading-relaxed">
            {t("You agree not to misuse the Service, including attempting to interfere with its normal operation, reverse-engineer the app, or use it for any unlawful purpose.")}
          </p>
        </section>

        <section className="mt-6 rounded-3xl bg-card border border-border p-6">
          <h2 className="text-xl font-serif text-card-foreground">{t("7. Content and Intellectual Property")}</h2>
          <p className="mt-2 text-muted-foreground leading-relaxed">
            {t("All content, design, and materials provided through EvenMe are owned by us or our licensors and are protected by applicable intellectual property laws. You may not copy, distribute, or create derivative works from the Service without our permission.")}
          </p>
        </section>

        <section className="mt-6 rounded-3xl bg-card border border-border p-6">
          <h2 className="text-xl font-serif text-card-foreground">{t("8. Disclaimer of Warranties")}</h2>
          <p className="mt-2 text-muted-foreground leading-relaxed">
            {t("The Service is provided \"as is\" without warranties of any kind, express or implied. We do not guarantee that the Service will be uninterrupted, error-free, or suitable for any particular purpose.")}
          </p>
        </section>

        <section className="mt-6 rounded-3xl bg-card border border-border p-6">
          <h2 className="text-xl font-serif text-card-foreground">{t("9. Limitation of Liability")}</h2>
          <p className="mt-2 text-muted-foreground leading-relaxed">
            {t("To the fullest extent permitted by law, we are not liable for any indirect, incidental, or consequential damages arising from your use of the Service.")}
          </p>
        </section>

        <section className="mt-6 rounded-3xl bg-card border border-border p-6">
          <h2 className="text-xl font-serif text-card-foreground">{t("10. Changes to These Terms")}</h2>
          <p className="mt-2 text-muted-foreground leading-relaxed">
            {t("We may update these Terms from time to time. Continued use of the Service after changes take effect constitutes acceptance of the revised Terms.")}
          </p>
        </section>

        <section className="mt-6 rounded-3xl bg-card border border-border p-6">
          <h2 className="text-xl font-serif text-card-foreground">{t("11. Contact")}</h2>
          <p className="mt-2 text-muted-foreground leading-relaxed">
            {t("Questions about these Terms can be sent to")}{" "}
            <a href="mailto:admin@storiahub.online" className="text-primary underline">
              admin@storiahub.online
            </a>
            .
          </p>
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
