# fal-ai/sync-lipsync v1 — quality-first fallback, NOT APPROVED FOR USE

**Do not route anything here without explicit written approval.** This file exists so the
fallback is costed and visible, not so it can be slipped in. Pipeline rule 1 makes
`fal-ai/latentsync` the catalog engine.

| Field | Value |
|---|---|
| Model ID | `fal-ai/sync-lipsync` (v1) |
| Provider | fal.ai |
| Method | Async |
| Type | Video (video + audio in) |
| API key | env `FAL_KEY`, header `Authorization: Key {FAL_KEY}` |
| Cost | **$0.70 per minute** — ~2.3× LatentSync at catalog scale |

## The one scenario it is pre-costed for

**If Roger rejects Curtis's beard softness at review**, route **Curtis only** here.
≈ **+$274** across the catalog, taking it to ≈$1,364 at 20% revisions — still inside the
$1,500 ceiling — and **nothing else changes**: same scripts, same batching, same gates, same
player, same packaging.

Whole-catalog routing here would be **$1,984** base. That is inside the ceiling but leaves no
room for revisions, and it buys nothing on the two presenters whose gates already pass.

## Withdrawn architectures — recorded so they are not re-proposed

| Route | Catalog cost | Why it is out |
|---|---|---|
| `volcengine/video-to-video-lip-sync` (KIE) @ $0.04/s | **$6,552** | 5.2× over ceiling. The original proposal — it priced lip-sync without surveying the dubbing market and assumed one call per segment |
| KIE `infinitalk` | — | **Permanently excluded.** 720p max against a contractual 1920×1080 floor, ~12× the per-second cost |
| HeyGen | — | **Permanently excluded.** Never used on this project |
| Arch 2b hybrid — 9 wrong-answer branches as title card + voiceover | $1,406 | Inside budget, but it **changes the storyboard and needs Roger's approval**. Not needed to hit budget, not recommended |
