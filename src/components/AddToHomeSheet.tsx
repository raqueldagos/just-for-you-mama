import { useT } from "@/lib/i18n";

/** A small bottom sheet with the Add to Home Screen steps. No nagging. */
export function AddToHomeSheet({ onClose }: { onClose: () => void }) {
  const t = useT();
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/30 px-4 pb-6">
      <div className="w-full max-w-md rounded-3xl border border-border bg-card p-6 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
        <h2 className="text-xl font-serif text-card-foreground">
          {t("Keep it one tap away")}
        </h2>
        <ol className="mt-4 space-y-2 text-sm text-muted-foreground">
          <li>{t("1. Tap the Share button in your browser bar.")}</li>
          <li>{t("2. Choose \u201cAdd to Home Screen\u201d.")}</li>
          <li>{t("3. Tap Add. That's it.")}</li>
        </ol>
        <p className="mt-4 text-xs text-muted-foreground">
          {t("On Android, open the browser menu and choose \u201cInstall app\u201d.")}
        </p>
        <button
          onClick={onClose}
          className="mt-6 w-full rounded-2xl bg-primary py-4 text-lg font-medium text-primary-foreground transition hover:opacity-90"
        >
          {t("Okay")}
        </button>
      </div>
    </div>
  );
}
