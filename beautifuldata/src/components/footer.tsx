export function Footer() {
  return (
    <footer className="border-t border-gray-800/50 px-6 py-12">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
        <div>
          <span className="text-sm font-semibold">
            <span className="text-brand-400">Beautiful</span>Data
          </span>
          <p className="mt-1 text-xs text-gray-600">
            Interactive data visualization for research & policy.
          </p>
        </div>
        <div className="flex gap-6">
          <a href="#services" className="text-xs text-gray-500 hover:text-gray-300 transition">Services</a>
          <a href="#work" className="text-xs text-gray-500 hover:text-gray-300 transition">Work</a>
          <a href="#pricing" className="text-xs text-gray-500 hover:text-gray-300 transition">Pricing</a>
          <a href="#contact" className="text-xs text-gray-500 hover:text-gray-300 transition">Contact</a>
        </div>
        <p className="text-xs text-gray-700">
          &copy; {new Date().getFullYear()} Beautiful Data
        </p>
      </div>
    </footer>
  );
}
