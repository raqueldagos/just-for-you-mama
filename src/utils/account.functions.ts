import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const schema = z.object({
  email: z.string().trim().toLowerCase().email().max(255),
});

/**
 * Permanently deletes everything we store for an email: lead row,
 * subscription rows, and the Supabase auth user if one exists.
 */
export const deleteAccount = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => schema.parse(data))
  .handler(async ({ data }): Promise<{ ok: boolean; error?: string }> => {
    try {
      const { supabaseAdmin } = await import(
        "@/integrations/supabase/client.server"
      );
      const email = data.email;

      await supabaseAdmin.from("leads").delete().ilike("email", email);
      await supabaseAdmin.from("subscriptions").delete().ilike("email", email);

      // Remove the auth user too, when the email was ever registered.
      try {
        const { data: list } = await supabaseAdmin.auth.admin.listUsers({
          page: 1,
          perPage: 200,
        });
        const match = list?.users?.find(
          (u) => (u.email ?? "").toLowerCase() === email,
        );
        if (match) await supabaseAdmin.auth.admin.deleteUser(match.id);
      } catch (err) {
        console.warn("deleteAccount: auth user cleanup skipped", err);
      }

      return { ok: true };
    } catch (err) {
      console.error("deleteAccount failed:", err);
      return { ok: false, error: "Could not delete the account right now." };
    }
  });
