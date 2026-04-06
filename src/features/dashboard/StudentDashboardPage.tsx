import { useMemo, type ReactNode } from 'react'

import type { GeminiLevelReviewOutput, GeminiRadarScores } from '../../services/geminiService'
import type { LevelPredictionResult } from '../../services/mlService'

function RadarCard({ scores }: { scores: GeminiRadarScores }) {
  const centerX = 310
  const centerY = 250
  const maxRadius = 180
  const axisAngles = [-90, -30, 30, 90, 150, 210]
  const axisValues = [
    scores.dataAndInformation,
    scores.communicationAndCollaboration,
    scores.digitalContentCreation,
    scores.safety,
    scores.problemSolving,
    scores.aiApplication,
  ]

  const points = axisAngles
    .map((angle, index) => {
      const ratio = Math.max(0, Math.min(100, axisValues[index])) / 100
      const radius = maxRadius * ratio
      const rad = (angle * Math.PI) / 180
      const x = centerX + radius * Math.cos(rad)
      const y = centerY + radius * Math.sin(rad)
      return `${x.toFixed(1)},${y.toFixed(1)}`
    })
    .join(' ')

  const pointDots = axisAngles.map((angle, index) => {
    const ratio = Math.max(0, Math.min(100, axisValues[index])) / 100
    const radius = maxRadius * ratio
    const rad = (angle * Math.PI) / 180
    const x = centerX + radius * Math.cos(rad)
    const y = centerY + radius * Math.sin(rad)
    return { x, y }
  })

  return (
    <article className="rounded-[28px] bg-white p-4 shadow-[0_8px_22px_rgba(15,35,70,0.06)]">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h3 className="text-[1.35rem] font-semibold tracking-[-0.01em] text-[#1F2937]">Ma trận Năng lực Số</h3>
          <p className="mt-1 text-[0.76rem] text-[#64748B]">Phân tích 6 miền năng lực theo chuẩn TT02/BGDĐT</p>
        </div>
        <button className="text-[0.74rem] font-semibold text-[#1D4ED8]">Phân tích chi tiết ↗</button>
      </div>

      <div className="relative h-[430px]">
        <svg viewBox="0 0 620 500" className="h-full w-full" aria-label="Radar chart">
          <g fill="none" stroke="#DCE3ED">
            <circle cx="310" cy="250" r="180" />
            <circle cx="310" cy="250" r="157.5" />
            <circle cx="310" cy="250" r="135" />
            <circle cx="310" cy="250" r="112.5" />
            <circle cx="310" cy="250" r="90" />
            <circle cx="310" cy="250" r="67.5" />
            <circle cx="310" cy="250" r="45" />
            <circle cx="310" cy="250" r="22.5" />
          </g>

          <g stroke="#D2DCE9" strokeWidth="1">
            <line x1="310" y1="250" x2="310" y2="70" />
            <line x1="310" y1="250" x2="466" y2="160" />
            <line x1="310" y1="250" x2="466" y2="340" />
            <line x1="310" y1="250" x2="310" y2="430" />
            <line x1="310" y1="250" x2="154" y2="340" />
            <line x1="310" y1="250" x2="154" y2="160" />
          </g>

          <circle cx="310" cy="250" r="12" fill="#A8BFE2" />

          <polygon points={points} fill="rgba(29,78,216,0.30)" stroke="#1E4BA5" strokeWidth="3.2" />

          <g fill="#1E4BA5">
            {pointDots.map((dot, index) => (
              <circle key={index} cx={dot.x} cy={dot.y} r="6.8" />
            ))}
          </g>
        </svg>

        <span className="absolute left-1/2 top-3 -translate-x-1/2 rounded-full border border-[#D5DFEC] bg-white px-4 py-2 text-[0.73rem] font-semibold leading-tight text-[#4B5563]">
          KHAI THÁC DỮ LIỆU VÀ THÔNG TIN
        </span>
        <span className="absolute right-0 top-[132px] rounded-full border border-[#D5DFEC] bg-white px-4 py-2 text-[0.73rem] font-semibold leading-tight text-[#4B5563]">
          GIAO TIẾP VÀ HỢP TÁC TRONG MÔI TRƯỜNG SỐ
        </span>
        <span className="absolute right-2 bottom-[106px] rounded-full border border-[#D5DFEC] bg-white px-4 py-2 text-[0.73rem] font-semibold leading-tight text-[#4B5563]">
          SÁNG TẠO NỘI DUNG SỐ
        </span>
        <span className="absolute left-1/2 bottom-1 -translate-x-1/2 rounded-full border border-[#D5DFEC] bg-white px-4 py-2 text-[0.73rem] font-semibold text-[#4B5563]">
          AN TOÀN
        </span>
        <span className="absolute left-0 bottom-[106px] rounded-full border border-[#D5DFEC] bg-white px-4 py-2 text-[0.73rem] font-semibold leading-tight text-[#4B5563]">
          GIẢI QUYẾT VẤN ĐỀ
        </span>
        <span className="absolute left-0 top-[132px] rounded-full border border-[#D5DFEC] bg-white px-4 py-2 text-[0.73rem] font-semibold leading-tight text-[#4B5563]">
          ỨNG DỤNG TRÍ TUỆ NHÂN TẠO
        </span>
      </div>
    </article>
  )
}

