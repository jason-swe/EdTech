import frameworkData from '../api/framework.json'
import type { LevelPredictionResult } from './mlService'

export type GeminiPersonalizationInput = {
  learnerName: string
  riskLevel: 'low' | 'medium' | 'high'
  weakDimensions: string[]
}

export type GeminiPersonalizationOutput = {
  summary: string
  recommendedActions: string[]
  earlyWarning: string
}

type FrameworkLevel = {
  level: number
  description: string
  advice?: string
  keywords?: string[]
}

type FrameworkCompetency = {
  id: string
  name: string
  description?: string
  levels: FrameworkLevel[]
}

type FrameworkDomain = {
  id?: string
  name?: string
  summary?: string
  competencies: FrameworkCompetency[]
}

type FrameworkDocument = {
  domains?: FrameworkDomain[]
}

export type GeminiRoadmapStep = {
  step?: number
  target_level?: number
  action_items?: string[]
  focus_keywords?: string[]
}

export type GeminiAssessmentSchema = {
  assessment?: {
    current_level?: number
    summary?: string
  }
  roadmap?: GeminiRoadmapStep[]
  mentor_advice?: string
}

export type GeminiLevelReviewInput = {
  userInput: string
  mlResult: LevelPredictionResult
  competencyId?: string
  learnerName?: string
}

export type GeminiRadarScores = {
  dataAndInformation: number
  communicationAndCollaboration: number
  digitalContentCreation: number
  safety: number
  problemSolving: number
  aiApplication: number
}

export type GeminiLevelReviewOutput = {
  finalLevel: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8
  confidenceScore: number
  overallScore: number
  radarScores: GeminiRadarScores
  analysis: string
  personalizedAdvice: string[]
  earlyRiskWarning: string
  assessment?: GeminiAssessmentSchema['assessment']
  roadmap?: GeminiRoadmapStep[]
  mentorAdvice?: string
  source: 'live' | 'fallback'
  reason?: string
}

type GeminiApiResponse = {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string
      }>
    }
  }>
}

type GeminiApiErrorResponse = {
  error?: {
    message?: string
    status?: string
  }
}

const inFlightReviewRequests = new Map<string, Promise<GeminiLevelReviewOutput>>()
const recentReviewResults = new Map<string, { at: number; result: GeminiLevelReviewOutput }>()
const REVIEW_CACHE_TTL_MS = 12000

const SYSTEM_PROMPT_TEMPLATE =
  [
    'Ban la Chuyen gia Danh gia Nang luc va Kien tao Lo trinh Hoc tap (Learning Path Architect).',
    'Nhiem vu: dua tren framework, phan tich mo ta cua nguoi hoc de xac dinh bac nang luc hien tai.',
    'Quy tac bat buoc:',
    '- Moi ket luan phai doi chieu tu domains, competencies, levels trong framework.',
    '- Khong tu y tao bac hoc moi, ky nang moi, hay noi dung ngoai framework.',
    '- Lo trinh thang tien phai dua tren advice va keywords trong framework.',
    '- action_items phai la de xuat hanh dong cu the, uu tien dang du an/nhiem vu co the thuc hien ngay.',
    '- Cam tra ve noi dung mang tinh dinh nghia chung chung (vi du: "X la gi", "Khai niem", "Mo ta ly thuyet").',
    '- Moi action_item phai theo mau: Dong tu hanh dong + Du an/nhiem vu cu the + San pham dau ra do duoc.',
    '- roadmap can bao phu 6 bac Bloom theo thu tu tang dan: Nho, Hieu, Van dung, Phan tich, Danh gia, Sang tao.',
    '- Tra ve DUY NHAT JSON hop le theo dung schema yeu cau, khong chen markdown, khong chen van ban ngoai JSON.',
  ].join('\n')

function clampLevel(level: number): GeminiLevelReviewOutput['finalLevel'] {
  if (level < 1) return 1
  if (level > 8) return 8
  return level as GeminiLevelReviewOutput['finalLevel']
}

function clampConfidence(score: number): number {
  if (Number.isNaN(score)) return 0
  return Math.max(0, Math.min(1, Number(score.toFixed(4))))
}

