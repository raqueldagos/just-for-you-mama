import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const captureSchema = z.object({
  email: z.string().trim().toLowerCase().email().max(255),
  name: z.string().trim().max(100).optional().nullable(),
  source: z.string().trim().max(40).optional(),
});

export const captureLead = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => captureSchema.parse(data))
  .handler(async ({ data }): Promise<{ ok: boolean }> => {
    try {
      const { supabaseAdmin } = await import(
        "@/integrations/supabase/client.server"
      );
      const now = new Date().toISOString();

      // Try to update existing row first (increment count, refresh last_seen).
      const { data: existing } = await supabaseAdmin
        .from("leads")
        .select("id, check_in_count")
        .eq("email", data.email)
        .maybeSingle();

      if (existing) {
        await supabaseAdmin
          .from("leads")
          .update({
            last_seen_at: now,
            check_in_count: (existing.check_in_count ?? 0) + 1,
            name: data.name ?? undefined,
            updated_at: now,
          })
          .eq("id", existing.id);
      } else {
        await supabaseAdmin.from("leads").insert({
          email: data.email,
          name: data.name ?? null,
          source: data.source ?? "checkin",
          first_seen_at: now,
          last_seen_at: now,
          check_in_count: 1,
        });
      }

      return { ok: true };
    } catch (err) {
      console.error("captureLead failed:", err);
      return { ok: false };
    }
  });
