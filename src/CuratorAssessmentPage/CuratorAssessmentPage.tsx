import { type ReactNode } from 'react'
import { Link } from 'react-router-dom'

const sideItems = [
  {
    label: 'Thông tin cá nhân',
    active: false,
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.75 6.75a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 19.5a7.5 7.5 0 0115 0"
      />
    ),
  },
  {
    label: 'Đánh giá năng lực số',
    active: true,
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4.5 18.75h15M7.5 15.75V9m4.5 6.75v-9m4.5 9v-4.5M4.5 5.25h15v13.5h-15z"
      />
    ),
  },
  {
    label: 'Lộ trình học tập',
    active: false,
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 6.75v10.5m0-10.5c-1.6-1.1-3.684-1.653-5.778-1.533A30.01 30.01 0 003 5.75v11.5a27.5 27.5 0 013.222-.533c2.094-.12 4.178.433 5.778 1.533m0-11.5c1.6-1.1 3.684-1.653 5.778-1.533 1.092.063 2.168.24 3.222.533v11.5a27.5 27.5 0 00-3.222-.533c-2.094-.12-4.178.433-5.778 1.533"
      />
    ),
  },
] as const

function RadarChart() {
  return (
    <svg viewBox="0 0 330 280" className="mx-auto h-[285px] w-full max-w-[360px]" aria-label="Biểu đồ radar năng lực số">
      <g fill="none" stroke="#DBE3EE">
        <polygon points="165,37 243,82 243,172 165,218 87,172 87,82" />
        <polygon points="165,61 222,94 222,160 165,192 108,160 108,94" />
        <polygon points="165,84 202,106 202,147 165,170 128,147 128,106" />
        <polygon points="165,106 184,116 184,136 165,147 146,136 146,116" />
      </g>

      <g stroke="#D8E0EC" strokeWidth="1">
        <line x1="165" y1="37" x2="165" y2="218" />
        <line x1="243" y1="82" x2="87" y2="172" />
        <line x1="243" y1="172" x2="87" y2="82" />
      </g>

      <polygon
        points="165,74 214,104 208,154 165,180 118,156 122,105"
        fill="rgba(28,79,171,0.16)"
        stroke="#0E3A8A"
        strokeWidth="3"
      />

      <g fill="#475569" fontSize="10" fontWeight="600" textAnchor="middle">
        <text x="165" y="24">KHAI THÁC DỮ LIỆU</text>
        <text x="257" y="88">GIAO TIẾP VÀ HỢP</text>
        <text x="257" y="100">TÁC TRONG KỶ NGUYÊN SỐ</text>
        <text x="236" y="196">SÁNG TẠO</text>
        <text x="236" y="208">NỘI DUNG SỐ</text>
        <text x="165" y="238">AN TOÀN</text>
        <text x="95" y="196">GIẢI QUYẾT</text>
        <text x="95" y="208">VẤN ĐỀ</text>
        <text x="74" y="88">ỨNG DỤNG</text>
        <text x="74" y="100">TRÍ TUỆ NHÂN TẠO</text>
      </g>
    </svg>
  )
}

function InsightCard({
  color,
  title,
  content,
  icon,
}: {
  color: string
  title: string
  content: string
  icon: ReactNode
}) {
  return (
    <article className="rounded-3xl border border-[#DDE4EE] bg-white p-5 shadow-[0_2px_10px_rgba(15,35,70,0.06)]">
      <span
        className="mb-4 inline-flex h-8 w-8 items-center justify-center rounded-full text-white"
        style={{ backgroundColor: color }}
      >
        {icon}
      </span>
      <h3 className="text-[1.75rem] font-semibold leading-[1.2] text-[#0F172A]">{title}</h3>
      <p className="mt-3 text-[0.95rem] leading-[1.6] text-[#4B5563]">{content}</p>
    </article>
  )
}

