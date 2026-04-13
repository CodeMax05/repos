import { useParams, Link } from 'react-router-dom'
import { useMemo } from 'react'

/**
 * DetailView component - Displays detailed weather information for a specific city
 * Uses useParams() hook to extract the city name from the URL
 * Includes extra information not shown in the dashboard view
 */
export function DetailView({ weatherData }) {
  // Extract city name from URL parameters using useParams()
  const { cityName } = useParams()

  // Find the city data based on the URL parameter
  const cityData = useMemo(() => {
    if (!cityName || !weatherData || weatherData.length === 0) return null

    return weatherData.find(
      (city) => city.city_name.toLowerCase() === cityName.toLowerCase()
    )
  }, [cityName, weatherData])

  // Handle case where city is not found
  if (!cityData) {
    return (
      <div className="detail-view">
        <div className="detail-header">
          <Link to="/" className="back-link">← Back to Dashboard</Link>
        </div>
        <div className="detail-content error">
          <h2>City Not Found</h2>
          <p>Sorry, we couldn't find weather data for "{cityName}".</p>
          <p>The city may not be in our tracking list, or the data may still be loading.</p>
        </div>
      </div>
    )
  }

  // Determine temperature color for visual indication
  const getTempColor = (temp) => {
    if (temp < 0) return '#3b82f6'
    if (temp < 10) return '#06b6d4'
    if (temp < 20) return '#10b981'
    if (temp < 30) return '#f59e0b'
    return '#ef4444'
  }

  // Determine UV index warning level
  const getUVWarning = (uv) => {
    if (uv <= 2) return { level: 'Low', color: '#10b981' }
    if (uv <= 5) return { level: 'Moderate', color: '#f59e0b' }
    if (uv <= 7) return { level: 'High', color: '#f97316' }
    if (uv <= 10) return { level: 'Very High', color: '#ef4444' }
    return { level: 'Extreme', color: '#7c3aed' }
  }

  // Determine wind description
  const getWindDescription = (speed) => {
    if (speed < 1) return 'Calm'
    if (speed < 4) return 'Light breeze'
    if (speed < 8) return 'Moderate breeze'
    if (speed < 12) return 'Fresh breeze'
    if (speed < 18) return 'Strong breeze'
    if (speed < 25) return 'Strong wind'
    return 'Storm'
  }

  // Get AQI description
  const getAQIDescription = (aqi) => {
    if (aqi <= 50) return { text: 'Good', color: '#10b981' }
    if (aqi <= 100) return { text: 'Moderate', color: '#f59e0b' }
    if (aqi <= 150) return { text: 'Unhealthy for Sensitive Groups', color: '#f97316' }
    if (aqi <= 200) return { text: 'Unhealthy', color: '#ef4444' }
    if (aqi <= 300) return { text: 'Very Unhealthy', color: '#7c3aed' }
    return { text: 'Hazardous', color: '#7f1d1d' }
  }

  const tempColor = getTempColor(cityData.temp)
  const uvInfo = getUVWarning(cityData.uv)
  const windDesc = getWindDescription(cityData.wind_spd)
  const aqiInfo = cityData.aqi ? getAQIDescription(cityData.aqi) : null

  return (
    <div className="detail-view">
      {/* Header with back button and unique URL display */}
      <div className="detail-header">
        <Link to="/" className="back-link">← Back to Dashboard</Link>
        <div className="url-display">
          <span className="url-label">Direct URL:</span>
          <code className="url-value">{window.location.origin}/city/{encodeURIComponent(cityData.city_name.toLowerCase())}</code>
        </div>
      </div>

      <div className="detail-content">
        {/* City Name and Country */}
        <div className="detail-hero">
          <h1>{cityData.city_name}</h1>
          <span className="detail-country">{cityData.country_code}</span>
          <div className="detail-datetime">
            <span>Last updated: {new Date(cityData.ob_time).toLocaleString()}</span>
            <span>Timezone: {cityData.timezone}</span>
          </div>
        </div>

        {/* Main Weather Display */}
        <div className="detail-main-weather">
          <div className="detail-weather-icon-section">
            <img
              src={`https://cdn.weatherbit.io/static/img/icons/${cityData.weather.icon}.png`}
              alt={cityData.weather.description}
              className="detail-weather-icon"
            />
            <span className="detail-weather-description">
              {cityData.weather.description}
            </span>
          </div>

          <div className="detail-temperature" style={{ color: tempColor }}>
            <span className="detail-temp-value">{cityData.temp}°C</span>
            <span className="detail-feels-like">Feels like {cityData.app_temp}°C</span>
          </div>
        </div>

        {/* Detailed Statistics Grid */}
        <div className="detail-stats-section">
          <h2>Detailed Weather Information</h2>
          <div className="detail-stats-grid">
            {/* Basic Info */}
            <div className="detail-stat-card">
              <h3>🌡️ Temperature</h3>
              <div className="detail-stat-content">
                <div className="stat-row">
                  <span>Current:</span>
                  <span style={{ color: tempColor, fontWeight: 600 }}>{cityData.temp}°C</span>
                </div>
                <div className="stat-row">
                  <span>Feels Like:</span>
                  <span>{cityData.app_temp}°C</span>
                </div>
                {cityData.dewpt && (
                  <div className="stat-row">
                    <span>Dew Point:</span>
                    <span>{cityData.dewpt}°C</span>
                  </div>
                )}
              </div>
            </div>

            {/* Humidity & Precipitation */}
            <div className="detail-stat-card">
              <h3>💧 Humidity & Precipitation</h3>
              <div className="detail-stat-content">
                <div className="stat-row">
                  <span>Relative Humidity:</span>
                  <span>{cityData.rh}%</span>
                </div>
                {cityData.precip !== undefined && (
                  <div className="stat-row">
                    <span>Precipitation:</span>
                    <span>{cityData.precip} mm</span>
                  </div>
                )}
                {cityData.clouds !== undefined && (
                  <div className="stat-row">
                    <span>Cloud Coverage:</span>
                    <span>{cityData.clouds}%</span>
                  </div>
                )}
              </div>
            </div>

            {/* Wind Information */}
            <div className="detail-stat-card">
              <h3>💨 Wind</h3>
              <div className="detail-stat-content">
                <div className="stat-row">
                  <span>Speed:</span>
                  <span>{cityData.wind_spd.toFixed(2)} m/s</span>
                </div>
                <div className="stat-row">
                  <span>Direction:</span>
                  <span>{cityData.wind_cdir} ({cityData.wind_dir}°)</span>
                </div>
                {cityData.wind_gust_spd && (
                  <div className="stat-row">
                    <span>Gust Speed:</span>
                    <span>{cityData.wind_gust_spd} m/s</span>
                  </div>
                )}
                <div className="stat-row">
                  <span>Description:</span>
                  <span>{windDesc}</span>
                </div>
              </div>
            </div>

            {/* Pressure & Visibility */}
            <div className="detail-stat-card">
              <h3>🌫️ Pressure & Visibility</h3>
              <div className="detail-stat-content">
                <div className="stat-row">
                  <span>Pressure:</span>
                  <span>{cityData.pres} mb</span>
                </div>
                {cityData.slp !== undefined && (
                  <div className="stat-row">
                    <span>Sea Level Pressure:</span>
                    <span>{cityData.slp} mb</span>
                  </div>
                )}
                {cityData.vis !== undefined && (
                  <div className="stat-row">
                    <span>Visibility:</span>
                    <span>{cityData.vis} km</span>
                  </div>
                )}
              </div>
            </div>

            {/* Solar Information */}
            <div className="detail-stat-card">
              <h3>☀️ Solar & UV</h3>
              <div className="detail-stat-content">
                <div className="stat-row">
                  <span>UV Index:</span>
                  <span style={{ color: uvInfo.color, fontWeight: 600 }}>
                    {cityData.uv} ({uvInfo.level})
                  </span>
                </div>
                {cityData.sunrise && (
                  <div className="stat-row">
                    <span>Sunrise:</span>
                    <span>{cityData.sunrise}</span>
                  </div>
                )}
                {cityData.sunset && (
                  <div className="stat-row">
                    <span>Sunset:</span>
                    <span>{cityData.sunset}</span>
                  </div>
                )}
                {cityData.dni !== undefined && (
                  <div className="stat-row">
                    <span>Solar Radiation:</span>
                    <span>{cityData.dni} W/m²</span>
                  </div>
                )}
              </div>
            </div>

            {/* Air Quality */}
            {aqiInfo && (
              <div className="detail-stat-card">
                <h3>🏭 Air Quality</h3>
                <div className="detail-stat-content">
                  <div className="stat-row">
                    <span>AQI (US EPA):</span>
                    <span style={{ color: aqiInfo.color, fontWeight: 600 }}>
                      {cityData.aqi} - {aqiInfo.text}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Location Coordinates */}
            <div className="detail-stat-card full-width">
              <h3>📍 Location</h3>
              <div className="detail-stat-content">
                <div className="stat-row">
                  <span>Latitude:</span>
                  <span>{cityData.lat}°</span>
                  <span>Longitude:</span>
                  <span>{cityData.lon}°</span>
                  <span>Elevation:</span>
                  <span>{cityData.elevation}m</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Share Link Section */}
        <div className="detail-share">
          <h3>🔗 Share This Location</h3>
          <p>Anyone can view this weather data using this direct link:</p>
          <div className="share-url-box">
            <code>{window.location.origin}/city/{encodeURIComponent(cityData.city_name.toLowerCase())}</code>
            <button
              className="copy-button"
              onClick={() => {
                navigator.clipboard.writeText(`${window.location.origin}/city/${encodeURIComponent(cityData.city_name.toLowerCase())}`)
                alert('URL copied to clipboard!')
              }}
            >
              Copy
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
