import { useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'

import { reviewLevelWithGemini } from '../../services/geminiService'
import { predictCompetencyLevel } from '../../services/mlService'
import { validateAssessmentFormInput } from '../../services/ruleEngine'

type Project = {
  id: number
  name: string
  role: string
  technologies: string
  summary: string
}

type Certificate = {
  id: number
  category: string
  name: string
  fileName: string
}

const sideItems = [
  {
    label: 'Thông tin cá nhân',
    active: true,
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

function IconBox({ children }: { children: ReactNode }) {
  return (
    <span className="flex h-7 w-7 items-center justify-center rounded-md bg-[#EAF0FA] text-[#1D4AA4]">
      {children}
    </span>
  )
}

function SectionHeader({ title, icon }: { title: string; icon: ReactNode }) {
  return (
    <div className="mb-5 flex items-center gap-2.5">
      <IconBox>{icon}</IconBox>
      <h2 className="text-xl font-semibold tracking-[-0.01em] text-[#0F172A]">{title}</h2>
    </div>
  )
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string
  value: string
  onChange: (nextValue: string) => void
  placeholder?: string
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[0.73rem] font-semibold uppercase tracking-[0.05em] text-[#64748B]">
        {label}
      </span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-11 w-full rounded-xl border-0 bg-[#EEF2F7] px-3.5 text-[0.95rem] text-[#1F2937] outline-none ring-2 ring-transparent transition-shadow placeholder:text-[#9CA3AF] focus:ring-[#8AA8DF]/45"
      />
    </label>
  )
}

function Tag({ text }: { text: string }) {
  return (
    <span className="rounded-md bg-[#E9F1FF] px-2 py-1 text-[0.65rem] font-bold text-[#2455AA]">
      {text}
    </span>
  )
}

export default function CuratorProfilePage() {
  const navigate = useNavigate()
  const [basicInfo, setBasicInfo] = useState({
    fullName: 'Trần Hoàng Nam',
    studentId: 'B20DCCN123',
    cohort: 'Công nghệ thông tin 1',
    school: 'Học viện Công nghệ Bưu chính Viễn thông',
    major: 'Kỹ thuật phần mềm',
    gpa: '3.67 / 4.0',
    graduationYear: '2027',
  })

  const [projects, setProjects] = useState<Project[]>([
    {
      id: 1,
      name: 'Hệ thống quản lý học tập thông minh (SmartLMS)',
      role: 'Fullstack Developer & Team Leader',
      technologies: 'REACTJS, NODEJS, MONGODB',
      summary:
        'Ứng dụng hỗ trợ sinh viên theo dõi tiến độ học tập và đề xuất tài liệu dựa trên AI. Đạt giải Nhất cuộc thi Sáng tạo trẻ cấp Trường.',
    },
  ])

  const [certificates, setCertificates] = useState<Certificate[]>([
    {
      id: 1,
      category: 'Ngoại ngữ (Language)',
      name: 'IELTS Academic 8.0 (IDP)',
      fileName: 'IELTS_Academic_8.0.pdf',
    },
  ])

  const updateProject = (id: number, key: keyof Omit<Project, 'id'>, value: string) => {
    setProjects((prev) => prev.map((item) => (item.id === id ? { ...item, [key]: value } : item)))
  }

  const updateCertificate = (id: number, key: keyof Omit<Certificate, 'id'>, value: string) => {
    setCertificates((prev) => prev.map((item) => (item.id === id ? { ...item, [key]: value } : item)))
  }

  const [analysisLoading, setAnalysisLoading] = useState(false)
  const [analysisError, setAnalysisError] = useState<string | null>(null)

  function buildCompetencyDescription(): string {
    const projectDescription = projects
      .map((project) => [project.name, project.role, project.summary, project.technologies].filter(Boolean).join('. '))
      .join('. ')
      .trim()

    if (projectDescription) {
      return projectDescription
    }

    const certificateSummary = certificates
      .map((item) => [item.category, item.name].filter(Boolean).join(': '))
      .filter(Boolean)
      .join('; ')

    const fallbackParts = [
      `${basicInfo.fullName || 'Nguoi hoc'} hien chua co du an thuc te de nop ho so nang luc.`,
      `Thong tin hoc tap hien tai: chuyen nganh ${basicInfo.major || 'chua cap nhat'}, GPA ${basicInfo.gpa || 'chua cap nhat'}, khoa ${basicInfo.cohort || 'chua cap nhat'}.`,
      certificateSummary
        ? `Nguoi hoc da co cac chung chi/lien quan: ${certificateSummary}.`
        : 'Nguoi hoc chua bo sung chung chi, nhung san sang tham gia bai danh gia de xac dinh bac nang luc hien tai.',
      'Muc tieu: xac dinh nang luc hien tai va nhan de xuat lo trinh bo sung minh chung thuc hanh trong giai doan tiep theo.',
    ]

    return fallbackParts.join(' ')
  }

  const handleContinueToAssessment = async () => {
    const competencyDescription = buildCompetencyDescription()

    const validation = validateAssessmentFormInput({ competencyDescription })
    if (!validation.isValid) {
      setAnalysisError(validation.errors[0]?.message ?? 'Du lieu danh gia khong hop le.')
      return
    }

    setAnalysisLoading(true)
    setAnalysisError(null)

    try {
      const mlResult = predictCompetencyLevel({
        userDescription: competencyDescription,
        competencyId: '1.1',
      })

      const geminiResult = await reviewLevelWithGemini({
        learnerName: basicInfo.fullName || 'Nguoi hoc',
        userInput: competencyDescription,
        mlResult,
        competencyId: '1.1',
      })

      sessionStorage.setItem(
        'curatorAssessmentResult',
        JSON.stringify({
          learnerName: basicInfo.fullName || 'Nguoi hoc',
          competencyId: '1.1',
          competencyDescription,
          mlResult,
          geminiResult,
          analyzedAt: new Date().toISOString(),
        }),
      )

      navigate('/curator-assessment')
    } catch (error: unknown) {
      setAnalysisError(error instanceof Error ? error.message : 'Khong the hoan tat phan tich luc nay.')
    } finally {
      setAnalysisLoading(false)
    }
  }

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
              <SectionHeader
                title="Thông tin cơ bản & học vấn"
                icon={
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 6.75a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 19.5a7.5 7.5 0 0115 0"
                    />
                  </svg>
                }
              />
              <div className="grid gap-3.5 sm:grid-cols-2">
                <Field
                  label="Họ và tên"
                  value={basicInfo.fullName}
                  onChange={(nextValue) => setBasicInfo((prev) => ({ ...prev, fullName: nextValue }))}
                />
                <Field
                  label="Mã số sinh viên"
                  value={basicInfo.studentId}
                  onChange={(nextValue) => setBasicInfo((prev) => ({ ...prev, studentId: nextValue }))}
                />
                <Field
                  label="Khóa"
                  value={basicInfo.cohort}
                  onChange={(nextValue) => setBasicInfo((prev) => ({ ...prev, cohort: nextValue }))}
                />
                <Field
                  label="Trường"
                  value={basicInfo.school}
                  onChange={(nextValue) => setBasicInfo((prev) => ({ ...prev, school: nextValue }))}
                />
                <Field
                  label="Chuyên ngành"
                  value={basicInfo.major}
                  onChange={(nextValue) => setBasicInfo((prev) => ({ ...prev, major: nextValue }))}
                />
                <Field
                  label="GPA hiện tại"
                  value={basicInfo.gpa}
                  onChange={(nextValue) => setBasicInfo((prev) => ({ ...prev, gpa: nextValue }))}
                />
                <Field
                  label="Năm tốt nghiệp dự kiến"
                  value={basicInfo.graduationYear}
                  onChange={(nextValue) => setBasicInfo((prev) => ({ ...prev, graduationYear: nextValue }))}
                />
              </div>
              <div className="mt-4 flex flex-wrap gap-2.5">
                <button className="rounded-lg bg-[#1649A5] px-4 py-2 text-sm font-semibold text-white">
                  Lưu thông tin
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setBasicInfo({
                      fullName: '',
                      studentId: '',
                      cohort: '',
                      school: '',
                      major: '',
                      gpa: '',
                      graduationYear: '',
                    })
                  }
                  className="rounded-lg border border-[#D5DEEB] bg-white px-4 py-2 text-sm font-semibold text-[#52617A]"
                >
                  Xóa trắng
                </button>
              </div>
            </section>

            <section>
              <SectionHeader
                title="Dự án tiêu biểu"
                icon={
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.9}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a5 5 0 10-7.18 0M12 17v.01" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.17 18.5l-1.43 2.47L9.5 20l1.24 2 1.26-2 2.76.97-1.43-2.47" />
                  </svg>
                }
              />

              <div className="space-y-4.5">
                {projects.map((project) => (
                  <div key={project.id} className="rounded-2xl bg-white p-5 sm:p-6">
                    <div className="space-y-5">
                      <Field
                        label="Tên dự án"
                        value={project.name}
                        onChange={(nextValue) => updateProject(project.id, 'name', nextValue)}
                      />

                      <div className="grid gap-4 sm:grid-cols-2">
                        <Field
                          label="Vai trò"
                          value={project.role}
                          onChange={(nextValue) => updateProject(project.id, 'role', nextValue)}
                        />
                        <label className="block">
                          <span className="mb-1.5 block text-[0.73rem] font-semibold uppercase tracking-[0.05em] text-[#64748B]">
                            Công nghệ sử dụng
                          </span>
                          <input
                            value={project.technologies}
                            onChange={(e) => updateProject(project.id, 'technologies', e.target.value)}
                            className="h-11 w-full rounded-xl border-0 bg-[#EEF2F7] px-3.5 text-[0.95rem] text-[#1F2937] outline-none ring-2 ring-transparent focus:ring-[#8AA8DF]/45"
                          />
                          <div className="mt-2 flex flex-wrap gap-2">
                            {project.technologies
                              .split(',')
                              .map((item) => item.trim())
                              .filter(Boolean)
                              .map((tech) => (
                                <Tag key={tech} text={tech.toUpperCase()} />
                              ))}
                          </div>
                        </label>
                      </div>

                      <label className="block">
                        <span className="mb-1.5 block text-[0.73rem] font-semibold uppercase tracking-[0.05em] text-[#64748B]">
                          Mô tả ngắn gọn sản phẩm
                        </span>
                        <textarea
                          value={project.summary}
                          onChange={(e) => updateProject(project.id, 'summary', e.target.value)}
                          rows={3}
                          className="w-full rounded-xl border-0 bg-[#EEF2F7] px-3.5 py-3 text-sm leading-relaxed text-[#475569] outline-none ring-2 ring-transparent focus:ring-[#8AA8DF]/45"
                        />
                      </label>

                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() => setProjects((prev) => prev.filter((item) => item.id !== project.id))}
                          className="rounded-lg border border-[#D4DEEC] bg-white px-3 py-1.5 text-xs font-semibold text-[#586782]"
                        >
                          Xóa dự án
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() =>
                    setProjects((prev) => [
                      ...prev,
                      { id: Date.now(), name: '', role: '', technologies: '', summary: '' },
                    ])
                  }
                  className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-dashed border-[#C8D3E4] bg-[#F7FAFF] text-sm font-semibold text-[#64748B] transition-colors hover:bg-[#EFF5FE]"
                >
                  <span className="text-base">+</span>
                  Thêm dự án mới
                </button>
              </div>
            </section>

            <section>
              <SectionHeader
                title="Chứng chỉ"
                icon={
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3l8 4.5v9L12 21 4 16.5v-9L12 3z" />
                  </svg>
                }
              />

              <div className="space-y-4">
                {certificates.map((certificate) => (
                  <div key={certificate.id} className="rounded-2xl bg-white p-5">
                    <div className="grid gap-4 lg:grid-cols-[1fr_1.5fr_auto] lg:items-end">
                      <Field
                        label="Phân loại"
                        value={certificate.category}
                        onChange={(nextValue) => updateCertificate(certificate.id, 'category', nextValue)}
                      />
                      <Field
                        label="Tên chứng chỉ"
                        value={certificate.name}
                        onChange={(nextValue) => updateCertificate(certificate.id, 'name', nextValue)}
                      />
                      <button
                        type="button"
                        onClick={() => setCertificates((prev) => prev.filter((item) => item.id !== certificate.id))}
                        className="h-10 w-10 rounded-md bg-[#EEF2F7] text-[#6B7280]"
                      >
                        🗑
                      </button>
                    </div>
                    <div className="mt-4 flex items-center justify-between rounded-lg bg-[#EEF3FA] px-3 py-2 text-sm text-[#334155]">
                      <input
                        value={certificate.fileName}
                        onChange={(e) => updateCertificate(certificate.id, 'fileName', e.target.value)}
                        className="w-full bg-transparent outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => updateCertificate(certificate.id, 'fileName', '')}
                        className="ml-2 text-[#64748B]"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() =>
                    setCertificates((prev) => [
                      ...prev,
                      { id: Date.now(), category: '', name: '', fileName: '' },
                    ])
                  }
                  className="h-10 rounded-xl bg-[#EEF2F7] px-5 text-sm font-semibold text-[#33538F] transition-colors hover:bg-[#E5ECF7]"
                >
                  + Thêm chứng chỉ khác
                </button>
              </div>
            </section>

            <section className="rounded-2xl bg-white px-5 py-5 sm:px-6 sm:py-6">
              <p className="text-[0.78rem] font-semibold uppercase tracking-[0.085em] text-[#64748B]">
                Bước 1/3 • Cập nhật thông tin cá nhân, dự án và chứng chỉ
              </p>
              <h3 className="mt-2.5 text-[2.25rem] font-black leading-[1.12] tracking-[-0.02em] text-[#0F172A]">
                Bắt đầu hành trình <span className="text-[#1D4ED8]">Curator</span> của bạn
              </h3>
              <div className="mt-4 h-2 rounded-full bg-[#DFE5EE]">
                <div className="h-full w-[33%] rounded-full bg-[#1D4ED8]" />
              </div>
            </section>

            <div className="flex flex-col items-end gap-2">
              {analysisError ? <p className="text-xs font-semibold text-[#DC2626]">{analysisError}</p> : null}
              <button
                type="button"
                disabled={analysisLoading}
                onClick={handleContinueToAssessment}
                className="inline-flex items-center gap-2 rounded-xl bg-[#0F3E97] px-7 py-3 text-sm font-semibold text-white shadow-[0_10px_20px_rgba(15,62,151,0.2)] transition-all hover:bg-[#0D3584] hover:shadow-[0_12px_24px_rgba(15,62,151,0.26)] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {analysisLoading ? 'Đang phân tích AI...' : 'Tiếp tục bước 2'}
                <span>→</span>
              </button>
            </div>
          </div>

          <p className="mt-6 text-[0.62rem] uppercase tracking-[0.1em] text-[#9AA8BF]">
            © 2026 EdTech Enthusiasts Academic Curator System
          </p>
        </main>
      </div>
    </div>
  )
}
