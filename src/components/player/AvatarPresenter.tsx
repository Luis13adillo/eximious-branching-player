"use client";

import type { Presenter } from "@/lib/branching/types";

/**
 * AvatarPresenter
 * ============================================================================
 * Placeholder for an AI-avatar presenter (HeyGen etc.). It renders a framed,
 * softly-lit presenter portrait with a broadcast lower-third and an animated
 * "speaking" indicator while playing. When a real avatar video is supplied the
 * <video> fills this same frame (handled by MediaStage) and this placeholder is
 * not shown — so the presenter provider swaps in with no layout change.
 */

function initials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function AvatarPresenter({
  presenter,
  speaking,
}: {
  presenter: Presenter;
  speaking: boolean;
}) {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      {/* framed portrait */}
      <div className="relative flex h-[62%] max-h-[340px] min-h-[180px] w-[min(46%,300px)] items-end justify-center">
        <div
          className="absolute inset-0 rounded-2xl border border-white/10"
          style={{
            background:
              "radial-gradient(120% 90% at 50% 12%, rgba(199,162,84,0.16), rgba(8,24,49,0.2) 55%, rgba(5,15,31,0.55))",
            boxShadow: "inset 0 0 60px rgba(0,0,0,0.35)",
          }}
        />
        {/* stylized presenter figure */}
        <svg
          viewBox="0 0 200 240"
          className="relative h-full w-full"
          aria-hidden="true"
          preserveAspectRatio="xMidYMax meet"
        >
          <defs>
            <radialGradient id="spot" cx="50%" cy="22%" r="70%">
              <stop offset="0" stopColor="var(--color-gold-500)" stopOpacity="0.22" />
              <stop offset="100%" stopColor="var(--color-gold-500)" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="figure" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="var(--color-navy-300)" stopOpacity="0.9" />
              <stop offset="1" stopColor="var(--color-navy-500)" stopOpacity="0.9" />
            </linearGradient>
          </defs>
          <rect x="0" y="0" width="200" height="240" fill="url(#spot)" />
          {/* shoulders */}
          <path
            d="M28 240 C34 176 66 156 100 156 C134 156 166 176 172 240 Z"
            fill="url(#figure)"
          />
          {/* head */}
          <circle cx="100" cy="104" r="40" fill="url(#figure)" />
          {/* monogram badge */}
          <circle cx="100" cy="104" r="40" fill="none" stroke="var(--color-gold-500)" strokeWidth="1.5" opacity="0.55" />
          <text
            x="100"
            y="116"
            textAnchor="middle"
            fill="var(--color-ink-100)"
            fontSize="30"
            fontFamily="var(--font-display)"
            opacity="0.92"
          >
            {initials(presenter.name)}
          </text>
        </svg>

        {/* speaking indicator */}
        <div
          className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-end gap-1"
          aria-hidden="true"
        >
          {[0, 1, 2, 3, 4].map((i) => (
            <span
              key={i}
              className="w-1 rounded-full bg-gold-400"
              style={{
                height: speaking ? 14 : 4,
                transformOrigin: "bottom",
                animation: speaking
                  ? `exSpeak ${0.7 + i * 0.12}s var(--ease-cinematic) ${i * 0.08}s infinite`
                  : undefined,
                opacity: speaking ? 1 : 0.4,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
