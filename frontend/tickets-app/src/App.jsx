import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/layout/Layout'
import AuthLayout from './components/layout/AuthLayout'
import TicketListPage from './pages/TicketListPage'
import TicketFormPage from './pages/TicketFormPage'
import TicketDetailPage from './pages/TicketDetailPage'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
// import ProtectedRoute from './routes/ProtectedRoute'
// import { ROLES } from './utils/constants'

function App() {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/registro" element={<RegisterPage />} />
      </Route>

      <Route element={<Layout />}>
        <Route path="/" element={<TicketListPage />} />
        <Route path="/tickets/:id" element={<TicketDetailPage />} />
        {/* Activar ProtectedRoute cuando el backend exponga /api/auth/ */}
        <Route path="/tickets/nuevo" element={<TicketFormPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}

export default App
