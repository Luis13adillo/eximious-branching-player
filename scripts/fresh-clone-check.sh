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
chk "14 Selena = gpt-4o-mini-tts-2025-12-15 / sage"  'gpt-4o-mini-tts-2025-12-15'
chk "15 lip-sync calls carry >=40 s of audio"        '40 ?s(ec)?'

# 16 — Selena's voice is not reproducible without her exact `instructions` string.
# It must be recoverable from the repo alone, and the two committed copies must agree.
LOCKED_HASH=bdf6862d6f8dc101b66898b0d0b2d0df1c4946d62f02fa202bb4af932483eeda
extract_json=$(git show HEAD:public/media/presenter-3-selena-navarro-voice-SELECTED.json 2>/dev/null \
  | node -e 'let d="";process.stdin.on("data",c=>d+=c).on("end",()=>process.stdout.write(JSON.parse(d).instructions||""))' 2>/dev/null)
extract_md=$(git show HEAD:CLAUDE.md 2>/dev/null \
  | node -e 'let d="";process.stdin.on("data",c=>d+=c).on("end",()=>{const m=d.match(/```text\n([\s\S]*?)\n```/);process.stdout.write(m?m[1]:"")})' 2>/dev/null)
h1=$(printf '%s' "$extract_json" | shasum -a 256 | cut -d' ' -f1)
h2=$(printf '%s' "$extract_md"   | shasum -a 256 | cut -d' ' -f1)
if [ "$h1" = "$LOCKED_HASH" ] && [ "$h2" = "$LOCKED_HASH" ]; then
  printf '  PASS  %s\n' "16 Selena instructions recoverable from HEAD; both copies match the locked hash"
  pass=$((pass+1))
else
  printf '  FAIL  %s\n' "16 Selena instructions: sidecar=$h1 CLAUDE.md=$h2 expected=$LOCKED_HASH"
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
