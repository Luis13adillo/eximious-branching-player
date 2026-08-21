/**
 * `@export-lesson` is a BUILD-TIME ALIAS, not a real package: vite.config.ts points it at
 * one lesson module under ../src/lib/lessons, chosen by EXPORT_LESSON_SLUG. TypeScript has
 * no way to know that, so the module is declared here.
 *
 * It is intentionally loose. Each lesson file exports its lesson under its own name
 * (`siu01Av1`, `claimsInvestigationApplication1`, …), so the entry point cannot import a
 * fixed identifier — it scans the namespace for the export whose `slug` matches and
 * narrows it there. Typing this as a specific shape would be a lie about which module
 * is behind the alias on any given build.
 */
declare module "@export-lesson" {
  const exports: Record<string, unknown>;
  export = exports;
}
