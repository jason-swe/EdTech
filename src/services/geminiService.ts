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
}

type FrameworkCompetency = {
  id: string
  name: string
  levels: FrameworkLevel[]
}

type FrameworkDomain = {
  competencies: FrameworkCompetency[]
}

type FrameworkDocument = {
  domains?: FrameworkDomain[]
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

const SYSTEM_PROMPT_TEMPLATE =
  'Ban la chuyen gia tham dinh nang luc so. Dua tren du bao cua lop ML la Bac X, hay phan tich sau hon van ban cua nguoi dung de xac nhan bac cuoi cung. Sau do, dua tren file @framework.json, hay dua ra 3 loi khuyen ca nhan hoa va 1 canh bao rui ro som.'

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

function buildFallbackReview(input: GeminiLevelReviewInput): GeminiLevelReviewOutput {
  const levels = getFrameworkLevels(input.competencyId)
  const matchedLevel = levels.find((item) => item.level === input.mlResult.predictedLevel)
  const radarScores = buildFallbackRadarScores(input.mlResult.predictedLevel)

  return {
    finalLevel: clampLevel(input.mlResult.predictedLevel),
    confidenceScore: clampConfidence(input.mlResult.confidenceScore),
    overallScore: clampScore((input.mlResult.predictedLevel / 8) * 100),
    radarScores,
    analysis: `He thong dang su dung ket qua ML de tam xac nhan Bac ${input.mlResult.predictedLevel}. Nen bo sung API key Gemini de co phan tich sau hon.`,
    personalizedAdvice: [
      matchedLevel?.advice ?? 'Dat muc tieu nang luc ro rang cho 2 tuan toi va theo doi tien do hang ngay.',
      'Bo sung minh chung thuc hanh cu the de nang cao do tin cay khi tham dinh nang luc.',
      'Thuc hien phan hoi dinh ky voi co van de dieu chinh lo trinh hoc tap phu hop.',
    ],
    earlyRiskWarning: 'Neu khong cap nhat minh chung hoc tap trong 7 ngay, nguy co sai lech danh gia se tang.',
    source: 'fallback',
    reason: 'Gemini unavailable or API key missing.',
  }
}

function parseGeminiReview(rawText: string, fallback: GeminiLevelReviewOutput): GeminiLevelReviewOutput {
  try {
    const parsed = JSON.parse(rawText) as Partial<GeminiLevelReviewOutput>

    const personalizedAdvice = Array.isArray(parsed.personalizedAdvice)
      ? parsed.personalizedAdvice.filter((item): item is string => typeof item === 'string').slice(0, 3)
      : []

    return {
      finalLevel: clampLevel(typeof parsed.finalLevel === 'number' ? parsed.finalLevel : fallback.finalLevel),
      confidenceScore: clampConfidence(typeof parsed.confidenceScore === 'number' ? parsed.confidenceScore : fallback.confidenceScore),
      overallScore: clampScore(typeof parsed.overallScore === 'number' ? parsed.overallScore : fallback.overallScore),
      radarScores: normalizeRadarScores(parsed.radarScores, fallback.radarScores),
      analysis: typeof parsed.analysis === 'string' && parsed.analysis.trim() ? parsed.analysis : fallback.analysis,
      personalizedAdvice:
        personalizedAdvice.length === 3
          ? personalizedAdvice
          : [...personalizedAdvice, ...fallback.personalizedAdvice].slice(0, 3),
      earlyRiskWarning:
        typeof parsed.earlyRiskWarning === 'string' && parsed.earlyRiskWarning.trim()
          ? parsed.earlyRiskWarning
          : fallback.earlyRiskWarning,
      source: 'live',
    }
  } catch {
    return fallback
  }
}

export async function reviewLevelWithGemini(input: GeminiLevelReviewInput): Promise<GeminiLevelReviewOutput> {
  const fallback = buildFallbackReview(input)
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY as string | undefined
  const model = (import.meta.env.VITE_GEMINI_MODEL as string | undefined) ?? 'gemini-2.5-flash'

  if (!apiKey) {
    return {
      ...fallback,
      reason: 'Missing VITE_GEMINI_API_KEY.',
    }
  }

  const frameworkLevels = getFrameworkLevels(input.competencyId)
  const frameworkContext = frameworkLevels
    .map((level) => `Bac ${level.level}: ${level.description}`)
    .join('\n')

  const systemPrompt = SYSTEM_PROMPT_TEMPLATE.replace('Bac X', `Bac ${input.mlResult.predictedLevel}`)
  const userPrompt = [
    `Ten nguoi hoc: ${input.learnerName ?? 'Nguoi hoc'}`,
    `Du bao ML: Bac ${input.mlResult.predictedLevel}, confidence ${input.mlResult.confidenceScore}`,
    `Van ban nguoi dung: ${input.userInput}`,
    'Khung tham chieu tu framework:',
    frameworkContext || 'Chua co du lieu framework cho nang luc nay.',
    'Hay tra ve JSON voi schema:',
    '{"finalLevel": number, "confidenceScore": number, "overallScore": number, "radarScores": {"dataAndInformation": number, "communicationAndCollaboration": number, "digitalContentCreation": number, "safety": number, "problemSolving": number, "aiApplication": number}, "analysis": string, "personalizedAdvice": [string, string, string], "earlyRiskWarning": string}',
    'Rang buoc: overallScore va radarScores la so nguyen trong khoang 0..100.',
  ].join('\n\n')

  try {
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
  } catch (error: unknown) {
    return {
      ...fallback,
      reason: error instanceof Error ? error.message : 'Unknown Gemini error.',
    }
  }
}

export async function generatePersonalizedAdvice(
  input: GeminiPersonalizationInput,
): Promise<GeminiPersonalizationOutput> {
  const summary = `${input.learnerName} đang ở mức rủi ro ${input.riskLevel}. Cần ưu tiên cải thiện các năng lực: ${input.weakDimensions.join(', ')}.`

  return {
    summary,
    recommendedActions: [
      'Lên kế hoạch học tập theo tuần với mục tiêu rõ ràng',
      'Thực hiện 1 buổi cố vấn học thuật mỗi tuần',
      'Theo dõi tiến độ theo từng năng lực trọng yếu',
    ],
    earlyWarning: input.riskLevel === 'high' ? 'Cần can thiệp trong 72 giờ tới.' : 'Theo dõi định kỳ mỗi tuần.',
  }
}
