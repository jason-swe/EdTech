import { useMemo } from 'react'

import { evaluateRiskRules, type RawAssessmentInput } from '../services/ruleEngine'

export function useAssessment(input: RawAssessmentInput) {
  return useMemo(() => evaluateRiskRules(input), [input])
}
