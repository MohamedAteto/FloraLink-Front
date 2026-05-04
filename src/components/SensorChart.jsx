import {
  Chart as ChartJS,
  CategoryScale, LinearScale, PointElement,
  LineElement, Title, Tooltip, Legend, Filler
} from 'chart.js'
import { Line } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler)

export default function SensorChart({ readings, type = 'moisture' }) {
  const sorted = [...readings].sort((a, b) => new Date(a.recordedAt) - new Date(b.recordedAt))
  const labels = sorted.map(r => new Date(r.recordedAt).toLocaleString('en', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }))

  const isMoisture = type === 'moisture'
  const data = {
    labels,
    datasets: [{
      label: isMoisture ? 'Soil Moisture (%)' : 'Temperature (°C)',
      data: sorted.map(r => isMoisture ? r.soilMoisture : r.temperature),
      borderColor: isMoisture ? '#16a34a' : '#f59e0b',
      backgroundColor: isMoisture ? 'rgba(22,163,74,.1)' : 'rgba(245,158,11,.1)',
      fill: true,
      tension: 0.4,
      pointRadius: 3,
      pointHoverRadius: 6
    }]
  }

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: { mode: 'index', intersect: false }
    },
    scales: {
      x: { grid: { display: false }, ticks: { maxTicksLimit: 8, font: { size: 11 } } },
      y: { grid: { color: '#f3f4f6' }, ticks: { font: { size: 11 } } }
    }
  }

  return <Line data={data} options={options} />
}
