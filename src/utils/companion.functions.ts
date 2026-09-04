import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const FEELINGS = [
  "stretched_thin",
  "running_on_empty",
  "okayish",
  "had_one_thing_mine",
  "felt_like_myself",
  "snapped_and_hate_that",
  "quiet_needed",
] as const;

const BASELINE: Record<string, number> = {
  stretched_thin: 847,
  running_on_empty: 612,
  okayish: 498,
  had_one_thing_mine: 236,
  felt_like_myself: 189,
  snapped_and_hate_that: 431,
  quiet_needed: 704,
};

const recordSchema = z.object({
  email: z.string().trim().toLowerCase().email().max(255).optional().nullable(),
  promptKey: z.string().trim().max(60).optional(),
  feelingKey: z.enum(FEELINGS),
  note: z.string().trim().max(140).optional().nullable(),
  slipId: z.string().trim().max(10),
  questDone: z.boolean().default(false),
  questKey: z.string().trim().max(60).optional().nullable(),
  checkinsCount: z.number().int().min(0).max(100000).optional(),
  minutesKept: z.number().int().min(0).max(1000000).optional(),
  plantStage: z.number().int().min(0).max(6).optional(),
});

function startOfToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
}

/** Saves a check-in and returns how many moms picked the same feeling today. */
export const recordCheckin = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => recordSchema.parse(data))
  .handler(async ({ data }): Promise<{ ok: boolean; sameFeelingToday: number }> => {
    const fallback = BASELINE[data.feelingKey] ?? 300;
    try {
      const { supabaseAdmin } = await import(
        "@/integrations/supabase/client.server"
      );
      const now = new Date().toISOString();
      let profileId: string | null = null;

      if (data.email) {
        const { data: existing } = await supabaseAdmin
          .from("profiles")
          .select("id")
          .eq("email", data.email)
          .maybeSingle();

        if (existing) {
          profileId = existing.id;
          await supabaseAdmin
            .from("profiles")
            .update({
              checkins_count: data.checkinsCount ?? undefined,
              minutes_kept: data.minutesKept ?? undefined,
              plant_stage: data.plantStage ?? undefined,
              last_checkin_at: now,
              onboarding_done: true,
              updated_at: now,
            })
            .eq("id", existing.id);
        } else {
          const { data: created } = await supabaseAdmin
            .from("profiles")
            .insert({
              email: data.email,
              checkins_count: data.checkinsCount ?? 1,
              minutes_kept: data.minutesKept ?? 2,
              plant_stage: data.plantStage ?? 1,
              last_checkin_at: now,
              onboarding_done: true,
            })
            .select("id")
            .maybeSingle();
          profileId = created?.id ?? null;
        }

        await supabaseAdmin
          .from("slips_unlocked")
          .upsert(
            { email: data.email, slip_id: data.slipId },
            { onConflict: "email,slip_id" },
          );
      }

      await supabaseAdmin.from("checkins").insert({
        profile_id: profileId,
        email: data.email ?? null,
        prompt_key: data.promptKey ?? null,
        feeling_key: data.feelingKey,
        optional_note: data.note ? data.note.slice(0, 140) : null,
        slip_id: data.slipId,
        quest_done: data.questDone,
        quest_key: data.questKey ?? null,
      });

      const { count } = await supabaseAdmin
        .from("checkins")
        .select("id", { count: "exact", head: true })
        .eq("feeling_key", data.feelingKey)
        .gte("created_at", startOfToday());

      return { ok: true, sameFeelingToday: fallback + (count ?? 1) };
    } catch (err) {
      console.error("recordCheckin failed:", err);
      return { ok: false, sameFeelingToday: fallback };
    }
  });

/** Read-only count of moms on the same feeling today. */
export const sameFeelingToday = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) =>
    z.object({ feelingKey: z.enum(FEELINGS) }).parse(data),
  )
  .handler(async ({ data }): Promise<{ count: number }> => {
    const fallback = BASELINE[data.feelingKey] ?? 300;
    try {
      const { supabaseAdmin } = await import(
        "@/integrations/supabase/client.server"
      );
      const { count } = await supabaseAdmin
        .from("checkins")
        .select("id", { count: "exact", head: true })
        .eq("feeling_key", data.feelingKey)
        .gte("created_at", startOfToday());
      return { count: fallback + (count ?? 0) };
    } catch {
      return { count: fallback };
    }
  });

/** "Same" tap. No comments, ever. */
export const cheerFeeling = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) =>
    z.object({ feelingKey: z.enum(FEELINGS) }).parse(data),
  )
  .handler(async ({ data }): Promise<{ ok: boolean }> => {
    try {
      const { supabaseAdmin } = await import(
        "@/integrations/supabase/client.server"
      );
      await supabaseAdmin.rpc("bump_cheer", { _feeling_key: data.feelingKey });
      return { ok: true };
    } catch {
      return { ok: false };
    }
  });

/** Stores the quiet reminder preference. */
export const saveReminderPreference = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) =>
    z
      .object({
        email: z.string().trim().toLowerCase().email().max(255),
        enabled: z.boolean(),
        label: z.string().trim().max(80).default("after the house is quiet"),
      })
      .parse(data),
  )
  .handler(async ({ data }): Promise<{ ok: boolean }> => {
    try {
      const { supabaseAdmin } = await import(
        "@/integrations/supabase/client.server"
      );
      await supabaseAdmin
        .from("profiles")
        .upsert(
          {
            email: data.email,
            reminder_enabled: data.enabled,
            reminder_label: data.label,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "email" },
        );
      return { ok: true };
    } catch {
      return { ok: false };
    }
  });
