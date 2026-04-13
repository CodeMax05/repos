import { Link, useLocation, Routes, Route } from 'react-router-dom'
import { Dashboard } from './Dashboard'
import { DetailView } from './DetailView'
import { TemperatureBarChart, WeatherPieChart } from './Charts'
import { useState, useEffect, useMemo } from 'react'
import gif from '../assets/ProjectGIF.gif'

// List of cities to fetch weather data for
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

const API_KEY = import.meta.env.VITE_APP_API_KEY

/**
 * Layout component - Wraps the entire app with sidebar navigation
 * Displays the same sidebar on all views including detail view
 */
export function Layout() {
  // const location = useLocation()
  const [weatherData, setWeatherData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch weather data on mount
  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        setLoading(true)
        setError(null)

        const weatherPromises = CITIES.map(async (city) => {
          try {
            const response = await fetch(
              `https://api.weatherbit.io/v2.0/current?key=${API_KEY}&lat=${city.lat}&lon=${city.lon}&units=M`
            )

            if (!response.ok) {
              console.error(`API Error for ${city.name}:`, response.status)
              return null
            }

            const data = await response.json()

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

        const results = await Promise.all(weatherPromises)
        const validResults = results.filter((result) => result !== null)

        if (validResults.length === 0) {
          setError('Failed to fetch weather data. Please check your API key.')
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

  // Generate dynamic routes from city data - unique URL for each city detail view
  const cityRoutes = useMemo(() => {
    return weatherData.map(city => ({
      path: `/city/${encodeURIComponent(city.city_name.toLowerCase())}`,
      name: city.city_name,
      cityData: city
    }))
  }, [weatherData])

  // Determine if we're on the dashboard
  // const isDashboard = location.pathname === '/' || location.pathname === '/dashboard'

  if (loading) {
    return (
      <div className="app-layout">
        <Sidebar cityRoutes={[]} isLoading={true} />
        <main className="main-content">
          <div className="loading">Loading weather data...</div>
        </main>
      </div>
    )
  }

  if (error && weatherData.length === 0) {
    return (
      <div className="app-layout">
        <Sidebar cityRoutes={[]} isLoading={false} />
        <main className="main-content">
          <div className="error">Error: {error}</div>
        </main>
      </div>
    )
  }

  return (
    <div className="app-layout">
      {/* Sidebar - displayed on all views including detail view */}
      <Sidebar cityRoutes={cityRoutes} isLoading={false} />

      {/* Main content area */}
      <main className="main-content">
        <Routes>
          {/* Dashboard route with charts */}
          <Route
            path="/"
            element={
              <DashboardWrapper
                weatherData={weatherData}
                loading={loading}
                error={error}
              />
            }
          />
          {/* Dashboard route (alternative) */}
          <Route
            path="/dashboard"
            element={
              <DashboardWrapper
                weatherData={weatherData}
                loading={loading}
                error={error}
              />
            }
          />
          {/* Detail view route using useParams to extract city name */}
          <Route
            path="/city/:cityName"
            element={<DetailView weatherData={weatherData} />}
          />
        </Routes>
      </main>
    </div>
  )
}

/**
 * Sidebar component with dynamic links to each city detail page
 */
function Sidebar({ cityRoutes, isLoading }) {
  const location = useLocation()

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>Weather App</h2>
        <p className="sidebar-subtitle">Global Weather Dashboard</p>
      </div>

      <nav className="sidebar-nav">
        <h3>Navigation</h3>
        <ul className="nav-list">
          <li>
            <Link
              to="/"
              className={`nav-link ${location.pathname === '/' || location.pathname === '/dashboard' ? 'active' : ''}`}
            >
              <span className="nav-icon">📊</span>
              Dashboard
            </Link>
          </li>
        </ul>

        <h3>Cities</h3>
        {isLoading ? (
          <p className="sidebar-loading">Loading cities...</p>
        ) : (
          <ul className="nav-list city-nav-list">
            {/* Dynamically generated list of routes - link to each city detail page */}
            {cityRoutes.map((route) => (
              <li key={route.path}>
                <Link
                  to={route.path}
                  className={`nav-link ${location.pathname === route.path ? 'active' : ''}`}
                >
                  <span className="nav-icon">🌍</span>
                  {route.name}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </nav>

      <div className="sidebar-footer">
        <p>{cityRoutes.length} cities tracked</p>
      </div>
    </aside>
  )
}

/**
 * Dashboard wrapper that includes both the dashboard and charts
 */
function DashboardWrapper({ weatherData, loading, error }) {
  if (loading) return <div className="loading">Loading...</div>
  if (error && weatherData.length === 0) return <div className="error">{error}</div>

  return (
    <div className="dashboard-wrapper">
      <Dashboard weatherData={weatherData} />

      {/* Charts Section - At least two unique charts incorporated into dashboard view */}
      <section className="charts-section">
        <h2>Weather Analytics</h2>
        <div className="charts-grid">
          {/* Chart 1: Temperature Bar Chart - different aspect of dataset */}
          <TemperatureBarChart data={weatherData} />
          {/* Chart 2: Weather Conditions Pie Chart - different aspect of dataset */}
          <WeatherPieChart data={weatherData} />
        </div>
      </section>

      <img src={gif} title='Video Walkthrough' width='' alt='Video Walkthrough' />
    </div>
  )
}
