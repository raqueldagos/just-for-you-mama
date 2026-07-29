import { useEffect, useState } from "react";
import {
  isNativeApp,
  initRevenueCat,
  currentStatus,
  applyStatusLocally,
} from "@/lib/iap";
import { recordAppleSubscription } from "@/utils/payments.functions";
import { KEYS, store } from "@/lib/evenme";
import { getStripeEnvironment } from "@/lib/stripe";

/** True only after hydration inside the native iOS wrapper. */
export function useIsNativeApp(): boolean {
  const [native, setNative] = useState(false);
  useEffect(() => setNative(isNativeApp()), []);
  return native;
}

/**
 * On app launch inside iOS, ask RevenueCat whether this Apple ID already has
 * an active entitlement and unlock access accordingly.
 */
export function useIapBootstrap() {
  useEffect(() => {
    if (!isNativeApp()) return;
    let cancelled = false;
    (async () => {
      try {
        await initRevenueCat();
        const status = await currentStatus();
        if (cancelled || !status.active) return;
        applyStatusLocally(status);
        const email = (store.get(KEYS.email) ?? "").trim().toLowerCase();
        if (!email.includes("@")) return;
        let environment: "sandbox" | "live" = "live";
        try {
          environment = getStripeEnvironment();
        } catch {
          /* keep default */
        }
        await recordAppleSubscription({
          data: {
            email,
            productId: status.productId ?? "unknown",
            appUserId: status.appUserId ?? email,
            expiresAt: status.expiresAt,
            willRenew: status.willRenew,
            environment,
          },
        });
      } catch (err) {
        console.warn("[iap] bootstrap failed", err);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);
}
