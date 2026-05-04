import { useNavigate } from 'react-router-dom'
import HealthRing from './HealthRing'
import MotionCard from './animations/MotionCard'
import CountUp from './animations/CountUp'
import StatusPulse from './animations/StatusPulse'
import './PlantCard.css'

const statusEmoji = { Happy: '😊', OK: '🙂', Thirsty: '😟', Stressed: '😰' }

export default function PlantCard({ plant, index = 0 }) {
  const navigate = useNavigate()
  const score = plant.healthScore ?? 0
  const status = plant.status ?? 'Unknown'

  return (
    <MotionCard
      className="plant-card card"
      onClick={() => navigate(`/plants/${plant.id}`)}
      style={{ cursor: 'pointer' }}
      delay={index * 0.08}
    >
      <div className="plant-card-header">
        <div>
          <h3 className="plant-name">{plant.name}</h3>
          <span className="plant-type">{plant.plantTypeName}</span>
        </div>
        <HealthRing score={score} size={56} />
      </div>

      <div className="plant-stats">
        <div className="stat">
          <span className="stat-icon">💧</span>
          <div>
            <div className="stat-value">
              {plant.latestMoisture != null
                ? <><CountUp value={plant.latestMoisture} decimals={1} />%</>
                : '—'}
            </div>
            <div className="stat-label">Moisture</div>
          </div>
        </div>
        <div className="stat">
          <span className="stat-icon">🌡️</span>
          <div>
            <div className="stat-value">
              {plant.latestTemperature != null
                ? <><CountUp value={plant.latestTemperature} decimals={1} />°C</>
                : '—'}
            </div>
            <div className="stat-label">Temperature</div>
          </div>
        </div>
      </div>

      <div className="plant-card-footer">
        <span className={`badge badge-${status.toLowerCase()}`} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <StatusPulse status={status} />
          {statusEmoji[status] || '🌱'} {status}
        </span>
        {plant.predictedNextWatering && (
          <span className="next-watering">💧 {plant.predictedNextWatering}</span>
        )}
      </div>
    </MotionCard>
  )
}
