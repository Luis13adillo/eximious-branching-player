#!/usr/bin/env python3
"""
Build Selena Navarro's PRODUCTION DRIVING BASE from the usable arc of her
approved motion base. ffmpeg only. No generation. No paid call. No
interpolation and no synthetic frames: every output frame is a copy of a
decoded source frame - only the ORDER changes.

Method and conventions follow the established Diane and Curtis builds,
`presenter-1-diane-marchetti-driving-base-corrected.build.py` and
`presenter-2-curtis-whitfield-driving-base.build.py`. The `wander()` routine is
those scripts', unchanged apart from its bounds and `min_leg`.

THE SOURCE
----------
`presenter-3-selena-navarro-motion-base.mp4` - 121 frames, 24 fps, 1920x1080,
no audio. QA gate PASS, accepted 2026-08-20. Lips are sealed in all 121 frames
(tracked lip-aperture floor 55.4/255; an exposed oral cavity reads under 30),
so unlike Curtis there is no open-mouth defect to design around.

It contains exactly TWO blinks, confirmed by eye on motion-TRACKED eye crops of
every frame, not by a fixed box - this base translates the face by up to 21 px
vertically, and a fixed box measures that drift rather than the eyelid:

    blink 1   frames 23-27   (22 last open, 28 first open again)
    blink 2   frames 52-56   (51 last open, 57 first open again)

WHY THE WINDOW IS 1-51
----------------------
The clip is two disconnected halves, and the measurement is unambiguous.

Frames 51-80 carry a large head move - the head rises ~21 px and comes back -
and frames 81-121 settle out of it. That is the most movement in the clip, and
blink 2 sits at its start. Reaching it means crossing blink 2, and a blink may
only ever be walked FORWARD, so the walk would have to join back down across
it. The cheapest such join is

    62 -> 51   10.975      (cheapest of ANY upper->lower pair in the clip)

against the motion the source makes on its own:

    source's own motion, blink-free pairs, whole-frame RMS
        1 frame   median 1.566   max 3.867
        2 frames  median 2.622   max 6.543
        3 frames  median 3.764   max 8.408
        5 frames  median 5.340   max 10.721
        6 frames  median 5.886   max 11.586

10.975 is a SIX-frame jump - the extreme tail of what the source ever does. It
would read as a cut. The two halves are genuinely disconnected: the head is
simply somewhere else.

Blink 1 prices completely differently, because the head is calm around it:

    28 -> 22    3.317      <- used
    29 -> 22    3.686      <- used
    28 -> 21    4.128      <- used
    29 -> 21    4.154      <- used

Every one sits between the source's own 2-frame and 3-frame step. A join here
is a step of motion the clip already takes on its own.

So the base is built on the arc AROUND BLINK 1, frames 1-51. That arc is also
the expression-consistent half: the tracked lip-aperture proxy runs 75-85 across
frames 1-51 and 56-60 across frames 57-121 (the closed-lip smile relaxing to
neutral, the drift accepted as non-blocking in the motion base's own sidecar).
Building inside one half means the delivered base never oscillates between the
two expressions.

CONSTRUCTION
------------
A CONTINUOUS WALK along the source frame index: every step is +1 or -1, so no
move contains a cut, and a change of direction reads as the head settling.

The blink splits the window into two pools:

    L = [ 1, 22]   22 frames   below the blink
    U = [28, 51]   24 frames   above the blink

and the walk moves between them ASYMMETRICALLY, which is what makes this
cheaper than Curtis's structure:

    L -> U   is the BLINK ITSELF, walked forward 22 -> 23,24,25,26,27 -> 28.
             No join at all. The up-transit IS the blink.
    U -> L   is the one join, skipping backwards over the blink.

So there is exactly ONE join per blink, and no blink frame is ever entered
travelling backwards or across a join.

Head travel is preserved, not flattened: L carries ~8 px of vertical settle
(concentrated in frames 1-9) and U a further ~6 px, and the walk uses the full
extent of both. Diane's shipped base moved 0.42 px RMS and that is recorded as
her known limitation; this one is built to keep the movement the source has.

NO PHOTOMETRIC CORRECTION IS APPLIED
------------------------------------
Take 3 was already exposure-corrected before acceptance (2.59% -> 0.12% peak).
Across frames 1-51 the per-channel mean spread measures 0.23/255 (~0.24%),
far below the 1.566 RMS the source moves between two consecutive frames.
Correcting it would rewrite every pixel to chase a difference smaller than the
clip's own frame-to-frame noise. It is left alone, and every output frame stays
a bit-exact copy.
"""
import subprocess, sys, os, json, glob

REPO = "/Users/luismiguel/Desktop/eximious-branching-player"
SRC  = f"{REPO}/public/media/presenter-3-selena-navarro-motion-base.mp4"
FPS  = 24
W, H = 1920, 1080

WINDOW_LO, WINDOW_HI = 1, 51       # the usable arc; nothing outside it
L_LO, L_HI = 1, 22                 # lower blink-free pool
U_LO, U_HI = 28, 51                # upper blink-free pool
BLINK = list(range(23, 28))        # frames 23-27, forward only
BLINK_ENTRY = 22                   # last fully-open frame before the blink
BLINK_EXIT  = 28                   # first fully-open frame after it

