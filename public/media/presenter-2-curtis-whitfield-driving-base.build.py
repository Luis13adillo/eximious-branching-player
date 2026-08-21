#!/usr/bin/env python3
"""
Build Curtis Whitfield's PRODUCTION DRIVING BASE from the QA-clean window of
take 2. ffmpeg only. No generation. No paid call. No interpolation and no
synthetic frames: every output frame is a copy of a decoded source frame -
only the ORDER changes.

Method and conventions follow the established Diane build,
`presenter-1-diane-marchetti-driving-base-corrected.build.py`. The `wander()`
routine is that script's, unchanged apart from its bounds.

WHY
---
`presenter-2-curtis-whitfield-motion-base-take2.mp4` passed 11 of 12 QA rows.
The one failure is confined to the head of the clip: Curtis's lips are parted
with visible teeth from about frame 5 to frame 40 (0.17-1.63 s). From frame 41
to the end the mouth is closed, the camera is locked at 1.000x, and every gate
row passes - several of them better than Diane's accepted base.

So the fix is not another generation. It is to build the base out of the clean
window only, exactly as Diane's blink defect was fixed for $0.00.

THE SOURCE MATERIAL  (1-indexed frame numbers, as extracted by ffmpeg)
---------------------------------------------------------------------
    41 - 121   THE QA-CLEAN WINDOW. Nothing outside it is touched.
       41- 53  A  13 blink-free frames
       54- 59  B1 blink one   (54 closing, 55-58 shut, 59 reopening)
       60-101  C  42 blink-free frames - the main working range
      102-107  B2 blink two   (102 closing, 103-106 shut, 107 reopening)
      108-121  D  14 blink-free frames

Frames 1-40 carry the open mouth and are DISCARDED. The build asserts that no
frame below 41 can ever enter the sequence.

CONSTRUCTION
------------
A CONTINUOUS WALK along the source frame index: every step is +1 or -1, so no
move contains a cut, and a change of direction reads as the head settling.

  * blink-free time is made by wandering inside C with varied turn points, so
    nothing repeats and there is no loop period a viewer can lock onto.
  * blinks are emitted by walking FORWARD through 54->59 or 102->107. Blink
    frames are never entered backwards, so no blink ever plays in reverse.
  * the two blinks alternate, so the base never repeats one identical blink.

JOINS
-----
A blink cannot be re-entered without leaving the range it sits in, so the walk
needs one join per blink - the same structure Diane uses.

  route B2 (blink two):  ... -> 101 -> [102..107] -> tail in D -> JOIN -> C
  route B1 (blink one):  ... -> 60  -> JOIN -> 53 -> [54..59] -> 60 -> C

Both joins are 7-frame skips across a blink, and both are chosen from the
cheapest pairs in the whole window by whole-frame RMS:

    108 -> 101   3.558      109 -> 101   3.823      110 -> 101   4.115
    108 ->  84   4.074      109 ->  84   4.125       60 ->  53   3.741

Curtis's window carries a slow continuous head drift, so - unlike Diane, whose
joins came in UNDER the largest step her source takes between two of its own
consecutive frames - no join here is that cheap. The honest bar is the one
below: measured against the source's own motion over several frames,

    source's own motion, blink-free pairs, whole-frame RMS
        1 frame   median 1.103   max 1.682
        2 frames  median 1.985   max 2.979
        3 frames  median 2.667   max 4.101
        4 frames  median 3.428   max 4.933

every join used here (3.558 - 4.125) falls inside the range the source itself
covers in 3 to 4 frames. A join is therefore a single step of motion the clip
already makes on its own - fast, but not a cut, and not a pose the source never
holds. Verified by eye on the rendered result, not only by the metric.

NO PHOTOMETRIC CORRECTION IS APPLIED
------------------------------------
Diane's base needed a per-frame multiplicative gain because Kling lifted her
exposure ~9.5% across the clip. Measured across frames 41-121 here, the total
per-channel spread is 0.799/255 - about 1.5% - which is below the 1.103 RMS the
source moves between two consecutive frames. Correcting it would mean rewriting
every pixel to chase a difference smaller than the clip's own frame-to-frame
noise. It is left alone, and every output frame stays a bit-exact copy.
"""
import subprocess, sys, os, json, glob

REPO = "/Users/luismiguel/Desktop/eximious-branching-player"
SRC  = f"{REPO}/public/media/presenter-2-curtis-whitfield-motion-base-take2.mp4"
FPS  = 24
W, H = 1920, 1080

WINDOW_LO, WINDOW_HI = 41, 121     # the QA-clean window; nothing outside it
C_LO, C_HI = 60, 101               # blink-free working range
B1 = list(range(54, 60))           # blink one, forward only
B2 = list(range(102, 108))         # blink two, forward only
A_ENTRY = 53                       # frame the B1 route joins to, just before B1
D_LO = 108                         # first frame after B2

