import 'dotenv/config'
import express from 'express'
import mysql from 'mysql2/promise'
import cors from 'cors'
import jwt from 'jsonwebtoken'

const app = express()
const port = Number(process.env.PORT || 8787)
const jwtSecret = process.env.JWT_SECRET || 'dev-secret-change-me'

// Middleware
app.use(cors())
app.use(express.json({ limit: '1mb' }))

// --- 1. KẾT NỐI MYSQL ---
const dbPool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'edutech_project',
  waitForConnections: true,
  connectionLimit: Number(process.env.DB_CONNECTION_LIMIT || 10),
  queueLimit: 0,
})

const requiredDbEnv = ['DB_USER', 'DB_PASSWORD']
const missingDbEnv = requiredDbEnv.filter((key) => !process.env[key])

if (missingDbEnv.length > 0) {
  console.warn(`Missing DB environment variables: ${missingDbEnv.join(', ')}`)
}

async function checkDbConnection() {
  try {
    await dbPool.query('SELECT 1')
    console.log('Connected to MySQL Database')
  } catch (err) {
    console.error('MySQL Connection Error:', err)
  }
}

function normalizeRole(role) {
  return typeof role === 'string' ? role.trim().toLowerCase() : ''
}

function signUserToken(user) {
  return jwt.sign(
    {
      user_id: user.user_id,
      email: user.email,
      role: normalizeRole(user.role),
      full_name: user.full_name,
    },
    jwtSecret,
    { expiresIn: '7d' }
  )
}

function authenticateToken(req, res, next) {
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : null

  if (!token) {
    return res.status(401).json({ ok: false, error: 'Missing bearer token.' })
  }

  try {
    req.user = jwt.verify(token, jwtSecret)
    return next()
  } catch {
    return res.status(401).json({ ok: false, error: 'Invalid or expired token.' })
  }
}

function requireRoles(allowedRoles = []) {
  const allowed = allowedRoles.map(normalizeRole)

  return (req, res, next) => {
    const role = normalizeRole(req.user?.role)

    if (!allowed.includes(role)) {
      return res.status(403).json({
        ok: false,
        error: 'Forbidden: insufficient role permissions.',
      })
    }

    return next()
  }
}

// --- 2. CÁC API DATABASE (LAYER 0, 1, 2) ---

app.post('/api/auth/dev-login', async (req, res) => {
  try {
    const { email } = req.body ?? {}

    if (typeof email !== 'string' || !email.trim()) {
      return res.status(400).json({ ok: false, error: 'Email is required.' })
    }

    const [rows] = await dbPool.query('SELECT user_id, full_name, email, role FROM users WHERE email = ? LIMIT 1', [email.trim()])
    const user = Array.isArray(rows) ? rows[0] : null

    if (!user) {
      return res.status(404).json({ ok: false, error: 'User not found.' })
    }

    const token = signUserToken(user)

    return res.json({
      ok: true,
      token,
      user: {
        ...user,
        role: normalizeRole(user.role),
      },
    })
  } catch (err) {
    return res.status(500).json({ ok: false, error: err instanceof Error ? err.message : 'Auth error' })
  }
})

app.get('/api/auth/me', authenticateToken, (req, res) => {
  return res.json({ ok: true, user: req.user })
})

app.get('/api/debug/admin-zone', authenticateToken, requireRoles(['admin']), (req, res) => {
  return res.json({ ok: true, message: `Hello admin ${req.user.full_name}` })
})

app.get('/api/debug/curator-zone', authenticateToken, requireRoles(['curator', 'admin']), (req, res) => {
  return res.json({ ok: true, message: `Hello curator ${req.user.full_name}` })
})

app.get('/api/debug/student-zone', authenticateToken, requireRoles(['student']), (req, res) => {
  return res.json({ ok: true, message: `Hello student ${req.user.full_name}` })
})

// Lấy danh sách users
app.get('/api/db/users', authenticateToken, requireRoles(['admin']), async (_req, res) => {
  try {
    const [results] = await dbPool.query('SELECT * FROM users')
    return res.json({ ok: true, data: results })
  } catch (err) {
    return res.status(500).json({ ok: false, error: err instanceof Error ? err.message : 'DB error' })
  }
})

// Lưu log hoạt động (Layer 1)
app.post('/api/db/add-log', authenticateToken, requireRoles(['student']), async (req, res) => {
  const { user_id, activity_type, log_details } = req.body

  if (Number(req.user?.user_id) !== Number(user_id)) {
    return res.status(403).json({ ok: false, error: 'You can only write your own learning log.' })
  }

  if (!Number.isInteger(user_id) || typeof activity_type !== 'string' || !activity_type.trim()) {
    return res.status(400).json({
      ok: false,
      error: 'Invalid payload: user_id must be an integer and activity_type must be a non-empty string.',
    })
  }

  const sql = 'INSERT INTO learning_logs (user_id, activity_type, log_details) VALUES (?, ?, ?)'

  try {
    const [result] = await dbPool.query(sql, [user_id, activity_type.trim(), JSON.stringify(log_details ?? {})])
    return res.json({ ok: true, message: 'Log saved', id: result.insertId })
  } catch (err) {
    return res.status(500).json({ ok: false, error: err instanceof Error ? err.message : 'DB error' })
  }
})

// --- 3. CÁC API AI (GIỮ NGUYÊN LOGIC GEMINI CỦA BẠN) ---

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'edtech-ai-backend' })
})

app.get('/api/db/health', async (_req, res) => {
  try {
    await dbPool.query('SELECT 1')
    return res.json({ ok: true, db: 'connected' })
  } catch (err) {
    return res.status(500).json({
      ok: false,
      db: 'disconnected',
      error: err instanceof Error ? err.message : 'DB error',
    })
  }
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

    let parsed = JSON.parse(text)

    // --- MỞ RỘNG (Tùy chọn): Lưu kết quả AI vào MySQL luôn ---
    // if (userInput.user_id) {
    //   const saveSql = 'INSERT INTO ai_analytics (user_id, prediction_result, confidence_score) VALUES (?, ?, ?)'
    //   db.query(saveSql, [userInput.user_id, parsed.recommendedLevel, parsed.confidence])
    // }

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
app.listen(port, async () => {
  await checkDbConnection()
  console.log(`AI backend is running at http://localhost:${port}`)
})