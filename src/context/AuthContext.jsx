import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('fl_token'))
  const [user, setUser] = useState(() => {
    const u = localStorage.getItem('fl_user')
    return u ? JSON.parse(u) : null
  })

  const login = (data) => {
    localStorage.setItem('fl_token', data.token)
    localStorage.setItem('fl_user', JSON.stringify({ id: data.userId, username: data.username, email: data.email }))
    setToken(data.token)
    setUser({ id: data.userId, username: data.username, email: data.email })
  }

  const logout = () => {
    localStorage.removeItem('fl_token')
    localStorage.removeItem('fl_user')
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
