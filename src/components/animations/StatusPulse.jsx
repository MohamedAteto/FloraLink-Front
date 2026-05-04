import { motion } from 'framer-motion'

const colors = {
  Happy:    '#22c55e',
  OK:       '#84cc16',
  Thirsty:  '#f59e0b',
  Stressed: '#ef4444',
  Unknown:  '#94a3b8'
}

export default function StatusPulse({ status }) {
  const color = colors[status] || colors.Unknown
  return (
    <span style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
      {/* Pulse ring */}
      <motion.span
        style={{
          position: 'absolute', width: 12, height: 12, borderRadius: '50%',
          background: color, opacity: 0.35
        }}
        animate={{ scale: [1, 2.2, 1], opacity: [0.35, 0, 0.35] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      />
      {/* Solid dot */}
      <span style={{ width: 10, height: 10, borderRadius: '50%', background: color, display: 'inline-block', flexShrink: 0 }} />
    </span>
  )
}
