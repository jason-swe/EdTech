const footerLinks = [
  { label: 'Chính sách bảo mật', href: '#' },
  { label: 'Điều khoản dịch vụ', href: '#' },
  { label: 'Đạo đức người dùng', href: '#' },
  { label: 'Câu hỏi & tiếp cận', href: '#' },
] as const

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-lg font-bold tracking-tight text-[#003380]">
              ScholarMetric.AI
            </p>
            <p className="mt-3 text-sm text-[#4B5563]">
              © {new Date().getFullYear()} ScholarMetric.AI. Bảo lưu mọi quyền.
            </p>
          </div>
          <nav
            className="flex flex-wrap gap-x-8 gap-y-3"
            aria-label="Pháp lý"
          >
            {footerLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-xs font-semibold uppercase tracking-wide text-[#4B5563] transition-colors hover:text-[#003380]"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
        <p className="mt-12 text-center text-xs font-semibold uppercase tracking-[0.18em] text-[#4B5563]/80">
          Liên hệ với chúng tôi
        </p>
      </div>
    </footer>
  )
}
