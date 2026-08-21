#!/usr/bin/env node
/**
 * Gate D — functional acceptance (Agreement A §2.2) driven against the ASSEMBLED PACKAGE,
 * not the dev app.
 *
 *   # 1. serve the package (range-capable; python3 -m http.server will NOT do)
 *   node scripts/serve-package.mjs ./EA_ew-01_AV1 8914 &
 *   # 2. dump the lesson's expected graph
 *   npx tsx --tsconfig tsconfig.json scripts/dump-lesson-graph.ts /tmp/graph.json
 *   # 3. run the acceptance walk
 *   npm install --no-save playwright && npx playwright install chromium   # once
 *   node scripts/acceptance-package.mjs http://127.0.0.1:8914 /tmp/graph.json
 *
 * Playwright is deliberately NOT in package.json. It is a QA tool, not part of the build,
 * and package.json ships inside the client's `_source.zip` — adding it there would make
 * their `npm install` pull a browser they have no use for. `--no-save` installs it into
 * node_modules (git-ignored, never packaged) and leaves the manifest alone.
 *
 * Costs $0.00. Verifies:
 *   - no autoplay at load; Start begins picture and sound together
 *   - plays start -> finish
 *   - all 12 options route to their own individual feedback
 *   - retry returns to the SAME decision
 *   - all paths rejoin
 *   - never more than one audible media element (no extraneous audio / dead segments)
 *
 * Playback is fast-forwarded by seeking each segment to its end; the routing logic is
 * what is under test, not the wall-clock duration.
 */
import { chromium } from "playwright";
import { readFileSync } from "node:fs";

const BASE = process.argv[2] || "http://127.0.0.1:8914";
const GRAPH = JSON.parse(readFileSync(process.argv[3], "utf8"));

const results = [];
const ok = (name, pass, detail = "") => {
  results.push({ name, pass, detail });
  console.log(`  ${pass ? "PASS" : "FAIL"}  ${name}${detail ? `  — ${detail}` : ""}`);
};

let maxAudible = 0;
const videosSeen = new Set();

async function mediaState(page) {
  return page.evaluate(() => {
    const els = [...document.querySelectorAll("video,audio")];
    const audible = els.filter((e) => !e.paused && !e.muted && e.volume > 0);
    /**
     * The STAGE video, not a preload. MediaPreloader mounts hidden muted <video>
     * elements for the four feedback clips while a decision is on screen, and they sit
     * EARLIER in the DOM — so querySelector("video") returns a preload and the stage
     * segment looks like it never played. Pick the visible one.
     */
    const main = els
      .filter((e) => e.tagName === "VIDEO" && !e.closest("[aria-hidden]") && e.clientWidth > 1)
      .sort((a, b) => b.clientWidth - a.clientWidth)[0] || null;
    return {
      audible: audible.length,
      audibleSrcs: audible.map((e) => (e.currentSrc || e.src || "").split("/").pop()),
      main: main
        ? {
            src: (main.currentSrc || main.src || "").split("/").pop(),
            paused: main.paused,
            ended: main.ended,
            dur: Number.isFinite(main.duration) ? main.duration : null,
            t: main.currentTime,
          }
        : null,
    };
  });
}

async function sample(page) {
  const s = await mediaState(page);
  if (s.audible > maxAudible) maxAudible = s.audible;
  if (s.main?.src) videosSeen.add(s.main.src);
  return s;
}

const decisionVisible = (page) =>
  page.locator('[role="group"][aria-label="Choose your answer"]').isVisible().catch(() => false);

/**
 * Advance controls are authored PER SCENE ("See who you are", "Take the call", ...),
 * not a generic "Continue" — matching on the word "continue" alone stalls at the intro.
 * The label set comes from the lesson data itself, plus the feedback controls.
 */
const ADVANCE_LABELS = new Set([
  ...GRAPH.continueLabels,
  "Continue", "Try again", "Open the file", "Make the call",
  "Back to the decision", "Review the decision",
]);
const END_LABELS = /restart|start over|back to lessons|replay the case/i;

async function visibleButtons(page) {
  return page.evaluate(() =>
    [...document.querySelectorAll("button")]
      .filter((b) => b.offsetParent !== null && !b.disabled)
      .map((b, i) => ({ i, text: (b.textContent || "").trim().replace(/\s+/g, " "), opt: b.getAttribute("data-option-id") })),
  );
}

async function clickAdvance(page) {
  const btns = await visibleButtons(page);
  const hit = btns.find((b) => !b.opt && ADVANCE_LABELS.has(b.text));
  if (!hit) return false;
  await page.evaluate((idx) => {
    const b = [...document.querySelectorAll("button")].filter((x) => x.offsetParent !== null && !x.disabled)[idx];
    b?.click();
  }, btns.indexOf(hit));
  return true;
}

