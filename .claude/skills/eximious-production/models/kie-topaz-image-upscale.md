# topaz/image-upscale (KIE) — presenter production stills

Used **once per presenter**, and only when an approved appearance reference is below the
contractual 1920×1080 floor. Both cases are already closed; this recipe exists for a fourth
presenter or a re-approved appearance.

| Field | Value |
|---|---|
| Model ID | `topaz/image-upscale` |
| Provider | **KIE** |
| Method | **Async** — createTask, then poll |
| Type | Image → image |
| API key | env `KIE_API_KEY`, header `Authorization: Bearer {KIE_API_KEY}` |
| Cost | **10 credits = $0.05** at ≤2K |

## Endpoint

```
POST https://api.kie.ai/api/v1/jobs/createTask
Authorization: Bearer {KIE_API_KEY}
```

## The rule that governs this step — pipeline rule 6

**The approved reference is never modified.** Upscale to a **NEW** file, then re-checksum
the original and prove it is byte-identical. Both approved 1672×941 references stayed
byte-identical through their entire production run; that is the standard.

## Choose the cheaper route first

**Measure the scale factor before you spend.**

| Case | Route | Cost |
|---|---|---|
| Selena, 1672×941 → 1920×1080 (**1.148×**) | pure lanczos: `scale=1920:1081:flags=lanczos,crop=1920:1080:0:1` | **$0.00**, PSNR 47.33 dB, colour within 0.03/255 |
| Curtis, same dimensions but a beard/mouth region that carries his watch item | Topaz **×2 → 3344×1882 → crop 1 row → lanczos to 1920×1080**, 16-bit intermediate | **$0.05**, detail gain 2.43× whole-frame, **2.75× in the beard/mouth region** |

At small factors a precision resample reproduces an approved appearance without a model
reinterpreting an approved face. Reach for Topaz when the detail actually matters
downstream — Curtis's mouth region is exactly where his accepted softness sits.

**Why ×2 then down, never 1672→1920 directly.** 3344×1881 is exactly 16:9, so the downscale
is a uniform 0.574163× on both axes. Going straight to 1920 lands at 1081 and forces
distortion.

## Notes

- **FLAGGED and unresolved:** the cost lock recommended "pad, do not crop". Selena's still
  crops one row of empty wall instead. Reversible at $0.00 if anyone objects.
- Record method, taskId, cost, input sha256, output sha256 and the post-run re-checksum of
  the original in a sidecar beside the new file.