function clampScore(score: number): number {
  if (Number.isNaN(score)) return 0
  return Math.max(0, Math.min(100, Math.round(score)))
}

function buildFallbackRadarScores(level: number): GeminiRadarScores {
  const baseline = clampScore((level / 8) * 100)

  return {
    dataAndInformation: clampScore(baseline + 3),
    communicationAndCollaboration: clampScore(baseline - 2),
    digitalContentCreation: clampScore(baseline + 1),
    safety: clampScore(baseline - 4),
    problemSolving: clampScore(baseline),
    aiApplication: clampScore(baseline + 5),
  }
}

function normalizeRadarScores(raw: Partial<GeminiRadarScores> | undefined, fallback: GeminiRadarScores): GeminiRadarScores {
  return {
    dataAndInformation: clampScore(typeof raw?.dataAndInformation === 'number' ? raw.dataAndInformation : fallback.dataAndInformation),
    communicationAndCollaboration: clampScore(
      typeof raw?.communicationAndCollaboration === 'number' ? raw.communicationAndCollaboration : fallback.communicationAndCollaboration,
    ),
    digitalContentCreation: clampScore(
      typeof raw?.digitalContentCreation === 'number' ? raw.digitalContentCreation : fallback.digitalContentCreation,
    ),
    safety: clampScore(typeof raw?.safety === 'number' ? raw.safety : fallback.safety),
    problemSolving: clampScore(typeof raw?.problemSolving === 'number' ? raw.problemSolving : fallback.problemSolving),
    aiApplication: clampScore(typeof raw?.aiApplication === 'number' ? raw.aiApplication : fallback.aiApplication),
  }
}

function getFrameworkLevels(competencyId?: string): FrameworkLevel[] {
  const framework = frameworkData as FrameworkDocument
  const competencies = (framework.domains ?? []).flatMap((domain) => domain.competencies ?? [])

  if (!competencyId) {
    return competencies.flatMap((competency) => competency.levels ?? [])
  }

  const competency = competencies.find((item) => item.id === competencyId)
  return competency?.levels ?? []
}

function getFrameworkCompetency(competencyId?: string): FrameworkCompetency | null {
  if (!competencyId) return null

  const framework = frameworkData as FrameworkDocument
  const competencies = (framework.domains ?? []).flatMap((domain) => domain.competencies ?? [])
  return competencies.find((item) => item.id === competencyId) ?? null
}

function extractRoadmapAdvice(roadmap: GeminiRoadmapStep[] | undefined, fallback: string[]): string[] {
  if (!Array.isArray(roadmap)) {
    return fallback
  }

  const actions = roadmap
    .flatMap((item) => (Array.isArray(item.action_items) ? item.action_items : []))
    .filter((item): item is string => typeof item === 'string' && item.trim().length > 0)

  return actions.length > 0 ? actions.slice(0, 3) : fallback
}

function buildFallbackReview(input: GeminiLevelReviewInput): GeminiLevelReviewOutput {
  const radarScores = buildFallbackRadarScores(input.mlResult.predictedLevel)

  return {
    finalLevel: clampLevel(input.mlResult.predictedLevel),
    confidenceScore: clampConfidence(input.mlResult.confidenceScore),
    overallScore: clampScore((input.mlResult.predictedLevel / 8) * 100),
    radarScores,
    analysis: '',
    personalizedAdvice: [],
    earlyRiskWarning: '',
    assessment: {
      current_level: clampLevel(input.mlResult.predictedLevel),
      summary: '',
    },
    roadmap: [],
    mentorAdvice: '',
    source: 'fallback',
    reason: 'Gemini unavailable or API key missing.',
  }
}

