# Stage 12 — GATE D · functional acceptance

**Cost $0.00. Gate D has TWO HALVES and they must be reported separately.**

1. **Driven functional acceptance — 18 checks.** In scope for this skill. PASSED 18/18 on all
   three pilots.
2. **Real devices — iOS Safari and Android Chrome.** **HELD / EXTERNAL.** Not done on any
   delivered pilot. Deferred, not waived. **Never report half 1 as if it were half 2.**

---

## Half 1 — the driven run

Runs a real Chromium browser against the **assembled package** — not the dev app, and not the
lesson data in isolation. It clicks **all twelve options** — every wrong answer at every
decision, then the right one — and checks each against the routing the lesson's own graph
declares. Playback is fast-forwarded by seeking each segment to its end; **routing is what is
under test, not the wall clock.**

```bash
node scripts/serve-package.mjs ./EA_<slug>_AV<n> 8915 &
npx tsx --tsconfig tsconfig.json scripts/dump-lesson-graph.ts /tmp/graph.json <lesson-slug>
npm install --no-save playwright && npx playwright install chromium   # once
node scripts/acceptance-package.mjs http://127.0.0.1:8915 /tmp/graph.json
```

**Playwright is deliberately NOT in `package.json`.** `package.json` ships inside the client's
`_source.zip`, and adding it would make their `npm install` pull a browser they have no use
for. `--no-save` keeps the manifest clean.

`BASE` may be a bare origin, so **the same harness verifies a package or a live deployment.**

### The 18 checks

no autoplay at load · Start control present behind the opening frame · Start begins picture
and sound together · all three decisions reached · 9 incorrect options each play their own
feedback · each is distinct · each routes to the feedback its data names · correct verdicts
are player-native with no video · retry returns to the SAME decision · all paths rejoin ·
lesson plays start→finish · every rejoin segment reached · every delivered segment reachable ·
never more than one audible media element · no failed network requests · no 4xx/5xx · no
console errors · no page errors.

### The serving requirement is not a detail

**The server MUST answer HTTP byte-range requests (206) and handle concurrency.** A decision
scene preloads all four of its feedback clips, so the player has **five videos in flight at
once**.

`python3 -m http.server` answers ranges with `200 OK` and the whole file, and serves one
connection at a time. Observed 2026-08-21: **every wrong answer spun forever and never
played.** The same package on `scripts/serve-package.mjs` played correctly on the first try,
with **no change to the package or the player**. This was already written down in one QA log
and was missed anyway.

### The lesson-slug trap

The slug passed to `dump-lesson-graph.ts` is the **registry slug**, which is not required to
match the media key. claims-01's is `claims-investigation-application-1`, not `claims-01-av1`.
**Passing the wrong one fails outright.**

### A QA harness is a deliverable too

Three real harness bugs on this project, all fixed, all worth remembering:

1. **`serve-package.mjs` 404'd every file.** `join()` normalises `./EA_x` to `EA_x`, so the
   containment guard `file.startsWith(ROOT)` never matched — and the broken form was the
   serve command *both other QA logs told you to run*. `ROOT` is now resolved absolute.
2. **A metadata race produced a false negative.** A stage video whose metadata had not arrived
   reported `dur === null`, so the drive loop did not record it as played and clicked past it.
   On localhost metadata is instant and it never fired; against a deployed origin it fired on
   **every feedback clip**, reporting "0/9 incorrect options played their own feedback" while
   the same run reported all 22 segments reachable. It now **waits for metadata**, which makes
   the check stricter. **Live Gate D went 16/18 → 18/18 on all three.**
3. **The printed evidence string hardcoded one lesson's player-native scene ids** for every
   video. The assertion underneath was always correct — only the record lied. Ids are now read
   from the lesson's own graph.

**Verify the harness against a known-good package before trusting a failure it reports.**

---

## Half 2 — real devices · HELD, EXTERNAL

Interactive Video Production Guidelines §04 requires **device, browser, viewport, defects and
final disposition**, on **iOS Safari and Android Chrome**, against the assembled package
served over the LAN on a byte-range-capable server.

**Not run on any of the three delivered pilots.** claims-01's round 1 ran 2026-08-19 against
the **v2** package and does not transfer. siu-01's attempt failed because the phone could not
reach the Mac over the LAN (`192.168.12.153:8913`) — **not diagnosed**.

**When it runs, record:** iOS version, device, **Low Power Mode state**, **ringer/silent
switch position**, and whether audio starts after the Start press.

**Two clean handsets close the open R1-5 iOS opening-audio item for all three pilots at
once.** The locked Start gate is expected to have already fixed it — starting inside a real
user gesture makes desktop Chrome, mobile Chrome and iOS Safari behave identically — but that
is an expectation, not a result.

**This is a human step. Do not automate it, and do not claim it.**

## Exit criteria

18/18 on half 1, reported as functional acceptance. Half 2 reported as **held**, with its
current status stated plainly.
