// Native Apple In-App Purchases via RevenueCat (iOS Capacitor wrapper only).
// On the web this module is inert — Stripe checkout stays the source of truth.

import { KEYS, setSubscribed, store } from "@/lib/evenme";

export const IOS_PRODUCTS = {
  annual: "com.brunadagostino.evenme.annual",
  weekly: "com.brunadagostino.evenme.weekly",
} as const;

const API_KEY = import.meta.env.VITE_REVENUECAT_IOS_API_KEY as
  | string
  | undefined;

// Optional: pin a single entitlement id. When unset we treat ANY active
// entitlement as premium, which is safe and avoids name drift.
const ENTITLEMENT = import.meta.env.VITE_REVENUECAT_ENTITLEMENT as
  | string
  | undefined;

export type IapPackage = {
  identifier: string;
  productId: string;
  priceString: string;
  title: string;
  raw: unknown;
};

export function isNativeApp(): boolean {
  if (typeof window === "undefined") return false;
  try {
    // Capacitor injects itself on the native webview; on web this is false.
    const cap = (window as unknown as { Capacitor?: { isNativePlatform?: () => boolean } })
      .Capacitor;
    return Boolean(cap?.isNativePlatform?.());
  } catch {
    return false;
  }
}

let configured: Promise<void> | null = null;

async function loadPlugin() {
  const mod = await import("@revenuecat/purchases-capacitor");
  return mod;
}

export async function initRevenueCat(): Promise<void> {
  if (!isNativeApp()) return;
  if (!API_KEY) {
    console.warn(
      "[iap] VITE_REVENUECAT_IOS_API_KEY is not set — native purchases disabled.",
    );
    return;
  }
  if (configured) return configured;
  configured = (async () => {
    const { Purchases, LOG_LEVEL } = await loadPlugin();
    await Purchases.setLogLevel({ level: LOG_LEVEL.ERROR });
    await Purchases.configure({ apiKey: API_KEY! });
    const email = (store.get(KEYS.email) ?? "").trim().toLowerCase();
    if (email) {
      try {
        await Purchases.logIn({ appUserID: email });
      } catch (err) {
        console.warn("[iap] logIn failed", err);
      }
    }
  })();
  return configured;
}

/** Associate purchases with the user's email once they provide it. */
export async function identifyRevenueCatUser(email: string): Promise<void> {
  if (!isNativeApp() || !API_KEY) return;
  const clean = email.trim().toLowerCase();
  if (!clean) return;
  try {
    await initRevenueCat();
    const { Purchases } = await loadPlugin();
    await Purchases.logIn({ appUserID: clean });
  } catch (err) {
    console.warn("[iap] identify failed", err);
  }
}

function activeEntitlement(customerInfo: any) {
  const active = customerInfo?.entitlements?.active ?? {};
  if (ENTITLEMENT && active[ENTITLEMENT]) return active[ENTITLEMENT];
  const first = Object.values(active)[0];
  return first ?? null;
}

export type IapStatus = {
  active: boolean;
  productId: string | null;
  expiresAt: string | null;
  willRenew: boolean;
  appUserId: string | null;
};

export async function fetchOfferings(): Promise<IapPackage[]> {
  await initRevenueCat();
  const { Purchases } = await loadPlugin();
  const offerings = await Purchases.getOfferings();
  const current = offerings.current ?? Object.values(offerings.all ?? {})[0];
  const pkgs = (current?.availablePackages ?? []) as any[];
  return pkgs.map((p) => ({
    identifier: p.identifier,
    productId: p.product?.identifier ?? "",
    priceString: p.product?.priceString ?? "",
    title: p.product?.title ?? p.identifier,
    raw: p,
  }));
}

export async function purchase(pkg: IapPackage): Promise<IapStatus> {
  await initRevenueCat();
  const { Purchases } = await loadPlugin();
  const result: any = await Purchases.purchasePackage({
    aPackage: pkg.raw as any,
  });
  return toStatus(result?.customerInfo);
}

export async function restore(): Promise<IapStatus> {
  await initRevenueCat();
  const { Purchases } = await loadPlugin();
  const result: any = await Purchases.restorePurchases();
  return toStatus(result?.customerInfo);
}

export async function currentStatus(): Promise<IapStatus> {
  await initRevenueCat();
  const { Purchases } = await loadPlugin();
  const result: any = await Purchases.getCustomerInfo();
  return toStatus(result?.customerInfo);
}

function toStatus(customerInfo: any): IapStatus {
  const ent = activeEntitlement(customerInfo);
  return {
    active: Boolean(ent),
    productId: ent?.productIdentifier ?? null,
    expiresAt: ent?.expirationDate ?? null,
    willRenew: Boolean(ent?.willRenew),
    appUserId: customerInfo?.originalAppUserId ?? null,
  };
}

/** True when the user cancelled the Apple sheet — not an error worth showing. */
export function isUserCancelled(err: unknown): boolean {
  const e = err as { code?: string | number; message?: string; userCancelled?: boolean };
  if (e?.userCancelled) return true;
  const msg = (e?.message ?? "").toLowerCase();
  return (
    String(e?.code) === "1" ||
    msg.includes("cancel") ||
    msg.includes("cancelled") ||
    msg.includes("canceled")
  );
}

/** Applies a status locally (unlocks the app on this device). */
export function applyStatusLocally(status: IapStatus) {
  if (status.active) setSubscribed(true);
}