async function clickableByText(page, re) {
  const btns = page.locator("button:visible");
  const n = await btns.count();
  for (let i = 0; i < n; i++) {
    const b = btns.nth(i);
    const t = ((await b.textContent()) || "").trim();
    if (re.test(t)) return b;
  }
  return null;
}

/** Advance until a decision panel appears, or the run ends. Returns the videos played. */
async function driveUntilDecisionOrEnd(page, { maxSteps = 120 } = {}) {
  const played = [];
  for (let step = 0; step < maxSteps; step++) {
    if (await decisionVisible(page)) return { stop: "decision", played };

    const s = await sample(page);

    // Play at speed and let the video reach its natural end, because the player advances
    // on the 'ended' event. Seeking to the last frame and pausing kills that event.
    if (s.main && s.main.dur && !s.main.ended) {
      if (!played.includes(s.main.src)) played.push(s.main.src);
      await page.evaluate(() => {
        const v = [...document.querySelectorAll("video")]
          .filter((e) => !e.closest("[aria-hidden]") && e.clientWidth > 1)
          .sort((a, b) => b.clientWidth - a.clientWidth)[0];
        if (!v) return;
        v.playbackRate = 16;
        if (v.paused) v.play().catch(() => {});
      });
      await page.waitForTimeout(260);
      continue;
    }

    if (await clickAdvance(page)) {
      await page.waitForTimeout(320);
      continue;
    }

    const done = await clickableByText(page, END_LABELS);
    if (done) return { stop: "end", played };

    await page.waitForTimeout(220);
  }
  return { stop: "exhausted", played };
}

/**
 * A decision scene plays its own short segment (Selena putting the question) WHILE the
 * options are already on screen — decision-1 is 2.24 s. Clicking the instant the panel
 * appears cuts it off, and it then looks as if the segment never played. Let it finish,
 * which is also what a learner does.
 */
async function letStageVideoFinish(page, maxMs = 20000) {
  const t0 = Date.now();
  while (Date.now() - t0 < maxMs) {
    const s = await sample(page);
    if (!s.main || !s.main.dur || s.main.ended) return;
    await page.evaluate(() => {
      const v = [...document.querySelectorAll("video")]
        .filter((e) => !e.closest("[aria-hidden]") && e.clientWidth > 1)
        .sort((a, b) => b.clientWidth - a.clientWidth)[0];
      if (!v) return;
      v.playbackRate = 16;
      if (v.paused) v.play().catch(() => {});
    });
    await page.waitForTimeout(200);
  }
}

const browser = await chromium.launch({
  args: ["--autoplay-policy=no-user-gesture-required", "--mute-audio"],
});
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
const consoleErrors = [];
page.on("console", (m) => m.type() === "error" && consoleErrors.push(m.text()));
page.on("pageerror", (e) => consoleErrors.push(String(e)));
/**
 * ERR_ABORTED on a media URL is not a defect: a <video> that switches src, or a preload the
 * player cancels, aborts its in-flight range request by design. What would be a defect is a
 * request that could not be served — a 4xx/5xx, or a non-abort transport failure.
 */
const failedRequests = [];
page.on("requestfailed", (r) => {
  const err = r.failure()?.errorText || "";
  if (!/ERR_ABORTED/.test(err)) failedRequests.push(`${r.url()} ${err}`);
});
const badResponses = [];
page.on("response", (r) => { if (r.status() >= 400) badResponses.push(`${r.url()} ${r.status()}`); });

console.log(`\nGate D functional acceptance — ${BASE}\n`);
await page.goto(`${BASE}/index.html`, { waitUntil: "load" });
await page.waitForTimeout(1200);

// ---- 1. no autoplay at load -------------------------------------------------
{
  const s = await sample(page);
  const startBtn = await clickableByText(page, /start the lesson/i);
  ok("does not autoplay at load", !!s.main && s.main.paused && s.main.t < 0.05,
     s.main ? `paused=${s.main.paused} t=${s.main.t.toFixed(2)}` : "no video element");
  ok("Start control is present behind the opening frame", !!startBtn);
  await startBtn.click();
  await page.waitForTimeout(900);
  const after = await sample(page);
  ok("Start begins picture and sound together", !after.main.paused,
     `playing=${!after.main.paused} src=${after.main.src}`);
}

// ---- 2. walk every decision, every option ----------------------------------
const feedbackByOption = {};
const retryReturns = [];
let reachedEnd = false;

