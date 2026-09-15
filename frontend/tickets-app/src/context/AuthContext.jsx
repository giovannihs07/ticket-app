import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import * as authService from '../api/authService'
import { ROLES } from '../utils/constants'

const AuthContext = createContext(null)

const TOKEN_KEY = 'tickets_access_token'
const USER_KEY = 'tickets_user'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem(USER_KEY)
    return stored ? JSON.parse(stored) : null
  })
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY))
  const [loading, setLoading] = useState(!!localStorage.getItem(TOKEN_KEY))

  const persistSession = useCallback((accessToken, userData) => {
    localStorage.setItem(TOKEN_KEY, accessToken)
    localStorage.setItem(USER_KEY, JSON.stringify(userData))
    setToken(accessToken)
    setUser(userData)
  }, [])

  const clearSession = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    setToken(null)
    setUser(null)
  }, [])

  useEffect(() => {
    if (!token) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLoading(false)
      return
    }

    authService.getCurrentUser()
      .then((res) => {
        setUser(res.data)
        localStorage.setItem(USER_KEY, JSON.stringify(res.data))
      })
      .catch(() => clearSession())
      .finally(() => setLoading(false))
  }, [token, clearSession])

  const login = async (credentials) => {
    const res = await authService.login(credentials)
    const accessToken = res.data.access

    // el interceptor de axios (client.js) lee el token de localStorage en cada
    // request, así que hay que guardarlo ANTES de llamar a getCurrentUser()
    localStorage.setItem(TOKEN_KEY, accessToken)
    setToken(accessToken)

    const meRes = await authService.getCurrentUser()
    persistSession(accessToken, meRes.data)
    return meRes.data
  }

  const register = async (data) => {
    // el backend de registro solo crea el usuario, no devuelve tokens:
    // reutilizamos login() con las mismas credenciales para obtener sesión
    await authService.register(data)
    return login({ username: data.username, password: data.password })
  }

  const logout = async () => {
    clearSession()
  }

  const value = useMemo(() => ({
    user,
    token,
    loading,
    isAuthenticated: !!user,
    isAgente: user?.role === ROLES.AGENTE,
    isSolicitante: user?.role === ROLES.SOLICITANTE,
    login,
    register,
    logout,
  }), [user, token, loading, persistSession, clearSession])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider')
  }
  return context
}
