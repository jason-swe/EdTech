import 'dotenv/config'
import express from 'express'

const app = express()
const port = Number(process.env.PORT || 8787)

app.use(express.json({ limit: '1mb' }))

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'edtech-ai-backend' })
})

app.post('/api/ai/roadmap', async (req, res) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return res.status(500).json({
        ok: false,
        error: 'Missing GEMINI_API_KEY in environment variables.',
      })
    }

    const { userInput, levelSchema, options } = req.body ?? {}

    if (!userInput || typeof userInput !== 'object') {
      return res.status(400).json({
        ok: false,
        error: 'Invalid payload: userInput is required and must be an object.',
      })
    }

    const model = typeof options?.model === 'string' ? options.model : 'gemini-pro-latest'

    const prompt = [
      'You are an EdTech AI planner.',
      'Task: Analyze user profile in exactly 3 steps and produce a practical learning roadmap.',
      'Constraints:',
      '1) Respect the provided 8-level schema only. Do not invent extra levels.',
      '2) Return JSON only (no markdown, no prose outside JSON).',
      '3) Include fields: recommendedLevel, confidence, stepAnalysis, roadmap, riskFlags, nextActions.',
      '4) stepAnalysis must contain exactly 3 steps with concise rationale.',
      '',
      'User Input JSON:',
      JSON.stringify(userInput),
      '',
      'Level Schema JSON:',
      JSON.stringify(levelSchema ?? { levels: [] }),
    ].join('\n')

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`

    const geminiResponse = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.2,
        },
      }),
    })

    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text()
      return res.status(geminiResponse.status).json({
        ok: false,
        error: 'Gemini API request failed.',
        details: errorText,
      })
    }

    const raw = await geminiResponse.json()
    const text = raw?.candidates?.[0]?.content?.parts?.[0]?.text

    if (!text || typeof text !== 'string') {
      return res.status(502).json({
        ok: false,
        error: 'Gemini returned empty content.',
      })
    }

    let parsed
    try {
      parsed = JSON.parse(text)
    } catch {
      return res.status(502).json({
        ok: false,
        error: 'Gemini output is not valid JSON.',
        rawText: text,
      })
    }

    return res.json({
      ok: true,
      model,
      data: parsed,
    })
  } catch (error) {
    return res.status(500).json({
      ok: false,
      error: 'Unexpected server error.',
      details: error instanceof Error ? error.message : 'Unknown error',
    })
  }
})

app.listen(port, () => {
  console.log(`AI backend is running at http://localhost:${port}`)
})