export default function CuratorAssessmentPage() {
  return (
    <div className="min-h-screen bg-[#E9EEF6] font-sans text-[#334155]">
      <header className="sticky top-0 z-20 border-b border-[#D7DFEC] bg-[#F7F9FD]">
        <div className="flex h-14 w-full items-center justify-between px-4 sm:px-6 lg:px-8">
          <p className="text-[0.95rem] font-bold text-[#154391]">EdTech Enthusiasts</p>
          <div className="flex items-center gap-3 text-[#64748B]">
            <button className="rounded-lg p-2 hover:bg-[#EAF0FA]" aria-label="Thông báo">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14.857 17.082A23.848 23.848 0 0112 17.25c-.969 0-1.924-.058-2.857-.168M7.5 8.625a4.5 4.5 0 119 0c0 1.078.121 2.132.35 3.145.224.994.738 1.9 1.5 2.614l.402.377A1.125 1.125 0 0118 16.5H6a1.125 1.125 0 01-.752-1.989l.402-.377c.762-.714 1.276-1.62 1.5-2.614.229-1.013.35-2.067.35-3.145z"
                />
              </svg>
            </button>
            <button className="rounded-lg p-2 hover:bg-[#EAF0FA]" aria-label="Cài đặt">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.573-1.066z"
                />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0F3F95] text-[1rem] font-semibold text-white">
              Q
            </span>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-56px)] w-full overflow-hidden">
        <aside className="hidden w-[322px] shrink-0 border-r border-[#D2DBE8] bg-[#E2E8F1] lg:block">
          <div className="h-full px-5 py-6">
            <div className="mb-6 flex items-center gap-2.5">
              <span className="flex h-12 w-12 items-center justify-center rounded-md bg-[#1E4BA5] text-white shadow-[0_6px_16px_rgba(30,75,165,0.24)]">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.9}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.5 9.5l-3 5 5-2-2-3z" />
                </svg>
              </span>
              <div className="min-w-0">
                <p className="whitespace-nowrap text-[1.62rem] font-extrabold uppercase leading-none tracking-[0.005em] text-[#22334B]">
                  Khởi tạo
                </p>
                <p className="mt-1 whitespace-nowrap text-[0.72rem] uppercase tracking-[0.065em] text-[#647892]">
                  Quy trình khởi tạo định hướng
                </p>
              </div>
            </div>

            <nav className="space-y-2.5">
              {sideItems.map((item) => (
                <button
                  key={item.label}
                  className={`flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-[0.83rem] leading-none transition-colors ${
                    item.active
                      ? 'bg-white font-semibold text-[#214A96] shadow-[0_4px_14px_rgba(15,35,70,0.11)]'
                      : 'text-[#64748B] hover:bg-white/65'
                  }`}
                >
                  <svg className="h-[0.95rem] w-[0.95rem] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.9}>
                    {item.icon}
                  </svg>
                  <span className="w-full overflow-hidden text-ellipsis whitespace-nowrap">{item.label}</span>
                </button>
              ))}
            </nav>

            <div className="pt-7">
              <button className="w-full rounded-xl border border-[#CFD8E6] bg-white px-4 py-2.5 text-sm font-semibold text-[#56637A] transition-colors hover:bg-[#F8FBFF]">
                Hỗ trợ
              </button>
            </div>
          </div>
        </aside>

        <main className="h-full w-full overflow-y-auto px-3 py-6 sm:px-6 sm:py-8 lg:px-6">
          <div className="mx-auto max-w-[1060px] space-y-9 p-5 sm:p-8 lg:p-9">
            <section>
              <h1 className="max-w-[760px] text-[2.8rem] font-black leading-[1.1] tracking-[-0.02em] text-[#0E2F6E] sm:text-[3.2rem]">
                <span className="mr-3 inline-block bg-[#BFD9FF] px-2 py-0.5">Kết quả</span>
                Phân tích Năng lực số sơ bộ
              </h1>
            </section>

            <section className="grid gap-6 lg:grid-cols-[2.2fr_1fr]">
              <article className="rounded-3xl border border-[#DCE4EF] bg-white p-5">
                <div className="flex items-start justify-between">
                  <p className="text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-[#6B7D95]">
                    Điểm năng lực tổng quát
                  </p>
                  <p className="text-right text-[4.2rem] font-black leading-none tracking-[-0.03em] text-[#0D3C8F]">
                    68
                    <span className="ml-1 text-[2.1rem] font-semibold text-[#C1C6CE]">/100</span>
                  </p>
                </div>
                <div className="mt-2">
                  <RadarChart />
                </div>
              </article>

              <div className="space-y-6">
                <InsightCard
                  color="#16A34A"
                  title="Thế mạnh: Khai thác Dữ liệu"
                  content="Hồ sơ của bạn cho thấy khả năng phân tích và quản lý dữ liệu xuất sắc từ các dự án thực tế trên GitHub."
                  icon={
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  }
                />
                <InsightCard
                  color="#92400E"
                  title="Cần chú trọng: An toàn Số"
                  content="Bạn cần bổ sung các chứng chỉ hoặc minh chứng thực hành về bảo mật và an toàn hệ thống số."
                  icon={
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 11v2m0 4h.01M5 6h14v6c0 4.2-3 7.9-7 9-4-1.1-7-4.8-7-9V6z" />
                    </svg>
                  }
                />
              </div>
            </section>

            <section className="flex flex-col gap-5 rounded-3xl border border-[#DCE4EF] bg-white p-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-[#D9E5FA]">
                  <svg className="h-7 w-7 text-[#1B4AA0]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6.75a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 19.5a7.5 7.5 0 0115 0" />
                  </svg>
                </span>
                <div>
                  <p className="text-[1.1rem] font-semibold text-[#1E3A8A]">Sẵn sàng bước tiếp?</p>
                  <p className="text-[0.92rem] text-[#64748B]">Chúng tôi đã phác thảo lộ trình học tập cá nhân hóa cho bạn.</p>
                </div>
              </div>

              <Link
                to="/curator-learning-plan"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#0F3E97] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_10px_20px_rgba(15,62,151,0.2)] transition-all hover:bg-[#0D3584] hover:shadow-[0_12px_24px_rgba(15,62,151,0.26)]"
              >
                Tiếp tục thiết kế Lộ trình học tập
                <span>→</span>
              </Link>
            </section>
          </div>

          <p className="mt-6 text-[0.62rem] uppercase tracking-[0.1em] text-[#9AA8BF]">
            © 2026 EdTech Enthusiasts Academic Curator System
          </p>
        </main>
      </div>
    </div>
  )
}
