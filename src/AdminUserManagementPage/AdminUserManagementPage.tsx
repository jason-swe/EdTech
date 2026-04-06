type NavItem = {
  label: string
  section?: 'main' | 'admin'
  active?: boolean
}

const navItems: NavItem[] = [
  { label: 'Bảng điều khiển quản trị', section: 'admin' },
  { label: 'Quản lý can thiệp', section: 'admin' },
  { label: 'Quản lý người dùng', section: 'admin', active: true },
  { label: 'Quản lý rủi ro', section: 'admin' },
]

type UserRow = {
  initials: string
  name: string
  email: string
  role: 'Học viên' | 'Cố vấn học thuật' | 'Quản trị hệ thống'
  status: 'Hoạt động' | 'Không hoạt động'
  lastLogin: string
}

const users: UserRow[] = [
  {
    initials: 'EW',
    name: 'Eleanor Wright',
    email: 'eleanor.w@university.edu',
    role: 'Học viên',
    status: 'Hoạt động',
    lastLogin: '2 giờ trước',
  },
  {
    initials: 'MT',
    name: 'Marcus Thorne',
    email: 'm.thorne@academic-hub.com',
    role: 'Cố vấn học thuật',
    status: 'Hoạt động',
    lastLogin: '24/10, 10:45',
  },
  {
    initials: 'SC',
    name: 'Sarah Chen',
    email: 'schen.dev@university.edu',
    role: 'Quản trị hệ thống',
    status: 'Không hoạt động',
    lastLogin: '3 tháng trước',
  },
  {
    initials: 'JL',
    name: 'James Lin',
    email: 'james.lin@university.edu',
    role: 'Học viên',
    status: 'Hoạt động',
    lastLogin: 'Hôm qua, 16:20',
  },
]

function roleBadge(role: UserRow['role']) {
  if (role === 'Học viên') {
    return <span className="rounded-full bg-[#E8F0FF] px-2.5 py-1 text-[0.65rem] font-semibold text-[#2A63CE]">Học viên</span>
  }

  if (role === 'Cố vấn học thuật') {
    return (
      <span className="rounded-full bg-[#FFF0E5] px-2.5 py-1 text-[0.65rem] font-semibold text-[#A75E28]">Cố vấn</span>
    )
  }

  return (
    <span className="rounded-full bg-[#E9EDF5] px-2.5 py-1 text-[0.65rem] font-semibold text-[#31507D]">Quản trị</span>
  )
}

