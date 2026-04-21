import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Review from './pages/Review'
import AddWord from './pages/AddWord'
import Vocabulary from './pages/Vocabulary'
import Lessons from './pages/Lessons'
import Import from './pages/Import'

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="flex items-center justify-center h-screen text-sm text-gray-400">Chargement...</div>
  if (!user) return <Navigate to="/login" replace />
  return children
}

function AppRoutes() {
  const { user, loading } = useAuth()
  if (loading) return <div className="flex items-center justify-center h-screen text-sm text-gray-400">Chargement...</div>

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
      <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/reviser" element={<ProtectedRoute><Review /></ProtectedRoute>} />
      <Route path="/ajouter" element={<ProtectedRoute><AddWord /></ProtectedRoute>} />
      <Route path="/vocabulaire" element={<ProtectedRoute><Vocabulary /></ProtectedRoute>} />
      <Route path="/lecons" element={<ProtectedRoute><Lessons /></ProtectedRoute>} />
      <Route path="/import" element={<ProtectedRoute><Import /></ProtectedRoute>} />
    </Routes>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  )
}