function HistoryCard() {
  return (
    <article className="rounded-[28px] bg-white p-4 shadow-[0_8px_22px_rgba(15,35,70,0.06)]">
      <h3 className="mb-3 text-[1.1rem] font-semibold text-[#1F2937]">Lịch sử</h3>

      <div className="relative space-y-6 pl-14">
        <span className="absolute left-[27px] top-5 bottom-5 w-px bg-[#D8E1EE]" aria-hidden />

        <div className="relative flex gap-4">
          <span className="absolute -left-14 top-0 flex h-11 w-11 items-center justify-center rounded-full bg-[#1E4BA5] text-white shadow-[0_8px_18px_rgba(30,75,165,0.2)]">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </span>
          <div>
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.06em] text-[#2563EB]">Hôm nay, 14:00</p>
            <p className="mt-1 text-[0.88rem] font-semibold text-[#1F2937]">Hoàn thành bài đánh giá Bảo mật nâng cao</p>
            <p className="mt-1 text-[0.76rem] text-[#64748B]">+500 điểm kinh nghiệm • Xuất sắc (95)</p>
          </div>
        </div>

        <div className="relative flex gap-4">
          <span className="absolute -left-14 top-0 flex h-11 w-11 items-center justify-center rounded-full border border-[#D7E0EC] bg-[#F4F7FB] text-[#92A1B8]">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3l8 4.5v6L12 18 4 13.5v-6L12 3z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 10l4-2" />
            </svg>
          </span>
          <div>
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.06em] text-[#94A3B8]">12 tháng 10, 2025</p>
            <p className="mt-1 text-[0.88rem] font-semibold text-[#1F2937]">Nhận chứng chỉ Digital Citizen Level 2</p>
            <p className="mt-1 text-[0.76rem] text-[#64748B]">Cấp bởi Precision Global Academy</p>
          </div>
        </div>

        <div className="relative flex gap-4">
          <span className="absolute -left-14 top-0 flex h-11 w-11 items-center justify-center rounded-full border border-[#D7E0EC] bg-[#F4F7FB] text-[#92A1B8]">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 10l-8 4-8-4" />
            </svg>
          </span>
          <div>
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.06em] text-[#94A3B8]">05 tháng 10, 2025</p>
            <p className="mt-1 text-[0.88rem] font-semibold text-[#1F2937]">Bắt đầu khóa học Phân tích dữ liệu với Python</p>
            <p className="mt-1 text-[0.76rem] text-[#64748B]">Hoàn thành 3/12 học phần</p>
          </div>
        </div>
      </div>
    </article>
  )
}

