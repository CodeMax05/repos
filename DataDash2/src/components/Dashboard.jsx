import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'

// Weather condition categories for filtering
const WEATHER_CATEGORIES = ['All', 'Clear', 'Clouds', 'Rain', 'Snow', 'Thunderstorm']

/**
 * Dashboard component - Displays the main weather dashboard with list view
 * Clicking on an item navigates to a detail view for that item
 */
export function Dashboard({ weatherData }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')

  // Filter data based on search query and selected category
  const filteredData = useMemo(() => {
    return weatherData
      .filter((item) => {
        const searchLower = searchQuery.toLowerCase()
        const matchesSearch =
          item.city_name.toLowerCase().includes(searchLower) ||
          item.country_code.toLowerCase().includes(searchLower)

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
            <span className="stat-label">Windy Cities (more than 10 m/s)</span>
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
            <Link
              key={item.id}
              to={`/city/${encodeURIComponent(item.city_name.toLowerCase())}`}
              className="weather-row-link"
            >
              <div className="weather-row">
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

                <div className="view-details-hint">
                  <span>View Details →</span>
                </div>
              </div>
            </Link>
          ))
        )}
      </section>
    </div>
  )
}
