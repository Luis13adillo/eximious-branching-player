#!/usr/bin/env bash
#
# fresh-clone-check.sh — does a plain `git clone` of this repo hand a new session
# the LOCKED production pipeline, or the superseded one?
#
# Reads COMMITTED HEAD ONLY (git show). Never the working tree, never the
# Second Brain in ~/.claude/. That is the whole point: it answers "what does
# someone who only has the repo actually know?"
#
# Usage:  bash scripts/fresh-clone-check.sh
# Exit:   0 = all checks pass, non-zero = number of failures.

set -u
cd "$(dirname "$0")/.." || exit 1

pass=0; fail=0
chk() {
  if grep -qiE -- "$2" "$CORPUS"; then printf '  PASS  %s\n' "$1"; pass=$((pass+1))
  else printf '  FAIL  %s\n' "$1"; fail=$((fail+1)); fi
}

CORPUS=$(mktemp); trap 'rm -f "$CORPUS"' EXIT
for f in $(git ls-files '*.md' '*.ts' '*.tsx' '*.json'); do
  git show "HEAD:$f" 2>/dev/null
done > "$CORPUS"

echo "Fresh-clone knowledge test — committed HEAD $(git rev-parse --short HEAD)"
echo "(working tree and Second Brain excluded by construction)"
chk "1  lip-sync engine is fal-ai/latentsync"        'fal-ai/latentsync'
chk "2  HeyGen named and excluded"                   'heygen'
chk "3  InfiniTalk named and superseded"             'infinitalk'
chk "4  motion base is kling/v2-1-pro"               'kling/v2-1-pro'
chk "5  motion base generated once per presenter"    'once per presenter'
chk "6  delivery is exactly 1920x1080"               '1920.?1080'
chk "7  LatentSync always returns 25 fps"            '25 ?fps'
chk "8  16-frame padding rule present"               '16.?frame'
chk "9  discard returned audio and remux"            'remux'
chk "10 loudness target -24.5 LUFS"                  '\-?24\.5 ?LUFS'
chk "11 audio format 24 kHz mono 128 kbps"           '24 ?kHz'
chk "12 Diane = tts-1-hd / shimmer"                  'shimmer'
chk "13 Curtis = tts-1-hd / onyx"                    'onyx'
# RECAST 2026-08-22: Selena left OpenAI. Asserting the OLD model here would keep passing
# forever while the repo described a voice that is no longer used, so the check follows the
# voice. The voice_id is the one thing that cannot be paraphrased.
chk "14 Selena = fal/MiniMax speech-02-hd, voice-design LA-1"  'ttv-voice-2026082200132526-qth65Vqj'
chk "15 lip-sync calls carry >=40 s of audio"        '40 ?s(ec)?'

# 16 — The RETIRED sage definition must stay reproducible from the repo alone.
#
# Before the 2026-08-22 recast this checked that Selena's live `instructions` string was
# recoverable from two agreeing copies. She no longer uses it — MiniMax takes no such
# parameter — but the string is still the ONLY thing that makes the v1 audio re-renderable,
# and v1 is what shipped on 2026-08-21. So the check follows it to where it now lives.
LOCKED_HASH=bdf6862d6f8dc101b66898b0d0b2d0df1c4946d62f02fa202bb4af932483eeda
SUP=public/media/presenter-3-selena-navarro-voice-SELECTED-v1-sage-superseded.json
extract_json=$(git show HEAD:$SUP 2>/dev/null \
  | node -e 'let d="";process.stdin.on("data",c=>d+=c).on("end",()=>process.stdout.write(JSON.parse(d).instructions||""))' 2>/dev/null)
h1=$(printf '%s' "$extract_json" | shasum -a 256 | cut -d' ' -f1)
if [ "$h1" = "$LOCKED_HASH" ]; then
  printf '  PASS  %s\n' "16 retired sage instructions recoverable from HEAD, byte-exact (v1 stays reproducible)"
  pass=$((pass+1))
else
  printf '  FAIL  %s\n' "16 retired sage instructions: superseded record=$h1 expected=$LOCKED_HASH"
  fail=$((fail+1))
fi

# 17 — The recast must not be a rumour. A fresh clone has to be able to reproduce the CURRENT
# voice, which means the tracked voice record and the presenter table must both name it.
if git show HEAD:public/media/presenter-3-selena-navarro-voice-SELECTED.json 2>/dev/null \
     | grep -q 'ttv-voice-2026082200132526-qth65Vqj' \
   && git show HEAD:scripts/tts-narration.mjs 2>/dev/null | grep -q 'fal-minimax'; then
  printf '  PASS  %s\n' "17 current voice reproducible from HEAD (tracked record + presenter table agree)"
  pass=$((pass+1))
else
  printf '  FAIL  %s\n' "17 current voice NOT reproducible from HEAD — the recast is not committed"
  fail=$((fail+1))
fi
echo "  ---- $pass passed, $fail failed"

# Confidentiality scan. The phrase list lives in the git-ignored docs/confidential/
# because it IS the protected text — committing it here would be the leak it prevents.
# A fresh clone has no list and correctly skips this half.
echo
PHRASES=docs/confidential/redaction-phrases.txt
if [ ! -f "$PHRASES" ]; then
  echo "Confidentiality scan SKIPPED — $PHRASES not present (expected in a fresh clone)."
else
  revs=$(git rev-list --all)
  n=$(echo "$revs" | wc -l | tr -d ' ')
  leaks=0; checked=0
  while IFS= read -r p; do
    case "$p" in ''|'#'*) continue;; esac
    checked=$((checked+1))
    if git grep -qF -- "$p" $revs 2>/dev/null; then
      echo "  LEAK: a protected phrase is present in git history"
      leaks=$((leaks+1)); fail=$((fail+1))
    fi
  done < "$PHRASES"
  if [ $leaks -eq 0 ]; then
    echo "Confidentiality scan: $checked protected phrases x $n commits — CLEAN, no pilot-script text in history."
  else
    echo "Confidentiality scan: $leaks protected phrase(s) FOUND IN HISTORY. Do not push."
  fi
fi

exit $fail
