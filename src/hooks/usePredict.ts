import { useEffect, useState } from 'react'

import { predictRiskBand, type MlFeatureVector, type MlPrediction } from '../services/mlService'

type PredictState = {
  loading: boolean
  result: MlPrediction | null
  error: string | null
}

export function usePredict(features: MlFeatureVector): PredictState {
  const [state, setState] = useState<PredictState>({
    loading: true,
    result: null,
    error: null,
  })

  useEffect(() => {
    let cancelled = false

    setState({ loading: true, result: null, error: null })

    predictRiskBand(features)
      .then((result) => {
        if (!cancelled) {
          setState({ loading: false, result, error: null })
        }
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setState({ loading: false, result: null, error: error instanceof Error ? error.message : 'Prediction failed' })
        }
      })

    return () => {
      cancelled = true
    }
  }, [features])

  return state
}
