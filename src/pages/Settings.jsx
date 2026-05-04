import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { getPlants, deletePlant } from '../services/api'
import { useAuth } from '../context/AuthContext'
import PageTransition from '../components/animations/PageTransition'
import MotionButton from '../components/animations/MotionButton'
import FadeInView from '../components/animations/FadeInView'

export default function Settings() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [plants, setPlants] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(null)
  const [confirmId, setConfirmId] = useState(null)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    getPlants().then(r => { setPlants(r.data); setLoading(false) })
  }, [])

  const handleDelete = async (id) => {
    setDeleting(id)
    try {
      await deletePlant(id)
      setPlants(prev => prev.filter(p => p.id !== id))
      setMsg('Plant removed successfully.')
      setTimeout(() => setMsg(''), 3000)
    } catch {
      setMsg('Failed to delete plant.')
    } finally {
      setDeleting(null)
      setConfirmId(null)
    }
  }

  const handleLogout = () => { logout(); navigate('/login') }

  return (
    <PageTransition>
      <div className="page-header">
        <h1 className="page-title">⚙️ Settings</h1>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 700 }}>

        {/* General Settings */}
        <FadeInView>
          <div className="card">
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, color: 'var(--gray-800)' }}>
              👤 General
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--gray-100)' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>Username</div>
                  <div style={{ color: 'var(--gray-500)', fontSize: 13 }}>{user?.username}</div>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--gray-100)' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>Email</div>
                  <div style={{ color: 'var(--gray-500)', fontSize: 13 }}>{user?.email}</div>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>Add New Plant</div>
                  <div style={{ color: 'var(--gray-500)', fontSize: 13 }}>Register a new plant with sensor</div>
                </div>
                <MotionButton className="btn btn-primary" onClick={() => navigate('/plants/add')} style={{ fontSize: 13 }}>
                  ➕ Add Plant
                </MotionButton>
              </div>
            </div>
          </div>
        </FadeInView>

        {/* Manage Plants */}
        <FadeInView delay={0.1}>
          <div className="card">
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4, color: 'var(--gray-800)' }}>
              🌱 Manage Plants
            </h3>
            <p style={{ fontSize: 13, color: 'var(--gray-500)', marginBottom: 16 }}>
              Remove plants you no longer want to monitor.
            </p>

            <AnimatePresence>
              {msg && (
                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  style={{ padding: '10px 14px', borderRadius: 8, background: msg.includes('success') ? 'var(--green-100)' : '#fee2e2', color: msg.includes('success') ? 'var(--green-700)' : '#991b1b', fontSize: 13, marginBottom: 12 }}>
                  {msg}
                </motion.div>
              )}
            </AnimatePresence>

            {loading ? (
              <p style={{ color: 'var(--gray-400)', fontSize: 14 }}>Loading plants…</p>
            ) : plants.length === 0 ? (
              <p style={{ color: 'var(--gray-400)', fontSize: 14 }}>No plants found.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <AnimatePresence>
                  {plants.map(plant => (
                    <motion.div key={plant.id}
                      initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 40, scale: 0.95 }}
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', background: 'var(--gray-50)', borderRadius: 8, border: '1px solid var(--gray-200)' }}>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 14 }}>{plant.name}</div>
                        <div style={{ fontSize: 12, color: 'var(--gray-500)' }}>{plant.plantTypeName} · {plant.sensorId}</div>
                      </div>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        {confirmId === plant.id ? (
                          <>
                            <span style={{ fontSize: 12, color: 'var(--gray-600)' }}>Sure?</span>
                            <MotionButton className="btn btn-danger" style={{ fontSize: 12, padding: '6px 12px' }}
                              onClick={() => handleDelete(plant.id)} disabled={deleting === plant.id}>
                              {deleting === plant.id ? '…' : 'Yes, delete'}
                            </MotionButton>
                            <MotionButton className="btn btn-secondary" style={{ fontSize: 12, padding: '6px 12px' }}
                              onClick={() => setConfirmId(null)}>
                              Cancel
                            </MotionButton>
                          </>
                        ) : (
                          <MotionButton className="btn btn-danger" style={{ fontSize: 12, padding: '6px 12px' }}
                            onClick={() => setConfirmId(plant.id)}>
                            🗑 Remove
                          </MotionButton>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </FadeInView>

        {/* Danger Zone */}
        <FadeInView delay={0.2}>
          <div className="card" style={{ border: '1px solid #fecaca' }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4, color: '#dc2626' }}>
              ⚠️ Account
            </h3>
            <p style={{ fontSize: 13, color: 'var(--gray-500)', marginBottom: 16 }}>
              Sign out from your account.
            </p>
            <MotionButton className="btn btn-danger" onClick={handleLogout}>
              Sign out
            </MotionButton>
          </div>
        </FadeInView>

      </div>
    </PageTransition>
  )
}
