const HERO_IMG =
  'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=960&h=720&fit=crop&q=80'

export function Hero() {
  return (
    <section className="bg-white px-4 py-28 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-2 lg:gap-20">
        <div className="max-w-xl lg:max-w-none">
          <h1 className="text-[3.25rem] font-black uppercase leading-[0.95] tracking-[-0.03em] sm:text-[4rem] lg:text-[4.8rem] xl:text-[5.2rem]">
            <span className="block text-[#0A3A8A]">Nâng cao và quản trị</span>
            <span className="mt-2 block text-[#1E78FF]">Năng lực số</span>
          </h1>
          <p className="mt-8 text-lg font-normal leading-[1.65] text-[#4B5563]">
            Nền tảng giúp tổ chức giáo dục đo lường, phát triển và quản trị năng
            lực số một cách thống nhất — từ lộ trình cá nhân đến báo cáo cấp hệ
            thống.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <a
              href="#dich-vu"
              className="inline-flex items-center justify-center rounded-xl bg-[#003380] px-8 py-3.5 text-[15px] font-semibold text-white shadow-sm transition-all hover:bg-[#002966] hover:shadow-md active:scale-[0.98]"
            >
              Khám phá nền tảng
            </a>
            <a
              href="#to-chuc"
              className="inline-flex items-center justify-center rounded-xl border border-gray-300 bg-white px-8 py-3.5 text-[15px] font-semibold text-[#003380] transition-all hover:border-[#003380]/40 hover:bg-gray-50 active:scale-[0.98]"
            >
              Dành cho tổ chức
            </a>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[560px] lg:max-w-none lg:justify-self-end">
          <div className="overflow-hidden rounded-xl shadow-[0_20px_50px_-12px_rgba(0,51,128,0.18)]">
            <img
              src={HERO_IMG}
              alt="Sinh viên làm việc với dữ liệu trên màn hình"
              className="aspect-[4/3] h-auto w-full object-cover"
              width={560}
              height={420}
            />
          </div>
          <div className="absolute -bottom-5 left-6 flex max-w-[280px] items-center gap-4 rounded-xl border border-gray-100 bg-white p-5 shadow-[0_12px_40px_-8px_rgba(0,0,0,0.12)]">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#003380]/10">
              <svg
                className="h-6 w-6 text-[#003380]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-[#003380]">
                Tăng trưởng năng lực số
              </p>
              <p className="mt-1 text-sm font-semibold text-[#4B5563]">+80%</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
