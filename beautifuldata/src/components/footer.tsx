export function Footer() {
  return (
    <footer className="border-t border-white/[0.04] px-6 py-12">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 sm:flex-row">
        <a href="#" className="text-[14px] font-semibold text-white">
          beautiful<span className="text-brand-400">data</span>
        </a>
        <div className="flex gap-8">
          {[
            { label: "Services", href: "#services" },
            { label: "Work", href: "#work" },
            { label: "Pricing", href: "#pricing" },
            { label: "Contact", href: "#contact" },
          ].map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-[13px] text-gray-600 transition-colors hover:text-gray-400"
            >
              {link.label}
            </a>
          ))}
        </div>
        <p className="text-[13px] text-gray-700">
          &copy; {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
}
