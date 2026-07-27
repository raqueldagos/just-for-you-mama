import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";
import { type StripeEnv, verifyWebhook } from "@/lib/stripe.server";
import { sendTemplateEmail } from "@/lib/email-templates/send-email";

let _supabase: any = null;
function getSupabase(): any {
  if (!_supabase) {
    _supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    );
  }
  return _supabase;
}


function emailFrom(subscription: any): string | null {
  return (
    subscription?.metadata?.email ||
    subscription?.customer_email ||
    null
  );
}

async function upsertFromSubscription(subscription: any, env: StripeEnv) {
  let email = emailFrom(subscription);
  if (!email && subscription.customer) {
    // Retrieve customer email as a fallback (rare — metadata is always set).
    // Skip when customer is an object with email inline.
    if (typeof subscription.customer === "object" && subscription.customer.email) {
      email = subscription.customer.email;
    }
  }
  if (!email) {
    console.error("No email found on subscription", subscription.id);
    return;
  }

  const item = subscription.items?.data?.[0];
  const priceId =
    item?.price?.lookup_key ||
    item?.price?.metadata?.lovable_external_id ||
    item?.price?.id ||
    "";
  const periodStart =
    item?.current_period_start ?? subscription.current_period_start;
  const periodEnd =
    item?.current_period_end ?? subscription.current_period_end;

  await getSupabase().from("subscriptions").upsert(
    {
      email: email.trim().toLowerCase(),
      stripe_subscription_id: subscription.id,
      stripe_customer_id:
        typeof subscription.customer === "string"
          ? subscription.customer
          : subscription.customer?.id,
      price_id: priceId,
      status: subscription.status,
      current_period_start: periodStart
        ? new Date(periodStart * 1000).toISOString()
        : null,
      current_period_end: periodEnd
        ? new Date(periodEnd * 1000).toISOString()
        : null,
      cancel_at_period_end: subscription.cancel_at_period_end ?? false,
      environment: env,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "stripe_subscription_id" },
  );
}

async function markCanceled(subscription: any, env: StripeEnv) {
  await getSupabase()
    .from("subscriptions")
    .update({
      status: "canceled",
      cancel_at_period_end: subscription.cancel_at_period_end ?? false,
      updated_at: new Date().toISOString(),
    })
    .eq("stripe_subscription_id", subscription.id)
    .eq("environment", env);
}

async function sendWelcomeIfNew(subscription: any) {
  const email = emailFrom(subscription);
  if (!email) return;
  const clean = email.trim().toLowerCase();
  // Upsert this email into the leads table and mark as subscribed.
  try {
    const { data: existing } = await getSupabase()
      .from("leads")
      .select("id")
      .eq("email", clean)
      .maybeSingle();
    const now = new Date().toISOString();
    if (existing) {
      await getSupabase()
        .from("leads")
        .update({ subscribed: true, last_seen_at: now, updated_at: now })
        .eq("id", existing.id);
    } else {
      await getSupabase().from("leads").insert({
        email: clean,
        subscribed: true,
        source: "stripe",
        first_seen_at: now,
        last_seen_at: now,
      });
    }
  } catch (err) {
    console.error("Failed to mark lead as subscribed:", err);
  }
  try {
    await sendTemplateEmail("welcome", clean, {
      idempotencyKey: `welcome-${subscription.id}`,
    });
  } catch (err) {
    console.error("Failed to send welcome email:", err);
  }
}

async function handleWebhook(req: Request, env: StripeEnv) {
  const event = await verifyWebhook(req, env);
  switch (event.type) {
    case "customer.subscription.created":
      await upsertFromSubscription(event.data.object, env);
      await sendWelcomeIfNew(event.data.object);
      break;
    case "customer.subscription.updated":
      await upsertFromSubscription(event.data.object, env);
      break;
    case "customer.subscription.deleted":
      await markCanceled(event.data.object, env);
      break;
    default:
      console.log("Unhandled event:", event.type);
  }
}

export const Route = createFileRoute("/api/public/payments/webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const rawEnv = new URL(request.url).searchParams.get("env");
        if (rawEnv !== "sandbox" && rawEnv !== "live") {
          console.error("Webhook missing or invalid env:", rawEnv);
          return Response.json({ received: true, ignored: "invalid env" });
        }
        try {
          await handleWebhook(request, rawEnv);
          return Response.json({ received: true });
        } catch (e) {
          console.error("Webhook error:", e);
          return new Response("Webhook error", { status: 400 });
        }
      },
    },
  },
});
