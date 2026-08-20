#!/usr/bin/env python3
"""
Build a corrected, longer Diane driving base from the APPROVED motion base.
ffmpeg only. No generation. No paid call. Every output frame is a bit-exact
copy of a frame of the approved base - only the ORDER changes.

WHY
---
The approved base is 121 frames / 5.04 s at 24 fps and contains FOUR blinks
(ground truth read off frame-by-frame contact sheets: onsets at frames 13, 34,
56, 105). That is 47.6 blinks/min in the source itself. LatentSync then
pingpongs it to cover the narration, so the delivered video repeats those four
blinks every 5.04 s AND plays half of them backwards on the reverse leg.

THE SOURCE MATERIAL
-------------------
  frames  0- 60  a one-way settling drift (the head moves into position).
                 It cannot be revisited without a visible pose jump, and it
                 carries three of the four blinks. NOT USED.
  frames 60-120  the settled on-camera pose. Contains exactly ONE blink
                 (frames 105-110). This is the whole working set.

    D = [60,104]  45 blink-free frames
    B = [105,110] the single blink
    E = [111,120] 10 blink-free frames

CONSTRUCTION
------------
The output is a CONTINUOUS WALK along the source frame index: every step is
+1 or -1, so there is no cut anywhere inside a move - a join is a change of
direction, which reads as the head settling rather than as an edit.

  * blink-free time is made by wandering inside D with varied turn points, so
    nothing repeats and there is no loop period to hear.
  * a blink is emitted by walking FORWARD through 105->110. Blink frames are
    never entered backwards, so no blink ever plays in reverse.
  * after a blink the walk is in E; it returns to D across the one join in the
    design, chosen from the frame pairs measured to be the most similar in the
    whole clip (E/D pairs around f104 <-> f112: whole-frame RMS ~1.0, where the
    MEDIAN difference between two genuinely consecutive frames of the approved
    base is 0.73 and the MAXIMUM is 2.05 - i.e. the join is a smaller visual
    step than steps the approved base already takes on its own).

The blink schedule is a fixed, documented list of gaps - irregular, with three
clustered doubles, in the range 1.4-8.4 s.
"""
import subprocess, sys, os, json, struct

SRC = "/Users/luismiguel/Desktop/eximious-branching-player/public/media/presenter-1-diane-marchetti-motion-base.mp4"
FPS = 24
W, H = 1920, 1080
D_LO, D_HI = 60, 104          # blink-free working range
BLINK = list(range(105, 111))  # the single blink, forward only
E_LO, E_HI = 111, 120

# gap between blink ONSETS, in seconds. Irregular by design; the three short
# ones are deliberate clustered doubles, which is what real blinking does.
GAPS = [2.6, 4.8, 1.5, 6.4, 3.7, 5.5, 2.2, 7.8, 4.1, 1.4, 5.0,
        3.2, 6.9, 4.4, 2.8, 8.4, 3.9, 1.6, 5.7, 4.3, 6.2, 3.4]
# how far into E to travel after each blink before rejoining D, and where in D
# to rejoin. Varied so the frames around a blink are never the same twice.
E_DEPTH  = [2, 5, 3, 7, 4, 2, 6, 3, 5, 2, 8, 4, 3, 6, 2, 5, 7, 3, 4, 2, 6, 3]
D_RETURN = [104, 102, 103, 101, 104, 100, 102, 103, 101, 104, 102,
            100, 103, 104, 101, 102, 104, 103, 100, 101, 104, 102]

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
    travels across the settled range instead of jittering in one corner. Leg
    lengths and turn points vary, which is what stops the result having a
    period a viewer can lock onto.
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
        # A candidate turn point is only allowed if what remains AFTER taking
        # that leg is either exactly the walk home, or big enough to be another
        # full leg. Without this the walk ends up absorbing 1-6 leftover frames
        # as a micro down-up, which reads as a twitch rather than a settle.
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
    rng = LCG(20260819)
    seq = [D_RETURN[0]]          # opening frame: settled pose
    joins = []                   # (output index, from_src, to_src)
    onsets = []                  # output frame index of each blink onset
    pos = seq[0]
    for i, gap in enumerate(GAPS):
        e_depth = E_DEPTH[i % len(E_DEPTH)]
        target = int(round(gap * FPS))
        bounce = target - (len(BLINK) + e_depth)
        if i == 0:
            bounce = target - 0    # lead-in: no preceding blink to pay for
        # parity fix: the walk pos -> 104 needs matching parity
        if (bounce - abs(D_HI - pos)) % 2:
            bounce += 1
        if bounce < abs(D_HI - pos):
            bounce += 2 * ((abs(D_HI - pos) - bounce + 1) // 2)
        seq += wander(pos, D_HI, bounce, D_LO, D_HI, rng)
        onsets.append(len(seq))              # next emitted frame is 105
        seq += BLINK                         # forward blink, never reversed
        seq += list(range(E_LO, E_LO + e_depth))
        nxt = D_RETURN[i % len(D_RETURN)]
        joins.append((len(seq), seq[-1], nxt))
        seq.append(nxt)
        pos = nxt
    # tail: settle out for a couple of seconds without another blink
    seq += wander(pos, D_HI - 10, 2 * FPS, D_LO, D_HI, rng)
    return seq, joins, onsets

def check(seq, joins):
    js = {j[0] for j in joins}
    for i in range(1, len(seq)):
        step = seq[i] - seq[i - 1]
        if i in js:
            continue
        assert abs(step) == 1, f"non-continuous step at {i}: {seq[i-1]}->{seq[i]}"
    # no blink frame may ever be entered travelling backwards
    for i in range(1, len(seq)):
        if seq[i] in BLINK and seq[i] - seq[i - 1] < 0:
            raise AssertionError(f"REVERSED BLINK at output frame {i}")
    for i in range(1, len(seq)):
        if seq[i] in BLINK and i in js:
            raise AssertionError(f"blink entered across a join at {i}")
    return True

if __name__ == "__main__":
    seq, joins, onsets = build()
    check(seq, joins)
    out = sys.argv[1]
    dur = len(seq) / FPS
    meta = dict(frames=len(seq), fps=FPS, dur_s=round(dur, 3),
                unique_src_frames=sorted(set(seq)),
                blink_onsets_s=[round(o / FPS, 3) for o in onsets],
                n_blinks=len(onsets), rate_per_min=round(len(onsets) / dur * 60, 2),
                gaps_s=[round((onsets[i+1]-onsets[i]) / FPS, 3) for i in range(len(onsets)-1)],
                joins=[dict(out_frame=j[0], src_from=j[1], src_to=j[2]) for j in joins])
    json.dump(meta, open(out + ".plan.json", "w"), indent=1)
    print(f"frames={len(seq)} dur={dur:.2f}s blinks={len(onsets)} "
          f"rate={meta['rate_per_min']}/min joins={len(joins)}")
    print(f"src frames used: {min(seq)}..{max(seq)}  ({len(set(seq))} distinct)")
    print(f"onsets(s): {meta['blink_onsets_s']}")
    print(f"gaps(s)  : {meta['gaps_s']}")
    open(out + ".seq", "w").write(" ".join(map(str, seq)))