function parseGeminiReview(rawText: string, fallback: GeminiLevelReviewOutput): GeminiLevelReviewOutput {
  try {
    const parsed = JSON.parse(rawText) as Partial<GeminiLevelReviewOutput> & GeminiAssessmentSchema

    if (parsed.assessment) {
      const levelFromAssessment =
        typeof parsed.assessment.current_level === 'number' ? clampLevel(parsed.assessment.current_level) : fallback.finalLevel

      const roadmapAdvice = extractRoadmapAdvice(parsed.roadmap, fallback.personalizedAdvice)
      const assessmentSummary =
        typeof parsed.assessment.summary === 'string' && parsed.assessment.summary.trim()
          ? parsed.assessment.summary
          : fallback.analysis

      return {
        finalLevel: levelFromAssessment,
        confidenceScore: fallback.confidenceScore,
        overallScore: clampScore((levelFromAssessment / 8) * 100),
        radarScores: buildFallbackRadarScores(levelFromAssessment),
        analysis: assessmentSummary,
        personalizedAdvice: roadmapAdvice,
        earlyRiskWarning:
          typeof parsed.mentor_advice === 'string' && parsed.mentor_advice.trim()
            ? parsed.mentor_advice
            : '',
        assessment: parsed.assessment,
        roadmap: Array.isArray(parsed.roadmap) ? parsed.roadmap : [],
        mentorAdvice: typeof parsed.mentor_advice === 'string' ? parsed.mentor_advice : '',
        source: 'live',
      }
    }

    const personalizedAdvice = Array.isArray(parsed.personalizedAdvice)
      ? parsed.personalizedAdvice.filter((item): item is string => typeof item === 'string').slice(0, 3)
      : []

    return {
      finalLevel: clampLevel(typeof parsed.finalLevel === 'number' ? parsed.finalLevel : fallback.finalLevel),
      confidenceScore: clampConfidence(typeof parsed.confidenceScore === 'number' ? parsed.confidenceScore : fallback.confidenceScore),
      overallScore: clampScore(typeof parsed.overallScore === 'number' ? parsed.overallScore : fallback.overallScore),
      radarScores: normalizeRadarScores(parsed.radarScores, fallback.radarScores),
      analysis: typeof parsed.analysis === 'string' && parsed.analysis.trim() ? parsed.analysis : fallback.analysis,
      personalizedAdvice,
      earlyRiskWarning:
        typeof parsed.earlyRiskWarning === 'string' && parsed.earlyRiskWarning.trim()
          ? parsed.earlyRiskWarning
          : '',
      assessment: fallback.assessment,
      roadmap: fallback.roadmap,
      mentorAdvice: '',
      source: 'live',
    }
  } catch {
    return fallback
  }
}

