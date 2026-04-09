import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { useAuth } from '../../auth/authContext'

const PRIMARY = '#003399'

export function SignupFormPanel() {
  const navigate = useNavigate()
  const { register, getDefaultRoute } = useAuth()

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [submitError, setSubmitError] = useState<string | null>(null)

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!fullName.trim()) {
      setSubmitError('Vui lòng nhập họ và tên.')
      return
    }

    if (!email.trim()) {
      setSubmitError('Vui lòng nhập email để đăng ký.')
      return
    }

    if (!password.trim()) {
      setSubmitError('Vui lòng nhập mật khẩu.')
      return
    }

    if (password !== confirmPassword) {
      setSubmitError('Mật khẩu xác nhận chưa khớp.')
      return
    }

    const currentUser = register(fullName, email, password)
    setSubmitError(null)
    navigate(getDefaultRoute(currentUser), { replace: true })
  }

  return (
    <div className="flex h-full min-h-0 w-full flex-1 flex-col overflow-y-auto bg-white lg:w-1/2">
      <div className="mx-auto flex w-full max-w-[420px] flex-1 flex-col justify-center px-8 py-9 lg:max-w-[470px] lg:px-12 lg:py-8">
        <Link to="/" className="inline-flex w-fit items-center gap-2.5 transition-opacity hover:opacity-90">
          <span
            className="flex h-10 w-10 items-center justify-center rounded-lg font-mono text-sm font-bold text-white"
            style={{ backgroundColor: PRIMARY }}
          >
            &gt;_
          </span>
          <span className="text-lg font-bold tracking-tight" style={{ color: PRIMARY }}>
            EdTech Enthusiasts
          </span>
        </Link>

        <div className="mt-7">
          <h1 className="text-[1.75rem] font-bold leading-tight tracking-tight text-gray-900 lg:text-[2.05rem]">Tạo tài khoản mới</h1>
          <p className="mt-2.5 text-[0.95rem] font-normal leading-relaxed text-[#6B7280] lg:text-[1.05rem]">
            Đăng ký để bắt đầu hành trình phát triển năng lực số của bạn
          </p>

          <form className="mt-7 space-y-5" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-[#6B7280]">
                Họ và tên
              </label>
              <div className="relative mt-2">
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Nguyễn Văn A"
                  className="w-full rounded-lg border-0 bg-[#F3F4F6] py-3 px-3 text-base text-gray-900 placeholder:text-gray-400 outline-none ring-1 ring-transparent transition-shadow focus:ring-2 focus:ring-[#003399]/25"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#6B7280]">
                Email
              </label>
              <div className="relative mt-2">
                <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-base text-[#9CA3AF]">@</span>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="username@email.com"
                  className="w-full rounded-lg border-0 bg-[#F3F4F6] py-3 pl-10 pr-3 text-base text-gray-900 placeholder:text-gray-400 outline-none ring-1 ring-transparent transition-shadow focus:ring-2 focus:ring-[#003399]/25"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="text-sm font-medium text-[#6B7280]">
                Mật khẩu
              </label>
              <div className="relative mt-2">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border-0 bg-[#F3F4F6] py-3 pl-3 pr-11 text-base text-gray-900 outline-none ring-1 ring-transparent transition-shadow focus:ring-2 focus:ring-[#003399]/25"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-1.5 text-[#9CA3AF] transition-colors hover:bg-gray-200/80 hover:text-gray-600"
                  aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                >
                  {showPassword ? 'Ẩn' : 'Hiện'}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="text-sm font-medium text-[#6B7280]">
                Xác nhận mật khẩu
              </label>
              <div className="relative mt-2">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full rounded-lg border-0 bg-[#F3F4F6] py-3 pl-3 pr-11 text-base text-gray-900 outline-none ring-1 ring-transparent transition-shadow focus:ring-2 focus:ring-[#003399]/25"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((v) => !v)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-1.5 text-[#9CA3AF] transition-colors hover:bg-gray-200/80 hover:text-gray-600"
                  aria-label={showConfirmPassword ? 'Ẩn mật khẩu xác nhận' : 'Hiện mật khẩu xác nhận'}
                >
                  {showConfirmPassword ? 'Ẩn' : 'Hiện'}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-lg py-3 text-base font-semibold text-white shadow-sm transition-all hover:brightness-110 active:scale-[0.99]"
              style={{ backgroundColor: PRIMARY }}
            >
              Đăng ký
            </button>

            {submitError ? <p className="text-sm font-semibold text-[#DC2626]">{submitError}</p> : null}
          </form>

          <p className="mt-7 text-center text-sm text-[#6B7280]">
            Bạn đã có tài khoản?{' '}
            <Link to="/login" className="font-semibold transition-opacity hover:opacity-80" style={{ color: PRIMARY }}>
              Đăng nhập
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
