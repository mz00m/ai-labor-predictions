import Link from "next/link";

interface MapHeroProps {
  occupationCount: number;
  taskCategoryCount: number;
  sectorCount: number;
  generatedAt?: string;
}

function formatGenerated(iso: string | undefined): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${months[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`;
}

export default function MapHero({
  occupationCount,
  taskCategoryCount,
  sectorCount,
  generatedAt,
}: MapHeroProps) {
  const updated = formatGenerated(generatedAt);

  return (
    <header className="mb-12">
      <p className="text-sm font-bold uppercase tracking-widest text-[var(--accent)] mb-4">
        Tasks &rarr; Jobs &rarr; Sectors &rarr; Regions
      </p>
      <h1
        className="text-5xl sm:text-6xl font-extrabold text-[var(--foreground)] leading-[1.05] tracking-tight mb-5 font-serif"
      >
        How AI risk maps onto the US economy
      </h1>
      <p className="text-prose text-[var(--muted)] leading-relaxed max-w-2xl mb-3 font-serif">
        AI doesn&rsquo;t fall on the labor market evenly. We score it from the bottom
        up: each task is rated, then rolled up into an occupation, then weighted by
        employment into the sector that hires it.
      </p>
      <p className="text-prose text-[var(--muted)] leading-relaxed max-w-2xl mb-8 font-serif">
        This page lets you see where the risk concentrates &mdash; which sectors
        carry the most exposed employment, and which specific occupations sit at
        the sharp end of that distribution.
      </p>

      {/* Stat strip */}
      <div className="grid grid-cols-3 gap-px bg-strong border border-strong rounded-lg overflow-hidden">
        <Stat value={occupationCount.toLocaleString("en-US")} label="occupations scored" />
        <Stat value={taskCategoryCount.toString()} label="task categories" />
        <Stat value={sectorCount.toString()} label="sector roll-ups" />
      </div>

      {updated && (
        <p className="mt-4 text-xs text-[var(--muted)]">
          Risk data generated {updated}.{" "}
          <Link href="/occupation-exposure" className="text-[var(--accent-text)] hover:underline">
            Methodology background &rarr;
          </Link>
        </p>
      )}
    </header>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="bg-white px-4 sm:px-6 py-5">
      <div className="text-4xl sm:text-5xl font-extrabold text-[var(--heading)] stat-number leading-none">
        {value}
      </div>
      <div className="mt-1.5 text-xs uppercase tracking-widest text-[var(--muted)] font-semibold">
        {label}
      </div>
    </div>
  );
}
