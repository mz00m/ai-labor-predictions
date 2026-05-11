export default function RegionalPlaceholder() {
  return (
    <section className="mb-20">
      <div className="mb-6">
        <p className="text-xs font-bold uppercase tracking-widest text-[var(--accent)] opacity-60 mb-2">
          03 &middot; Regional view{" "}
          <span className="text-[var(--muted)] opacity-80">(Phase 2)</span>
        </p>
        <h2 className="text-3xl sm:text-heading-lg font-bold text-[var(--foreground)] leading-tight mb-2">
          The geography of AI risk
        </h2>
        <p className="text-md text-[var(--muted)] leading-relaxed max-w-2xl">
          National scores hide regional concentration. The same occupation can
          be 18% of employment in one metro and 2% in another. Next phase: a
          clickable choropleth that drills from state to MSA to county, colored
          by sector and occupation risk.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-8 items-start border border-strong rounded-xl p-6 sm:p-8 bg-white">
        {/* US silhouette */}
        <div>
          <div className="relative aspect-[1.6/1] w-full">
            <UsSilhouette />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="text-2xs font-bold uppercase tracking-widest text-[var(--muted)] bg-white/90 rounded px-2 py-1 border border-strong">
                Coming in Phase 2
              </span>
            </div>
          </div>
          <p className="mt-3 text-xs text-[var(--muted)] text-center">
            Visual placeholder. Interactive map renders against BLS OEWS &amp; QCEW.
          </p>
        </div>

        {/* Data plan */}
        <div>
          <p className="text-2xs font-bold uppercase tracking-widest text-[var(--muted)] opacity-70 mb-2">
            Data plan
          </p>
          <h3 className="text-xl font-bold text-[var(--foreground)] mb-3 leading-tight">
            Two BLS series, three levels of resolution
          </h3>
          <ul className="space-y-3 text-sm text-[var(--foreground)] leading-relaxed">
            <li>
              <span className="font-semibold">OEWS</span>{" "}
              <span className="text-[var(--muted)]">(Occupational Employment &amp; Wage Statistics)</span>
              {" "}&mdash; employment and wages by SOC occupation at the state and
              MSA level. Drives the state-level and metro-level risk overlays.
            </li>
            <li>
              <span className="font-semibold">QCEW</span>{" "}
              <span className="text-[var(--muted)]">(Quarterly Census of Employment &amp; Wages)</span>
              {" "}&mdash; employment by NAICS industry at the county level, used
              to convert occupation risk into sector concentration at fine
              geographic resolution.
            </li>
            <li>
              <span className="font-semibold">LAUS</span>{" "}
              <span className="text-[var(--muted)]">(Local Area Unemployment Statistics)</span>
              {" "}&mdash; for layering observed labor outcomes (unemployment,
              labor force participation) against modeled risk.
            </li>
          </ul>
          <p className="mt-4 text-xs text-[var(--muted)] leading-relaxed">
            Phase 2 will publish a clickable US map with state &rarr; MSA &rarr;
            county drilldown, the same risk model as the table above, and a
            switcher to view the map colored by sector concentration or by
            employment-weighted occupation risk.
          </p>
        </div>
      </div>
    </section>
  );
}

// Minimal stylized lower-48 silhouette. Hand-tuned polygon, intentionally
// abstracted — this is a visual placeholder, not cartography.
function UsSilhouette() {
  return (
    <svg
      viewBox="0 0 800 500"
      className="w-full h-full"
      role="img"
      aria-label="Stylized outline of the contiguous United States"
    >
      <defs>
        <linearGradient id="us-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5C61F6" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#5C61F6" stopOpacity="0.02" />
        </linearGradient>
        <pattern id="us-grid" width="32" height="32" patternUnits="userSpaceOnUse">
          <path d="M 32 0 L 0 0 0 32" fill="none" stroke="#1a1a1a" strokeOpacity="0.05" strokeWidth="0.6" />
        </pattern>
      </defs>

      {/* Background grid */}
      <rect width="800" height="500" fill="url(#us-grid)" />

      {/* Lower-48 abstract polygon */}
      <path
        d="M 70,180
           L 95,150 L 130,135 L 175,120 L 230,108 L 285,98
           L 340,92 L 395,90 L 445,92 L 495,98 L 540,108
           L 580,122 L 615,138 L 645,158 L 670,180
           L 685,210 L 692,245 L 690,278 L 680,308
           L 660,335 L 632,358 L 600,372 L 560,378
           L 515,380 L 470,378 L 432,380 L 405,388
           L 380,398 L 358,408 L 330,408 L 305,400
           L 282,388 L 260,378 L 235,372 L 210,368
           L 185,360 L 162,348 L 142,332 L 125,312
           L 112,288 L 102,262 L 90,235 L 78,208 Z"
        fill="url(#us-grad)"
        stroke="#1a1a1a"
        strokeOpacity="0.18"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />

      {/* Florida nub */}
      <path
        d="M 600,372 L 615,392 L 625,420 L 632,440 L 625,452 L 612,448 L 602,432 L 595,408 L 588,388 Z"
        fill="url(#us-grad)"
        stroke="#1a1a1a"
        strokeOpacity="0.18"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />

      {/* Texas hook */}
      <path
        d="M 358,408 L 348,425 L 345,442 L 350,455 L 365,460 L 380,452 L 388,438 L 385,420 Z"
        fill="url(#us-grad)"
        stroke="#1a1a1a"
        strokeOpacity="0.18"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />

      {/* Demo dots for major MSAs (decorative — annotation as design) */}
      {[
        { x: 170, y: 192, label: "Seattle" },
        { x: 145, y: 295, label: "SF Bay" },
        { x: 175, y: 348, label: "LA" },
        { x: 405, y: 295, label: "Denver" },
        { x: 470, y: 308, label: "Dallas" },
        { x: 555, y: 318, label: "Atlanta" },
        { x: 600, y: 220, label: "Chicago" },
        { x: 670, y: 200, label: "NYC" },
        { x: 660, y: 245, label: "DC" },
        { x: 615, y: 408, label: "Miami" },
      ].map((p) => (
        <g key={p.label}>
          <circle
            cx={p.x}
            cy={p.y}
            r="3"
            fill="#5C61F6"
            fillOpacity="0.55"
          />
          <circle
            cx={p.x}
            cy={p.y}
            r="7"
            fill="none"
            stroke="#5C61F6"
            strokeOpacity="0.18"
            strokeWidth="1"
          />
        </g>
      ))}
    </svg>
  );
}
