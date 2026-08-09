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
