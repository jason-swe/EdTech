import { type ReactNode } from 'react'

import { getUserInitials, useAuth } from '../../auth/authContext'

type MenuItem = {
  label: string
  active?: boolean
  icon: ReactNode
}

const menuItems: MenuItem[] = [
  {
    label: 'Bảng điều khiển học viên',
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4.5 5.25h6v6h-6v-6zm9 0h6v4.5h-6v-4.5zm0 7.5h6v6h-6v-6zm-9 1.5h6v4.5h-6v-4.5z"
      />
    ),
  },
  {
    label: 'Đánh giá',
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 17.25h6m-6-3h4.5m-6.75-9h10.5A1.5 1.5 0 0118.75 6.75v10.5a1.5 1.5 0 01-1.5 1.5H6.75a1.5 1.5 0 01-1.5-1.5V6.75a1.5 1.5 0 011.5-1.5z"
      />
    ),
  },
  {
    label: 'Giám sát rủi ro',
    active: true,
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 3l8 16.5H4L12 3zm0 6v4.5m0 3h.01"
      />
    ),
  },
  {
    label: 'Lộ trình học',
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4.5 6.75h15m-15 5.25h15m-15 5.25h9"
      />
    ),
  },
  {
    label: 'Bảng điều khiển quản trị',
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M10.5 3.75h3a2.25 2.25 0 012.25 2.25v1.5h1.5A2.25 2.25 0 0119.5 9.75v7.5A2.25 2.25 0 0117.25 19.5H6.75A2.25 2.25 0 014.5 17.25v-7.5A2.25 2.25 0 016.75 7.5h1.5V6a2.25 2.25 0 012.25-2.25z"
      />
    ),
  },
  {
    label: 'Quản lý can thiệp',
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8.25 7.5a3.75 3.75 0 117.5 0M5.25 19.5v-1.875A3.375 3.375 0 018.625 14.25h6.75a3.375 3.375 0 013.375 3.375V19.5"
      />
    ),
  },
  {
    label: 'Quản lý người dùng',
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.75 6.75a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM3.75 18.75a7.5 7.5 0 0115 0"
      />
    ),
  },
  {
    label: 'Quản lý dữ liệu học tập',
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4.5 6.75C4.5 5.507 7.86 4.5 12 4.5s7.5 1.007 7.5 2.25S16.14 9 12 9 4.5 7.993 4.5 6.75zm0 0v5.25C4.5 13.243 7.86 14.25 12 14.25s7.5-1.007 7.5-2.25V6.75m-15 5.25v5.25c0 1.243 3.36 2.25 7.5 2.25s7.5-1.007 7.5-2.25V12"
      />
    ),
  },
]

