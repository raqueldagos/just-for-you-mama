import { STAGE_CAPTIONS } from "@/lib/companion";
import { useT } from "@/lib/i18n";

/**
 * The Window — a quiet accumulation visual.
 * Stages 0-6 come from total check-ins, never from consecutive days.
 * There is no sad state. If she disappears, the window just waits.
 */
export function WindowScene({
  stage,
  animate = false,
  className = "",
}: {
  stage: number;
  animate?: boolean;
  className?: string;
}) {
  const t = useT();
  const s = Math.max(0, Math.min(6, stage));

  return (
    <figure className={className}>
      <div
        className={`overflow-hidden rounded-3xl border border-border bg-card ${
          animate ? "animate-fade-in" : ""
        }`}
      >
        <svg viewBox="0 0 300 220" className="h-auto w-full" role="img" aria-label={t(STAGE_CAPTIONS[s])}>
          {/* room */}
          <rect x="0" y="0" width="300" height="220" fill="var(--card)" />

          {/* window frame */}
          <rect x="60" y="20" width="180" height="130" rx="8" fill="var(--muted)" />
          {/* sky, brightening with stage */}
          <rect
            x="68"
            y="28"
            width="164"
            height="114"
            rx="4"
            fill="var(--background)"
            opacity={s === 0 ? 0.35 : 0.55 + s * 0.06}
          />
          {s >= 1 && (
            <circle cx="150" cy="70" r={16 + s * 2} fill="var(--primary)" opacity={0.18 + s * 0.05} />
          )}
          {/* mullions */}
          <rect x="148" y="28" width="4" height="114" fill="var(--muted)" />
          <rect x="68" y="83" width="164" height="4" fill="var(--muted)" />
          <rect x="60" y="20" width="180" height="130" rx="8" fill="none" stroke="var(--border)" strokeWidth="3" />

          {/* curtains — closed at stage 0, drawn back after */}
          <rect
            x="68"
            y="28"
            width={s === 0 ? 82 : 22}
            height="114"
            fill="var(--secondary)"
            opacity="0.85"
          />
          <rect
            x={s === 0 ? 150 : 210}
            y="28"
            width={s === 0 ? 82 : 22}
            height="114"
            fill="var(--secondary)"
            opacity="0.85"
          />

          {/* sill */}
          <rect x="48" y="150" width="204" height="10" rx="4" fill="var(--border)" />

          {/* plant */}
          {s >= 2 && (
            <g>
              <path d="M126 150 h20 l-3 -18 h-14 z" fill="var(--primary)" opacity="0.75" />
              <path
                d={
                  s >= 3
                    ? "M136 132 C136 112 122 108 120 96 C134 100 138 112 138 122 C140 110 150 102 160 100 C154 114 144 118 138 132 Z"
                    : "M136 132 C136 122 130 118 128 112 C136 116 138 124 138 130 Z"
                }
                fill="var(--accent)"
              />
            </g>
          )}

          {/* mug */}
          {s >= 4 && (
            <g>
              <rect x="168" y="136" width="20" height="14" rx="3" fill="var(--primary)" opacity="0.85" />
              <path d="M188 140 q7 3 0 7" fill="none" stroke="var(--primary)" strokeWidth="2.5" />
            </g>
          )}

          {/* lamp */}
          {s >= 5 && (
            <g>
              <path d="M258 150 l-14 0 l7 -16 z" fill="var(--primary)" />
              <rect x="249" y="150" width="4" height="14" fill="var(--border)" />
              <circle cx="251" cy="140" r="26" fill="var(--primary)" opacity="0.12" />
            </g>
          )}

          {/* fuller room */}
          {s >= 6 && (
            <g opacity="0.8">
              <rect x="18" y="120" width="26" height="40" rx="5" fill="var(--secondary)" />
              <rect x="22" y="112" width="18" height="10" rx="3" fill="var(--accent)" />
              <rect x="96" y="168" width="110" height="8" rx="4" fill="var(--muted)" />
            </g>
          )}
        </svg>
      </div>
      <figcaption className="mt-3 text-center text-sm text-muted-foreground">
        {t(STAGE_CAPTIONS[s])}
      </figcaption>
    </figure>
  );
}
