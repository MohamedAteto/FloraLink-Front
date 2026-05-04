import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { createPlant, getPlantTypes, lookupPlantType } from '../services/api'
import MotionButton from '../components/animations/MotionButton'
import PageTransition from '../components/animations/PageTransition'
import FadeInView from '../components/animations/FadeInView'
import './AddPlant.css'

export default function AddPlant() {
  const navigate = useNavigate()
  const [plantTypes, setPlantTypes] = useState([])
  const [form, setForm] = useState({ name: '', sensorId: '', plantTypeId: '' })
  const [customName, setCustomName] = useState('')
  const [useCustom, setUseCustom] = useState(false)
  const [aiLoading, setAiLoading] = useState(false)
  const [aiResult, setAiResult] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const debounceRef = useRef(null)

  useEffect(() => { getPlantTypes().then(r => setPlantTypes(r.data)) }, [])

  // Group plant types by category for the dropdown
  const grouped = plantTypes.reduce((acc, t) => {
    const cat = t.category || 'Other'
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(t)
    return acc
  }, {})

  // When user types a custom plant name, debounce AI lookup
  const handleCustomNameChange = (e) => {
    const val = e.target.value
    setCustomName(val)
    setAiResult(null)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (val.trim().length < 3) return
    debounceRef.current = setTimeout(async () => {
      setAiLoading(true)
      try {
        const res = await lookupPlantType(val.trim())
        if (!res.data || res.data.found === false) {
          setAiResult(null)
          return
        }
        setAiResult(res.data)
        setPlantTypes(prev =>
          prev.find(t => t.id === res.data.id) ? prev : [...prev, res.data]
        )
        setForm(f => ({ ...f, plantTypeId: String(res.data.id) }))
      } catch {
        setAiResult(null)
      } finally {
        setAiLoading(false)
      }
    }, 800)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await createPlant({ ...form, plantTypeId: parseInt(form.plantTypeId) })
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add plant')
    } finally {
      setLoading(false)
    }
  }

  const selectedType = aiResult?.id === parseInt(form.plantTypeId)
    ? aiResult
    : plantTypes.find(t => t.id === parseInt(form.plantTypeId))

  return (
    <PageTransition>
      <div className="add-plant-page">
        <div className="page-header">
          <h1 className="page-title">Add New Plant</h1>
          <MotionButton className="btn btn-secondary" onClick={() => navigate('/')}>← Cancel</MotionButton>
        </div>

        <div className="add-plant-layout">
          <FadeInView>
            <div className="card add-plant-form">
              <AnimatePresence>
                {error && (
                  <motion.div className="auth-error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="name">Plant Name</label>
                  <input id="name" type="text" value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    required placeholder="e.g. My Cactus" />
                </div>

                <div className="form-group">
                  <label htmlFor="sensorId">Sensor ID</label>
                  <input id="sensorId" type="text" value={form.sensorId}
                    onChange={e => setForm({ ...form, sensorId: e.target.value })}
                    required placeholder="e.g. ESP32-001" />
                </div>

                <div className="form-group">
                  <label>Plant Type</label>
                  <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                    <button type="button"
                      className={`btn ${!useCustom ? 'btn-primary' : 'btn-secondary'}`}
                      style={{ flex: 1, fontSize: 13 }}
                      onClick={() => { setUseCustom(false); setAiResult(null); setCustomName('') }}>
                      📋 Choose from list
                    </button>
                    <button type="button"
                      className={`btn ${useCustom ? 'btn-primary' : 'btn-secondary'}`}
                      style={{ flex: 1, fontSize: 13 }}
                      onClick={() => { setUseCustom(true); setForm(f => ({ ...f, plantTypeId: '' })) }}>
                      🤖 AI lookup
                    </button>
                  </div>

                  {!useCustom ? (
                    <select id="plantTypeId" value={form.plantTypeId}
                      onChange={e => setForm({ ...form, plantTypeId: e.target.value })} required>
                      <option value="">Select a plant type…</option>
                      {Object.entries(grouped).map(([cat, types]) => (
                        <optgroup key={cat} label={cat}>
                          {types.map(t => (
                            <option key={t.id} value={t.id}>{t.emoji} {t.name}</option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                  ) : (
                    <div>
                      <input type="text" value={customName}
                        onChange={handleCustomNameChange}
                        placeholder="Type any plant name… AI will find requirements"
                        style={{ width: '100%' }} />
                      {aiLoading && (
                        <motion.p animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.2 }}
                          style={{ fontSize: 13, color: 'var(--primary)', marginTop: 6 }}>
                          🤖 Looking up plant requirements…
                        </motion.p>
                      )}
                      {aiResult && !aiLoading && (
                        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                          style={{ fontSize: 13, color: 'var(--success)', marginTop: 6 }}>
                          ✅ {aiResult.isAIGenerated ? 'AI generated' : 'Found in database'}: {aiResult.name}
                        </motion.p>
                      )}
                      {/* Hidden select to satisfy form validation */}
                      <input type="hidden" name="plantTypeId" value={form.plantTypeId} required />
                    </div>
                  )}
                </div>

                <MotionButton type="submit" className="btn btn-primary"
                  style={{ width: '100%', justifyContent: 'center' }}
                  disabled={loading || aiLoading || !form.plantTypeId}>
                  {loading ? 'Adding…' : '🌱 Add Plant'}
                </MotionButton>
              </form>
            </div>
          </FadeInView>

          <AnimatePresence>
            {selectedType && (
              <FadeInView delay={0.1}>
                <div className="card plant-type-info">
                  <h3 className="type-info-title">
                    {selectedType.emoji} {selectedType.name} Requirements
                    {selectedType.isAIGenerated && (
                      <span style={{ fontSize: 11, background: 'var(--primary)', color: '#fff', borderRadius: 4, padding: '2px 6px', marginLeft: 8 }}>AI</span>
                    )}
                  </h3>
                  <p className="type-desc">{selectedType.description}</p>
                  <div className="type-ranges">
                    <div className="range-item"><span>💧 Moisture</span><span>{selectedType.minMoisture}% – {selectedType.maxMoisture}%</span></div>
                    <div className="range-item"><span>🌡️ Temperature</span><span>{selectedType.minTemperature}°C – {selectedType.maxTemperature}°C</span></div>
                    <div className="range-item"><span>💦 Watering</span><span>{selectedType.wateringFrequency}</span></div>
                    <div className="range-item critical"><span>⚠️ Critical Moisture</span><span>Below {selectedType.criticalMoistureThreshold}%</span></div>
                  </div>
                </div>
              </FadeInView>
            )}
          </AnimatePresence>
        </div>
      </div>
    </PageTransition>
  )
}
