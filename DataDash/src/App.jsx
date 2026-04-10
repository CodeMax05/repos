import { useState, useEffect, useMemo } from 'react'
import gif from './assets/AssignmentGif.gif'
import './App.css'

const API_KEY = import.meta.env.VITE_APP_API_KEY

// List of cities to fetch weather data for (ensuring at least 10 items)
const CITIES = [
  { name: 'London', country: 'UK', lat: 51.5074, lon: -0.1278 },
  { name: 'New York', country: 'US', lat: 40.7128, lon: -74.0060 },
  { name: 'Tokyo', country: 'JP', lat: 35.6762, lon: 139.6503 },
  { name: 'Paris', country: 'FR', lat: 48.8566, lon: 2.3522 },
  { name: 'Sydney', country: 'AU', lat: -33.8688, lon: 151.2093 },
  { name: 'Dubai', country: 'AE', lat: 25.2048, lon: 55.2708 },
  { name: 'Singapore', country: 'SG', lat: 1.3521, lon: 103.8198 },
  { name: 'Los Angeles', country: 'US', lat: 34.0522, lon: -118.2437 },
  { name: 'Berlin', country: 'DE', lat: 52.5200, lon: 13.4050 },
  { name: 'Mumbai', country: 'IN', lat: 19.0760, lon: 72.8777 },
  { name: 'Toronto', country: 'CA', lat: 43.6532, lon: -79.3832 },
  { name: 'São Paulo', country: 'BR', lat: -23.5505, lon: -46.6333 },
]

// Weather condition categories for filtering
const WEATHER_CATEGORIES = ['All', 'Clear', 'Clouds', 'Rain', 'Snow', 'Thunderstorm']

