import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getPlants, getAlerts } from '../services/api'
import { useAuth } from '../context/AuthContext'
import PlantCard from '../components/PlantCard'
import AlertBanner from '../components/AlertBanner'
import MotionButton from '../components/animations/MotionButton'
import MotionCard from '../components/animations/MotionCard'
import CountUp from '../components/animations/CountUp'
import PageTransition from '../components/animations/PageTransition'
import { SkeletonCard } from '../components/animations/Skeleton'
import './Dashboard.css'

const statsList = (stats) => [
  { icon: '🌿', value: stats.total,      label: 'Total Plants' },
  { icon: '😊', value: stats.happy,      label: 'Happy Plants' },
  { icon: '💧', value: stats.needsWater, label: 'Need Water' },
  { icon: '❤️', value: stats.avgHealth,  label: 'Avg Health Score' },
]

export default function Dashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [plants, setPlants] = useState([])
  const [alerts, setAlerts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getPlants(), getAlerts()])
      .then(([p, a]) => { setPlants(p.data); setAlerts(a.data) })
      .finally(() => setLoading(false))
  }, [])

  const stats = {
    total:      plants.length,
    happy:      plants.filter(p => p.status === 'Happy').length,
    needsWater: plants.filter(p => p.status === 'Thirsty' || p.status === 'Stressed').length,
    avgHealth:  plants.length ? Math.round(plants.reduce((s, p) => s + (p.healthScore ?? 0), 0) / plants.length) : 0
  }

  return (
    <PageTransition>
      <div className="page-header">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="page-title">Good day, {user?.username} 🌱</h1>
          <p className="page-subtitle">Here's how your plants are doing</p>
        </motion.div>
        <MotionButton className="btn btn-primary" onClick={() => navigate('/plants/add')}>
          + Add Plant
        </MotionButton>
      </div>

      <AlertBanner alerts={alerts} onDismiss={id => setAlerts(prev => prev.filter(a => a.id !== id))} />

      {/* Stats row */}
      <div className="stats-row grid-4">
        {statsList(stats).map((s, i) => (
          <MotionCard key={s.label} className="stat-card card" delay={i * 0.07}>
            <div className="stat-card-icon">{s.icon}</div>
            <div className="stat-card-value">
              <CountUp value={s.value} duration={1.0} />
            </div>
            <div className="stat-card-label">{s.label}</div>
          </MotionCard>
        ))}
      </div>

      {/* Plant cards */}
      {loading ? (
        <div className="grid-3">
          {[1,2,3].map(i => <SkeletonCard key={i} />)}
        </div>
      ) : plants.length === 0 ? (
        <motion.div
          className="empty-state card"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <div className="empty-icon">🪴</div>
          <h3>No plants yet</h3>
          <p>Add your first plant to start monitoring</p>
          <MotionButton className="btn btn-primary" onClick={() => navigate('/plants/add')}>
            Add Plant
          </MotionButton>
        </motion.div>
      ) : (
        <div className="grid-3">
          {plants.map((plant, i) => <PlantCard key={plant.id} plant={plant} index={i} />)}
        </div>
      )}
    </PageTransition>
  )
}
