import { useEffect, useState } from 'react'
import { getPlants, getReadings } from '../services/api'
import SensorChart from '../components/SensorChart'
import PageTransition from '../components/animations/PageTransition'
import FadeInView from '../components/animations/FadeInView'
import CountUp from '../components/animations/CountUp'
import './Analytics.css'

export default function Analytics() {
  const [plants, setPlants] = useState([])
  const [selected, setSelected] = useState(null)
  const [readings, setReadings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getPlants().then(r => {
      setPlants(r.data)
      if (r.data.length > 0) setSelected(r.data[0].id)
      setLoading(false)
    })
  }, [])

  useEffect(() => {
    if (selected) {
      getReadings(selected, 100).then(r => setReadings(r.data))
    }
  }, [selected])

  if (loading) return <div className="loading">Loading analytics…</div>

  const plant = plants.find(p => p.id === selected)
  const avgMoisture = readings.length ? readings.reduce((s, r) => s + r.soilMoisture, 0) / readings.length : 0
  const avgTemp = readings.length ? readings.reduce((s, r) => s + r.temperature, 0) / readings.length : 0
  const avgHealth = readings.length ? readings.reduce((s, r) => s + r.healthScore, 0) / readings.length : 0

  return (
    <PageTransition>
      <div className="page-header">
        <h1 className="page-title">Analytics</h1>
        <select className="plant-selector" value={selected ?? ''} onChange={e => setSelected(parseInt(e.target.value))}>
          {plants.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
      </div>

      {plant && (
        <div className="analytics-summary grid-4">
          {[
            { label: 'Total Readings', value: readings.length, suffix: '' },
            { label: 'Avg Moisture', value: parseFloat(avgMoisture.toFixed(1)), suffix: '%' },
            { label: 'Avg Temperature', value: parseFloat(avgTemp.toFixed(1)), suffix: '°C' },
            { label: 'Avg Health Score', value: Math.round(avgHealth), suffix: '' },
          ].map((stat, i) => (
            <FadeInView key={stat.label} delay={i * 0.08}>
              <div className="card summary-card">
                <div className="summary-label">{stat.label}</div>
                <div className="summary-value">
                  {readings.length
                    ? <><CountUp value={stat.value} decimals={stat.suffix === '%' || stat.suffix === '°C' ? 1 : 0} />{stat.suffix}</>
                    : '—'}
                </div>
              </div>
            </FadeInView>
          ))}
        </div>
      )}

      <div className="analytics-charts">
        <FadeInView delay={0.1}>
          <div className="card chart-card">
            <h3 className="chart-title">💧 Soil Moisture Over Time</h3>
            {readings.length > 0 ? <SensorChart readings={readings} type="moisture" /> : <p className="no-data">No data available</p>}
          </div>
        </FadeInView>
        <FadeInView delay={0.2}>
          <div className="card chart-card">
            <h3 className="chart-title">🌡️ Temperature Over Time</h3>
            {readings.length > 0 ? <SensorChart readings={readings} type="temperature" /> : <p className="no-data">No data available</p>}
          </div>
        </FadeInView>
      </div>
    </PageTransition>
  )
}
