import { createContext, useContext, useState, useEffect } from 'react'
import apiClient from '../api/client'
import { signIn, signOut } from '../api/auth'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('jwt_token')
    if (token) {
      apiClient.get('/me')
        .then(res => setUser(res.data))
        .catch(() => localStorage.removeItem('jwt_token'))
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (email, password) => {
    await signIn(email, password)
    const res = await apiClient.get('/me')
    setUser(res.data)
  }

  const logout = async () => {
    await signOut()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
