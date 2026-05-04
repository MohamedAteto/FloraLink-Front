import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getPlant, getReadings, getWateringHistory, triggerWatering } from '../services/api'
import HealthRing from '../components/HealthRing'
import SensorChart from '../components/SensorChart'
import MotionButton from '../components/animations/MotionButton'
import MotionCard from '../components/animations/MotionCard'
import CountUp from '../components/animations/CountUp'
import StatusPulse from '../components/animations/StatusPulse'
import FadeInView from '../components/animations/FadeInView'
import PageTransition from '../components/animations/PageTransition'
import { PageLoader } from '../components/animations/Skeleton'
import './PlantDetails.css'

const statusEmoji = { Happy: '😊', OK: '🙂', Thirsty: '😟', Stressed: '😰' }

export default function PlantDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [plant, setPlant] = useState(null)
  const [readings, setReadings] = useState([])
  const [watering, setWatering] = useState([])
  const [loading, setLoading] = useState(true)
  const [watering_loading, setWateringLoading] = useState(false)

  const load = async () => {
    const [p, r, w] = await Promise.all([
      getPlant(id),
      getReadings(id, 50),
      getWateringHistory(id)
    ])
    setPlant(p.data)
    setReadings(r.data)
    setWatering(w.data)
    setLoading(false)
  }

  useEffect(() => { load() }, [id])

  const handleWater = async () => {
    setWateringLoading(true)
    try {
      await triggerWatering({ plantId: parseInt(id), waterAmountMl: 200, notes: 'Manual watering' })
      await load()
    } finally {
      setWateringLoading(false)
    }
  }

  if (loading) return <PageLoader />
  if (!plant) return <div className="loading">Plant not found.</div>

  const status = plant.status ?? 'Unknown'

  return (
    <PageTransition>
      <div>
      <div className="page-header">
        <div className="plant-detail-header">
          <MotionButton className="btn btn-secondary back-btn" onClick={() => navigate('/')}>← Back</MotionButton>
          <div>
            <h1 className="page-title">{plant.name}</h1>
            <span className="plant-type-badge">{plant.plantTypeName}</span>
          </div>
        </div>
        <div className="detail-actions">
          <MotionButton className="btn btn-secondary" onClick={() => navigate(`/diary/${id}`)}>📔 Diary</MotionButton>
          <MotionButton className="btn btn-primary" onClick={handleWater} disabled={watering_loading}>
            {watering_loading ? 'Watering…' : '💧 Water Now'}
          </MotionButton>
        </div>
      </div>

      <div className="detail-top grid-4">
        {[
          { content: <><HealthRing score={plant.healthScore ?? 0} size={72} /><div className="detail-stat-label">Health Score</div></>, delay: 0 },
          { content: <><div className="detail-big">{plant.latestMoisture != null ? <><CountUp value={plant.latestMoisture} decimals={1} />%</> : '—'}</div><div className="detail-stat-label">💧 Soil Moisture</div></>, delay: 0.07 },
          { content: <><div className="detail-big">{plant.latestTemperature != null ? <><CountUp value={plant.latestTemperature} decimals={1} />°C</> : '—'}</div><div className="detail-stat-label">🌡️ Temperature</div></>, delay: 0.14 },
          { content: <><span className={`badge badge-${status.toLowerCase()} status-badge`} style={{ display:'flex', alignItems:'center', gap:6 }}><StatusPulse status={status} />{status}</span><div className="detail-stat-label">Plant Status</div></>, delay: 0.21 },
        ].map((item, i) => (
          <MotionCard key={i} className="card detail-stat" delay={item.delay}>{item.content}</MotionCard>
        ))}
      </div>

      {plant.predictedNextWatering && (
        <FadeInView delay={0.1}>
          <div className="card predicted-watering-banner">
            <span className="predicted-icon">🔮</span>
            <div>
              <div className="predicted-label">Predicted Next Watering</div>
              <div className="predicted-value">{plant.predictedNextWatering}</div>
            </div>
          </div>
        </FadeInView>
      )}

      {plant.plantTypeMinMoisture != null && (
        <FadeInView delay={0.15}>
          <div className="card plant-type-requirements">
            <h3 className="section-title">🌿 {plant.plantTypeName} Requirements</h3>
            <div className="requirements-grid">
              <div className="req-item"><span className="req-icon">💧</span><div><div className="req-label">Moisture Range</div><div className="req-value">{plant.plantTypeMinMoisture}% – {plant.plantTypeMaxMoisture}%</div></div></div>
              <div className="req-item"><span className="req-icon">🌡️</span><div><div className="req-label">Temperature Range</div><div className="req-value">{plant.plantTypeMinTemperature}°C – {plant.plantTypeMaxTemperature}°C</div></div></div>
              <div className="req-item"><span className="req-icon">⚠️</span><div><div className="req-label">Critical Moisture</div><div className="req-value">Below {plant.plantTypeCriticalMoisture}%</div></div></div>
            </div>
          </div>
        </FadeInView>
      )}

      <div className="charts-grid">
        <FadeInView delay={0.1}>
          <div className="card chart-card">
            <h3 className="chart-title">💧 Soil Moisture History</h3>
            {readings.length > 0 ? <SensorChart readings={readings} type="moisture" /> : <p className="no-data">No readings yet</p>}
          </div>
        </FadeInView>
        <FadeInView delay={0.18}>
          <div className="card chart-card">
            <h3 className="chart-title">🌡️ Temperature History</h3>
            {readings.length > 0 ? <SensorChart readings={readings} type="temperature" /> : <p className="no-data">No readings yet</p>}
          </div>
        </FadeInView>
      </div>

      <FadeInView>
        <div className="card watering-history">
          <h3 className="section-title">💧 Watering History</h3>
          {watering.length === 0 ? (
            <p className="no-data">No watering events recorded yet.</p>
          ) : (
            <table className="watering-table">
              <thead><tr><th>Date</th><th>Amount</th><th>Type</th><th>Notes</th></tr></thead>
              <tbody>
                {watering.map(w => (
                  <tr key={w.id}>
                    <td>{new Date(w.wateredAt).toLocaleString()}</td>
                    <td>{w.waterAmountMl} ml</td>
                    <td><span className={`badge ${w.isAutomatic ? 'badge-info' : 'badge-ok'}`}>{w.isAutomatic ? 'Auto' : 'Manual'}</span></td>
                    <td>{w.notes || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </FadeInView>
      </div>
    </PageTransition>
  )
}
