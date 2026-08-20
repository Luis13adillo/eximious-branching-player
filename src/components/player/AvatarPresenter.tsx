"use client";

import type { Presenter } from "@/lib/branching/types";

/**
 * AvatarPresenter
 * ============================================================================
 * Placeholder shown before a delivered presenter segment exists. Rendered as a soft,
 * cinematically-lit portrait — a rim-lit head-and-shoulders form under a warm
 * key light, softly blurred so it reads as an out-of-focus person on a studio
 * set rather than clip art. A "speaking" equalizer animates while playing.
 * When a real avatar video is supplied the <video> fills this frame instead
 * (handled by MediaStage) and this is not shown — so the provider swaps in with
 * no layout change. The presenter's name/role appear in the stage's identity
 * tag, so no lettering is drawn here.
 */
export function AvatarPresenter({ speaking }: { presenter: Presenter; speaking: boolean }) {
  return (
    <div className="absolute inset-0 flex items-end justify-center">
      <div className="relative h-[78%] w-[min(58%,360px)]">
        <svg
          viewBox="0 0 220 260"
          className="h-full w-full"
          aria-hidden="true"
          preserveAspectRatio="xMidYMax meet"
        >
          <defs>
            {/* warm key from upper-left, cool shadow side */}
            <linearGradient id="pres-body" x1="0.15" y1="0" x2="0.9" y2="1">
              <stop offset="0" stopColor="#3b567f" />
              <stop offset="0.5" stopColor="#26364f" />
              <stop offset="1" stopColor="#141f30" />
            </linearGradient>
            <filter id="pres-soft" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="2.2" />
            </filter>
          </defs>

          <g filter="url(#pres-soft)">
            {/* shoulders / torso */}
            <path
              d="M12 260 C22 188 62 164 110 164 C158 164 198 188 208 260 Z"
              fill="url(#pres-body)"
            />
            {/* neck */}
            <rect x="94" y="118" width="32" height="52" rx="14" fill="#26364f" />
            {/* head */}
            <ellipse cx="110" cy="92" rx="40" ry="46" fill="url(#pres-body)" />
          </g>

          {/* warm rim light along the key-side edge */}
          <g filter="url(#pres-soft)" opacity="0.9">
            <path
              d="M70 60 C58 78 56 104 66 130"
              stroke="var(--color-gold-300)"
              strokeWidth="3"
              fill="none"
              opacity="0.55"
            />
            <path
              d="M150 62 C162 80 164 104 156 128"
              stroke="var(--color-gold-300)"
              strokeWidth="2"
              fill="none"
              opacity="0.3"
            />
          </g>
        </svg>

        {/* speaking indicator */}
        <div
          className="absolute bottom-6 left-1/2 flex -translate-x-1/2 items-end gap-1"
          aria-hidden="true"
        >
          {[0, 1, 2, 3, 4].map((i) => (
            <span
              key={i}
              className="w-1 rounded-full bg-gold-400"
              style={{
                height: speaking ? 15 : 4,
                transformOrigin: "bottom",
                animation: speaking
                  ? `exSpeak ${0.7 + i * 0.12}s var(--ease-cinematic) ${i * 0.08}s infinite`
                  : undefined,
                opacity: speaking ? 0.95 : 0.35,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
