/**
 * Icons — a tiny, dependency-free set drawn to a consistent 24px grid.
 * currentColor so they inherit text color; 1.75 stroke for a refined weight.
 */

type P = React.SVGProps<SVGSVGElement>;

function Svg({ children, ...p }: P & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...p}
    >
      {children}
    </svg>
  );
}

export const PlayIcon = (p: P) => (
  <Svg {...p}>
    <path d="M6 4.5v15l13-7.5-13-7.5Z" fill="currentColor" stroke="none" />
  </Svg>
);

export const PauseIcon = (p: P) => (
  <Svg {...p}>
    <rect x="6.5" y="5" width="3.5" height="14" rx="1" fill="currentColor" stroke="none" />
    <rect x="14" y="5" width="3.5" height="14" rx="1" fill="currentColor" stroke="none" />
  </Svg>
);

export const ReplayIcon = (p: P) => (
  <Svg {...p}>
    <path d="M4 12a8 8 0 1 0 2.4-5.7" />
    <path d="M4 4v4h4" />
  </Svg>
);

export const VolumeIcon = (p: P) => (
  <Svg {...p}>
    <path d="M4 9v6h4l5 4V5L8 9H4Z" fill="currentColor" stroke="currentColor" />
    <path d="M16.5 8.5a5 5 0 0 1 0 7" />
    <path d="M19 6a8 8 0 0 1 0 12" />
  </Svg>
);

export const MuteIcon = (p: P) => (
  <Svg {...p}>
    <path d="M4 9v6h4l5 4V5L8 9H4Z" fill="currentColor" stroke="currentColor" />
    <path d="m16 9 5 6M21 9l-5 6" />
  </Svg>
);

export const CaptionsIcon = (p: P) => (
  <Svg {...p}>
    <rect x="3" y="5" width="18" height="14" rx="2.5" />
    <path d="M9 10.5a2 2 0 0 0-2.5 2 2 2 0 0 0 2.5 2M16 10.5a2 2 0 0 0-2.5 2 2 2 0 0 0 2.5 2" />
  </Svg>
);

export const FullscreenIcon = (p: P) => (
  <Svg {...p}>
    <path d="M4 9V5h4M20 9V5h-4M4 15v4h4M20 15v4h-4" />
  </Svg>
);

export const ExitFullscreenIcon = (p: P) => (
  <Svg {...p}>
    <path d="M8 5v3H5M16 5v3h3M8 19v-3H5M16 19v-3h3" />
  </Svg>
);

export const ArrowRightIcon = (p: P) => (
  <Svg {...p}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </Svg>
);

export const CheckIcon = (p: P) => (
  <Svg {...p}>
    <path d="M4 12.5 9 17.5 20 6.5" />
  </Svg>
);

export const XIcon = (p: P) => (
  <Svg {...p}>
    <path d="M6 6l12 12M18 6 6 18" />
  </Svg>
);

export const DocumentIcon = (p: P) => (
  <Svg {...p}>
    <path d="M7 3h7l4 4v14H7z" />
    <path d="M14 3v4h4M9.5 12h5M9.5 15.5h5" />
  </Svg>
);

/* ---------------------------------------------------------------------------
 * Summary-card icon registry.
 * Drawn to the same 24px grid as the set above. The names are GENERIC
 * investigation concepts, not one case's nouns, so the four-icon rejoin card
 * can be configured for any of the 267 videos without new artwork.
 * ------------------------------------------------------------------------ */

/** Facts — an observed record. */
export const FactsIcon = (p: P) => (
  <Svg {...p}>
    <path d="M4 6h11M4 12h11M4 18h7" />
    <path d="m17.5 15.5 2 2 3.5-4" />
  </Svg>
);

/** Coverage — what the policy responds to. */
export const CoverageIcon = (p: P) => (
  <Svg {...p}>
    <path d="M12 3.5 5 6.2v5.1c0 4 2.9 7.6 7 9.2 4.1-1.6 7-5.2 7-9.2V6.2L12 3.5Z" />
    <path d="M9.5 12.2 11.4 14l3.4-3.6" />
  </Svg>
);

/** Damages — the amount in dispute. */
export const DamagesIcon = (p: P) => (
  <Svg {...p}>
    <path d="M12 3.5v17" />
    <path d="M15.8 7.3a3.3 3.3 0 0 0-3.3-1.6h-1a2.9 2.9 0 0 0 0 5.8h1.6a2.9 2.9 0 0 1 0 5.8h-1.2a3.3 3.3 0 0 1-3.3-1.7" />
  </Svg>
);

/** Timing — when it happened. */
export const TimingIcon = (p: P) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7v5.2l3.2 2" />
  </Svg>
);

/** Issue — the question actually in dispute. */
export const IssueIcon = (p: P) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M9.6 9.4a2.5 2.5 0 0 1 4.8.9c0 1.7-2.4 2-2.4 3.6" />
    <path d="M12 17.2h.01" />
  </Svg>
);

/** Burden — who has to carry it. */
export const BurdenIcon = (p: P) => (
  <Svg {...p}>
    <path d="M12 4v16M5 8h14M8.5 20h7" />
    <path d="M5 8 2.5 13.5h5L5 8ZM19 8l-2.5 5.5h5L19 8Z" />
  </Svg>
);

/** Standard — the level of proof required. */
export const StandardIcon = (p: P) => (
  <Svg {...p}>
    <path d="M3.5 16.5a8.5 8.5 0 0 1 17 0" />
    <path d="M12 16.5 16 10" />
    <path d="M3.5 16.5h17" />
  </Svg>
);

/** Evidence — what is actually in the file. */
export const EvidenceIcon = (p: P) => (
  <Svg {...p}>
    <path d="M3.5 7.5A1.5 1.5 0 0 1 5 6h4l1.8 2.2H19a1.5 1.5 0 0 1 1.5 1.5v7.8A1.5 1.5 0 0 1 19 19H5a1.5 1.5 0 0 1-1.5-1.5v-10Z" />
    <path d="M8.5 13.5h7" />
  </Svg>
);

/** Neutral fallback so an unregistered icon name can never break the player. */
export const DotIcon = (p: P) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="4" fill="currentColor" stroke="none" />
  </Svg>
);

/**
 * Name → component. `SummaryIconName` in the data model is the key set; the
 * lookup falls back to `DotIcon` rather than throwing.
 */
export const SUMMARY_ICONS = {
  facts: FactsIcon,
  coverage: CoverageIcon,
  damages: DamagesIcon,
  timing: TimingIcon,
  issue: IssueIcon,
  burden: BurdenIcon,
  standard: StandardIcon,
  evidence: EvidenceIcon,
} as const;

export function summaryIcon(name: string) {
  return (SUMMARY_ICONS as Record<string, (p: P) => React.JSX.Element>)[name] ?? DotIcon;
}

/** Outstanding — an item the file still needs. */
export const PendingIcon = (p: P) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="8.5" strokeDasharray="3 2.6" />
    <path d="M12 8v4.3l2.8 1.7" />
  </Svg>
);

/** Not obtainable — an item that cannot be had. */
export const UnavailableIcon = (p: P) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="m6.6 6.6 10.8 10.8" />
  </Svg>
);
