export function Hero() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 pt-16">
      {/* Atmospheric gradient — refined, not blobby */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/4 h-[500px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-600/[0.07] blur-[150px]" />
        <div className="absolute bottom-1/4 right-1/4 h-[300px] w-[500px] rounded-full bg-brand-400/[0.04] blur-[120px]" />
      </div>

      {/* Subtle grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      <div className="relative mx-auto max-w-3xl text-center">
        <h1 className="text-[clamp(2.5rem,6vw,4.5rem)] font-semibold leading-[1.1] tracking-tight text-white">
          Your research deserves
          <br />
          more than a PDF
        </h1>

        <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-gray-400">
          We build interactive data experiences for organizations whose
          research is too important for static charts and slide decks.
        </p>

        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <a
            href="#contact"
            className="rounded-full bg-brand-600 px-8 py-3 text-[15px] font-medium text-white transition-all hover:bg-brand-500 hover:shadow-lg hover:shadow-brand-600/20"
          >
            Start a project
          </a>
          <a
            href="#work"
            className="rounded-full border border-white/10 px-8 py-3 text-[15px] font-medium text-gray-300 transition-all hover:border-white/25 hover:text-white"
          >
            See the work
          </a>
        </div>
      </div>
    </section>
  );
}
