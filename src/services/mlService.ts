import stringSimilarity from 'string-similarity'

import frameworkData from '../api/framework.json'

export type MlFeatureVector = {
  riskScoreFromRules: number
  engagementScore: number
  trendSlope: number
}

export type MlPrediction = {
  probabilityAtRisk: number
  level: 'low' | 'medium' | 'high'
}

type FrameworkLevel = {
  level: number
  description: string
}

type FrameworkCompetency = {
  id: string
  levels: FrameworkLevel[]
}

type FrameworkDomain = {
  competencies: FrameworkCompetency[]
}

type FrameworkDocument = {
  domains?: FrameworkDomain[]
}

export type LevelPredictionInput = {
  userDescription: string
  competencyId?: string
}

export type LevelPredictionResult = {
  predictedLevel: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8
  confidenceScore: number
}

function toLevelRange(level: number): LevelPredictionResult['predictedLevel'] {
  if (level < 1) return 1
  if (level > 8) return 8
  return level as LevelPredictionResult['predictedLevel']
}

function getCandidateLevels(competencyId?: string): FrameworkLevel[] {
  const framework = frameworkData as FrameworkDocument
  const competencies = (framework.domains ?? []).flatMap((domain) => domain.competencies ?? [])

  const selectedCompetencies = competencyId
    ? competencies.filter((competency) => competency.id === competencyId)
    : competencies

  return selectedCompetencies.flatMap((competency) => competency.levels ?? [])
}

export function predictCompetencyLevel(input: LevelPredictionInput): LevelPredictionResult {
  const normalizedDescription = input.userDescription.trim()
  if (!normalizedDescription) {
    return {
      predictedLevel: 1,
      confidenceScore: 0,
    }
  }

  const candidateLevels = getCandidateLevels(input.competencyId)
  if (candidateLevels.length === 0) {
    return {
      predictedLevel: 1,
      confidenceScore: 0,
    }
  }

  const descriptions = candidateLevels.map((candidate) => candidate.description)
  const bestMatch = stringSimilarity.findBestMatch(normalizedDescription, descriptions)
  const bestMatchIndex = bestMatch.bestMatchIndex
  const matchedLevel = candidateLevels[bestMatchIndex]

  return {
    predictedLevel: toLevelRange(matchedLevel.level),
    confidenceScore: Number(bestMatch.bestMatch.rating.toFixed(4)),
  }
}

export async function predictRiskBand(features: MlFeatureVector): Promise<MlPrediction> {
  const baseline = features.riskScoreFromRules * 0.5 + (100 - features.engagementScore) * 0.35 + Math.max(0, -features.trendSlope) * 15
  const probabilityAtRisk = Math.max(0, Math.min(1, baseline / 100))

  const level: MlPrediction['level'] =
    probabilityAtRisk >= 0.7 ? 'high' : probabilityAtRisk >= 0.4 ? 'medium' : 'low'

  return {
    probabilityAtRisk,
    level,
  }
}
