import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import AdminUserManagementPage from './features/admin-user-management/AdminUserManagementPage.tsx'
import CuratorAssessmentPage from './features/assessment/CuratorAssessmentPage.tsx'
import CuratorLearningPathPage from './features/learning-path/CuratorLearningPathPage.tsx'
import CuratorProfilePage from './features/profile/CuratorProfilePage.tsx'
import CuratorRiskMonitoringPage from './features/monitoring/CuratorRiskMonitoringPage.tsx'
import LandingPage from './features/landing-page/LandingPage'
import LoginPage from './features/login/LoginPage'
import StudentDashboardPage from './features/dashboard/StudentDashboardPage.tsx'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/curator-profile" element={<CuratorProfilePage />} />
        <Route path="/curator-assessment" element={<CuratorAssessmentPage />} />
        <Route path="/curator-learning-plan" element={<CuratorLearningPathPage />} />
        <Route path="/curator-risk-monitoring" element={<CuratorRiskMonitoringPage />} />
        <Route path="/admin-user-management" element={<AdminUserManagementPage />} />
        <Route path="/student-dashboard" element={<StudentDashboardPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
