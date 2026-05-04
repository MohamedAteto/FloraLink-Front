import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { register as registerApi } from '../services/api'
import { useAuth } from '../context/AuthContext'
import MotionButton from '../components/animations/MotionButton'
import './Auth.css'

export default function Register() {
  const [form, setForm] = useState({ username: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { data } = await registerApi(form)
      login(data)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <motion.div className="auth-card card"
        initial={{ opacity: 0, y: 32, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}>

        <motion.div className="auth-logo"
          animate={{ rotate: [0, -8, 8, -4, 4, 0] }}
          transition={{ delay: 0.5, duration: 0.6 }}>
          🌿 FloraLink
        </motion.div>

        <h1 className="auth-title">Create account</h1>
        <p className="auth-subtitle">Start monitoring your plants today</p>

        {error && (
          <motion.div className="auth-error" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit}>
          {['username', 'email', 'password'].map((field, i) => (
            <motion.div key={field} className="form-group"
              initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 + i * 0.08 }}>
              <label htmlFor={field}>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
              <input
                id={field}
                type={field === 'password' ? 'password' : field === 'email' ? 'email' : 'text'}
                value={form[field]}
                onChange={e => setForm({ ...form, [field]: e.target.value })}
                required
                placeholder={field === 'username' ? 'plantlover' : field === 'email' ? 'you@example.com' : 'Min 6 characters'}
                minLength={field === 'password' ? 6 : undefined}
              />
            </motion.div>
          ))}
          <MotionButton type="submit" className="btn btn-primary auth-submit" disabled={loading}>
            {loading ? 'Creating account…' : 'Create account'}
          </MotionButton>
        </form>

        <p className="auth-link">Already have an account? <Link to="/login">Sign in</Link></p>
      </motion.div>
    </div>
  )
}
