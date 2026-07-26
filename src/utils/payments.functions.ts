import { createServerFn } from "@tanstack/react-start";
import {
  type StripeEnv,
  createStripeClient,
  getStripeErrorMessage,
} from "@/lib/stripe.server";

type CheckoutSessionResult =
  | { clientSecret: string }
  | { error: string };

async function resolveOrCreateCustomer(
  stripe: ReturnType<typeof createStripeClient>,
  email: string,
): Promise<string> {
  const existing = await stripe.customers.list({ email, limit: 1 });
  if (existing.data.length) return existing.data[0].id;
  const created = await stripe.customers.create({
    email,
    metadata: { email },
  });
  return created.id;
}

export const createCheckoutSession = createServerFn({ method: "POST" })
  .inputValidator(
    (data: {
      priceId: string;
      email: string;
      returnUrl: string;
      environment: StripeEnv;
    }) => {
      if (!/^[a-zA-Z0-9_-]+$/.test(data.priceId))
        throw new Error("Invalid priceId");
      if (!data.email || !data.email.includes("@"))
        throw new Error("A valid email is required");
      return data;
    },
  )
  .handler(async ({ data }): Promise<CheckoutSessionResult> => {
    try {
      const stripe = createStripeClient(data.environment);
      const prices = await stripe.prices.list({
        lookup_keys: [data.priceId],
      });
      if (!prices.data.length) throw new Error("Price not found");
      const stripePrice = prices.data[0];

      const email = data.email.trim().toLowerCase();
      const customerId = await resolveOrCreateCustomer(stripe, email);

      const session = await stripe.checkout.sessions.create({
        line_items: [{ price: stripePrice.id, quantity: 1 }],
        mode: "subscription",
        ui_mode: "embedded_page",
        return_url: data.returnUrl,
        customer: customerId,
        automatic_tax: { enabled: true },
        metadata: { email },
        subscription_data: { metadata: { email } },
      });
      return { clientSecret: session.client_secret ?? "" };
    } catch (error) {
      return { error: getStripeErrorMessage(error) };
    }
  });

type SubscriptionCheck = {
  active: boolean;
  status: string | null;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
  priceId: string | null;
};

export const checkSubscription = createServerFn({ method: "POST" })
  .inputValidator((data: { email: string; environment: StripeEnv }) => {
    if (!data.email || !data.email.includes("@"))
      throw new Error("A valid email is required");
    return data;
  })
  .handler(async ({ data }): Promise<SubscriptionCheck> => {
    const { supabaseAdmin } = await import(
      "@/integrations/supabase/client.server"
    );
    const email = data.email.trim().toLowerCase();
    const { data: rows } = await supabaseAdmin
      .from("subscriptions")
      .select(
        "status, current_period_end, cancel_at_period_end, price_id, environment",
      )
      .ilike("email", email)
      .eq("environment", data.environment)
      .order("created_at", { ascending: false })
      .limit(1);

    const row = rows?.[0];
    if (!row) {
      return {
        active: false,
        status: null,
        currentPeriodEnd: null,
        cancelAtPeriodEnd: false,
        priceId: null,
      };
    }

    const end = row.current_period_end
      ? new Date(row.current_period_end as string).getTime()
      : null;
    const now = Date.now();
    const active =
      ((row.status === "active" ||
        row.status === "trialing" ||
        row.status === "past_due") &&
        (end === null || end > now)) ||
      (row.status === "canceled" && end !== null && end > now);

    return {
      active,
      status: row.status as string,
      currentPeriodEnd: (row.current_period_end as string) ?? null,
      cancelAtPeriodEnd: (row.cancel_at_period_end as boolean) ?? false,
      priceId: (row.price_id as string) ?? null,
    };
  });