function App() {
  const [weatherData, setWeatherData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')

  // Fetch weather data using useEffect and async/await
  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        setLoading(true)
        setError(null)

        // Fetch weather data for all cities concurrently
        const weatherPromises = CITIES.map(async (city) => {
          try {
            const response = await fetch(
              `https://api.weatherbit.io/v2.0/current?key=${API_KEY}&lat=${city.lat}&lon=${city.lon}&units=M`
            )

            if (!response.ok) {
              console.error(`API Error for ${city.name}:`, response.status, response.statusText)
              return null
            }

            const data = await response.json()

            // Check if data exists and has expected structure
            if (!data || !data.data || !Array.isArray(data.data) || data.data.length === 0) {
              console.error(`No data returned for ${city.name}`)
              return null
            }

            return {
              ...data.data[0],
              id: `${city.name}-${Date.now()}`,
            }
          } catch (cityError) {
            console.error(`Error fetching ${city.name}:`, cityError.message)
            return null
          }
        })

        // Use Promise.allSettled so one failure doesn't break everything
        const results = await Promise.all(weatherPromises)

        // Filter out null results (failed requests)
        const validResults = results.filter((result) => result !== null)

        if (validResults.length === 0) {
          setError('Failed to fetch weather data for all cities. Please check your API key and try again.')
        } else if (validResults.length < CITIES.length) {
          console.warn(`Fetched data for ${validResults.length} of ${CITIES.length} cities`)
        }

        setWeatherData(validResults)
      } catch (err) {
        console.error('Fetch error:', err)
        setError(`Failed to load weather data: ${err.message}`)
      } finally {
        setLoading(false)
      }
    }

    if (API_KEY) {
      fetchWeatherData()
    } else {
      setError('API key is missing. Please check your .env file.')
      setLoading(false)
    }
  }, [])

  // Filter data based on search query and selected category
  const filteredData = useMemo(() => {
    return weatherData
      .filter((item) => {
        // Search filter (by city name or country)
        const searchLower = searchQuery.toLowerCase()
        const matchesSearch =
          item.city_name.toLowerCase().includes(searchLower) ||
          item.country_code.toLowerCase().includes(searchLower)

        // Category filter (by weather condition)
        const matchesCategory =
          selectedCategory === 'All' ||
          item.weather.description
            .toLowerCase()
            .includes(selectedCategory.toLowerCase())

        return matchesSearch && matchesCategory
      })
  }, [weatherData, searchQuery, selectedCategory])

  // Calculate summary statistics
  const statistics = useMemo(() => {
    if (weatherData.length === 0) {
      return {
        totalItems: 0,
        averageTemp: 0,
        avgHumidity: 0,
        highestTemp: 0,
        lowestTemp: 0,
        windyCities: 0,
      }
    }

    const temps = weatherData.map((item) => item.temp)
    const humidities = weatherData.map((item) => item.rh)
    const windSpeeds = weatherData.map((item) => item.wind_spd)

    const totalItems = weatherData.length
    const averageTemp = temps.reduce((a, b) => a + b, 0) / totalItems
    const avgHumidity = humidities.reduce((a, b) => a + b, 0) / totalItems
    const highestTemp = Math.max(...temps)
    const lowestTemp = Math.min(...temps)
    const windyCities = windSpeeds.filter((speed) => speed > 10).length

    return {
      totalItems,
      averageTemp: averageTemp.toFixed(1),
      avgHumidity: Math.round(avgHumidity),
      highestTemp,
      lowestTemp,
      windyCities,
    }
  }, [weatherData])


  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading">Loading weather data...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <div className="error">Error: {error}</div>
      </div>
    )
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Weather Dashboard</h1>
        <p>Live weather data from around the world</p>
      </header>

      {/* Summary Statistics Section */}
      <section className="statistics-section">
        <h2>Summary Statistics</h2>
        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-value">{statistics.totalItems}</span>
            <span className="stat-label">Total Cities</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{statistics.averageTemp}°C</span>
            <span className="stat-label">Average Temperature</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{statistics.avgHumidity}%</span>
            <span className="stat-label">Average Humidity</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{statistics.highestTemp}°C</span>
            <span className="stat-label">Highest Temperature</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{statistics.lowestTemp}°C</span>
            <span className="stat-label">Lowest Temperature</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{statistics.windyCities}</span>
            <span className="stat-label">Windy Cities (&gt;10 m/s)</span>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="filters-section">
        <div className="filter-group">
          <label htmlFor="search">Search Cities:</label>
          <input
            id="search"
            type="text"
            placeholder="Search by city or country..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-group">
          <label htmlFor="category">Weather Condition:</label>
          <select
            id="category"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="category-select"
          >
            {WEATHER_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </section>

      {/* Results Count */}
      <div className="results-count">
        Showing {filteredData.length} of {weatherData.length} cities
      </div>

      {/* Weather List */}
      <section className="weather-list">
        {filteredData.length === 0 ? (
          <div className="no-results">
            No cities match your search criteria.
          </div>
        ) : (
          filteredData.map((item) => (
            <div key={item.id} className="weather-row">
              <div className="weather-city">
                <h3>{item.city_name}</h3>
                <span className="country-badge">{item.country_code}</span>
              </div>

              <div className="weather-info">
                <div className="weather-main">
                  <img
                    src={`https://cdn.weatherbit.io/static/img/icons/${item.weather.icon}.png`}
                    alt={item.weather.description}
                    className="weather-icon"
                  />
                  <span className="weather-description">
                    {item.weather.description}
                  </span>
                </div>

                <div className="weather-stats">
                  <div className="stat">
                    <span className="stat-label">Temperature</span>
                    <span className="stat-value">{item.temp}°C</span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">Feels Like</span>
                    <span className="stat-value">{item.app_temp}°C</span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">Humidity</span>
                    <span className="stat-value">{item.rh}%</span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">Wind</span>
                    <span className="stat-value">
                      {item.wind_spd.toFixed(1)} m/s
                    </span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">Pressure</span>
                    <span className="stat-value">{item.pres} mb</span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">UV Index</span>
                    <span className="stat-value">{item.uv}</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </section>

      <img src={gif} title='Video Walkthrough' width='' alt='Video Walkthrough' />
    </div>
  )
}

export default App
