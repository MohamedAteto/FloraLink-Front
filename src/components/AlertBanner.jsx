import { motion, AnimatePresence } from 'framer-motion'
import { markAlertRead } from '../services/api'
import './AlertBanner.css'

export default function AlertBanner({ alerts, onDismiss }) {
  if (!alerts?.length) return null

  const handleDismiss = async (id) => {
    await markAlertRead(id)
    onDismiss(id)
  }

  return (
    <div className="alert-list">
      <AnimatePresence initial={false}>
        {alerts.slice(0, 5).map(alert => (
          <motion.div
            key={alert.id}
            className={`alert-item alert-${alert.severity.toLowerCase()}`}
            initial={{ opacity: 0, y: -12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 60, scale: 0.95 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            layout>
            <span className="alert-icon">
              {alert.severity === 'Critical' ? '🚨' : alert.severity === 'Warning' ? '⚠️' : 'ℹ️'}
            </span>
            <div className="alert-content">
              <span className="alert-plant">{alert.plantName}</span>
              <span className="alert-msg">{alert.message}</span>
            </div>
            <motion.button
              className="alert-dismiss"
              onClick={() => handleDismiss(alert.id)}
              aria-label="Dismiss alert"
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}>
              ✕
            </motion.button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
