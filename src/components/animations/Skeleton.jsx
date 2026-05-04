import { motion } from 'framer-motion'
import './Skeleton.css'

export function SkeletonLine({ width = '100%', height = 16, style }) {
  return (
    <motion.div
      className="skeleton-line"
      style={{ width, height, borderRadius: 6, ...style }}
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
    />
  )
}

export function SkeletonCard() {
  return (
    <div className="skeleton-card card">
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <div>
          <SkeletonLine width={120} height={18} style={{ marginBottom: 8 }} />
          <SkeletonLine width={80} height={13} />
        </div>
        <SkeletonLine width={56} height={56} style={{ borderRadius: '50%' }} />
      </div>
      <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
        <SkeletonLine width="48%" height={40} />
        <SkeletonLine width="48%" height={40} />
      </div>
      <SkeletonLine width={90} height={24} style={{ borderRadius: 999 }} />
    </div>
  )
}

export function PageLoader() {
  return (
    <div className="page-loader">
      <motion.div
        className="loader-ring"
        animate={{ rotate: 360 }}
        transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }}
      />
      <motion.p
        className="loader-text"
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 1.6, repeat: Infinity }}
      >
        Loading…
      </motion.p>
    </div>
  )
}
