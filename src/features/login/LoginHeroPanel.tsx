const PRIMARY = '#003399'

export function LoginHeroPanel() {
  return (
    <div className="relative hidden min-h-0 w-full flex-col overflow-hidden bg-[#103A8F] lg:flex lg:w-1/2">
      <img
        src="/logo.png"
        alt=""
        className="pointer-events-none absolute inset-0 z-0 h-full w-full scale-110 object-cover opacity-24 blur-[1.25px]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-br from-[#1A4AA8]/72 to-[#0A2E7A]/78"
        aria-hidden
      />

      <div className="relative z-10 flex min-h-0 flex-1 flex-col justify-center px-10 py-8 xl:px-14">
        <div className="h-1 w-12 rounded-sm bg-[#a5b4fc]" aria-hidden />
        <h2 className="mt-6 max-w-[14rem] text-left text-[1.625rem] font-extrabold leading-[1.08] tracking-[-0.02em] text-white xl:max-w-[15rem] xl:text-[1.875rem]">
          <span className="block">Kiến tạo</span>
          <span className="block">tương lai</span>
          <span className="block">bằng dữ liệu</span>
          <span className="block">trí tuệ.</span>
        </h2>
        <p className="mt-4 max-w-[17rem] text-left text-[0.9375rem] font-normal leading-[1.55] text-blue-100/85">
          Hệ thống phân tích năng lực số tiên tiến dành cho các tổ chức giáo dục
          hiện đại.
        </p>
      </div>

      <div className="relative z-10 shrink-0 px-10 pb-8 pt-2 xl:px-14">
        <div className="flex max-w-md items-center gap-3 rounded-xl bg-[#D1E9FF] px-4 py-3 shadow-sm">
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-white"
            style={{ backgroundColor: PRIMARY }}
          >
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
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          </div>
          <div>
            <p
              className="text-[0.6875rem] font-bold uppercase tracking-[0.08em] text-[#003399]"
            >
              EdTech Enthusiasts
            </p>
            <p className="mt-0.5 text-xs font-normal text-[#6B7280]">
              98.4% Phân tích chính xác
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