export async function reviewLevelWithGemini(input: GeminiLevelReviewInput): Promise<GeminiLevelReviewOutput> {
  const requestKey = JSON.stringify({
    learnerName: input.learnerName ?? '',
    competencyId: input.competencyId ?? '',
    userInput: input.userInput,
    predictedLevel: input.mlResult.predictedLevel,
    confidenceScore: input.mlResult.confidenceScore,
  })

  const recent = recentReviewResults.get(requestKey)
  if (recent && Date.now() - recent.at <= REVIEW_CACHE_TTL_MS) {
    return recent.result
  }

  const inFlight = inFlightReviewRequests.get(requestKey)
  if (inFlight) {
    return inFlight
  }

  const task = (async () => {
    const fallback = buildFallbackReview(input)
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY as string | undefined
    const configuredModel = (import.meta.env.VITE_GEMINI_MODEL as string | undefined)?.trim()
    const modelCandidates = [configuredModel || 'gemini-pro-latest', 'gemini-pro-latest'].filter(
      (item, index, list) => !!item && list.indexOf(item) === index,
    ) as string[]

    if (!apiKey) {
      return {
        ...fallback,
        reason: 'Missing VITE_GEMINI_API_KEY.',
      }
    }

    const frameworkLevels = getFrameworkLevels(input.competencyId)
    const frameworkCompetency = getFrameworkCompetency(input.competencyId)
    const frameworkContext = frameworkLevels
      .map((level) => {
        const keywords = Array.isArray(level.keywords) && level.keywords.length > 0 ? ` | keywords: ${level.keywords.join(', ')}` : ''
        const advice = level.advice?.trim() ? ` | advice: ${level.advice}` : ''
        return `Bac ${level.level}: ${level.description}${keywords}${advice}`
      })
      .join('\n')

    const systemPrompt = SYSTEM_PROMPT_TEMPLATE
    const userPrompt = [
      `Ten nguoi hoc: ${input.learnerName ?? 'Nguoi hoc'}`,
      `Du bao ML: Bac ${input.mlResult.predictedLevel}, confidence ${input.mlResult.confidenceScore}`,
      `Nang luc tham chieu: ${frameworkCompetency?.id ?? input.competencyId ?? 'chua xac dinh'} - ${frameworkCompetency?.name ?? 'Khong tim thay competency trong framework'}`,
      frameworkCompetency?.description ? `Mo ta nang luc: ${frameworkCompetency.description}` : 'Mo ta nang luc: khong co du lieu.',
      `Van ban nguoi dung: ${input.userInput}`,
      'Khung tham chieu tu framework:',
      frameworkContext || 'Chua co du lieu framework cho nang luc nay.',
      'Dinh dang tra ve BAT BUOC (JSON nguyen khoi):',
      '{"assessment":{"current_level":number,"summary":"string"},"roadmap":[{"step":number,"target_level":number,"action_items":["string"],"focus_keywords":["string"]}],"mentor_advice":"string"}',
      'Rang buoc bo sung:',
      '- current_level phai la so nguyen 1..8.',
      '- roadmap la danh sach buoc nang bac tu muc hien tai len muc cao hon hop ly va phan bo theo 6 bac Bloom (Nho -> Sang tao).',
      '- action_items va focus_keywords phai bam sat framework, uu tien lay tu advice va keywords.',
      '- Moi step can co toi thieu 1 action_item mang tinh du an/nhiem vu thuc te cho nguoi hoc.',
      '- Moi action_item phai co ket qua dau ra quan sat duoc (bao cao, san pham demo, bo du lieu, slide, rubric, artifact).',
      '- Khong viet action_item duoi dang dinh nghia, khai niem, mo ta ly thuyet chung chung.',
      '- Khong duoc tra ve bat ky truong nao khac ngoai schema tren.',
    ].join('\n\n')

    try {
      for (const model of modelCandidates) {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            systemInstruction: {
              parts: [{ text: systemPrompt }],
            },
            contents: [
              {
                role: 'user',
                parts: [{ text: userPrompt }],
              },
            ],
            generationConfig: {
              responseMimeType: 'application/json',
              temperature: 0.2,
            },
          }),
        })

        if (!response.ok) {
          const errorPayload = (await response.json().catch(() => null)) as GeminiApiErrorResponse | null
          const errorMessage = errorPayload?.error?.message?.trim()
          const errorStatus = errorPayload?.error?.status?.trim()
          const detail = [errorStatus, errorMessage].filter(Boolean).join(' - ')

          if (response.status === 404 || response.status === 429 || response.status === 503) {
            continue
          }

          return {
            ...fallback,
            reason: detail ? `Gemini HTTP ${response.status}: ${detail}` : `Gemini HTTP ${response.status}`,
          }
        }

        const data = (await response.json()) as GeminiApiResponse
        const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text

        if (!rawText) {
          return {
            ...fallback,
            reason: 'Gemini returned empty text.',
          }
        }

        return parseGeminiReview(rawText, fallback)
      }

      return {
        ...fallback,
        reason: `No available Gemini model from candidates: ${modelCandidates.join(', ')}`,
      }
    } catch (error: unknown) {
      return {
        ...fallback,
        reason: error instanceof Error ? error.message : 'Unknown Gemini error.',
      }
    }
  })()

  inFlightReviewRequests.set(requestKey, task)

  try {
    const result = await task
    recentReviewResults.set(requestKey, { at: Date.now(), result })
    return result
  } finally {
    inFlightReviewRequests.delete(requestKey)
  }
}

export async function generatePersonalizedAdvice(
  input: GeminiPersonalizationInput,
): Promise<GeminiPersonalizationOutput> {
  const summary = `${input.learnerName} đang ở mức rủi ro ${input.riskLevel}.`
  const uniqueWeakDimensions = [...new Set(input.weakDimensions.map((item) => item.trim()).filter((item) => item.length > 0))]

  return {
    summary,
    recommendedActions: uniqueWeakDimensions,
    earlyWarning: input.riskLevel,
  }
}