export default function AdminUserManagementPage() {
  return (
    <div className="min-h-screen bg-[#ECEFF5] text-[#334155]">
      <div className="grid min-h-screen grid-cols-[250px_1fr] bg-[#F3F6FB]">
        <aside className="flex h-screen flex-col bg-[#E8EDF4] px-4 py-4">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1A4AA3] text-white">
              <svg className="h-4.5 w-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15M12 4.5v15" />
              </svg>
            </span>
            <div>
              <p className="text-[0.95rem] font-bold leading-none text-[#154391]">EdTech Enthusiasts</p>
              <p className="mt-1 text-[0.62rem] uppercase tracking-[0.08em] text-[#73859E]">Curator học thuật</p>
            </div>
          </div>

          <div className="mt-4">
            <p className="mb-2 text-[0.62rem] font-semibold uppercase tracking-[0.08em] text-[#8A9AB0]">Quản trị</p>
            <div className="space-y-1">
              {navItems
                .filter((item) => item.section === 'admin')
                .map((item) => (
                  <button
                    key={item.label}
                    className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-[0.78rem] ${
                      item.active
                        ? 'bg-white font-semibold text-[#1D4BA5] shadow-[0_4px_10px_rgba(15,35,70,0.08)]'
                        : 'text-[#65788F] hover:bg-white/65'
                    }`}
                  >
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-current/80" />
                    <span className="truncate">{item.label}</span>
                    {item.active ? <span className="ml-auto h-4 w-[2px] rounded-full bg-[#1D4BA5]" aria-hidden /> : null}
                  </button>
                ))}
            </div>
          </div>

          <div className="mt-auto rounded-2xl bg-[#17479F] p-3 text-white">
            <p className="text-[0.62rem] uppercase tracking-[0.08em] text-[#C7D8F7]">Trạng thái hệ thống</p>
            <p className="mt-1 text-[0.85rem] font-semibold">Đang vận hành ổn định</p>
          </div>
        </aside>

        <section className="h-screen overflow-y-auto bg-[#F8FAFD]">
          <header className="flex items-center justify-between border-b border-[#DEE5EF] px-4 py-3">
            <label className="relative w-[44%]">
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
                placeholder="Tìm kiếm theo hồ sơ học thuật..."
                className="h-9 w-full rounded-full border border-[#E1E8F2] bg-[#EDF1F7] pl-9 pr-3 text-[0.74rem] text-[#334155] outline-none placeholder:text-[#91A0B5]"
              />
            </label>

            <div className="flex items-center gap-3">
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

              <div className="flex items-center gap-2">
                <div className="text-right leading-tight">
                  <p className="text-[0.74rem] font-semibold text-[#2B4264]">TS. Julian Vance</p>
                  <p className="text-[0.62rem] text-[#7588A1]">Quản trị hệ thống</p>
                </div>
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#F6DEC7] text-[0.62rem] font-semibold text-[#9C5A1F]">JV</span>
              </div>
            </div>
          </header>

          <div className="px-4 py-4">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <h2 className="text-[3.1rem] font-black tracking-[-0.045em] text-[#123D8F]">Quản lý người dùng</h2>
                <p className="mt-0.5 text-[0.9rem] text-[#64748B]">
                  Giám sát kiểm soát truy cập và phân quyền trong hệ sinh thái năng lực số.
                </p>
              </div>
              <button className="inline-flex items-center gap-1.5 rounded-full bg-[#17479F] px-4 py-2 text-[0.74rem] font-semibold text-white shadow-[0_8px_16px_rgba(23,71,159,0.28)]">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
                </svg>
                Mời người dùng mới
              </button>
            </div>

            <div className="grid gap-3 lg:grid-cols-[1fr_1fr_1fr_0.9fr]">
              <article className="rounded-2xl border border-[#E2E8F2] bg-white p-4">
                <p className="text-[0.72rem] font-semibold uppercase tracking-[0.06em] text-[#7B8CA1]">Tổng người dùng</p>
                <p className="mt-1 text-[2.1rem] font-black leading-none tracking-[-0.03em] text-[#111827]">2,842</p>
                <p className="mt-1 text-[0.67rem] font-semibold text-[#0E9B6C]">↗ 12% so với tháng trước</p>
              </article>

              <article className="rounded-2xl border border-[#E2E8F2] bg-white p-4">
                <p className="text-[0.72rem] font-semibold uppercase tracking-[0.06em] text-[#7B8CA1]">Học viên đang hoạt động</p>
                <p className="mt-1 text-[2.1rem] font-black leading-none tracking-[-0.03em] text-[#111827]">2,410</p>
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-[#EAF0FA]">
                  <div className="h-full w-[82%] rounded-full bg-[#2A63CE]" />
                </div>
              </article>

              <article className="rounded-2xl border border-[#E2E8F2] bg-white p-4">
                <p className="text-[0.72rem] font-semibold uppercase tracking-[0.06em] text-[#7B8CA1]">Cố vấn học thuật</p>
                <p className="mt-1 text-[2.1rem] font-black leading-none tracking-[-0.03em] text-[#111827]">312</p>
                <p className="mt-1 text-[0.67rem] text-[#64748B]">Tỷ lệ 1:8 cố vấn-học viên</p>
              </article>

              <article className="rounded-2xl bg-[#8A3704] p-4 text-white">
                <p className="text-[0.72rem] font-semibold uppercase tracking-[0.06em] text-[#F4CEB5]">Yêu cầu chờ duyệt</p>
                <p className="mt-1 text-[2.1rem] font-black leading-none tracking-[-0.03em]">18</p>
                <p className="mt-1 text-[0.67rem] font-semibold text-[#FFDCC7]">Xem hàng chờ →</p>
              </article>
            </div>

            <section className="mt-3 rounded-2xl border border-[#E2E8F2] bg-white">
              <div className="flex items-center justify-between border-b border-[#E7EDF6] px-4 py-3">
                <div className="flex items-center gap-2">
                  <label className="relative w-[300px]">
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
                      placeholder="Lọc theo tên, email hoặc mã ID..."
                      className="h-9 w-full rounded-full border border-[#E1E8F2] bg-[#F4F7FB] pl-9 pr-3 text-[0.72rem] text-[#334155] outline-none placeholder:text-[#91A0B5]"
                    />
                  </label>
                  <button className="rounded-full bg-[#F4F7FB] px-3 py-1.5 text-[0.7rem] font-semibold text-[#5B6C82]">Tất cả vai trò</button>
                  <button className="rounded-full bg-[#F4F7FB] px-3 py-1.5 text-[0.7rem] font-semibold text-[#5B6C82]">Tất cả trạng thái</button>
                </div>
                <button className="text-[0.75rem] font-semibold text-[#17479F]">Xuất CSV</button>
              </div>

              <div className="px-4 pb-2 pt-1">
                <div className="grid grid-cols-[1.7fr_0.9fr_0.8fr_0.9fr_0.5fr] py-2 text-[0.62rem] font-semibold uppercase tracking-[0.08em] text-[#7F8FA4]">
                  <span>Chi tiết người dùng</span>
                  <span>Vai trò</span>
                  <span>Trạng thái</span>
                  <span>Đăng nhập gần nhất</span>
                  <span className="text-right">Hành động</span>
                </div>

                {users.map((user) => (
                  <div
                    key={user.email}
                    className="grid grid-cols-[1.7fr_0.9fr_0.8fr_0.9fr_0.5fr] items-center border-t border-[#EDF2F8] py-2.5 text-[0.78rem]"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#E7EDF9] text-[0.7rem] font-semibold text-[#2F4D78]">
                        {user.initials}
                      </span>
                      <div>
                        <p className="font-semibold text-[#1E3A68]">{user.name}</p>
                        <p className="text-[0.66rem] text-[#7F8FA4]">{user.email}</p>
                      </div>
                    </div>
                    <div>{roleBadge(user.role)}</div>
                    <div className="flex items-center gap-1.5 text-[0.75rem]">
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          user.status === 'Hoạt động' ? 'bg-[#17B26A]' : 'bg-[#94A3B8]'
                        }`}
                      />
                      <span>{user.status}</span>
                    </div>
                    <div className="text-[0.74rem] text-[#4F5F77]">{user.lastLogin}</div>
                    <button className="text-right text-[0.74rem] font-semibold text-[#1D4BA5]">Xem</button>
                  </div>
                ))}

                <div className="flex items-center justify-between py-2.5 text-[0.72rem] text-[#6C7C94]">
                  <p>Hiển thị 1-4 trong 2,842 người dùng</p>
                  <div className="flex items-center gap-1.5">
                    <button className="h-7 w-7 rounded-full bg-[#F2F6FB] text-[#7A8AA0]">‹</button>
                    <button className="h-7 w-7 rounded-full bg-[#1848A1] text-white">1</button>
                    <button className="h-7 w-7 rounded-full bg-[#F2F6FB] text-[#7A8AA0]">2</button>
                    <button className="h-7 w-7 rounded-full bg-[#F2F6FB] text-[#7A8AA0]">3</button>
                    <span className="px-1">…</span>
                    <button className="h-7 w-7 rounded-full bg-[#F2F6FB] text-[#7A8AA0]">71</button>
                    <button className="h-7 w-7 rounded-full bg-[#F2F6FB] text-[#7A8AA0]">›</button>
                  </div>
                </div>
              </div>
            </section>

            <section className="mt-4">
              <h3 className="text-[1.85rem] font-black tracking-[-0.03em] text-[#123D8F]">Tổng quan phân quyền</h3>
              <p className="mt-1 text-[0.85rem] text-[#64748B]">Tóm tắt phân tầng người dùng và mức truy cập trong hệ thống curator.</p>

              <div className="mt-3 grid gap-3 lg:grid-cols-3">
                <article className="rounded-2xl border border-[#E1E7F1] bg-white p-4">
                  <p className="inline-block rounded-full bg-[#E8F0FF] px-2.5 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.06em] text-[#2A63CE]">
                    Người dùng cuối
                  </p>
                  <h4 className="mt-2 text-[1.6rem] font-semibold text-[#1F2937]">Học viên</h4>
                  <p className="mt-1 text-[0.78rem] leading-[1.6] text-[#64748B]">
                    Truy cập bảng điều khiển cá nhân, nộp bài đánh giá và theo dõi lộ trình học tập.
                  </p>
                  <ul className="mt-3 space-y-1 text-[0.72rem] text-[#4B5563]">
                    <li>• Nhật ký tự đánh giá</li>
                    <li>• Truy cập lộ trình học tập</li>
                  </ul>
                </article>

                <article className="rounded-2xl border border-[#E1E7F1] bg-white p-4">
                  <p className="inline-block rounded-full bg-[#FFF0E5] px-2.5 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.06em] text-[#A75E28]">
                    Quản lý
                  </p>
                  <h4 className="mt-2 text-[1.6rem] font-semibold text-[#1F2937]">Cố vấn học thuật</h4>
                  <p className="mt-1 text-[0.78rem] leading-[1.6] text-[#64748B]">
                    Theo dõi học viên phụ trách, quản lý can thiệp, xác thực tiến độ và hiệu quả học tập.
                  </p>
                  <ul className="mt-3 space-y-1 text-[0.72rem] text-[#4B5563]">
                    <li>• Phân tích học vụ theo thời gian</li>
                    <li>• Thực thi can thiệp theo nhóm</li>
                  </ul>
                </article>

                <article className="rounded-2xl bg-[#17479F] p-4 text-white shadow-[0_10px_24px_rgba(23,71,159,0.25)]">
                  <p className="inline-block rounded-full bg-white/18 px-2.5 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.06em] text-[#D7E7FF]">
                    Siêu quản trị
                  </p>
                  <h4 className="mt-2 text-[1.6rem] font-semibold">Quản trị hệ thống</h4>
                  <p className="mt-1 text-[0.78rem] leading-[1.6] text-[#E7F0FF]">
                    Toàn quyền cấu hình nền tảng, dữ liệu toàn cục và quản trị người dùng trên toàn hệ thống.
                  </p>
                  <ul className="mt-3 space-y-1 text-[0.72rem] text-[#E7F0FF]">
                    <li>• Toàn quyền cơ sở dữ liệu</li>
                    <li>• Kiểm tra nhật ký bảo mật</li>
                  </ul>
                </article>
              </div>
            </section>
          </div>
        </section>
      </div>
    </div>
  )
}
