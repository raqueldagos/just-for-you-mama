import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { hasAccess } from "@/lib/evenme";

/**
 * Returns true if the user has access (subscribed OR free uses remaining).
 * If not, redirects to /paywall and returns false. Renders should bail on false.
 */
export function useAccessGuard(): boolean {
  const navigate = useNavigate();
  const [ok, setOk] = useState<boolean>(() => hasAccess());

  useEffect(() => {
    const allowed = hasAccess();
    setOk(allowed);
    if (!allowed) navigate({ to: "/paywall" });
  }, [navigate]);

  return ok;
}
