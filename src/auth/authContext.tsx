import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'

export type UserRole = 'student' | 'curator' | 'admin'

export type SessionUser = {
  id: string
  email: string
  fullName: string
  role: UserRole
  setupStep: number
  assignedLearners: string[]
  lastLoginAt: string
}

type AuthContextValue = {
  user: SessionUser | null
  isAuthenticated: boolean
  login: (email: string, password: string) => SessionUser
  register: (fullName: string, email: string, password: string) => SessionUser
  logout: () => void
  completeSetupStep: (step: number) => void
  getDefaultRoute: (targetUser?: SessionUser | null) => string
  getSetupRouteForProgress: (progress?: number) => string
  getRegisteredUsers: () => SessionUser[]
}

const SESSION_KEY = 'edtech.session.user'
const USERS_KEY = 'edtech.mock.users'

const DEFAULT_LEARNER_NAMES = ['Trần Hoàng Nam', 'Eleanor Wright', 'Marcus Thorne', 'Sarah Chen']

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

function toInitials(name: string): string {
  const words = name
    .split(/\s+/)
    .map((item) => item.trim())
    .filter(Boolean)

  if (words.length === 0) return 'U'
  if (words.length === 1) return words[0].slice(0, 1).toUpperCase()

  return `${words[0][0] ?? ''}${words[words.length - 1][0] ?? ''}`.toUpperCase()
}

function titleCase(input: string): string {
  return input
    .split(/[^a-zA-Z0-9]+/)
    .map((token) => token.trim())
    .filter(Boolean)
    .map((token) => `${token.slice(0, 1).toUpperCase()}${token.slice(1).toLowerCase()}`)
    .join(' ')
}

function roleFromEmail(email: string): UserRole {
  if (email.includes('admin')) return 'admin'
  if (email.includes('curator') || email.includes('mentor')) return 'curator'
  return 'student'
}

function buildDefaultName(email: string, role: UserRole): string {
  if (role === 'admin') return 'TS. Julian Vance'
  if (role === 'curator') return 'Nguyễn Thu Hà'

  const localPart = email.split('@')[0] ?? ''
  const parsed = titleCase(localPart)
  return parsed || 'Người học mới'
}

function safeParse<T>(raw: string | null): T | null {
  if (!raw) return null

  try {
    return JSON.parse(raw) as T
  } catch {
    return null
  }
}

function readSessionUser(): SessionUser | null {
  if (typeof window === 'undefined') return null
  return safeParse<SessionUser>(window.localStorage.getItem(SESSION_KEY))
}

function writeSessionUser(user: SessionUser | null) {
  if (typeof window === 'undefined') return

  if (!user) {
    window.localStorage.removeItem(SESSION_KEY)
    return
  }

  window.localStorage.setItem(SESSION_KEY, JSON.stringify(user))
}

function seedUsers(): SessionUser[] {
  const now = new Date().toISOString()

  return [
    {
      id: 'u-student-nam',
      email: 'nam.student@edtech.vn',
      fullName: 'Trần Hoàng Nam',
      role: 'student',
      setupStep: 3,
      assignedLearners: [],
      lastLoginAt: now,
    },
    {
      id: 'u-curator-ha',
      email: 'ha.curator@edtech.vn',
      fullName: 'Nguyễn Thu Hà',
      role: 'curator',
      setupStep: 3,
      assignedLearners: ['Trần Hoàng Nam', 'Eleanor Wright', 'Marcus Thorne'],
      lastLoginAt: now,
    },
    {
      id: 'u-admin-julian',
      email: 'julian.admin@edtech.vn',
      fullName: 'TS. Julian Vance',
      role: 'admin',
      setupStep: 3,
      assignedLearners: [],
      lastLoginAt: now,
    },
  ]
}

function readUsers(): SessionUser[] {
  if (typeof window === 'undefined') return []

  const parsed = safeParse<SessionUser[]>(window.localStorage.getItem(USERS_KEY))
  if (Array.isArray(parsed) && parsed.length > 0) {
    return parsed
  }

  const seeded = seedUsers()
  window.localStorage.setItem(USERS_KEY, JSON.stringify(seeded))
  return seeded
}

