import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import type { ReactElement } from 'react'
import { AuthProvider, useAuth } from './auth/authContext'
import AdminUserManagementPage from './features/admin-user-management/AdminUserManagementPage.tsx'
import CuratorAssessmentPage from './features/assessment/CuratorAssessmentPage.tsx'
import CuratorLearningPathPage from './features/learning-path/CuratorLearningPathPage.tsx'
import CuratorProfilePage from './features/profile/CuratorProfilePage.tsx'
import CuratorRiskMonitoringPage from './features/monitoring/CuratorRiskMonitoringPage.tsx'
import LandingPage from './features/landing-page/LandingPage'
import LoginPage from './features/login/LoginPage'
import SignupPage from './features/login/SignupPage'
import StudentDashboardPage from './features/dashboard/StudentDashboardPage.tsx'

function PublicOnlyRoute({ children }: { children: ReactElement }) {
  const { isAuthenticated, getDefaultRoute } = useAuth()
  if (isAuthenticated) {
    return <Navigate to={getDefaultRoute()} replace />
  }

  return children
}

function ProtectedRoute({ children }: { children: ReactElement }) {
  const { isAuthenticated } = useAuth()
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return children
}

function SetupStepRoute({ step, children }: { step: 1 | 2 | 3; children: ReactElement }) {
  const { user, getDefaultRoute, getSetupRouteForProgress } = useAuth()
  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (user.role !== 'student') {
    return <Navigate to={getDefaultRoute(user)} replace />
  }

  if (user.setupStep >= 3) {
    return <Navigate to="/student-dashboard" replace />
  }

  const requiredProgress = step - 1
  if (user.setupStep < requiredProgress) {
    return <Navigate to={getSetupRouteForProgress(user.setupStep)} replace />
  }

  return children
}

function RoleRoute({ role, children }: { role: 'admin' | 'curator' | 'student'; children: ReactElement }) {
  const { user, getDefaultRoute, getSetupRouteForProgress } = useAuth()
  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (role === 'student' && user.role === 'student' && user.setupStep < 3) {
    return <Navigate to={getSetupRouteForProgress(user.setupStep)} replace />
  }

  if (user.role !== role) {
    return <Navigate to={getDefaultRoute(user)} replace />
  }

  return children
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route
            path="/login"
            element={
              <PublicOnlyRoute>
                <LoginPage />
              </PublicOnlyRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <PublicOnlyRoute>
                <SignupPage />
              </PublicOnlyRoute>
            }
          />
          <Route
            path="/curator-profile"
            element={
              <SetupStepRoute step={1}>
                <CuratorProfilePage />
              </SetupStepRoute>
            }
          />
          <Route
            path="/curator-assessment"
            element={
              <SetupStepRoute step={2}>
                <CuratorAssessmentPage />
              </SetupStepRoute>
            }
          />
          <Route
            path="/curator-learning-plan"
            element={
              <SetupStepRoute step={3}>
                <CuratorLearningPathPage />
              </SetupStepRoute>
            }
          />
          <Route
            path="/curator-risk-monitoring"
            element={
              <RoleRoute role="curator">
                <CuratorRiskMonitoringPage />
              </RoleRoute>
            }
          />
          <Route
            path="/admin-user-management"
            element={
              <RoleRoute role="admin">
                <AdminUserManagementPage />
              </RoleRoute>
            }
          />
          <Route
            path="/student-dashboard"
            element={
              <ProtectedRoute>
                <RoleRoute role="student">
                  <StudentDashboardPage />
                </RoleRoute>
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
