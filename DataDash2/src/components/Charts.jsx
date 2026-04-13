import { useMemo } from 'react'

/**
 * Temperature Bar Chart - Shows temperature comparison across cities
 */
export function TemperatureBarChart({ data }) {
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return []
    return data
      .slice()
      .sort((a, b) => b.temp - a.temp)
      .map(city => ({
        name: city.city_name,
        temp: city.temp,
        color: getTempColor(city.temp)
      }))
  }, [data])

  const maxTemp = Math.max(...chartData.map(d => d.temp), 1)

  if (chartData.length === 0) return null

  return (
    <div className="chart-container">
      <h3>Temperature by City</h3>
      <p className="chart-description">Comparing temperatures across all cities</p>
      <div className="bar-chart">
        {chartData.map((item) => (
          <div key={item.name} className="bar-row">
            <span className="bar-label">{item.name}</span>
            <div className="bar-wrapper">
              <div
                className="bar"
                style={{
                  width: `${(item.temp / maxTemp) * 100}%`,
                  backgroundColor: item.color
                }}
              >
                <span className="bar-value">{item.temp}°C</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/**
 * Weather Conditions Pie Chart - Shows distribution of weather types
 */
export function WeatherPieChart({ data }) {
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return []

    const distribution = data.reduce((acc, city) => {
      const condition = categorizeWeather(city.weather.description)
      acc[condition] = (acc[condition] || 0) + 1
      return acc
    }, {})

    const total = data.length
    return Object.entries(distribution).map(([name, count]) => ({
      name,
      count,
      percentage: ((count / total) * 100).toFixed(1),
      color: getWeatherColor(name)
    }))
  }, [data])

  const totalSegments = chartData.length
  let cumulativePercentage = 0

  if (chartData.length === 0) return null

  return (
    <div className="chart-container">
      <h3>Weather Conditions Distribution</h3>
      <p className="chart-description">Breakdown of weather types across cities</p>
      <div className="pie-chart-wrapper">
        <svg viewBox="0 0 200 200" className="pie-chart">
          {chartData.map((segment, index) => {
            const startAngle = (cumulativePercentage / 100) * 360
            cumulativePercentage += parseFloat(segment.percentage)
            const endAngle = (cumulativePercentage / 100) * 360
            const pathData = describeArc(100, 100, 80, startAngle, endAngle)

            return (
              <path
                key={segment.name}
                d={pathData}
                fill={segment.color}
                stroke="var(--bg)"
                strokeWidth="2"
              />
            )
          })}
          <circle cx="100" cy="100" r="50" fill="var(--bg)" />
        </svg>
        <div className="pie-legend">
          {chartData.map((segment) => (
            <div key={segment.name} className="legend-item">
              <span
                className="legend-color"
                style={{ backgroundColor: segment.color }}
              />
              <span className="legend-label">
                {segment.name}: {segment.count} ({segment.percentage}%)
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/**
 * Humidity vs Temperature Scatter Plot - Shows correlation
 */
export function HumidityTempScatter({ data }) {
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return []
    return data.map(city => ({
      name: city.city_name,
      temp: city.temp,
      humidity: city.rh
    }))
  }, [data])

  const temps = chartData.map(d => d.temp)
  const humidities = chartData.map(d => d.humidity)
  const minTemp = Math.min(...temps) - 5
  const maxTemp = Math.max(...temps) + 5
  const minHumidity = 0
  const maxHumidity = 100

  if (chartData.length === 0) return null

  return (
    <div className="chart-container">
      <h3>Temperature vs Humidity Correlation</h3>
      <p className="chart-description">Exploring the relationship between temperature and humidity</p>
      <div className="scatter-chart">
        <svg viewBox="0 0 400 250" className="scatter-svg">
          {/* Grid lines */}
          {[0, 25, 50, 75, 100].map(h => (
            <line
              key={`h-${h}`}
              x1="50"
              y1={200 - (h / 100) * 150}
              x2="380"
              y2={200 - (h / 100) * 150}
              stroke="var(--border)"
              strokeDasharray="4"
            />
          ))}
          {[0, 10, 20, 30, 40].map((t, i) => (
            <line
              key={`t-${t}`}
              x1={50 + (i / 4) * 330}
              y1="50"
              x2={50 + (i / 4) * 330}
              y2="200"
              stroke="var(--border)"
              strokeDasharray="4"
            />
          ))}

          {/* Data points */}
          {chartData.map((point) => {
            const x = 50 + ((point.temp - minTemp) / (maxTemp - minTemp)) * 330
            const y = 200 - ((point.humidity - minHumidity) / (maxHumidity - minHumidity)) * 150
            return (
              <g key={point.name}>
                <circle
                  cx={x}
                  cy={y}
                  r="8"
                  fill="var(--accent)"
                  fillOpacity="0.7"
                  stroke="var(--accent-border)"
                  strokeWidth="2"
                />
                <title>{point.name}: {point.temp}°C, {point.humidity}% humidity</title>
              </g>
            )
          })}

          {/* Axes */}
          <line x1="50" y1="200" x2="380" y2="200" stroke="var(--text)" strokeWidth="2" />
          <line x1="50" y1="50" x2="50" y2="200" stroke="var(--text)" strokeWidth="2" />

          {/* Labels */}
          <text x="215" y="230" textAnchor="middle" fill="var(--text)">Temperature (°C)</text>
          <text x="15" y="125" textAnchor="middle" fill="var(--text)" transform="rotate(-90 15 125)">Humidity (%)</text>
        </svg>
      </div>
    </div>
  )
}

/**
 * Wind Speed Gauge Chart - Shows wind speed distribution
 */
export function WindSpeedChart({ data }) {
  const windData = useMemo(() => {
    if (!data || data.length === 0) return { calm: 0, breezy: 0, windy: 0, stormy: 0 }

    return data.reduce((acc, city) => {
      const speed = city.wind_spd
      if (speed < 3) acc.calm++
      else if (speed < 8) acc.breezy++
      else if (speed < 15) acc.windy++
      else acc.stormy++
      return acc
    }, { calm: 0, breezy: 0, windy: 0, stormy: 0 })
  }, [data])

  const categories = [
    { name: 'Calm (<3 m/s)', count: windData.calm, color: '#10b981' },
    { name: 'Breezy (3-8 m/s)', count: windData.breezy, color: '#3b82f6' },
    { name: 'Windy (8-15 m/s)', count: windData.windy, color: '#f59e0b' },
    { name: 'Stormy (>15 m/s)', count: windData.stormy, color: '#ef4444' }
  ]

  const maxCount = Math.max(...categories.map(c => c.count), 1)

  return (
    <div className="chart-container">
      <h3>Wind Speed Distribution</h3>
      <p className="chart-description">Cities grouped by wind speed categories</p>
      <div className="wind-chart">
        {categories.map((cat) => (
          <div key={cat.name} className="wind-bar-container">
            <div className="wind-bar-wrapper">
              <div
                className="wind-bar"
                style={{
                  height: `${(cat.count / maxCount) * 100}%`,
                  backgroundColor: cat.color
                }}
              />
            </div>
            <span className="wind-count">{cat.count}</span>
            <span className="wind-label">{cat.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// Helper functions
function getTempColor(temp) {
  if (temp < 0) return '#3b82f6'
  if (temp < 10) return '#06b6d4'
  if (temp < 20) return '#10b981'
  if (temp < 30) return '#f59e0b'
  return '#ef4444'
}

function categorizeWeather(description) {
  const desc = description.toLowerCase()
  if (desc.includes('clear') || desc.includes('sun')) return 'Clear'
  if (desc.includes('cloud')) return 'Cloudy'
  if (desc.includes('rain') || desc.includes('drizzle')) return 'Rain'
  if (desc.includes('snow')) return 'Snow'
  if (desc.includes('thunder') || desc.includes('storm')) return 'Storm'
  return 'Other'
}

function getWeatherColor(condition) {
  const colors = {
    'Clear': '#fbbf24',
    'Cloudy': '#9ca3af',
    'Rain': '#3b82f6',
    'Snow': '#e0f2fe',
    'Storm': '#7c3aed',
    'Other': '#6b7280'
  }
  return colors[condition] || '#6b7280'
}

function describeArc(cx, cy, radius, startAngle, endAngle) {
  const start = polarToCartesian(cx, cy, radius, endAngle)
  const end = polarToCartesian(cx, cy, radius, startAngle)
  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1'

  return [
    'M', cx, cy,
    'L', start.x, start.y,
    'A', radius, radius, 0, largeArcFlag, 0, end.x, end.y,
    'L', cx, cy
  ].join(' ')
}

function polarToCartesian(cx, cy, radius, angleInDegrees) {
  const angleInRadians = (angleInDegrees - 90) * Math.PI / 180
  return {
    x: cx + radius * Math.cos(angleInRadians),
    y: cy + radius * Math.sin(angleInRadians)
  }
}