# gap between blink ONSETS, in seconds. Irregular by design; the short ones are
# deliberate clustered doubles, which is what real blinking does.
GAPS = [2.4, 5.1, 1.6, 6.7, 3.3, 4.8, 8.2, 2.7, 1.5, 5.6, 3.9,
        7.1, 2.2, 6.3, 4.5, 1.9, 5.8, 3.4, 8.6, 2.6, 4.1, 6.9,
        1.7, 5.3, 3.7, 7.4, 2.9, 6.1, 4.4, 2.0, 5.9]
# the four cheapest backward joins over the blink, cycled so the frames around a
# blink are never the same twice.
JOINS = [(28, 22), (29, 22), (28, 21), (29, 21)]
# share of each gap's wander budget spent in U rather than L. Varied so the two
# pools are not visited in a fixed rhythm.
U_SHARE = [0.70, 0.62, 0.75, 0.58, 0.68, 0.72, 0.60, 0.66]
TAIL_S  = 4.0                      # settle out at the end without another blink
START   = 40                       # opening frame: settled, mid-U pose
END     = 38                       # closing frame: near START, for loop fit


class LCG:
    """Fixed-seed generator so the build is byte-reproducible."""
    def __init__(s, seed): s.x = seed & 0xFFFFFFFF
    def next(s):
        s.x = (1664525 * s.x + 1013904223) & 0xFFFFFFFF
        return s.x
    def rand(s, a, b): return a + s.next() % (b - a + 1)


def wander(start, end, n, lo, hi, rng, min_leg=10):
    """
    n single-frame steps from `start` to `end` without ever leaving [lo,hi].
    Built as a chain of LONG legs to randomly chosen turn points, so the head
    travels across the pool instead of jittering in one corner.
    (Taken unchanged from the Diane and Curtis builds; min_leg is 10 here
    because these pools are 22-24 frames rather than 42-45.)
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


def fit(n, start, end, floor=0):
    """Smallest n' >= max(n, floor) reachable from start to end by +-1 steps."""
    n = max(n, floor, abs(end - start))
    if (n - abs(end - start)) % 2:
        n += 1
    return n


def build():
    rng = LCG(20260820)
    seq = [START]
    joins  = []                    # (output index, from_src, to_src)
    onsets = []                    # output frame index of each blink onset
    pos = START
    for i, gap in enumerate(GAPS):
        j_src, j_tgt = JOINS[i % len(JOINS)]
        share = U_SHARE[i % len(U_SHARE)]
        # a blink cycle costs: join(1) + blink(5) + the +1 step onto BLINK_EXIT
        budget = int(round(gap * FPS)) - (0 if i == 0 else (1 + len(BLINK) + 1))
        budget = max(budget, 0)
        nU = fit(int(round(budget * share)), pos, j_src)
        nL = fit(budget - nU, j_tgt, BLINK_ENTRY)

        seq += wander(pos, j_src, nU, U_LO, U_HI, rng)     # ... wander in U
        joins.append((len(seq), seq[-1], j_tgt))
        seq.append(j_tgt)                                   # JOIN back over the blink
        seq += wander(j_tgt, BLINK_ENTRY, nL, L_LO, L_HI, rng)  # ... wander in L
        onsets.append(len(seq))                             # next emitted frame is 23
        seq += BLINK                                        # forward blink, never reversed
        seq.append(BLINK_EXIT)                              # 27 -> 28, a normal +1 step
        pos = BLINK_EXIT
    tail = fit(int(round(TAIL_S * FPS)), pos, END)
    seq += wander(pos, END, tail, U_LO, U_HI, rng)
    return seq, joins, onsets


def check(seq, joins):
    js = {j[0] for j in joins}
    lo, hi = min(seq), max(seq)
    assert lo >= WINDOW_LO and hi <= WINDOW_HI, \
        f"frame outside the usable window: {lo}..{hi}"
    for i in range(1, len(seq)):
        if i in js:
            continue
        assert abs(seq[i] - seq[i - 1]) == 1, \
            f"non-continuous step at {i}: {seq[i-1]}->{seq[i]}"
    for i in range(1, len(seq)):
        if seq[i] in BLINK and seq[i] - seq[i - 1] < 0:
            raise AssertionError(f"REVERSED BLINK at output frame {i}")
        if seq[i] in BLINK and i in js:
            raise AssertionError(f"blink entered across a join at {i}")
    # a join must never LAND on a blink frame either
    for idx, a, b in joins:
        assert b not in BLINK, f"join lands on a blink frame at {idx}"
    # every blink traversal must be a complete, in-order run
    i = 0
    runs = 0
    while i < len(seq):
        if seq[i] == BLINK[0]:
            run = seq[i:i + len(BLINK)]
            assert run == BLINK, f"partial/!in-order blink at {i}: {run}"
            runs += 1
            i += len(BLINK)
        else:
            i += 1
    assert runs == len(joins), f"{runs} blink runs vs {len(joins)} joins"
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
    # symlinks, not copies: thousands of output frames over 51 real files
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
    workdir = sys.argv[2] if len(sys.argv) > 2 else "/tmp/selena-base"
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
    stem = out[:-4] if out.endswith(".mp4") else out
    json.dump(meta, open(stem + ".plan.json", "w"), indent=1)
    open(stem + ".seq", "w").write(" ".join(map(str, seq)))
    print(f"frames={len(seq)} dur={dur:.3f}s blinks={len(onsets)} "
          f"rate={meta['rate_per_min']}/min joins={len(joins)}")
    print(f"src frames used: {min(seq)}..{max(seq)}  ({len(set(seq))} distinct)")
    print(f"gaps(s)  : {meta['gaps_s']}")
    if "--render" in sys.argv:
        order = render(seq, out, workdir)
        print("rendered ->", out)