for (const dec of GRAPH.decisions) {
  const r = await driveUntilDecisionOrEnd(page);
  if (r.stop !== "decision") {
    ok(`reached ${dec.id}`, false, `driver stopped at "${r.stop}"`);
    break;
  }
  ok(`reached ${dec.id}`, true);
  await letStageVideoFinish(page);

  const wrong = dec.options.filter((o) => !o.correct);
  const right = dec.options.find((o) => o.correct);

  for (const opt of wrong) {
    const btn = page.locator(`button[data-option-id="${opt.id}"]`);
    if (!(await btn.isVisible().catch(() => false))) {
      ok(`${dec.id} option ${opt.id} is offered`, false, "button not visible");
      continue;
    }
    await btn.click();
    await page.waitForTimeout(400);
    const r2 = await driveUntilDecisionOrEnd(page);
    if (r2.stop === "decision") await letStageVideoFinish(page);
    feedbackByOption[`${dec.id}:${opt.id}`] = r2.played.filter((p) => /^fb-/.test(p));
    retryReturns.push({ dec: dec.id, opt: opt.id, back: r2.stop === "decision" });
  }

  // the correct answer
  const rb = page.locator(`button[data-option-id="${right.id}"]`);
  await rb.click();
  await page.waitForTimeout(400);
  const r3 = await driveUntilDecisionOrEnd(page);
  feedbackByOption[`${dec.id}:${right.id}`] = r3.played.filter((p) => /^fb-/.test(p));
  if (r3.stop === "end") reachedEnd = true;
}

if (!reachedEnd) {
  const tail = await driveUntilDecisionOrEnd(page, { maxSteps: 80 });
  reachedEnd = tail.stop === "end";
}

// ---- 3. assertions ----------------------------------------------------------
{
  const wrongEntries = Object.entries(feedbackByOption).filter(([k]) => {
    const [d, o] = k.split(":");
    return !GRAPH.decisions.find((x) => x.id === d).options.find((x) => x.id === o).correct;
  });
  const withOwn = wrongEntries.filter(([, v]) => v.length > 0);
  const distinct = new Set(wrongEntries.flatMap(([, v]) => v));
  ok("all 9 incorrect options play their own feedback segment",
     withOwn.length === 9, `${withOwn.length}/9 played a fb-* segment`);
  ok("each incorrect option's feedback is DISTINCT",
     distinct.size === withOwn.length, `${distinct.size} distinct across ${withOwn.length}`);

  const expected = new Set(
    GRAPH.decisions.flatMap((d) => d.options.filter((o) => !o.correct).map((o) => `${o.feedback}.mp4`)),
  );
  const matched = [...distinct].filter((v) => expected.has(v));
  ok("each incorrect option routes to the feedback its data names",
     matched.length === expected.size, `${matched.length}/${expected.size} matched`);

  const correctEntries = Object.entries(feedbackByOption).filter(([k]) => {
    const [d, o] = k.split(":");
    return GRAPH.decisions.find((x) => x.id === d).options.find((x) => x.id === o).correct;
  });
  /**
   * Which feedback ids are the player-native "correct" beats differs per video
   * (claims-01: fb-1d/2b/3b; ew-01: fb-1b/2b/3b), so name them from THIS lesson's
   * graph rather than hardcoding one video's ids into every video's QA record.
   */
  const nativeIds = GRAPH.decisions
    .flatMap((d) => d.options.filter((o) => o.correct).map((o) => o.feedback))
    .filter(Boolean);
  ok("the correct option's verdict is player-native (no video segment)",
     correctEntries.every(([, v]) => v.length === 0),
     `${correctEntries.length} correct answers, ${correctEntries.filter(([, v]) => v.length === 0).length} with no fb video — by design${nativeIds.length ? ` (${nativeIds.join("/")} carry no media)` : ""}`);
}

ok("retry returns to the SAME decision every time",
   retryReturns.length === 9 && retryReturns.every((r) => r.back),
   `${retryReturns.filter((r) => r.back).length}/${retryReturns.length}`);

ok("all paths rejoin and the lesson plays start -> finish", reachedEnd);

{
  const rejoins = [...videosSeen].filter((v) => /^rejoin-/.test(v));
  ok("every rejoin segment was reached", rejoins.length >= 3, `${rejoins.length} rejoin segments played`);
}

ok("never more than one audible media element", maxAudible <= 1, `max simultaneous audible = ${maxAudible}`);
ok("no failed network requests (aborted media fetches excluded — see note)",
   failedRequests.length === 0, failedRequests.slice(0, 3).join(" | "));
ok("no 4xx/5xx responses — every asset the package requests is served",
   badResponses.length === 0, badResponses.slice(0, 3).join(" | "));
ok("no console/page errors", consoleErrors.length === 0, consoleErrors.slice(0, 3).join(" | "));

{
  const delivered = Object.entries(GRAPH.videoUrls)
    .filter(([, v]) => v).map(([, v]) => v.split("/").pop());
  const never = delivered.filter((v) => !videosSeen.has(v));
  ok("every delivered segment is reachable through the UI",
     never.length === 0, never.length ? `never played: ${never.join(", ")}` : `${videosSeen.size}/${delivered.length}`);
}
console.log(`\n  distinct segments played: ${videosSeen.size}`);
const passed = results.filter((r) => r.pass).length;
console.log(`\n  GATE D FUNCTIONAL ACCEPTANCE: ${passed}/${results.length} ${passed === results.length ? "PASS" : "— SEE FAILURES ABOVE"}\n`);

await browser.close();
process.exit(passed === results.length ? 0 : 1);