function StatCard({
  title,
  value,
  hint,
  progress,
  icon,
  iconWrapperClassName,
  accentClassName,
  chip,
}: {
  title: string
  value: ReactNode
  hint: string
  progress?: number
  icon?: ReactNode
  iconWrapperClassName?: string
  accentClassName?: string
  chip?: string
}) {
  return (
    <article
      className={`relative min-h-[178px] overflow-hidden rounded-[28px] border border-[#D8E1EE] bg-white p-5 shadow-[0_12px_28px_rgba(15,35,70,0.06)] ${
        accentClassName ?? ''
      }`}
    >
      <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-transparent via-white/70 to-transparent" aria-hidden />
      <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-[#EAF1FF] blur-2xl" aria-hidden />

      <div className="relative flex h-full flex-col">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.08em] text-[#6B7A90]">{title}</p>
            {chip ? (
              <span className="inline-flex rounded-full bg-[#EEF4FF] px-2.5 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.08em] text-[#2858C6]">
                {chip}
              </span>
            ) : null}
          </div>

          <span
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl shadow-[0_10px_20px_rgba(15,35,70,0.08)] ${
              iconWrapperClassName ?? 'bg-[#F4F7FB] text-[#1D4ED8]'
            }`}
          >
            {icon ?? (
              <svg className="h-4.5 w-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 19h16" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 19v-5" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.5 19v-8" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 19v-12" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 19v-7" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 19v-13" />
              </svg>
            )}
          </span>
        </div>

        <div className="mt-8 flex flex-1 flex-col">
          <p className="text-[2.8rem] font-black leading-none tracking-[-0.07em] text-[#0F172A]">{value}</p>
          {typeof progress === 'number' ? (
            <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-[#EEF3FA]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#20C991] to-[#25B4A7]"
                style={{ width: `${progress}%` }}
              />
            </div>
          ) : null}
          <p className="mt-auto pt-3 text-[0.75rem] font-medium text-[#16A34A]">{hint}</p>
        </div>
      </div>
    </article>
  )
}

export default function StudentDashboardPage() {
  const assessmentData = useMemo(() => {
    const raw = sessionStorage.getItem('curatorAssessmentResult')
    if (!raw) return null

    try {
      return JSON.parse(raw) as {
        learnerName?: string
        competencyDescription: string
        competencyId: string
        analyzedAt: string
        mlResult: LevelPredictionResult
        geminiResult: GeminiLevelReviewOutput
      }
    } catch {
      return null
    }
  }, [])

  const finalLevel = assessmentData?.geminiResult.finalLevel ?? 4
  const learnerName = assessmentData?.learnerName?.trim() || 'Trung'
  const overallScore = assessmentData?.geminiResult.overallScore ?? Math.round((finalLevel / 8) * 100)
  const radarScores = assessmentData?.geminiResult.radarScores ?? {
    dataAndInformation: overallScore,
    communicationAndCollaboration: overallScore,
    digitalContentCreation: overallScore,
    safety: overallScore,
    problemSolving: overallScore,
    aiApplication: overallScore,
  }

  const riskLevel: 'low' | 'medium' | 'high' = finalLevel <= 3 ? 'high' : finalLevel <= 5 ? 'medium' : 'low'
  const riskProbability = riskLevel === 'high' ? 0.82 : riskLevel === 'medium' ? 0.48 : 0.19

  const advisor = {
    summary:
      assessmentData?.geminiResult.analysis ??
      'Chưa có dữ liệu AI từ trang Assessment. Vui lòng hoàn thành bước đánh giá để đồng bộ gợi ý.',
    earlyWarning:
      assessmentData?.geminiResult.earlyRiskWarning ??
      'Chưa có cảnh báo sớm. Hãy cập nhật hồ sơ và hoàn tất đánh giá năng lực số.',
    recommendedActions: assessmentData?.geminiResult.personalizedAdvice ?? [
      'Hoàn tất bước đánh giá năng lực số để nhận lộ trình cá nhân hóa.',
      'Bổ sung minh chứng học tập hoặc dự án gần nhất để tăng độ chính xác AI.',
    ],
  }

  const interactionScore = Math.max(0, Math.min(100, Math.round((assessmentData?.geminiResult.confidenceScore ?? 0.82) * 100)))

  const riskStatusLabel = riskLevel === 'high' ? 'Nguy cơ cao' : riskLevel === 'medium' ? 'Cần theo dõi' : 'An toàn'
  const riskHint =
    assessmentData?.geminiResult.earlyRiskWarning ??
    (riskLevel === 'high'
      ? 'Cần kích hoạt cảnh báo sớm trong 72 giờ'
      : riskLevel === 'medium'
        ? 'Có dấu hiệu rủi ro học tập, cần theo dõi'
        : 'Xác suất rủi ro học tập cực thấp')
  const riskChip = riskLevel === 'high' ? 'Mức cao' : riskLevel === 'medium' ? 'Mức trung bình' : 'Đang an toàn'

  return (
    <div className="min-h-screen bg-[#ECEFF4]">
      <div className="w-full overflow-hidden bg-[#F5F8FC]">
        <header className="bg-white px-4 py-3">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1E4BA5] text-white text-[0.8rem]">■</span>
              <p className="text-[0.98rem] font-bold text-[#1E3A8A]">EdTech Enthusiasts</p>
            </div>

            <div className="flex items-center gap-3">
              <label className="relative w-[280px]">
                <svg
                  className="pointer-events-none absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-[#64748B]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.3-4.3M11 18a7 7 0 100-14 7 7 0 000 14z" />
                </svg>
                <input
                  type="text"
                  placeholder="Tìm kiếm nội dung..."
                  className="h-10 w-full rounded-full border-0 bg-[#EFF3F9] pl-10 pr-4 text-[0.82rem] text-[#334155] outline-none ring-2 ring-transparent transition-shadow placeholder:text-[#7A8799] focus:ring-[#93B2E6]/55"
                />
              </label>

              <span className="h-8 w-px bg-[#D9E2EF]" aria-hidden />

              <button className="relative rounded-lg p-1.5 text-[#475569] hover:bg-[#EFF3F9]" aria-label="Thông báo">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14.857 17.082A23.848 23.848 0 0112 17.25c-.969 0-1.924-.058-2.857-.168M7.5 8.625a4.5 4.5 0 119 0c0 1.078.121 2.132.35 3.145.224.994.738 1.9 1.5 2.614l.402.377A1.125 1.125 0 0118 16.5H6a1.125 1.125 0 01-.752-1.989l.402-.377c.762-.714 1.276-1.62 1.5-2.614.229-1.013.35-2.067.35-3.145z"
                  />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 18.75a2.25 2.25 0 004.5 0" />
                </svg>
                <span className="absolute right-1 top-1 h-2.5 w-2.5 rounded-full bg-[#EF4444]" aria-hidden />
              </button>

              <div className="flex items-center gap-2.5">
                <div className="text-right leading-tight">
                  <p className="text-[0.84rem] font-semibold text-[#0F172A]">{learnerName}</p>
                  <p className="mt-1 text-[0.7rem] text-[#64748B]">Thành viên</p>
                </div>
                <span className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-[#D9E2EF] bg-[#0F3F95] shadow-[0_4px_10px_rgba(15,63,149,0.2)]">
                  <svg className="h-7 w-7" viewBox="0 0 48 48" aria-hidden>
                    <circle cx="24" cy="24" r="24" fill="#0F3F95" />
                    <circle cx="24" cy="18" r="8" fill="#F5F8FC" />
                    <path d="M10 40c2-7 8-11 14-11s12 4 14 11" fill="#F5F8FC" />
                  </svg>
                </span>
              </div>
            </div>
          </div>
        </header>

        <div className="flex h-[calc(100vh-56px)] overflow-hidden">
          <aside className="h-full w-[214px] shrink-0 bg-[#EEF2F8] px-4 py-5">
            <div className="flex h-full flex-col">
              <div>
                <p className="text-[0.62rem] font-semibold uppercase tracking-[0.08em] text-[#94A3B8]">Menu chính</p>
                <div className="mt-2.5 space-y-1 text-[0.78rem]">
                  <button className="flex w-full items-center gap-2 rounded-lg bg-[#E4EBF7] px-3 py-2 text-left font-semibold text-[#1E4BA5]">
                    <span className="flex h-4.5 w-4.5 items-center justify-center">
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4h16v16H4z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 9h16M9 4v16M15 4v16" />
                      </svg>
                    </span>
                    <span>Bảng điều khiển</span>
                  </button>
                  <button className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-[#64748B]">
                    <span className="flex h-4.5 w-4.5 items-center justify-center">
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h4v4H4zM10 6h10M4 12h4v4H4zM10 12h10M4 18h4v2H4zM10 18h10" />
                      </svg>
                    </span>
                    <span>Phân tích sâu</span>
                  </button>
                  <button className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-[#64748B]">
                    <span className="flex h-4.5 w-4.5 items-center justify-center">
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3l8 14H4l8-14z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v3" />
                        <circle cx="12" cy="16.5" r="1" fill="currentColor" stroke="none" />
                      </svg>
                    </span>
                    <span>Cảnh báo sớm</span>
                  </button>
                  <button className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-[#64748B]">
                    <span className="flex h-4.5 w-4.5 items-center justify-center">
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 5.5A2.5 2.5 0 017 3h3a2 2 0 012 2v15H7a2.5 2.5 0 01-2.5-2.5z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 5.5A2.5 2.5 0 0017 3h-3a2 2 0 00-2 2v15h5.5a2.5 2.5 0 002.5-2.5z" />
                      </svg>
                    </span>
                    <span>Lộ trình học tập</span>
                  </button>
                </div>

                <p className="mt-7 text-[0.62rem] font-semibold uppercase tracking-[0.08em] text-[#94A3B8]">Công cụ</p>
                <div className="mt-2.5 space-y-1 text-[0.78rem] text-[#64748B]">
                  <button className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left">
                    <span className="flex h-4.5 w-4.5 items-center justify-center">
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 12h16M4 17h16" />
                        <circle cx="9" cy="7" r="1" fill="currentColor" stroke="none" />
                        <circle cx="15" cy="12" r="1" fill="currentColor" stroke="none" />
                        <circle cx="11" cy="17" r="1" fill="currentColor" stroke="none" />
                      </svg>
                    </span>
                    <span>Cài đặt</span>
                  </button>
                  <button className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left">
                    <span className="flex h-4.5 w-4.5 items-center justify-center">
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3a9 9 0 109 9" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 17h.01M12 13.5c0-1.5 2-2 2-3.5a2 2 0 10-4 0" />
                      </svg>
                    </span>
                    <span>Trung tâm trợ giúp</span>
                  </button>
                </div>
              </div>

              <div className="mt-auto rounded-xl bg-white p-3">
                <p className="text-[0.72rem] font-semibold text-[#1E4BA5]">Gói Enterprise</p>
                <p className="mt-1 text-[0.66rem] text-[#64748B]">Hết hạn sau 45 ngày</p>
                <button className="mt-3 w-full rounded-lg bg-[#EFF3F9] py-2 text-[0.72rem] font-semibold text-[#1E4BA5]">Gia hạn ngay</button>
              </div>
            </div>
          </aside>

          <main className="h-full flex-1 overflow-y-auto bg-[#F3F6FB] px-4 py-4">
            <div className="mb-4">
              <div>
                <h1 className="text-[1.75rem] font-black tracking-[-0.02em] text-[#1F2937]">Chào mừng trở lại, {learnerName}! 👋</h1>
                <p className="mt-1 text-[0.82rem] text-[#64748B]">Bạn đã hoàn thành 85% mục tiêu tuần. <span className="font-semibold text-[#16A34A]">Đang dẫn đầu lớp!</span></p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <StatCard
                title="Điểm tổng kết"
                value={`${overallScore}/100`}
                hint={`AI đánh giá năng lực bậc ${finalLevel}`}
                chip="Cập nhật mới"
                accentClassName="bg-gradient-to-br from-white to-[#F8FBFF]"
                iconWrapperClassName="bg-[#EEF4FF] text-[#2C63F1]"
              />
              <StatCard
                title="Trạng thái rủi ro"
                value={
                  <span>
                    <span className={`mr-1 ${riskLevel === 'high' ? 'text-[#DC2626]' : riskLevel === 'medium' ? 'text-[#D97706]' : 'text-[#16A34A]'}`}>•</span>
                    {riskStatusLabel}
                  </span>
                }
                iconWrapperClassName="bg-[#E7F6F1] text-[#0E9B6C]"
                accentClassName="bg-gradient-to-br from-white to-[#F7FFFC]"
                icon={
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.1} aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3l7 3v5c0 4.2-2.9 7.9-7 9-4.1-1.1-7-4.8-7-9V6l7-3z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
                  </svg>
                }
                progress={Math.round(riskProbability * 100)}
                hint={riskHint}
                chip={riskChip}
              />
              <StatCard
                title="Mức độ tương tác"
                value={`${interactionScore}%`}
                hint="Độ tin cậy của đánh giá AI"
                iconWrapperClassName="bg-[#ECEFF4] text-[#2A73E8]"
                accentClassName="bg-gradient-to-br from-white to-[#F7F9FF]"
                chip="Tăng trưởng"
                icon={
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 2L5 14h6l-1 8 9-13h-6l0-7z" />
                  </svg>
                }
              />
            </div>

            <div className="mt-4 grid grid-cols-[2.35fr_0.65fr] gap-3">
              <div className="space-y-3">
                <RadarCard scores={radarScores} />
                <HistoryCard />
              </div>

              <div className="space-y-3">
                <article className="flex min-h-[490px] flex-col rounded-[24px] bg-[#123F97] px-3 py-3 text-white shadow-[0_12px_30px_rgba(18,64,154,0.24)]">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/18 bg-white/10 text-white shadow-[0_4px_10px_rgba(255,255,255,0.12)]">
                        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.9} aria-hidden>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 18h6" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8 8h8" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M7 11V8a5 5 0 0110 0v3" />
                          <rect x="6" y="9" width="12" height="8" rx="3" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M10 13h.01M14 13h.01" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-[0.9rem] font-semibold leading-none">Trợ lý Cố vấn AI</p>
                        <div className="mt-1 flex items-center gap-1.5 text-[0.6rem] font-bold uppercase tracking-[0.13em] text-white/88">
                          <span className="h-2 w-2 rounded-full bg-[#3BD98F]" aria-hidden />
                          <span>Sẵn sàng</span>
                        </div>
                      </div>
                    </div>

                    <button className="-mr-1 mt-1 text-white/60 hover:text-white" aria-label="Tùy chọn">
                      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                        <circle cx="12" cy="5" r="1.6" />
                        <circle cx="12" cy="12" r="1.6" />
                        <circle cx="12" cy="19" r="1.6" />
                      </svg>
                    </button>
                  </div>

                  <div className="mt-4 rounded-[18px] border border-white/12 bg-white/8 px-3 py-3 text-[0.76rem] leading-[1.6] text-white/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
                    <p>
                      {advisor?.summary ?? 'Đang tổng hợp phân tích cá nhân hóa theo dữ liệu mới nhất...'}
                    </p>
                    <p className="mt-4">
                      Cảnh báo sớm: <span className="font-semibold text-white">{advisor?.earlyWarning ?? 'Đang đánh giá mức độ can thiệp phù hợp.'}</span>
                    </p>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-1.5 text-[0.65rem] font-semibold">
                    <button className="rounded-lg bg-white/10 px-2.5 py-1.5 text-white/95">
                      {advisor?.recommendedActions[0] ?? 'Đang tạo gợi ý số 1...'}
                    </button>
                    <button className="rounded-lg bg-white/10 px-2.5 py-1.5 text-white/95">
                      {advisor?.recommendedActions[1] ?? 'Đang tạo gợi ý số 2...'}
                    </button>
                  </div>

                  <div className="mt-auto pt-10">
                    <div className="flex items-center gap-2 rounded-[16px] border border-white/10 bg-[#0F3D93] px-3 py-2 text-white/40 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
                      <span className="flex-1 text-[0.68rem]">Hỏi bất cứ điều gì bạn muốn</span>
                      <svg className="h-4 w-4 text-white/80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.1} aria-hidden>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 12h13" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 6l7 6-7 6" />
                      </svg>
                    </div>
                  </div>
                </article>

                <article className="rounded-[28px] bg-gradient-to-br from-[#0E3A8A] to-[#1E4BA5] p-4 text-white shadow-[0_8px_24px_rgba(18,64,154,0.22)]">
                  <p className="text-[0.64rem] font-semibold uppercase tracking-[0.07em] text-blue-100">Sự kiện sắp tới</p>
                  <h3 className="mt-2 text-[1.08rem] font-semibold leading-[1.25]">Hackathon 2024: Future of AI</h3>
                  <p className="mt-1.5 text-[0.74rem] text-blue-100">Giải thưởng $10,000 & Cơ hội thực tập</p>
                  <button className="mt-3 rounded-lg bg-white px-3 py-2 text-[0.72rem] font-semibold text-[#12409A]">Đăng ký ngay</button>
                </article>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
