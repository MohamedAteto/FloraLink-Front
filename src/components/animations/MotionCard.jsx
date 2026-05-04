import { motion } from 'framer-motion'

// Drop-in replacement for any .card div — adds hover lift + shadow
export default function MotionCard({ children, className, onClick, style, delay = 0 }) {
  return (
    <motion.div
      className={className}
      style={style}
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      whileHover={onClick ? { y: -6, boxShadow: '0 12px 32px rgba(0,0,0,0.13)' } : { y: -4, boxShadow: '0 8px 24px rgba(0,0,0,0.10)' }}
      transition={{ duration: 0.35, ease: 'easeOut', delay }}
    >
      {children}
    </motion.div>
  )
}
