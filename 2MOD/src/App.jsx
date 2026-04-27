import { useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router'
import Home from './pages/Home'
import './App.css'
import Navigation from './components/Navigation'

function App() {

  return (
   <div>
    <Router>
      <Navigation />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
        </main>
    </Router>
   </div>
  )
}

export default App
