export function Hero() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 pt-16">
      {/* Soft arc decoration */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        preserveAspectRatio="none"
      >
        <ellipse
          cx="50%"
          cy="85%"
          rx="55%"
          ry="25%"
          fill="none"
          stroke="rgba(20,184,166,0.06)"
          strokeWidth="1"
        />
        <ellipse
          cx="50%"
          cy="90%"
          rx="45%"
          ry="20%"
          fill="none"
          stroke="rgba(20,184,166,0.04)"
          strokeWidth="1"
        />
      </svg>

      {/* Minimal atmospheric glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-[400px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-500/[0.04] blur-[120px]" />

      <div className="relative mx-auto max-w-3xl text-center">
        {/* Thin horizontal rule above */}
        <div className="mx-auto mb-12 h-px w-16 bg-brand-500/30" />

        <h1 className="text-[clamp(2.5rem,6vw,4.5rem)] font-light leading-[1.1] tracking-tight text-white">
          Your research deserves
          <br />
          <span className="font-semibold">more than a PDF</span>
        </h1>

        <p className="mx-auto mt-8 max-w-lg text-lg leading-relaxed text-gray-400">
          We build interactive data experiences for organizations whose
          research is too important for static charts and slide decks.
        </p>

        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <a
            href="#contact"
            className="rounded-lg bg-brand-600 px-8 py-3 text-[15px] font-medium text-white transition-all hover:bg-brand-500 hover:shadow-lg hover:shadow-brand-500/15"
          >
            Start a project
          </a>
          <a
            href="#work"
            className="rounded-lg border border-white/10 px-8 py-3 text-[15px] text-gray-400 transition-all hover:border-white/20 hover:text-white"
          >
            See the work
          </a>
        </div>

        {/* Thin horizontal rule below */}
        <div className="mx-auto mt-16 h-px w-full max-w-xs bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>
    </section>
  );
}
