import { Link, useLocation } from 'react-router-dom'

const navItems = [
  { label: 'Đánh giá', href: '#danh-gia' },
  { label: 'Dự đoán', href: '#du-doan' },
  { label: 'Cá nhân hóa', href: '#ca-nhan-hoa' },
  { label: 'Tổ chức', href: '#to-chuc' },
] as const

export function Navbar() {
  const location = useLocation()
  const activeHash = location.hash || '#danh-gia'

  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="shrink-0 text-[0.95rem] font-bold tracking-tight text-[#003380] transition-opacity hover:opacity-90 sm:text-[1rem]"
        >
          EdTech Enthusiasts
        </Link>

        <nav
          className="hidden flex-1 items-center justify-center gap-6 md:flex lg:gap-10"
          aria-label="Chính"
        >
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={`relative pb-1.5 text-[0.95rem] font-medium transition-colors lg:text-[1.05rem] ${
                activeHash === item.href
                  ? 'text-[#1B57D0]'
                  : 'text-[#475569] hover:text-[#003380]'
              }`}
              aria-current={activeHash === item.href ? 'page' : undefined}
            >
              {item.label}
              <span
                className={`absolute -bottom-[2px] left-0 h-[3px] rounded-full bg-[#1B57D0] transition-all ${
                  activeHash === item.href ? 'w-full opacity-100' : 'w-0 opacity-0'
                }`}
                aria-hidden
              />
            </a>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-6">
          <Link
            to="/login"
            className="text-[0.9rem] font-medium text-[#003380] transition-opacity hover:opacity-80"
          >
            Đăng nhập
          </Link>
          <Link
            to="/login"
            className="rounded-lg bg-[#003380] px-4 py-2.5 text-[0.9rem] font-semibold text-white shadow-sm transition-all hover:bg-[#002966] hover:shadow-md active:scale-[0.98]"
          >
            Bắt đầu ngay
          </Link>
        </div>
      </div>
    </header>
  )
}
