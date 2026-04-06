export type RawAssessmentInput = {
  attendanceRate: number
  assignmentCompletionRate: number
  avgScore: number
  inactivityDays: number
}

export type RuleEngineResult = {
  riskScore: number
  flags: string[]
}

export type AssessmentFormInput = {
  competencyDescription: string
  [key: string]: string | number | boolean | null | undefined
}

export type FieldValidationError = {
  field: string
  code: 'required' | 'min_length'
  message: string
}

export type AssessmentValidationResult = {
  isValid: boolean
  errors: FieldValidationError[]
}

function isEmptyValue(value: AssessmentFormInput[string]): boolean {
  if (value === null || value === undefined) {
    return true
  }

  if (typeof value === 'string') {
    return value.trim().length === 0
  }

  return false
}

export function validateAssessmentFormInput(input: AssessmentFormInput): AssessmentValidationResult {
  const errors: FieldValidationError[] = []

  Object.entries(input).forEach(([field, value]) => {
    if (isEmptyValue(value)) {
      errors.push({
        field,
        code: 'required',
        message: `Truong \"${field}\" khong duoc de trong.`,
      })
    }
  })

  const normalizedDescription = input.competencyDescription?.trim() ?? ''

  if (normalizedDescription.length > 0 && normalizedDescription.length <= 50) {
    errors.push({
      field: 'competencyDescription',
      code: 'min_length',
      message: 'Mo ta nang luc phai tren 50 ky tu de dam bao do chinh xac cho phan tich.',
    })
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

export function evaluateRiskRules(input: RawAssessmentInput): RuleEngineResult {
  const flags: string[] = []
  let riskScore = 0

  if (input.attendanceRate < 0.75) {
    riskScore += 25
    flags.push('attendance_low')
  }

  if (input.assignmentCompletionRate < 0.7) {
    riskScore += 25
    flags.push('assignment_completion_low')
  }

  if (input.avgScore < 65) {
    riskScore += 30
    flags.push('average_score_low')
  }

  if (input.inactivityDays >= 7) {
    riskScore += 20
    flags.push('inactive_for_7_days')
  }

  return {
    riskScore: Math.min(100, riskScore),
    flags,
  }
}
