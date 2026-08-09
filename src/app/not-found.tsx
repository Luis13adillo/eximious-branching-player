import Link from "next/link";
import { BrandMark } from "@/components/ui/BrandMark";

export default function NotFound() {
  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center gap-6 bg-navy-950 px-6 text-center">
      <BrandMark size="lg" />
      <div>
        <div className="font-[family-name:var(--font-display)] text-3xl text-ink-100">
          Case not found
        </div>
        <p className="mt-2 font-sans text-ink-300">
          That lesson isn&apos;t in the catalog.
        </p>
      </div>
      <Link
        href="/"
        className="rounded-full bg-gold-500 px-6 py-2.5 font-sans text-sm font-semibold text-navy-950 transition-colors hover:bg-gold-400"
      >
        Back to the academy
      </Link>
    </div>
  );
}
