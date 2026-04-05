const items = [
  {
    id: 'danh-gia',
    title: 'Đánh giá Năng động',
    desc: 'Phân tích dữ liệu đa nguồn từ các dấu vết hành vi, sản phẩm học tập và tự báo cáo để có hồ sơ năng lực toàn diện.',
    cta: 'Tìm hiểu về Phân tích Dấu vết',
    iconBg: 'bg-[#003380]',
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 19h16M7 16V9m5 7V6m5 10v-4M6 6h12a1 1 0 011 1v12H5V7a1 1 0 011-1z"
      />
    ),
  },
  {
    id: 'du-doan',
    title: 'Cảnh báo sớm & Dự đoán',
    desc: 'Xác định xác suất rủi ro và các kiểu mẫu mất tập trung trước khi chúng ảnh hưởng đến kết quả học tập và tỷ lệ duy trì của sinh viên.',
    cta: 'Mô hình hóa Rủi ro',
    iconBg: 'bg-[#8A2F00]',
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 8v4m0 3h.01M5.2 19h13.6c1.07 0 1.74-1.15 1.2-2.08L13.2 6.08a1.4 1.4 0 00-2.4 0L4 16.92c-.54.93.13 2.08 1.2 2.08z"
      />
    ),
  },
  {
    id: 'ca-nhan-hoa',
    title: 'Lộ trình Cá nhân hóa',
    desc: 'Đề xuất và các gợi ý hỗ trợ do AI tuyển chọn nhằm thúc đẩy sự phát triển cá nhân và tính tự chủ trong học tập.',
    cta: 'Khung Gợi ý',
    iconBg: 'bg-[#2D78E4]',
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M7 6a2 2 0 100 4 2 2 0 000-4zm10 8a2 2 0 100 4 2 2 0 000-4zM7 14a2 2 0 100 4 2 2 0 000-4zm2-6h4m-4 8h4M15 8l-2 2 2 2"
      />
    ),
  },
] as const

function ArrowIcon() {
  return (
    <svg
      className="h-4 w-4"
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
  )
}

export function FeaturesTechnical() {
  return (
    <section
      id="dich-vu"
      className="bg-[#F3F4F6] px-4 py-28 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">
        <h2 className="text-center text-3xl font-bold tracking-tight text-[#003380] lg:text-[2rem]">
          Đối tác Kỹ thuật số cho sự Phát triển
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-center text-lg leading-relaxed text-[#4B5563]">
          Vượt xa các điểm dữ liệu tiêu chuẩn để cung cấp những hiểu biết sâu
          sắc về hành vi thông qua việc điều phối AI có đạo đức.
        </p>
        <div className="mt-16 grid gap-8 md:grid-cols-3 md:gap-10">
          {items.map((item) => (
            <article
              key={item.title}
              id={item.id}
              className="scroll-mt-28 flex flex-col rounded-[1.85rem] border border-[#E5E7EB] bg-white p-8 shadow-[0_2px_12px_rgba(0,0,0,0.04)] transition-shadow hover:shadow-[0_10px_30px_rgba(0,51,128,0.08)]"
            >
              <div
                className={`mx-auto mb-8 flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${item.iconBg} text-white`}
                aria-hidden
              >
                <svg
                  className="h-7 w-7"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.8}
                >
                  {item.icon}
                </svg>
              </div>
              <h3 className="text-[2.1rem] font-bold leading-[1.2] tracking-[-0.015em] text-[#003380]">
                {item.title}
              </h3>
              <p className="mt-3 flex-1 text-[15px] leading-relaxed text-[#4B5563]">
                {item.desc}
              </p>
              <div className="mt-8 border-t border-[#EEF0F3]" aria-hidden />
              <a
                href="#dich-vu"
                className="mt-8 inline-flex items-center gap-2 text-[1.05rem] font-semibold text-[#0A57C4] transition-opacity hover:opacity-80"
              >
                {item.cta}
                <ArrowIcon />
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
