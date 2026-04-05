import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import AdminUserManagementPage from './AdminUserManagementPage/AdminUserManagementPage.tsx'
import CuratorAssessmentPage from './CuratorAssessmentPage/CuratorAssessmentPage.tsx'
import CuratorLearningPathPage from './CuratorLearningPathPage/CuratorLearningPathPage.tsx'
import CuratorProfilePage from './CuratorProfilePage/CuratorProfilePage.tsx'
import CuratorRiskMonitoringPage from './CuratorRiskMonitoringPage/CuratorRiskMonitoringPage.tsx'
import LandingPage from './LandingPage/LandingPage'
import LoginPage from './LoginPage/LoginPage'
import StudentDashboardPage from './StudentDashboardPage/StudentDashboardPage.tsx'

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
