import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import MotionButton from './animations/MotionButton'
import './Layout.css'

export default function Layout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => { logout(); navigate('/login') }

  return (
    <div className="layout">
      <motion.aside
        className="sidebar"
        initial={{ x: -60, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        <div className="sidebar-logo">
          <motion.span
            className="logo-icon"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity, repeatDelay: 4 }}
          >🌿</motion.span>
          <span className="logo-text">
            <span style={{ color: '#4ade80' }}>Flora</span>
            <span style={{ background: 'linear-gradient(135deg,#fb923c,#fbbf24)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>Link</span>
          </span>
        </div>

        <nav className="sidebar-nav">
          {[
            { to: '/', icon: '🏠', label: 'Dashboard', end: true },
            { to: '/analytics', icon: '📊', label: 'Analytics' },
            { to: '/settings', icon: '⚙️', label: 'Settings' },
          ].map(({ to, icon, label, end }) => (
            <NavLink key={to} to={to} end={end}
              className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
            >
              {({ isActive }) => (
                <motion.span
                  style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%' }}
                  whileHover={{ x: 4 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                >
                  <span>{icon}</span> {label}
                  {isActive && (
                    <motion.span
                      className="nav-active-bar"
                      layoutId="activeBar"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </motion.span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <motion.div
              className="user-avatar"
              whileHover={{ scale: 1.1 }}
              transition={{ type: 'spring', stiffness: 400 }}
            >
              {user?.username?.[0]?.toUpperCase()}
            </motion.div>
            <div>
              <div className="user-name">{user?.username}</div>
              <div className="user-email">{user?.email}</div>
            </div>
          </div>
          <MotionButton className="btn btn-secondary logout-btn" onClick={handleLogout}>
            Sign out
          </MotionButton>
        </div>
      </motion.aside>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  )
}
