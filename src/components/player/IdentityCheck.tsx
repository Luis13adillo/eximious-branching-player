"use client";

import { useEffect, useRef } from "react";
import { CheckIcon } from "@/components/ui/icons";

/**
 * IdentityCheck — a simple, reusable "are you still there?" modal.
 * The learner must acknowledge presence before the lesson continues. No
 * biometrics, no login, no external identity service — one button. It's a
 * blocking, focus-trapped dialog so it can't be dismissed by clicking away or
 * pressing Escape; only the acknowledge button resumes the lesson. The player
 * pauses media before showing this and resumes on acknowledge.
 */
export function IdentityCheck({
  title,
  body,
  acknowledgeLabel,
  onAcknowledge,
}: {
  title: string;
  body: string;
  acknowledgeLabel: string;
  onAcknowledge: () => void;
}) {
  const btnRef = useRef<HTMLButtonElement>(null);

  // Move focus onto the acknowledge button and keep it trapped in the dialog.
  useEffect(() => {
    btnRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Tab") {
        e.preventDefault();
        btnRef.current?.focus();
      } else if (e.key === "Escape") {
        // Presence check can't be escaped — it must be acknowledged.
        e.preventDefault();
      } else if (e.key === "Enter" || e.key === " ") {
        // Enter/Space acknowledges (button already focused, but be explicit).
        e.preventDefault();
        onAcknowledge();
      }
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [onAcknowledge]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="ex-idcheck-title"
      aria-describedby="ex-idcheck-body"
      className="ex-animate-fade fixed inset-0 z-50 flex items-center justify-center bg-navy-950/85 p-5 backdrop-blur-sm"
    >
      <div className="w-full max-w-md rounded-2xl border border-white/12 bg-navy-900 p-6 shadow-2xl shadow-black/50 sm:p-7">
        <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-full bg-gold-500/15 ring-1 ring-gold-500/40">
          <span className="relative flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full rounded-full bg-gold-400/70 [animation:exPulseRing_1.8s_ease-out_infinite]" />
            <span className="relative inline-flex h-3 w-3 rounded-full bg-gold-400" />
          </span>
        </div>
        <h2
          id="ex-idcheck-title"
          className="font-[family-name:var(--font-display)] text-xl leading-snug text-ink-100"
        >
          {title}
        </h2>
        <p
          id="ex-idcheck-body"
          className="mt-2 font-sans text-[14px] leading-relaxed text-ink-200"
        >
          {body}
        </p>
        <button
          ref={btnRef}
          type="button"
          onClick={onAcknowledge}
          className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gold-500 px-4 py-3 font-sans text-[15px] font-semibold text-navy-950 transition-colors hover:bg-gold-400"
        >
          <CheckIcon className="h-4 w-4" />
          {acknowledgeLabel}
        </button>
      </div>
    </div>
  );
}
