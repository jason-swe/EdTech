import { useState } from 'react'
import { Link } from 'react-router-dom'

const PRIMARY = '#003399'

export function LoginFormPanel() {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="flex h-full min-h-0 w-full flex-1 flex-col overflow-y-auto bg-white lg:w-1/2">
      <div className="mx-auto flex w-full max-w-[420px] flex-1 flex-col justify-center px-8 py-9 lg:max-w-[470px] lg:px-12 lg:py-8">
        <Link
          to="/"
          className="inline-flex w-fit items-center gap-2.5 transition-opacity hover:opacity-90"
        >
          <span
            className="flex h-10 w-10 items-center justify-center rounded-lg font-mono text-sm font-bold text-white"
            style={{ backgroundColor: PRIMARY }}
          >
            &gt;_
          </span>
          <span
            className="text-lg font-bold tracking-tight"
            style={{ color: PRIMARY }}
          >
            EdTech Enthusiasts
          </span>
        </Link>

        <div className="mt-7">
          <h1 className="text-[1.75rem] font-bold leading-tight tracking-tight text-gray-900 lg:text-[2.05rem]">
            Chào mừng trở lại
          </h1>
          <p className="mt-2.5 text-[0.95rem] font-normal leading-relaxed text-[#6B7280] lg:text-[1.05rem]">
            Đăng nhập để tiếp tục lộ trình phát triển năng lực số của bạn
          </p>

          <form
            className="mt-7 space-y-5"
            onSubmit={(e) => e.preventDefault()}
          >
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-[#6B7280]"
              >
                Email
              </label>
              <div className="relative mt-2">
                <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-base text-[#9CA3AF]">
                  @
                </span>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="username@email.com"
                  className="w-full rounded-lg border-0 bg-[#F3F4F6] py-3 pl-10 pr-3 text-base text-gray-900 placeholder:text-gray-400 outline-none ring-1 ring-transparent transition-shadow focus:ring-2 focus:ring-[#003399]/25"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between gap-2">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-[#6B7280]"
                >
                  Mật khẩu
                </label>
                <a
                  href="#"
                  className="text-sm font-medium transition-opacity hover:opacity-80"
                  style={{ color: PRIMARY }}
                >
                  Quên mật khẩu?
                </a>
              </div>
              <div className="relative mt-2">
                <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF]">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                    aria-hidden
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </span>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  className="w-full rounded-lg border-0 bg-[#F3F4F6] py-3 pl-11 pr-11 text-base text-gray-900 outline-none ring-1 ring-transparent transition-shadow focus:ring-2 focus:ring-[#003399]/25"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-1.5 text-[#9CA3AF] transition-colors hover:bg-gray-200/80 hover:text-gray-600"
                  aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                >
                  {showPassword ? (
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <label className="flex cursor-pointer items-center gap-2.5">
              <input
                type="checkbox"
                name="remember"
                className="h-4.5 w-4.5 rounded border-gray-300 text-[#003399] focus:ring-[#003399]/30"
              />
              <span className="text-sm text-[#6B7280]">Ghi nhớ đăng nhập</span>
            </label>

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-lg py-3 text-base font-semibold text-white shadow-sm transition-all hover:brightness-110 active:scale-[0.99]"
              style={{ backgroundColor: PRIMARY }}
            >
              Đăng nhập
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </button>
          </form>

          <div className="relative my-7">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-3 text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-[#9CA3AF]">
                Hoặc truy cập nhanh
              </span>
            </div>
          </div>

          <button
            type="button"
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white py-3 text-base font-medium text-[#4B5563] transition-all hover:border-gray-300 hover:bg-gray-50 active:scale-[0.99]"
          >
            <svg
              className="h-5 w-5 shrink-0"
              style={{ color: PRIMARY }}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.75}
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
            <span className="text-left leading-snug">
              Đăng nhập qua hệ thống trường (LMS)
            </span>
          </button>

          <p className="mt-7 text-center text-sm text-[#6B7280]">
            Bạn chưa có tài khoản?{' '}
            <a
              href="#"
              className="font-semibold transition-opacity hover:opacity-80"
              style={{ color: PRIMARY }}
            >
              Liên hệ quản trị viên
            </a>
          </p>

          <div className="mt-7 flex justify-center gap-7 pb-2 text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-[#9CA3AF]">
            <a href="#" className="transition-colors hover:text-[#6B7280]">
              Điều khoản
            </a>
            <a href="#" className="transition-colors hover:text-[#6B7280]">
              Bảo mật
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
