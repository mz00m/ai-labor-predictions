export function Hero() {
  return (
    <section className="relative flex min-h-[90vh] items-center justify-center overflow-hidden px-6 pt-20">
      {/* Gradient background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[600px] w-[800px] -translate-x-1/2 rounded-full bg-brand-600/10 blur-[120px]" />
        <div className="absolute bottom-0 left-1/4 h-[400px] w-[600px] rounded-full bg-brand-800/10 blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-4xl text-center">
        <p className="mb-4 text-sm font-medium uppercase tracking-widest text-brand-400">
          Interactive Data Visualization
        </p>

        <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
          Your research deserves
          <br />
          <span className="bg-gradient-to-r from-brand-400 to-brand-600 bg-clip-text text-transparent">
            more than a PDF
          </span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-gray-400 sm:text-xl">
          We turn research papers, policy data, and corporate analytics into
          interactive web experiences that tell stories and drive decisions.
        </p>

        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <a
            href="#contact"
            className="rounded-lg bg-brand-600 px-8 py-3 text-base font-medium text-white transition hover:bg-brand-500 hover:shadow-lg hover:shadow-brand-600/25"
          >
            Start a Project
          </a>
          <a
            href="#work"
            className="rounded-lg border border-gray-700 px-8 py-3 text-base font-medium text-gray-300 transition hover:border-gray-500 hover:text-white"
          >
            See Our Work
          </a>
        </div>

        {/* Trust signals */}
        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-3">
          {[
            { stat: "17", label: "Interactive prediction graphs" },
            { stat: "300+", label: "Verified research sources" },
            { stat: "5x", label: "Faster delivery with AI tooling" },
          ].map((item) => (
            <div key={item.label}>
              <p className="text-2xl font-bold text-white">{item.stat}</p>
              <p className="mt-1 text-sm text-gray-500">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
