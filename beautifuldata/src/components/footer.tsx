export function Footer() {
  return (
    <footer className="px-6 py-12">
      <div className="mx-auto max-w-5xl">
        {/* Graceful arc divider */}
        <svg className="mx-auto mb-10 h-4 w-48" viewBox="0 0 192 16">
          <path
            d="M 0 0 Q 96 16 192 0"
            fill="none"
            stroke="rgba(20,184,166,0.15)"
            strokeWidth="1"
          />
        </svg>

        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <a href="#" className="text-base font-semibold text-white">
            Beautiful<span className="font-normal text-brand-400">Data</span>
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
      </div>
    </footer>
  );
}
