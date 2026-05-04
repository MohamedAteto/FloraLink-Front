import { useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'

export default function CountUp({ value, duration = 1.2, decimals = 0, suffix = '' }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (!isInView) return
    const start = 0
    const end = parseFloat(value) || 0
    const steps = Math.ceil(duration * 60)
    let step = 0

    const timer = setInterval(() => {
      step++
      const progress = step / steps
      // ease-out curve
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(parseFloat((start + (end - start) * eased).toFixed(decimals)))
      if (step >= steps) { setDisplay(end); clearInterval(timer) }
    }, 1000 / 60)

    return () => clearInterval(timer)
  }, [isInView, value, duration, decimals])

  return <span ref={ref}>{display.toFixed(decimals)}{suffix}</span>
}
