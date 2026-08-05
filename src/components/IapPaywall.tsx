import { useEffect, useState } from "react";
import { useNavigate, Link } from "@tanstack/react-router";
import {
  fetchOfferings,
  purchase,
  restore,
  isUserCancelled,
  applyStatusLocally,
  identifyRevenueCatUser,
  type IapPackage,
} from "@/lib/iap";
import { recordAppleSubscription } from "@/utils/payments.functions";
import { KEYS, store } from "@/lib/evenme";
import { getStripeEnvironment } from "@/lib/stripe";
import { useT } from "@/lib/i18n";

/** iOS (Capacitor) paywall backed by Apple In-App Purchase via RevenueCat. */
export function IapPaywall() {
  const t = useT();
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>(() => store.get(KEYS.email) ?? "");
  const [packages, setPackages] = useState<IapPackage[] | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchOfferings()
      .then((pkgs) => {
        if (cancelled) return;
        // Annual first.
        const sorted = [...pkgs].sort((a, b) =>
          a.productId.endsWith(".annual") ? -1 : b.productId.endsWith(".annual") ? 1 : 0,
        );
        setPackages(sorted);
        setSelected(sorted[0]?.identifier ?? null);
      })
      .catch((err) => {
        console.error("[iap] offerings failed", err);
        if (!cancelled)
          setError(t("We couldn't load the plans right now. Please try again."));
        if (!cancelled) setPackages([]);
      });
    return () => {
      cancelled = true;
    };
  }, [t]);

  const environment = (() => {
    try {
      return getStripeEnvironment();
    } catch {
      return "live" as const;
    }
  })();

  async function saveAndUnlock(
    status: Awaited<ReturnType<typeof purchase>>,
    cleanEmail: string,
  ) {
    applyStatusLocally(status);
    if (status.active) {
      // Only sync to our backend when the user chose to share an email.
      if (cleanEmail.includes("@")) {
        try {
          await recordAppleSubscription({
            data: {
              email: cleanEmail,
              productId: status.productId ?? "unknown",
              appUserId: status.appUserId ?? cleanEmail,
              expiresAt: status.expiresAt,
              willRenew: status.willRenew,
              environment,
            },
          });
        } catch (err) {
          // Local access is already granted; the backend can be retried later.
          console.error("[iap] record failed", err);
        }
      }
      navigate({ to: "/checkin" });
    }
  }


  async function handleBuy() {
    setError(null);
    setNotice(null);
    // Email is optional: purchases work with RevenueCat's anonymous app user id.
    const clean = email.trim().toLowerCase();
    const hasEmail = clean.includes("@");
    const pkg = packages?.find((p) => p.identifier === selected);
    if (!pkg) {
      setError(t("Please pick a plan."));
      return;
    }
    if (hasEmail) store.set(KEYS.email, clean);
    setBusy(true);
    try {
      if (hasEmail) await identifyRevenueCatUser(clean);
      const status = await purchase(pkg);
      if (!status.active) {
        setNotice(t("Purchase didn't complete. You can try again anytime."));
        return;
      }
      await saveAndUnlock(status, hasEmail ? clean : "");
    } catch (err) {
      if (isUserCancelled(err)) {
        setNotice(t("No worries — nothing was charged."));
      } else {
        console.error("[iap] purchase failed", err);
        setError(t("Something went wrong with the purchase. Please try again."));
      }
    } finally {
      setBusy(false);
    }
  }


  async function handleRestore() {
    setError(null);
    setNotice(null);
    setBusy(true);
    try {
      const status = await restore();
      if (status.active) {
        const clean = (email.trim().toLowerCase() || store.get(KEYS.email) || "").trim();
        if (clean.includes("@")) store.set(KEYS.email, clean);
        await saveAndUnlock(status, clean || "unknown@evenme.online");
      } else {
        setNotice(t("We couldn't find an active purchase on this Apple ID."));
      }
    } catch (err) {
      console.error("[iap] restore failed", err);
      setError(t("Restore didn't work. Please try again."));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-md px-6 py-10">
        <Link
          to="/checkin"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          {t("← Not now")}
        </Link>
        <h1 className="mt-4 text-3xl font-serif text-foreground">
          {t("Keep showing up for you.")}
        </h1>
        <p className="mt-2 text-muted-foreground">
          {t("Your free tip is used. Pick what works.")}
        </p>

        <div className="mt-6">
          <label className="block text-sm text-muted-foreground mb-2">
            {t("Your email")}
          </label>
          <input
            type="email"
            inputMode="email"
            autoCapitalize="none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full rounded-2xl border border-border bg-card px-5 py-4 outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <div className="mt-6 space-y-3">
          {packages === null && (
            <p className="text-sm text-muted-foreground">{t("Loading plans…")}</p>
          )}
          {packages?.map((p) => (
            <button
              key={p.identifier}
              onClick={() => setSelected(p.identifier)}
              className={`w-full text-left rounded-3xl border p-5 transition ${
                selected === p.identifier
                  ? "border-primary bg-card ring-2 ring-primary"
                  : "border-border bg-card"
              }`}
            >
              <span className="font-medium text-card-foreground">
                {p.productId.endsWith(".annual") ? t("Annual") : t("Weekly")}
              </span>
              <p className="mt-1 text-2xl font-serif text-foreground">
                {p.priceString}
              </p>
            </button>
          ))}
        </div>

        {error && <p className="mt-4 text-sm text-destructive">{error}</p>}
        {notice && <p className="mt-4 text-sm text-muted-foreground">{notice}</p>}

        <button
          onClick={handleBuy}
          disabled={busy || !packages?.length}
          className="mt-8 w-full rounded-2xl bg-primary py-4 text-primary-foreground text-lg font-medium hover:opacity-90 transition disabled:opacity-50"
        >
          {busy ? t("Please wait…") : t("Continue")}
        </button>
        <button
          onClick={handleRestore}
          disabled={busy}
          className="mt-3 w-full text-center text-sm text-muted-foreground underline disabled:opacity-50"
        >
          {t("Restore purchases")}
        </button>
        <p className="mt-3 text-center text-xs text-muted-foreground">
          {t("Cancel anytime in Settings.")}
        </p>
      </div>
    </div>
  );
}
