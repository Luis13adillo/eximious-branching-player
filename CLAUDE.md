# Eximious Academy — Project Instructions

This repository is exclusively for the Eximious Academy interactive training-video program.

## Authoritative Sources

Before making production-level changes, consult:

1. `docs/source/executed-agreement.pdf`
2. `docs/source/video-production-spec.pdf`
3. `docs/source/pilot-scripts.pdf`
4. `docs/EXIMIOUS_PRODUCTION_SPEC.md`

> Note: the three source PDFs above are kept **local-only and git-ignored**
> (`docs/source/*.pdf`) because they contain the signed agreement (signatures /
> PII) and confidential course scripts. They are available at these paths on the
> working machine but must never be committed or pushed.

Source precedence:

- Executed Agreement = contractual authority
- Roger's Video Production Spec = production authority
- Roger's Pilot Scripts = content authority for the three pilots
- EXIMIOUS_PRODUCTION_SPEC.md = consolidated implementation specification,
  including later client-approved decisions

Do not substitute the existing water-damage demo for pilot content.
It is a technical/template reference only.

## Current Pilot

Three pilot videos:

- claims-01 AV1 — Marcus Delaney
- siu-01 AV1 — Marcus Delacroix
- ew-01 AV1 — Prieto expert-witness case

All three must use the reusable player architecture rather than bespoke implementations.

## Critical Rule

Do not silently invent, reinterpret, or remove client requirements.

If code conflicts with the authoritative specifications, flag the conflict before making a destructive or expensive change.

Do not render expensive media until the relevant presenter identity, script, configuration, and template requirements are locked.

---

@AGENTS.md