# gap between blink ONSETS, in seconds. Irregular by design; the short ones are
# deliberate clustered doubles, which is what real blinking does.
#
# VERSION HISTORY - the only thing that has ever changed here is the LENGTH.
#   v1  the first 22 gaps below, TAIL_S 4.0  ->  2446 frames, 101.917 s.
#       Superseded: the documented batching rule is "chunk at ~120 s"
#       (docs/COST_OPTIMIZATION_267.md 6.2), and 101.917 s sits under that
#       ceiling, so a long call could still trigger loop_mode.
#   v2  all 30 gaps below, TAIL_S 4.0        ->  the current asset.
# v2 is a strict EXTENSION: same seed, same source frames, same routes, and the
# first 22 blink cycles are byte-identical to v1's, verified against v1's .seq.
GAPS = [2.5, 4.6, 1.7, 5.9, 3.4, 6.8, 2.1, 4.9, 8.1, 3.6, 1.5,
        5.2, 4.4, 7.3, 2.9, 6.1, 3.8, 1.8, 5.5, 4.2, 6.6, 3.1,
        5.0, 2.3, 7.6, 3.3, 6.4, 4.7, 2.0, 8.7]
# route B2 only: how far into D to travel after the blink, and where in C to
# rejoin. Varied so the frames around a blink are never the same twice. The
# first 11 entries are v1's, untouched, so v1's prefix is reproduced exactly.
D_DEPTH  = [1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1]
C_RETURN = [101, 101, 84, 101, 84, 101, 101, 84, 101, 101, 84, 101, 84, 101, 84]
TAIL_S   = 4.0                     # settle out at the end without another blink


class LCG:
    """Fixed-seed generator so the build is byte-reproducible."""
    def __init__(s, seed): s.x = seed & 0xFFFFFFFF
    def next(s):
        s.x = (1664525 * s.x + 1013904223) & 0xFFFFFFFF
        return s.x
    def rand(s, a, b): return a + s.next() % (b - a + 1)


