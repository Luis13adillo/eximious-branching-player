import Link from "next/link";
import { BrandMark } from "@/components/ui/BrandMark";
import { ArrowRightIcon, PlayIcon } from "@/components/ui/icons";
import { FEATURED_LESSON_SLUG, listLessons } from "@/lib/lessons";
import { SceneBackdrop } from "@/components/media/SceneBackdrop";

export default function Home() {
  const lessons = listLessons();
  const featured = lessons[0];

  return (
    <div className="relative min-h-[100dvh] w-full overflow-hidden bg-navy-950">
      {/* atmospheric backdrop */}
      <div className="absolute inset-0 opacity-70">
        <SceneBackdrop scene="claim-desk" animate={false} />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-navy-950/40 via-navy-950/70 to-navy-950" />

      <div className="relative mx-auto flex min-h-[100dvh] w-full max-w-6xl flex-col px-5 py-6 sm:px-8">
        <header className="flex items-center justify-between">
          <BrandMark size="md" />
          <nav className="hidden items-center gap-6 font-sans text-sm text-ink-300 sm:flex">
            <span className="cursor-default">Curriculum</span>
            <span className="cursor-default">Faculty</span>
            <span className="cursor-default">Accreditation</span>
            <Link
              href={`/lesson/${FEATURED_LESSON_SLUG}`}
              className="whitespace-nowrap rounded-full border border-gold-500/50 px-4 py-1.5 text-gold-200 transition-colors hover:bg-gold-500/10"
            >
              Enter a case
            </Link>
          </nav>
        </header>

        <main className="flex flex-1 flex-col justify-center py-14">
          <div className="max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/5 px-3 py-1 font-sans text-[11px] font-medium uppercase tracking-[0.2em] text-gold-200">
              <span className="h-1.5 w-1.5 rounded-full bg-gold-400" />
              Interactive Case Studies
            </div>
            <h1 className="font-[family-name:var(--font-display)] text-4xl font-medium leading-[1.05] tracking-tight text-ink-100 sm:text-6xl">
              Judgment, trained the way{" "}
              <span className="text-gold-400">the work actually happens.</span>
            </h1>
            <p className="mt-5 max-w-xl font-sans text-lg leading-relaxed text-ink-200">
              Eximious Academy turns real claims and investigation scenarios into
              branching, decision-driven video lessons. Work the evidence, make
              the call, and see exactly why it was right — or wasn&apos;t.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href={`/lesson/${FEATURED_LESSON_SLUG}`}
                className="group inline-flex items-center gap-2 rounded-full bg-gold-500 px-7 py-3.5 font-sans text-[15px] font-semibold text-navy-950 shadow-lg shadow-gold-900/40 transition-colors hover:bg-gold-400"
              >
                Begin the case study
                <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <span className="font-sans text-sm text-ink-400">
                ~8 minutes · 3 decision points · 12 feedback branches
              </span>
            </div>
          </div>

          {/* featured case card */}
          {featured && (
            <div className="mt-14 max-w-xl">
              <div className="mb-2 font-sans text-[11px] font-semibold uppercase tracking-[0.24em] text-ink-400">
                Featured case
              </div>
              <Link
                href={`/lesson/${featured.slug}`}
                className="group flex flex-col gap-4 rounded-2xl border border-white/10 bg-navy-900/50 p-4 backdrop-blur-sm transition-all hover:border-gold-500/40 hover:bg-navy-900/70 sm:flex-row sm:items-center sm:gap-5 sm:p-5"
              >
                <div className="relative aspect-video w-full shrink-0 overflow-hidden rounded-lg border border-white/10 sm:h-24 sm:w-44">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/media/evidence-basement.jpg"
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-navy-950/25" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-navy-950/55 ring-1 ring-white/25 backdrop-blur-sm">
                      <PlayIcon className="ml-0.5 h-4 w-4 text-ink-100" />
                    </span>
                  </div>
                  <span className="absolute left-2 top-2 rounded bg-navy-950/70 px-1.5 py-0.5 font-sans text-[9px] font-semibold uppercase tracking-[0.15em] text-gold-300 ring-1 ring-white/10">
                    Case study
                  </span>
                  {featured.estimatedMinutes && (
                    <span className="absolute bottom-2 right-2 rounded bg-navy-950/70 px-1.5 py-0.5 font-sans text-[9px] font-medium text-ink-200 ring-1 ring-white/10">
                      {featured.estimatedMinutes} min
                    </span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-sans text-[11px] uppercase tracking-[0.18em] text-gold-300">
                    {featured.courseTitle}
                    {featured.caseId ? ` · Case ${featured.caseId}` : ""}
                  </div>
                  <div className="mt-1 font-[family-name:var(--font-display)] text-xl text-ink-100">
                    {featured.title}
                  </div>
                  <div className="mt-0.5 font-sans text-sm text-ink-300">
                    {featured.subtitle}
                  </div>
                </div>
                <ArrowRightIcon className="hidden h-5 w-5 shrink-0 text-ink-400 transition-all group-hover:translate-x-0.5 group-hover:text-gold-300 sm:block" />
              </Link>
            </div>
          )}
        </main>

        <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-white/8 pt-4 font-sans text-[11px] text-ink-400">
          <span>© Eximious Academy · Professional Claims Education</span>
          <span className="hidden sm:block">Investigation · Coverage · Litigation Readiness</span>
        </footer>
      </div>
    </div>
  );
}
