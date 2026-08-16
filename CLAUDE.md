# Eximious Academy — Project Instructions

This repository is exclusively for the Eximious Academy interactive training-video program.

## Authoritative Sources

Before making production-level changes, consult:

1. `docs/source/executed-agreement.pdf`
2. `docs/source/video-production-spec.pdf`
3. `docs/source/pilot-scripts.pdf`
4. `docs/EXIMIOUS_PRODUCTION_SPEC.md`
5. `docs/source/eximious-corporate-brand-guidelines.pdf`
6. `docs/source/eximious-video-production-guidelines.pdf`

> Note: every source PDF under `docs/source/` is kept **local-only and git-ignored**
> (`docs/source/*.pdf`) because they contain the signed agreement (signatures /
> PII) and confidential brand documents and course scripts. They are available at
> these paths on the working machine but must never be committed or pushed.

Source precedence:

- Executed Agreement = contractual authority
- Roger's Video Production Spec = production authority
- Roger's Pilot Scripts = content authority for the three pilots
- EXIMIOUS_PRODUCTION_SPEC.md = consolidated implementation specification,
  including later client-approved decisions
- Corporate Brand Guidelines = corporate visual authority
- Interactive Video Production Guidelines = video-production visual/system
  authority (inherits the corporate brand)

If sources conflict, flag the conflict. Do not silently reconcile it.

Later explicit client-approved decisions recorded in `docs/EXIMIOUS_PRODUCTION_SPEC.md`
supersede earlier conflicting implementation guidance, except where doing so would
conflict with the Executed Agreement.

Never treat superseded guidance as an unresolved approval item.

Do not substitute the existing water-damage demo for pilot content.
It is a technical/template reference only.

## Current Pilot

Three pilot videos:

- claims-01 AV1 — Marcus Delaney
- siu-01 AV1 — Marcus Delacroix
- ew-01 AV1 — Prieto expert-witness case

All three must use the reusable player architecture rather than bespoke implementations.

Do not create bespoke player behavior for an individual pilot when the requirement
belongs in the reusable template. Pilot implementation must prove the architecture
intended for the full 267-video catalog.

## Critical Rule

Do not silently invent, reinterpret, or remove client requirements.

If code conflicts with the authoritative specifications, flag the conflict before making a destructive or expensive change.

Do not render expensive media until the relevant presenter identity, script, configuration, and template requirements are locked.

Before generating or rendering production media, verify that the applicable presenter,
script, interaction configuration, visual rules, disclosure behavior, captions, and
required reusable components comply with the controlled sources.

Do not use the water-damage demo's content, labels, decisions, or scene structure as
pilot content.

## Mandatory — read controlled sources before any production work

Before any Eximious visual, presenter, UI, media, rendering, or package-production work, read and reconcile:

- the authoritative Agreement / Production Spec / applicable Pilot Script
- `docs/EXIMIOUS_PRODUCTION_SPEC.md`
- the Corporate Brand Guidelines where corporate-brand decisions apply
- the Interactive Video Production Guidelines for all video-production decisions

The Interactive Video Production Guidelines are mandatory across all 267 application videos.

Do not generate from memory if the controlled requirements are available.

---

@AGENTS.md
