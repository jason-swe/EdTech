const clubs = [
  {
    title: 'AI Research Club',
    desc: 'Nghiên cứu ứng dụng AI trong giáo dục và phân tích dữ liệu học tập.',
    circle: 'bg-sky-100 text-sky-700',
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
      />
    ),
  },
  {
    title: 'Digital Marketing Lab',
    desc: 'Thực hành chiến dịch số, đo lường hiệu quả và tối ưu kênh truyền thông.',
    circle: 'bg-violet-100 text-violet-700',
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"
      />
    ),
  },
  {
    title: 'Data Ethics Society',
    desc: 'Thảo luận đạo đức dữ liệu, quyền riêng tư và trách nhiệm trong EdTech.',
    circle: 'bg-orange-100 text-orange-700',
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
      />
    ),
  },
]

export function FeaturesClubs() {
  return (
    <section
      id="su-kien"
      className="bg-[#F9FAFB] px-4 py-28 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">
        <h2 className="text-center text-3xl font-bold tracking-tight text-[#003380] lg:text-[2rem]">
          Phát triển qua hành động: Câu lạc bộ &amp; Dự án
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-center text-lg leading-relaxed text-[#4B5563]">
          Tham gia cộng đồng thực chiến để rèn năng lực số và mở rộng kết nối
          học thuật.
        </p>
        <div className="mt-16 grid gap-8 md:grid-cols-3 md:gap-10">
          {clubs.map((c) => (
            <article
              key={c.title}
              className="flex flex-col rounded-xl border border-gray-100 bg-white p-8 text-center shadow-[0_4px_24px_rgba(0,0,0,0.06)] transition-shadow hover:shadow-[0_8px_32px_rgba(0,51,128,0.08)]"
            >
              <div
                className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full ${c.circle}`}
              >
                <svg
                  className="h-8 w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.75}
                  aria-hidden
                >
                  {c.icon}
                </svg>
              </div>
              <h3 className="mt-6 text-lg font-bold text-[#003380]">{c.title}</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-[#4B5563]">
                {c.desc}
              </p>
            </article>
          ))}
        </div>
        <div className="mt-14 flex justify-center">
          <a
            href="#"
            className="inline-flex items-center justify-center rounded-xl bg-[#003380] px-10 py-3.5 text-[15px] font-semibold text-white shadow-sm transition-all hover:bg-[#002966] hover:shadow-md active:scale-[0.98]"
          >
            Khám phá các câu lạc bộ
          </a>
        </div>
      </div>
    </section>
  )
}
