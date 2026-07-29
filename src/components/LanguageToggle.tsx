import { useLang, tr } from "@/lib/i18n";

// Brazilian flag SVG (simplified but recognizable).
function BRFlag({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 14" className={className} aria-hidden="true">
      <rect width="20" height="14" fill="#009c3b" />
      <polygon points="10,1.5 18.5,7 10,12.5 1.5,7" fill="#ffdf00" />
      <circle cx="10" cy="7" r="2.8" fill="#002776" />
      <path
        d="M7.4 7.4 Q10 6 12.6 7.4"
        stroke="#ffffff"
        strokeWidth="0.5"
        fill="none"
      />
    </svg>
  );
}

// US flag (simplified).
function USFlag({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 14" className={className} aria-hidden="true">
      <rect width="20" height="14" fill="#ffffff" />
      {[0, 2, 4, 6, 8, 10, 12].map((y) => (
        <rect key={y} y={y} width="20" height="1" fill="#b22234" />
      ))}
      <rect width="9" height="7" fill="#3c3b6e" />
    </svg>
  );
}

export function LanguageToggle() {
  const [lang, setLang] = useLang();
  const isPT = lang === "pt";
  const nextLabel = isPT
    ? tr("Switch to English", lang)
    : tr("Switch to Portuguese", lang);

  return (
    <button
      onClick={() => setLang(isPT ? "en" : "pt")}
      aria-label={nextLabel}
      title={nextLabel}
      className="fixed right-4 top-4 z-50 flex items-center gap-2 rounded-full border border-border bg-card/90 px-3 py-1.5 shadow-sm backdrop-blur hover:bg-muted transition"
    >
      {isPT ? <USFlag className="h-4 w-6 rounded-sm" /> : <BRFlag className="h-4 w-6 rounded-sm" />}
      <span className="text-xs font-medium text-foreground">
        {isPT ? "EN" : "PT"}
      </span>
    </button>
  );
}
