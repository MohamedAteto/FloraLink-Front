import { useEffect, useState } from 'react'
import { getLatestReading } from '../services/api'
import './LiveSensorCard.css'

const STATUS_CONFIG = {
  Happy:    { emoji: '😊', color: '#16a34a', label: 'Happy' },
  OK:       { emoji: '👍', color: '#2563eb', label: 'OK' },
  Thirsty:  { emoji: '💧', color: '#d97706', label: 'Thirsty' },
  Stressed: { emoji: '⚠️', color: '#dc2626', label: 'Stressed' },
}

export default function LiveSensorCard({ plantId, plantName }) {
  const [data, setData]       = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(false)
  const [pulse, setPulse]     = useState(false)

  useEffect(() => {
    let mounted = true

    const fetchLatest = () => {
      getLatestReading(plantId)
        .then(res => {
          if (!mounted) return
          setData(res.data)
          setError(false)
          setLoading(false)
          // briefly flash the card to signal a new reading
          setPulse(true)
          setTimeout(() => setPulse(false), 600)
        })
        .catch(() => {
          if (!mounted) return
          setError(true)
          setLoading(false)
        })
    }

    fetchLatest()
    const timer = setInterval(fetchLatest, 10_000)
    return () => { mounted = false; clearInterval(timer) }
  }, [plantId])

  if (loading) return <div className="lsc-card lsc-loading">Loading sensor data…</div>
  if (error)   return <div className="lsc-card lsc-error">⚠️ No sensor data available</div>

  const status = STATUS_CONFIG[data.plantStatus] ?? STATUS_CONFIG.OK
  const health = Math.round(data.healthScore)
  const ringColor = health >= 80 ? '#16a34a' : health >= 60 ? '#2563eb' : health >= 40 ? '#d97706' : '#dc2626'
  const timestamp = new Date(data.recordedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })

  return (
    <div className={`lsc-card ${pulse ? 'lsc-pulse' : ''}`}>
      <div className="lsc-header">
        <span className="lsc-title">📡 Live Sensor</span>
        <span className="lsc-dot" title="Live" />
      </div>

      <div className="lsc-ring-row">
        <svg className="lsc-ring" viewBox="0 0 36 36">
          <path className="lsc-ring-bg"
            d="M18 2.5 a15.5 15.5 0 0 1 0 31 a15.5 15.5 0 0 1 0-31"
            fill="none" strokeWidth="3" />
          <path className="lsc-ring-fill"
            d="M18 2.5 a15.5 15.5 0 0 1 0 31 a15.5 15.5 0 0 1 0-31"
            fill="none" strokeWidth="3"
            stroke={ringColor}
            strokeDasharray={`${health * 0.97} 100`}
            strokeLinecap="round" />
          <text x="18" y="20.5" className="lsc-ring-text">{health}</text>
        </svg>
        <div className="lsc-status-block">
          <span className="lsc-status-emoji">{status.emoji}</span>
          <span className="lsc-status-label" style={{ color: status.color }}>{status.label}</span>
        </div>
      </div>

      <div className="lsc-metrics">
        <div className="lsc-metric">
          <span className="lsc-metric-icon">💧</span>
          <div>
            <div className="lsc-metric-value">{data.soilMoisture.toFixed(1)}%</div>
            <div className="lsc-metric-label">Moisture</div>
          </div>
        </div>
        <div className="lsc-metric">
          <span className="lsc-metric-icon">🌡️</span>
          <div>
            <div className="lsc-metric-value">{data.temperature.toFixed(1)}°C</div>
            <div className="lsc-metric-label">Temperature</div>
          </div>
        </div>
      </div>

      <div className="lsc-footer">
        <span>🕐 Updated {timestamp}</span>
        <span>Refreshes every 10s</span>
      </div>
    </div>
  )
}
