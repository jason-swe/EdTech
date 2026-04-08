import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'

import { reviewLevelWithGemini, type GeminiLevelReviewOutput, type GeminiRoadmapStep } from '../../services/geminiService'
import type { LevelPredictionResult } from '../../services/mlService'

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
    active: false,
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
    active: true,
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 6.75v10.5m0-10.5c-1.6-1.1-3.684-1.653-5.778-1.533A30.01 30.01 0 003 5.75v11.5a27.5 27.5 0 013.222-.533c2.094-.12 4.178.433 5.778 1.533m0-11.5c1.6-1.1 3.684-1.653 5.778-1.533 1.092.063 2.168.24 3.222.533v11.5a27.5 27.5 0 00-3.222-.533c-2.094-.12-4.178.433-5.778 1.533"
      />
    ),
  },
] as const

function StageBadge({
  label,
  tone,
}: {
  label: string
  tone: 'done' | 'progress' | 'pending'
}) {
  const cls =
    tone === 'done'
      ? 'bg-emerald-100 text-emerald-700'
      : tone === 'progress'
      ? 'bg-blue-100 text-blue-700'
      : 'bg-gray-100 text-gray-500'

  return (
    <span className={`rounded-full px-2 py-1 text-[0.62rem] font-bold uppercase tracking-[0.08em] ${cls}`}>
      {label}
    </span>
  )
}

