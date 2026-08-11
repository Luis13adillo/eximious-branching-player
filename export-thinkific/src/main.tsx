/*
  Static entry for the Thinkific HTML5 package.
  ------------------------------------------------------------------
  Renders the EXACT approved player with the approved claims-investigation
  lesson — the same component tree the Next.js /lesson/[slug] page renders,
  wrapped in the identical shell. No Next.js runtime, no server, no APIs.
*/
import { createRoot } from "react-dom/client";

// Self-hosted variable fonts (inlined into index.html at build time — no
// external font requests, matching the Next app's next/font behavior).
import "@fontsource-variable/fraunces";
import "@fontsource-variable/inter";

// Approved theme + Tailwind utilities for the shared components.
import "./styles.css";

// The approved player boundary and the approved lesson data, reused verbatim.
import { PlayerClient } from "@/components/player/PlayerClient";
import { claimsInvestigationApplication1 } from "@/lib/lessons/claims-investigation-application-1";

const el = document.getElementById("root");
if (el) {
  createRoot(el).render(
    // Same wrapper as src/app/lesson/[slug]/page.tsx.
    <div className="min-h-[100dvh] w-full bg-navy-950">
      <PlayerClient lesson={claimsInvestigationApplication1} />
    </div>,
  );
}