def wander(start, end, n, lo, hi, rng, min_leg=12):
    """
    n single-frame steps from `start` to `end` without ever leaving [lo,hi].
    Built as a chain of LONG legs to randomly chosen turn points, so the head
    travels across the settled range instead of jittering in one corner.
    (Taken unchanged from the Diane build.)
    """
    if n < abs(end - start) or (n - abs(end - start)) % 2:
        raise ValueError(f"infeasible walk {start}->{end} in {n}")
    path, pos, left = [], start, n
    def go(to):
        nonlocal pos, left
        step = 1 if to > pos else -1
        for _ in range(abs(to - pos)):
            pos += step; path.append(pos); left -= 1
    while left > 0:
        need = abs(end - pos)
        if left == need:
            go(end); break
        def feasible(t):
            slack_after = (left - abs(t - pos)) - abs(end - t)
            return slack_after == 0 or slack_after >= 2 * min_leg
        cands = [t for t in range(lo, hi + 1)
                 if abs(t - pos) >= min_leg and left - abs(t - pos) >= abs(end - t)
                 and feasible(t)]
        if cands:
            go(cands[rng.rand(0, len(cands) - 1)])
        else:
            slack = left - need
            dep = min(slack // 2, pos - lo)
            if dep > 0:
                go(pos - dep); go(pos + dep)
            else:
                dep = min(slack // 2, hi - pos)
                if dep == 0:
                    go(end); break
                go(pos + dep); go(pos - dep)
    assert pos == end and left == 0, (pos, end, left)
    return path


def build():
    rng = LCG(20260820)
    seq = [C_HI]                 # opening frame: settled pose, eyes open
    joins  = []                  # (output index, from_src, to_src)
    onsets = []                  # output frame index of each blink onset
    pos = seq[0]
    b2_i = 0
    for i, gap in enumerate(GAPS):
        route_b2 = (i % 2 == 0)          # alternate the two blinks
        pre = C_HI if route_b2 else C_LO  # where the wander must end
        cost = (len(B2) + D_DEPTH[b2_i % len(D_DEPTH)] + 1) if route_b2 \
               else (1 + len(B1) + 1)     # frames the blink cycle itself costs
        bounce = int(round(gap * FPS)) - (0 if i == 0 else cost)
        # parity fix: the walk pos -> pre needs matching parity
        if (bounce - abs(pre - pos)) % 2:
            bounce += 1
        if bounce < abs(pre - pos):
            bounce += 2 * ((abs(pre - pos) - bounce + 1) // 2)
        seq += wander(pos, pre, bounce, C_LO, C_HI, rng)

        if route_b2:
            depth = D_DEPTH[b2_i % len(D_DEPTH)]
            ret   = C_RETURN[b2_i % len(C_RETURN)]
            b2_i += 1
            onsets.append(len(seq))                    # next emitted frame is 102
            seq += B2                                  # forward blink, never reversed
            seq += list(range(D_LO, D_LO + depth))      # tail into D
            joins.append((len(seq), seq[-1], ret))
            seq.append(ret)
            pos = ret
        else:
            joins.append((len(seq), seq[-1], A_ENTRY))  # 60 -> 53, lands just before B1
            seq.append(A_ENTRY)
            onsets.append(len(seq))                    # next emitted frame is 54
            seq += B1                                  # forward blink, never reversed
            seq.append(C_LO)                           # 59 -> 60, a normal +1 step
            pos = C_LO
    # tail: settle out for a few seconds without another blink
    tail = int(round(TAIL_S * FPS))
    end = C_HI - 10
    if (tail - abs(end - pos)) % 2:
        tail += 1
    seq += wander(pos, end, tail, C_LO, C_HI, rng)
    return seq, joins, onsets


def check(seq, joins):
    js = {j[0] for j in joins}
    lo, hi = min(seq), max(seq)
    assert lo >= WINDOW_LO and hi <= WINDOW_HI, \
        f"frame outside the QA-clean window: {lo}..{hi}"
    assert all(f not in range(1, WINDOW_LO) for f in seq), "open-mouth frame used"
    for i in range(1, len(seq)):
        if i in js:
            continue
        assert abs(seq[i] - seq[i - 1]) == 1, \
            f"non-continuous step at {i}: {seq[i-1]}->{seq[i]}"
    for i in range(1, len(seq)):
        if seq[i] in B1 + B2 and seq[i] - seq[i - 1] < 0:
            raise AssertionError(f"REVERSED BLINK at output frame {i}")
        if seq[i] in B1 + B2 and i in js:
            raise AssertionError(f"blink entered across a join at {i}")
    # every blink traversal must be a complete, in-order run
    for blink in (B1, B2):
        i = 0
        while i < len(seq):
            if seq[i] == blink[0]:
                run = seq[i:i + len(blink)]
                assert run == blink, f"partial/!in-order blink at {i}: {run}"
                i += len(blink)
            else:
                i += 1
    return True


def render(seq, out_mp4, workdir):
    frames = f"{workdir}/src"
    order  = f"{workdir}/order"
    os.makedirs(frames, exist_ok=True)
    if not glob.glob(f"{frames}/f001.png"):
        subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", SRC,
                        "-vsync", "0", f"{frames}/f%03d.png"], check=True)
    subprocess.run(["rm", "-rf", order], check=True)
    os.makedirs(order, exist_ok=True)
    # symlinks, not copies: 2400 output frames over 81 real files
    for n, f in enumerate(seq, start=1):
        os.symlink(f"{frames}/f{f:03d}.png", f"{order}/o{n:05d}.png")
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error",
                    "-framerate", str(FPS), "-i", f"{order}/o%05d.png",
                    "-c:v", "libx264", "-preset", "slow", "-crf", "12",
                    "-pix_fmt", "yuv420p", "-an", "-movflags", "+faststart",
                    out_mp4], check=True)
    return order


if __name__ == "__main__":
    out = sys.argv[1]
    workdir = sys.argv[2] if len(sys.argv) > 2 else "/tmp/curtis-base"
    os.makedirs(workdir, exist_ok=True)
    seq, joins, onsets = build()
    check(seq, joins)
    dur = len(seq) / FPS
    meta = dict(frames=len(seq), fps=FPS, dur_s=round(dur, 3),
                source_window=[WINDOW_LO, WINDOW_HI],
                unique_src_frames=sorted(set(seq)),
                blink_onsets_s=[round(o / FPS, 3) for o in onsets],
                n_blinks=len(onsets), rate_per_min=round(len(onsets) / dur * 60, 2),
                gaps_s=[round((onsets[i+1]-onsets[i]) / FPS, 3) for i in range(len(onsets)-1)],
                joins=[dict(out_frame=j[0], src_from=j[1], src_to=j[2]) for j in joins])
    # plan + frame list sit beside the asset, named like Diane's: no ".mp4." in
    # the name, so they can never be mistaken for a lesson-data sidecar.
    stem = out[:-4] if out.endswith(".mp4") else out
    json.dump(meta, open(stem + ".plan.json", "w"), indent=1)
    open(stem + ".seq", "w").write(" ".join(map(str, seq)))
    print(f"frames={len(seq)} dur={dur:.2f}s blinks={len(onsets)} "
          f"rate={meta['rate_per_min']}/min joins={len(joins)}")
    print(f"src frames used: {min(seq)}..{max(seq)}  ({len(set(seq))} distinct)")
    print(f"onsets(s): {meta['blink_onsets_s']}")
    print(f"gaps(s)  : {meta['gaps_s']}")
    if "--render" in sys.argv:
        order = render(seq, out, workdir)
        print("rendered ->", out)
        print("frame order dir:", order)