function TaskCard({
  icon,
  title,
  subtitle,
  right,
  disabled,
  highlight,
}: {
  icon: ReactNode
  title: string
  subtitle: string
  right?: string
  disabled?: boolean
  highlight?: boolean
}) {
  return (
    <div
      className={`rounded-xl border px-4 py-3 ${
        disabled
          ? 'border-[#E8ECF2] bg-[#F8FAFD] text-[#A0A9B8]'
          : highlight
          ? 'border-[#B8D1FF] bg-[#F8FBFF] text-[#334155]'
          : 'border-[#DBE3EE] bg-white text-[#334155]'
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span
            className={`flex h-10 w-10 items-center justify-center rounded-lg ${
              disabled ? 'bg-[#F1F4F8] text-[#B6BFCC]' : 'bg-[#F1F4F8] text-[#3B5A92]'
            }`}
          >
            {icon}
          </span>
          <p className="text-[0.92rem] font-semibold">{title}</p>
        </div>
        {right ? <span className="text-[0.72rem] font-semibold text-[#2563EB]">{right}</span> : null}
      </div>
      <p className="mt-1 pl-[52px] text-[0.78rem] text-[#7A879A]">{subtitle}</p>
    </div>
  )
}

function StageSection({
  dot,
  dotTone,
  title,
  sub,
  badge,
  children,
  muted,
  showLine,
}: {
  dot: ReactNode
  dotTone: 'done' | 'progress' | 'pending'
  title: string
  sub: string
  badge: ReactNode
  children: ReactNode
  muted?: boolean
  showLine?: boolean
}) {
  const dotClass =
    dotTone === 'done'
      ? 'border-[#1D4ED8] bg-[#1D4ED8] text-white'
      : dotTone === 'progress'
      ? 'border-[#2563EB] bg-[#EFF6FF] text-[#2563EB]'
      : 'border-[#D9E2EF] bg-[#F4F6FA] text-[#9AA8BD]'

  return (
    <section className={`relative pl-10 ${muted ? 'opacity-70' : ''}`}>
      {showLine !== false ? (
        <span className="absolute left-[13px] top-8 bottom-0 w-px bg-[#DDE4EF]" aria-hidden />
      ) : null}
      <span className={`absolute left-0 top-1 flex h-7 w-7 items-center justify-center rounded-full border ${dotClass}`}>
        {dot}
      </span>
      <div className="mb-3 flex items-center gap-2">
        {badge}
      </div>
      <h3 className="text-[2rem] font-semibold leading-[1.2] text-[#1F2937]">{title}</h3>
      <p className="mt-1 text-[0.95rem] text-[#64748B]">{sub}</p>
      <div className="mt-4 space-y-3">{children}</div>
    </section>
  )
}

export default function CuratorLearningPathPage() {
  const [syncStatus, setSyncStatus] = useState<string | null>(null)
  const [hasSynced, setHasSynced] = useState(false)

  const [assessmentData, setAssessmentData] = useState<{
    learnerName?: string
    competencyDescription: string
    competencyId: string
    analyzedAt: string
    mlResult: LevelPredictionResult
    geminiResult: GeminiLevelReviewOutput
  } | null>(() => {
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
  })

  useEffect(() => {
    let cancelled = false

    async function syncAiResult() {
      if (!assessmentData || hasSynced) {
        return
      }

      setHasSynced(true)

      setSyncStatus('Dang thu dong bo phan tich AI...')

      const refreshed = await reviewLevelWithGemini({
        learnerName: assessmentData.learnerName ?? 'Nguoi hoc',
        userInput: assessmentData.competencyDescription,
        mlResult: assessmentData.mlResult,
        competencyId: assessmentData.competencyId,
      })

      if (cancelled) return

      if (refreshed.source === 'live') {
        const nextData = {
          ...assessmentData,
          geminiResult: refreshed,
          analyzedAt: new Date().toISOString(),
        }

        sessionStorage.setItem('curatorAssessmentResult', JSON.stringify(nextData))
        setAssessmentData(nextData)
        setSyncStatus('Da dong bo thanh cong ket qua AI tu Gemini.')
      } else {
        setSyncStatus(refreshed.reason ? `AI chua san sang: ${refreshed.reason}` : 'AI chua san sang de phan tich.')
      }
    }

    void syncAiResult()

    return () => {
      cancelled = true
    }
  }, [assessmentData, hasSynced])

  const finalLevel = assessmentData?.geminiResult.finalLevel ?? 4
  const confidence = assessmentData?.geminiResult.confidenceScore ?? 0
  const isAiFallback = assessmentData?.geminiResult.source === 'fallback'
  const aiAnalysis = isAiFallback ? undefined : assessmentData?.geminiResult.analysis
  const aiWarning = isAiFallback ? undefined : assessmentData?.geminiResult.earlyRiskWarning
  const advice = assessmentData?.geminiResult.personalizedAdvice ?? []
  const analysis = aiAnalysis
  const warning = aiWarning
  const roadmap = assessmentData?.geminiResult.roadmap ?? []

  const roadmapSteps = useMemo(
    () =>
      [...roadmap]
        .filter((item): item is GeminiRoadmapStep => typeof item?.step === 'number')
        .sort((a, b) => (a.step ?? 0) - (b.step ?? 0)),
    [roadmap],
  )

  const stageOneStep = roadmapSteps[0]
  const stageTwoStep = roadmapSteps[1] ?? roadmapSteps[0]
  const stageThreeStep = roadmapSteps[2] ?? roadmapSteps[1]
  const stage2Tone: 'done' | 'progress' | 'pending' = finalLevel >= 6 ? 'done' : finalLevel >= 4 ? 'progress' : 'pending'
  const stage2Badge =
    stageTwoStep?.target_level && finalLevel >= stageTwoStep.target_level
      ? 'Giai đoạn 2 • Hoàn thành 100%'
      : finalLevel >= 4
      ? 'Giai đoạn 2 • Đang tiến hành'
      : 'Giai đoạn 2 • Ưu tiên bắt đầu'
  const stage1Title = stageOneStep?.target_level
    ? 'Giai đoạn 1'
    : finalLevel >= 6
    ? 'Nền tảng năng lực số nâng cao'
    : finalLevel >= 4
    ? 'Nền tảng năng lực số tiêu chuẩn'
    : 'Nền tảng năng lực số cần củng cố'
  const stage1Sub =
    stageOneStep?.action_items?.[0] ??
    warning ??
    'Bắt đầu với các hành động nền tảng theo đề xuất AI.'
  const stage3Title = stageThreeStep?.target_level
    ? 'Giai đoạn 3'
    : finalLevel >= 6
    ? 'Sáng tạo & Lan tỏa Tri thức ở cấp độ cao'
    : 'Sáng tạo & Lan tỏa Tri thức theo nhịp cá nhân'
  const stage3Sub =
    stageThreeStep?.action_items?.[0] ??
    advice[2] ??
    'Tiếp tục lộ trình theo nhịp cá nhân hóa từ AI.'
  const stage3TaskLeft =
    stageThreeStep?.action_items?.[1] ?? advice[0] ?? 'Tiếp tục nhiệm vụ AI đề xuất'
  const stage3TaskRight =
    stageThreeStep?.action_items?.[2] ?? advice[1] ?? 'Hoàn tất mục tiêu bước kế tiếp'

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
                  <svg
                    className="h-[0.95rem] w-[0.95rem] shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.9}
                  >
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
              <span className="inline-flex rounded-md bg-[#E6EEFF] px-2.5 py-1.5 text-[0.72rem] font-bold uppercase tracking-[0.07em] text-[#2454AA]">
                Cá nhân hóa bởi AI
              </span>
              <h1 className="mt-3 text-[3.2rem] font-black tracking-[-0.03em] text-[#1A2638] sm:text-[3.6rem]">
                Lộ trình Phát triển Năng lực Số
              </h1>
              <p className="mt-4 max-w-[760px] text-[0.95rem] leading-[1.7] text-[#64748B]">
                {analysis ?? 'Dựa trên kết quả đánh giá, ScholarMetric đề xuất lộ trình chi tiết giúp bạn làm chủ môi trường nghiên cứu số hiện đại.'}
              </p>
              <p className="mt-2 text-[0.78rem] text-[#94A0B2]">
                Bậc AI xác nhận: {finalLevel} • Độ tin cậy: {(confidence * 100).toFixed(1)}%
              </p>
            </section>

            <section className="space-y-8">
              <StageSection
                dot={
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3l7 4v5c0 4-2.8 7.5-7 8.7C7.8 19.5 5 16 5 12V7l7-4z" />
                  </svg>
                }
                dotTone="done"
                badge={
                  <StageBadge
                    label={
                      stageOneStep?.target_level && finalLevel >= stageOneStep.target_level
                        ? 'Giai đoạn 1 • Hoàn thành 100%'
                        : 'Giai đoạn 1 • Đang thực hiện'
                    }
                    tone={stageOneStep?.target_level && finalLevel >= stageOneStep.target_level ? 'done' : 'progress'}
                  />
                }
                title={stage1Title}
                sub={stage1Sub}
              >
                <div className="grid gap-3 sm:grid-cols-2">
                  <TaskCard
                    icon={
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a3 3 0 10-6 0v2m9 0H6a1 1 0 00-1 1v7a1 1 0 001 1h12a1 1 0 001-1v-7a1 1 0 00-1-1z" />
                      </svg>
                    }
                    title={stageOneStep?.action_items?.[0] ?? 'Nhiệm vụ 1 theo đề xuất AI'}
                    subtitle={
                      stageOneStep?.focus_keywords?.length
                        ? `Từ khóa trọng tâm: ${stageOneStep.focus_keywords.slice(0, 3).join(', ')}`
                        : 'Ưu tiên hoàn thành trước khi chuyển bước'
                    }
                    right={stageOneStep?.target_level && finalLevel >= stageOneStep.target_level ? '✓' : '0%'}
                    highlight
                  />
                  <TaskCard
                    icon={
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3a5 5 0 015 5c0 2-1.2 3.8-3 4.5v2.2m-4 0v-2.2A5 5 0 017 8a5 5 0 015-5z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 18h4m-5 3h6" />
                      </svg>
                    }
                    title={stageOneStep?.action_items?.[1] ?? stageOneStep?.action_items?.[0] ?? 'Nhiệm vụ 2 theo đề xuất AI'}
                    subtitle={
                      stageOneStep?.focus_keywords?.length
                        ? `Bổ sung theo keywords: ${stageOneStep.focus_keywords.slice(0, 2).join(', ')}`
                        : 'Theo dõi tiến độ bằng minh chứng thực hành'
                    }
                    right={stageOneStep?.target_level && finalLevel >= stageOneStep.target_level ? '✓' : '0%'}
                    highlight
                  />
                </div>
              </StageSection>

              <StageSection
                dot={
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 3a8 8 0 106.32 12.9l3.39 3.4" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 7v4l2.5 2.5" />
                  </svg>
                }
                dotTone={stage2Tone}
                badge={<StageBadge label={stage2Badge} tone={stage2Tone} />}
                title={
                  stageTwoStep?.target_level
                    ? 'Giai đoạn 2 • Khai thác & Xử lý Dữ liệu'
                    : advice[0]
                    ? `Giai đoạn 2 • Khai thác & Xử lý Dữ liệu: ${advice[0]}`
                    : 'Giai đoạn 2 • Khai thác & Xử lý Dữ liệu'
                }
                sub={
                  stageTwoStep?.action_items?.[0] ??
                  advice[0] ??
                  'Kỹ năng truy xuất, đánh giá và quản trị nguồn học liệu số khổng lồ.'
                }
              >
                <div className="grid gap-3 sm:grid-cols-2">
                  <TaskCard
                    icon={
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                        <ellipse cx="12" cy="6" rx="6" ry="2.5" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 6v6c0 1.4 2.7 2.5 6 2.5s6-1.1 6-2.5V6" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 12v6c0 1.4 2.7 2.5 6 2.5s6-1.1 6-2.5v-6" />
                      </svg>
                    }
                    title={stageTwoStep?.action_items?.[0] ? `Module 1: ${stageTwoStep.action_items[0]}` : 'Module 1: Theo đề xuất AI'}
                    subtitle={
                      stageTwoStep?.focus_keywords?.length
                        ? `Từ khóa trọng tâm: ${stageTwoStep.focus_keywords.slice(0, 3).join(', ')}`
                        : advice[1] ?? 'Ước tính: 4 giờ học theo nhịp AI đề xuất'
                    }
                    right={stageTwoStep?.target_level && finalLevel >= stageTwoStep.target_level ? '100%' : finalLevel >= 4 ? '50%' : '0%'}
                    highlight={stage2Tone !== 'pending'}
                  />
                  <TaskCard
                    icon={
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7 16V8m5 8V5m5 11v-6" />
                      </svg>
                    }
                    title={
                      stageTwoStep?.action_items?.[1]
                        ? `Module 2: ${stageTwoStep.action_items[1]}`
                        : advice[2]
                        ? `Module 2: ${advice[2]}`
                        : 'Module 2: Theo đề xuất AI'
                    }
                    subtitle={
                      stageTwoStep?.focus_keywords?.length
                        ? `Bổ sung theo keywords: ${stageTwoStep.focus_keywords.slice(0, 2).join(', ')}`
                        : 'Ước tính: 12 giờ học theo phân tích AI'
                    }
                    disabled={stage2Tone === 'pending'}
                  />
                </div>
                <div className="rounded-xl border border-[#DCE4EF] bg-[#F9FBFE] p-4">
                  <p className="flex items-center gap-2 text-[0.65rem] font-bold uppercase tracking-[0.08em] text-[#5374AE]">
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3l2.3 4.67L19.5 8.4l-3.75 3.65.89 5.15L12 14.78l-4.64 2.42.89-5.15L4.5 8.4l5.2-.73L12 3z" />
                    </svg>
                    Dự án đề xuất
                  </p>
                  <h4 className="mt-1 text-[0.95rem] font-semibold text-[#1F2937]">
                    {stageTwoStep?.action_items?.[2]
                      ? `Dự án bước ${stageTwoStep.step}: ${stageTwoStep.action_items[2]}`
                      : analysis ?? 'Dự án theo gợi ý AI'}
                  </h4>
                  <p className="mt-1 text-[0.82rem] leading-[1.6] text-[#6B7280]">
                    {stageTwoStep?.focus_keywords?.length
                      ? `Tập trung triển khai với các từ khóa: ${stageTwoStep.focus_keywords.join(', ')}.`
                      : advice[2] ?? 'Triển khai dự án dựa trên roadmap AI cá nhân hóa.'}
                  </p>
                  <p className="mt-2 text-[0.7rem] text-[#9AA5B5]">+12 ngày làm việc</p>
                </div>
              </StageSection>

              <StageSection
                dot={
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6l1.8 3.6L18 12l-4.2 2.4L12 18l-1.8-3.6L6 12l4.2-2.4L12 6z" />
                  </svg>
                }
                dotTone="pending"
                badge={<StageBadge label="Giai đoạn 3 • Chưa bắt đầu" tone="pending" />}
                title={stage3Title}
                sub={stage3Sub}
                muted
                showLine={false}
              >
                <div className="grid gap-3 sm:grid-cols-2">
                  <TaskCard
                    icon={
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 8h8M8 12h8M8 16h5" />
                      </svg>
                    }
                    title={stage3TaskLeft}
                    subtitle="Module 3 theo đề xuất AI"
                    disabled
                  />
                  <TaskCard
                    icon={
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h8M8 14h8M4 7h16v10H4z" />
                      </svg>
                    }
                    title={stage3TaskRight}
                    subtitle="Module 4 theo đề xuất AI"
                    disabled
                  />
                </div>
              </StageSection>
            </section>

            <section className="space-y-4 rounded-2xl border border-[#DCE4EF] bg-white px-5 py-5 text-center sm:px-6 sm:py-6">
              <p className="text-[0.78rem] text-[#94A0B2]">
                {warning ?? 'Hệ thống sẽ tự động mở khóa các giai đoạn tiếp theo khi bạn hoàn thành các thử thách.'}
              </p>
              <Link
                to="/student-dashboard"
                className="inline-flex items-center gap-2 rounded-xl bg-[#0F172A] px-7 py-3 text-sm font-semibold text-white shadow-[0_8px_18px_rgba(15,23,42,0.24)] transition-colors hover:bg-[#111827]"
              >
                Lưu lộ trình & Tiếp tục
                <span>→</span>
              </Link>
              <p className="text-[0.72rem] text-[#B0B8C6]">Mục tiêu của bạn có thể được tinh chỉnh bất cứ lúc nào.</p>
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