export default function CuratorRiskMonitoringPage() {
  const { user, logout } = useAuth()
  const assignedLearners = user?.assignedLearners ?? []
  const firstLearner = assignedLearners[0] ?? 'Học viên A'
  const secondLearner = assignedLearners[1] ?? 'Học viên B'
  const thirdLearner = assignedLearners[2] ?? 'Học viên C'

  return (
    <div className="min-h-screen bg-[#ECEFF5] text-[#334155]">
      <main className="h-screen w-full overflow-hidden">
        <div className="grid h-full grid-cols-[250px_1fr] overflow-hidden bg-[#F3F6FB]">
          <aside className="flex h-full flex-col bg-[#E8EDF4] px-4 pt-4">
            <div className="rounded-xl bg-[#F0F4FA] p-3">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0D3D91] text-white">
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V12m0-4.5h.01M4.5 12a7.5 7.5 0 1115 0 7.5 7.5 0 01-15 0z" />
                  </svg>
                </span>
                <div>
                  <p className="text-[0.95rem] font-bold leading-none text-[#154391]">EdTech Enthusiasts</p>
                  <p className="text-[0.55rem] font-semibold uppercase tracking-[0.13em] text-[#6B7B91]">Curator học thuật</p>
                </div>
              </div>
            </div>

            <nav className="mt-5 space-y-1.5">
              {menuItems.map((item) => (
                <button
                  key={item.label}
                  className={`group flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-[0.77rem] ${
                    item.active
                      ? 'bg-white text-[#1E4BA5] shadow-[0_4px_12px_rgba(15,35,70,0.09)]'
                      : 'text-[#66788F] hover:bg-white/70'
                  }`}
                >
                  <svg
                    className={`h-3.5 w-3.5 shrink-0 ${item.active ? 'text-[#1E4BA5]' : 'text-[#7B8CA1]'}`}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.9}
                  >
                    {item.icon}
                  </svg>
                  <span className="truncate">{item.label}</span>
                  {item.active ? <span className="ml-auto h-4 w-[2px] rounded-full bg-[#1E4BA5]" aria-hidden /> : null}
                </button>
              ))}
            </nav>

            <div className="mt-auto flex items-center gap-2 border-t border-[#D7DFEA] pb-3 pt-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#194698] text-[0.62rem] font-semibold text-white">
                {getUserInitials(user?.fullName)}
              </span>
              <div>
                <p className="text-[0.68rem] font-semibold text-[#30445E]">{user?.fullName ?? 'Cố vấn học thuật'}</p>
                <p className="text-[0.56rem] text-[#7A8AA0]">Cố vấn phụ trách</p>
              </div>
            </div>
          </aside>

          <section className="flex h-full flex-col bg-[#F8FAFD]">
            <header className="flex items-center justify-between border-b border-[#DEE5EF] px-4 py-2.5">
              <label className="relative w-[56%]">
                <svg
                  className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#7A8AA0]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.3-4.3M11 18a7 7 0 100-14 7 7 0 000 14z" />
                </svg>
                <input
                  type="text"
                  placeholder="Tìm kiếm học viên, cảnh báo hoặc rủi ro..."
                  className="h-8 w-full rounded-full border border-[#E1E8F2] bg-[#EDF1F7] pl-9 pr-3 text-[0.7rem] text-[#334155] outline-none placeholder:text-[#91A0B5]"
                />
              </label>

              <div className="flex items-center gap-3.5">
                <button className="relative text-[#64748B]" aria-label="Thông báo">
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M14.857 17.082A23.848 23.848 0 0112 17.25c-.969 0-1.924-.058-2.857-.168M7.5 8.625a4.5 4.5 0 119 0c0 1.078.121 2.132.35 3.145.224.994.738 1.9 1.5 2.614l.402.377A1.125 1.125 0 0118 16.5H6a1.125 1.125 0 01-.752-1.989l.402-.377c.762-.714 1.276-1.62 1.5-2.614.229-1.013.35-2.067.35-3.145z"
                    />
                  </svg>
                  <span className="absolute -right-0.5 -top-0.5 h-1.5 w-1.5 rounded-full bg-[#EF4444]" />
                </button>

                <div className="h-5 w-px bg-[#DAE2ED]" />

                <button
                  type="button"
                  onClick={logout}
                  className="rounded-xl border border-[#CAD6E8] bg-white px-3 py-1.5 text-xs font-semibold text-[#3F5370] transition-colors hover:bg-[#EEF4FF]"
                >
                  Đăng xuất
                </button>

                <button className="flex items-center gap-2">
                  <span className="text-[0.72rem] font-semibold text-[#2B4264]">Hồ sơ</span>
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#0D3D91] text-[0.64rem] font-semibold text-white">
                    {getUserInitials(user?.fullName)}
                  </span>
                </button>
              </div>
            </header>

            <div className="flex-1 overflow-y-auto px-4 py-4">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <h2 className="text-[2.55rem] font-black tracking-[-0.04em] text-[#123D8F]">Giám sát rủi ro</h2>
                  <p className="mt-0.5 text-[0.82rem] text-[#64748B]">Phân tích dự báo và cảnh báo sớm cho hiệu suất học tập của các khoa.</p>
                </div>

                <div className="flex items-center gap-2">
                  <button className="inline-flex items-center gap-1.5 rounded-full bg-[#ECEFF4] px-3 py-1.5 text-[0.7rem] font-semibold text-[#495A70]">
                    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M7 12h10M10 18h4" />
                    </svg>
                    Bộ lọc
                  </button>
                  <button className="inline-flex items-center gap-1.5 rounded-full bg-[#17479F] px-3.5 py-1.5 text-[0.7rem] font-semibold text-white shadow-[0_8px_16px_rgba(23,71,159,0.3)]">
                    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v10.5m0 0l4.5-4.5M12 15l-4.5-4.5M4.5 19.5h15" />
                    </svg>
                    Xuất báo cáo
                  </button>
                </div>
              </div>

              <div className="grid gap-3 lg:grid-cols-[1fr_1fr_1.05fr]">
                <article className="rounded-2xl border border-[#E2E8F2] bg-white p-4">
                  <div className="mb-4 flex items-center justify-between">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#FCE7E4] text-[#D1493D]">
                      <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l5-5 3 3 6-6" />
                      </svg>
                    </span>
                    <p className="text-[0.64rem] font-semibold text-[#D1493D]">+2.4% so với kỳ trước</p>
                  </div>
                  <p className="text-[2.95rem] font-black leading-none tracking-[-0.05em] text-[#111827]">12%</p>
                  <p className="mt-1 text-[0.95rem] text-[#3F4E63]">Học viên có nguy cơ</p>
                </article>

                <article className="rounded-2xl border border-[#E2E8F2] bg-white p-4">
                  <div className="mb-4 flex items-center justify-between">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#E8EEFA] text-[#2A63CE]">
                      <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5h15m-12-3v-6m4.5 6v-10.5m4.5 10.5v-7.5" />
                      </svg>
                    </span>
                    <p className="text-[0.64rem] font-semibold text-[#2A63CE]">Giảm nghiêm trọng</p>
                  </div>
                  <p className="text-[2.95rem] font-black leading-none tracking-[-0.05em] text-[#111827]">15%</p>
                  <p className="mt-1 text-[0.95rem] text-[#3F4E63]">Phát hiện sụt giảm tương tác</p>
                </article>

                <article className="rounded-2xl border border-[#E2D5CE] bg-[#F7F4F2] p-4">
                  <p className="text-[0.72rem] font-bold uppercase tracking-[0.08em] text-[#A15830]">Trung tâm cảnh báo</p>
                  <div className="mt-3 space-y-2.5">
                    <div className="rounded-xl border border-[#E7DCD5] bg-[#FFF9F5] px-3 py-2">
                      <p className="text-[0.76rem] font-semibold text-[#5F3722]">{firstLearner}, {secondLearner} và {thirdLearner} không đăng nhập 7 ngày qua</p>
                      <p className="mt-1 text-[0.62rem] text-[#8A6A58]">Lớp 2025 • Khoa Kỹ thuật</p>
                    </div>
                    <div className="rounded-xl border border-[#E7DCD5] bg-[#FFF9F5] px-3 py-2">
                      <p className="text-[0.76rem] font-semibold text-[#5F3722]">{firstLearner} sụt giảm bất thường điểm kiểm tra nhanh</p>
                      <p className="mt-1 text-[0.62rem] text-[#8A6A58]">Học phần: Quyền riêng tư dữ liệu</p>
                    </div>
                  </div>
                </article>
              </div>

              <div className="mt-3 grid gap-3 lg:grid-cols-[2fr_1fr]">
                <article className="rounded-3xl bg-gradient-to-br from-[#1849A5] via-[#123F95] to-[#0C357E] p-6 text-white shadow-[0_16px_30px_rgba(16,55,126,0.35)]">
                  <h3 className="text-[1.9rem] font-semibold tracking-[-0.02em]">Tỷ lệ can thiệp thành công</h3>
                  <p className="mt-2 max-w-[85%] text-[0.92rem] leading-[1.6] text-[#D6E5FF]">
                    Các can thiệp sớm trong 4 tuần đầu học kỳ đã đạt tỷ lệ 68% đưa học viên trở lại trạng thái Rủi ro thấp.
                  </p>
                  <div className="mt-5 flex items-end gap-7">
                    <div>
                      <p className="text-[2.2rem] font-black leading-none">68.4%</p>
                      <p className="mt-1 text-[0.62rem] font-semibold uppercase tracking-[0.09em] text-[#BCD2F9]">Tỷ lệ phục hồi</p>
                    </div>
                    <div>
                      <p className="text-[2.2rem] font-black leading-none">42</p>
                      <p className="mt-1 text-[0.62rem] font-semibold uppercase tracking-[0.09em] text-[#BCD2F9]">Can thiệp đang chạy</p>
                    </div>
                  </div>
                </article>

                <article className="rounded-3xl bg-[#8A3704] p-5 text-white shadow-[0_16px_28px_rgba(121,52,9,0.34)]">
                  <span className="mb-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#A85626] text-[#FFD7B8]">
                    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 4h.01M4.5 12a7.5 7.5 0 1115 0 7.5 7.5 0 01-15 0z" />
                    </svg>
                  </span>
                  <h3 className="text-[1.55rem] font-semibold">Gợi ý cố vấn</h3>
                  <p className="mt-2 text-[0.86rem] leading-[1.55] text-[#F7D7BF]">
                    Mô-đun Quyền riêng tư dữ liệu đang xuất hiện cụm điểm cao-rủi ro. Cân nhắc tổ chức một buổi phụ đạo theo nhóm.
                  </p>
                  <button className="mt-6 w-full rounded-full bg-[#B56D43] px-3 py-2 text-[0.72rem] font-bold uppercase tracking-[0.08em] text-[#FFF1E7]">
                    Lên lịch phiên hỗ trợ
                  </button>
                </article>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
