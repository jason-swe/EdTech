function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  )
}

export function InfoDarkSection() {
  return (
    <section
      id="to-chuc"
      className="bg-[#003380] px-4 py-28 text-white sm:px-6 lg:px-8"
    >
      <div className="mx-auto grid max-w-7xl gap-16 lg:grid-cols-2 lg:gap-20">
        <div className="max-w-xl">
          <h2 className="text-3xl font-bold leading-tight tracking-tight text-white lg:text-[2rem]">
            Minh bạch, đạo đức và thông thái.
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-white/85">
            Thiết kế cho bối cảnh học thuật: dữ liệu được xử lý có trách nhiệm,
            quyền riêng tư được tôn trọng và giải thích rõ ràng cho mọi bên liên
            quan.
          </p>
          <ul className="mt-10 space-y-6">
            <li className="flex gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-white/15">
                <CheckIcon className="h-5 w-5 text-white" />
              </span>
              <div>
                <p className="font-semibold text-white">Khung đạo đức</p>
                <p className="mt-1 text-[15px] leading-relaxed text-white/80">
                  Nguyên tắc và quy trình kiểm soát phù hợp bối cảnh giáo dục.
                </p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-white/15">
                <CheckIcon className="h-5 w-5 text-white" />
              </span>
              <div>
                <p className="font-semibold text-white">Minh bạch tuyệt đối</p>
                <p className="mt-1 text-[15px] leading-relaxed text-white/80">
                  Báo cáo và nhật ký truy vết giúp tổ chức giải trình khi cần.
                </p>
              </div>
            </li>
          </ul>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <article className="rounded-xl border border-white/10 bg-white/10 p-6 backdrop-blur-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10">
              <svg
                className="h-5 w-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.75}
                aria-hidden
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
                />
              </svg>
            </div>
            <h3 className="mt-4 text-lg font-bold text-white">Sinh viên</h3>
            <p className="mt-2 text-[15px] leading-relaxed text-white/80">
              Theo dõi lộ trình, chứng chỉ và phản hồi để phát triển năng lực số
              có định hướng.
            </p>
          </article>

          <article className="rounded-xl border border-white/10 bg-white/10 p-6 backdrop-blur-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10">
              <svg
                className="h-5 w-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.75}
                aria-hidden
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <h3 className="mt-4 text-lg font-bold text-white">Cố vấn</h3>
            <p className="mt-2 text-[15px] leading-relaxed text-white/80">
              Hỗ trợ nhóm nhỏ với thông tin đồng nhất và công cụ theo dõi tiến
              độ.
            </p>
          </article>

          <article className="rounded-xl border border-white/10 bg-white/10 p-6 backdrop-blur-sm sm:col-span-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10">
              <svg
                className="h-5 w-5 text-white"
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
            </div>
            <h3 className="mt-4 text-lg font-bold text-white">Nhà quản lý</h3>
            <p className="mt-2 text-[15px] leading-relaxed text-white/80">
              Tổng quan tuân thủ, rủi ro và hiệu quả đầu tư vào phát triển năng
              lực tổ chức.
            </p>
          </article>
        </div>
      </div>
    </section>
  )
}
