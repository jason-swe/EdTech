import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import LandingPage from './LandingPage/LandingPage'
import LoginPage from './LoginPage/LoginPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