function writeUsers(users: SessionUser[]) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

function upsertUser(users: SessionUser[], user: SessionUser): SessionUser[] {
  const existingIndex = users.findIndex((item) => item.email === user.email)
  if (existingIndex < 0) return [user, ...users]

  const next = [...users]
  next[existingIndex] = user
  return next
}

function createNewSessionUser(email: string): SessionUser {
  const role = roleFromEmail(email)
  const now = new Date().toISOString()

  return {
    id: `u-${Math.random().toString(36).slice(2, 9)}`,
    email,
    fullName: buildDefaultName(email, role),
    role,
    setupStep: role === 'student' ? 0 : 3,
    assignedLearners: role === 'curator' ? DEFAULT_LEARNER_NAMES.slice(0, 3) : [],
    lastLoginAt: now,
  }
}

function normalizeName(input: string): string {
  return input.trim().replace(/\s+/g, ' ')
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(() => readSessionUser())

  const getSetupRouteForProgress = (progress = user?.setupStep ?? 0): string => {
    if (progress <= 0) return '/curator-profile'
    if (progress === 1) return '/curator-assessment'
    if (progress === 2) return '/curator-learning-plan'
    return '/student-dashboard'
  }

  const getDefaultRoute = (targetUser: SessionUser | null = user): string => {
    if (!targetUser) return '/login'

    if (targetUser.role === 'admin') return '/admin-user-management'
    if (targetUser.role === 'curator') return '/curator-risk-monitoring'

    return targetUser.setupStep >= 3 ? '/student-dashboard' : getSetupRouteForProgress(targetUser.setupStep)
  }

  const login = (rawEmail: string): SessionUser => {
    const email = rawEmail.trim().toLowerCase()
    const users = readUsers()
    const matched = users.find((item) => item.email === email)
    const current = matched ?? createNewSessionUser(email)

    const nextUser: SessionUser = {
      ...current,
      lastLoginAt: new Date().toISOString(),
    }

    writeSessionUser(nextUser)
    writeUsers(upsertUser(users, nextUser))
    setUser(nextUser)

    return nextUser
  }

  const register = (rawFullName: string, rawEmail: string): SessionUser => {
    const email = rawEmail.trim().toLowerCase()
    const fullName = normalizeName(rawFullName)

    const users = readUsers()
    const matched = users.find((item) => item.email === email)
    const baseUser = matched ?? createNewSessionUser(email)

    const nextUser: SessionUser = {
      ...baseUser,
      role: 'student',
      setupStep: 0,
      assignedLearners: [],
      fullName: fullName || baseUser.fullName,
      lastLoginAt: new Date().toISOString(),
    }

    writeSessionUser(nextUser)
    writeUsers(upsertUser(users, nextUser))
    setUser(nextUser)

    return nextUser
  }

  const logout = () => {
    writeSessionUser(null)
    setUser(null)
  }

  const completeSetupStep = (step: number) => {
    setUser((prev) => {
      if (!prev) return prev

      const nextUser: SessionUser = {
        ...prev,
        setupStep: Math.max(prev.setupStep, Math.min(3, step)),
      }

      writeSessionUser(nextUser)
      writeUsers(upsertUser(readUsers(), nextUser))

      return nextUser
    })
  }

  const getRegisteredUsers = (): SessionUser[] => {
    const merged = user ? upsertUser(readUsers(), user) : readUsers()
    return merged
      .map((item) => ({ ...item }))
      .sort((a, b) => (a.lastLoginAt > b.lastLoginAt ? -1 : 1))
  }

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: !!user,
      login: (email, _password) => login(email),
      register: (fullName, email, _password) => register(fullName, email),
      logout,
      completeSetupStep,
      getDefaultRoute,
      getSetupRouteForProgress,
      getRegisteredUsers,
    }),
    [user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider')
  }

  return context
}

export function getUserInitials(name?: string): string {
  return toInitials(name?.trim() || 'User')
}
